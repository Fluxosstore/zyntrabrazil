import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

// Base64url helpers
function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (base64.length % 4)) % 4;
  const binary = atob(base64 + '='.repeat(padLen));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function generateChallenge(): string {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  return bufferToBase64url(challenge.buffer);
}

async function signChallenge(challenge: string): Promise<string> {
  const keyMaterial = secrets.get("OPENROUTER_API_KEY") || "zyntra-passkey-fallback";
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(keyMaterial),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(challenge));
  return bufferToBase64url(sig);
}

async function verifyChallenge(challenge: string, signature: string): Promise<boolean> {
  const keyMaterial = secrets.get("OPENROUTER_API_KEY") || "zyntra-passkey-fallback";
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(keyMaterial),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  return await crypto.subtle.verify('HMAC', key, base64urlToBuffer(signature), new TextEncoder().encode(challenge));
}

async function deriveAesKey(): Promise<CryptoKey> {
  const keyMaterial = secrets.get("OPENROUTER_API_KEY") || "zyntra-passkey-fallback";
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(keyMaterial), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode('zyntra-passkey-salt-v1'), iterations: 100000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptPassword(password: string): Promise<string> {
  const key = await deriveAesKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(password));
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return bufferToBase64url(combined.buffer);
}

async function decryptPassword(encrypted: string): Promise<string | null> {
  try {
    const key = await deriveAesKey();
    const combined = new Uint8Array(base64urlToBuffer(encrypted));
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return new TextDecoder().decode(dec);
  } catch (e) {
    return null;
  }
}

function getKeyImportParams(alg: number): { name: string; namedCurve?: string; hash?: string } {
  if (alg === -7) return { name: 'ECDSA', namedCurve: 'P-256' };
  if (alg === -35) return { name: 'ECDSA', namedCurve: 'P-384' };
  if (alg === -36) return { name: 'ECDSA', namedCurve: 'P-521' };
  if (alg === -257) return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' };
  if (alg === -258) return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-384' };
  if (alg === -259) return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-512' };
  return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' };
}

function getVerifyParams(alg: number): { name: string; hash?: string } {
  if (alg === -7) return { name: 'ECDSA', hash: 'SHA-256' };
  if (alg === -35) return { name: 'ECDSA', hash: 'SHA-384' };
  if (alg === -36) return { name: 'ECDSA', hash: 'SHA-512' };
  return { name: 'RSASSA-PKCS1-v1_5' };
}

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { action } = body;

    // === REGISTRATION (authenticated) ===
    if (action === "startRegistration") {
      const user = await base44.auth.me();
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const challenge = generateChallenge();
      const challengeSignature = await signChallenge(challenge);
      const userIdBuffer = new TextEncoder().encode(user.id);

      return Response.json({
        challenge,
        challengeSignature,
        userId: bufferToBase64url(userIdBuffer.buffer),
        userEmail: user.email,
      });
    }

    if (action === "finishRegistration") {
      const user = await base44.auth.me();
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { credentialId, publicKey, algorithm, challenge, challengeSignature, deviceName, password } = body;

      const valid = await verifyChallenge(challenge, challengeSignature);
      if (!valid) return Response.json({ error: "Invalid challenge" }, { status: 400 });

      // Check duplicate
      const existing = await base44.asServiceRole.entities.Passkey.filter({ credential_id: credentialId });
      if (existing && existing.length > 0) {
        return Response.json({ error: "Credential already exists" }, { status: 400 });
      }

      let encryptedPassword: string | null = null;
      if (password) {
        encryptedPassword = await encryptPassword(password);
      }

      await base44.entities.Passkey.create({
        credential_id: credentialId,
        public_key: publicKey,
        algorithm: algorithm,
        device_name: deviceName || "Dispositivo",
        counter: 0,
        encrypted_password: encryptedPassword,
      });

      return Response.json({ success: true });
    }

    // === MANAGEMENT (authenticated) ===
    if (action === "list") {
      const user = await base44.auth.me();
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const passkeys = await base44.entities.Passkey.filter({ created_by_id: user.id });
      return Response.json({ passkeys });
    }

    if (action === "delete") {
      const user = await base44.auth.me();
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const { id } = body;
      const passkeys = await base44.entities.Passkey.filter({ id, created_by_id: user.id });
      if (!passkeys || passkeys.length === 0) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }
      await base44.entities.Passkey.delete(id);
      return Response.json({ success: true });
    }

    // === AUTHENTICATION (unauthenticated — for login) ===
    if (action === "startAuth") {
      const challenge = generateChallenge();
      const challengeSignature = await signChallenge(challenge);

      // Use discoverable credentials — don't pass allowCredentials
      // The browser will show all passkeys for this domain on the device
      return Response.json({
        challenge,
        challengeSignature,
        allowCredentials: [],
      });
    }

    if (action === "finishAuth") {
      const { credentialId, authenticatorData, clientDataJSON, signature: clientSig, challenge, challengeSignature } = body;

      console.log("[finishAuth] credentialId:", credentialId);
      console.log("[finishAuth] challenge:", challenge);

      const valid = await verifyChallenge(challenge, challengeSignature);
      if (!valid) {
        console.log("[finishAuth] Challenge signature invalid");
        return Response.json({ error: "Invalid challenge" }, { status: 400 });
      }

      // Find the passkey by credential ID using service role
      const passkeys = await base44.asServiceRole.entities.Passkey.filter({ credential_id: credentialId });
      if (!passkeys || passkeys.length === 0) {
        console.log("[finishAuth] Passkey not found for credentialId:", credentialId);
        return Response.json({ error: "Credential not found" }, { status: 404 });
      }

      const passkey = passkeys[0];
      console.log("[finishAuth] Passkey found, algorithm:", passkey.algorithm, "device:", passkey.device_name);

      // Parse clientDataJSON
      const clientData = JSON.parse(new TextDecoder().decode(base64urlToBuffer(clientDataJSON)));
      console.log("[finishAuth] clientData type:", clientData.type, "origin:", clientData.origin);
      if (clientData.type !== "webauthn.get") {
        return Response.json({ error: "Invalid assertion type" }, { status: 400 });
      }

      // Verify challenge matches (compare base64url without padding)
      const normalizeB64url = (s: string) => s.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      if (normalizeB64url(clientData.challenge) !== normalizeB64url(challenge)) {
        console.log("[finishAuth] Challenge mismatch:", clientData.challenge, "vs", challenge);
        return Response.json({ error: "Challenge mismatch" }, { status: 400 });
      }

      // Verify the signature
      const importParams = getKeyImportParams(passkey.algorithm);
      console.log("[finishAuth] importParams:", JSON.stringify(importParams));

      let publicKey;
      try {
        publicKey = await crypto.subtle.importKey(
          'spki',
          base64urlToBuffer(passkey.public_key),
          importParams,
          false,
          ['verify']
        );
        console.log("[finishAuth] Public key imported successfully");
      } catch (importErr) {
        console.log("[finishAuth] Public key import failed:", importErr.message);
        return Response.json({ error: "Key import failed: " + importErr.message }, { status: 500 });
      }

      const authData = new Uint8Array(base64urlToBuffer(authenticatorData));
      const clientDataHash = new Uint8Array(await crypto.subtle.digest('SHA-256', base64urlToBuffer(clientDataJSON)));
      const signedData = new Uint8Array(authData.length + clientDataHash.length);
      signedData.set(authData, 0);
      signedData.set(clientDataHash, authData.length);

      console.log("[finishAuth] authData length:", authData.length, "clientDataHash length:", clientDataHash.length, "signedData length:", signedData.length);
      console.log("[finishAuth] signature length:", base64urlToBuffer(clientSig).byteLength);

      const verifyParams = getVerifyParams(passkey.algorithm);
      console.log("[finishAuth] verifyParams:", JSON.stringify(verifyParams));

      const sigBuffer = base64urlToBuffer(clientSig);

      // Try raw signature verification
      let verified = await crypto.subtle.verify(
        verifyParams,
        publicKey,
        sigBuffer,
        signedData
      );
      console.log("[finishAuth] Raw signature verify result:", verified);

      // If raw verification fails and algorithm is ECDSA, try DER format
      if (!verified && passkey.algorithm === -7) {
        console.log("[finishAuth] Raw verify failed, trying DER to raw conversion");
        try {
          const derSig = new Uint8Array(sigBuffer);
          // DER format: 0x30 <len> 0x02 <rlen> <r> 0x02 <slen> <s>
          if (derSig[0] === 0x30) {
            let offset = 2;
            const rLen = derSig[offset];
            offset++;
            const r = derSig.slice(offset, offset + rLen);
            offset += rLen;
            const sLen = derSig[offset];
            offset++;
            const s = derSig.slice(offset, offset + sLen);

            // Remove leading zeros and pad to 32 bytes
            const rPadded = new Uint8Array(32);
            const sPadded = new Uint8Array(32);
            const rStart = Math.max(0, 32 - r.length);
            const sStart = Math.max(0, 32 - s.length);
            rPadded.set(r, rStart);
            sPadded.set(s, sStart);

            const rawSig = new Uint8Array(64);
            rawSig.set(rPadded, 0);
            rawSig.set(sPadded, 32);

            verified = await crypto.subtle.verify(verifyParams, publicKey, rawSig.buffer, signedData);
            console.log("[finishAuth] DER-converted verify result:", verified);
          }
        } catch (derErr) {
          console.log("[finishAuth] DER conversion failed:", derErr.message);
        }
      }

      if (!verified) {
        console.log("[finishAuth] Signature verification failed");
        return Response.json({ error: "Signature verification failed" }, { status: 401 });
      }

      // Get the user's email
      let userEmail: string | null = null;
      try {
        const userRecord = await base44.asServiceRole.entities.User.filter({ id: passkey.created_by_id });
        userEmail = userRecord?.[0]?.email || null;
      } catch (e) {
        // ignore
      }

      // Decrypt stored password for auto-login
      let decryptedPassword: string | null = null;
      if (passkey.encrypted_password) {
        decryptedPassword = await decryptPassword(passkey.encrypted_password);
      }

      return Response.json({ success: true, email: userEmail, password: decryptedPassword });
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}