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

      const debug: any = { step: "start", credentialId };

      const valid = await verifyChallenge(challenge, challengeSignature);
      if (!valid) {
        debug.step = "challenge_invalid";
        return Response.json({ success: false, error: "Invalid challenge", debug }, { status: 200 });
      }
      debug.step = "challenge_ok";

      // Find the passkey by credential ID using service role
      let passkeys;
      try {
        passkeys = await base44.asServiceRole.entities.Passkey.filter({ credential_id: credentialId });
        debug.passkeysFound = passkeys?.length || 0;
      } catch (dbErr) {
        debug.step = "db_error";
        debug.dbError = dbErr.message;
        return Response.json({ success: false, error: "DB error: " + dbErr.message, debug }, { status: 200 });
      }

      if (!passkeys || passkeys.length === 0) {
        debug.step = "passkey_not_found";
        return Response.json({ success: false, error: "Credential not found", debug }, { status: 200 });
      }

      const passkey = passkeys[0];
      debug.step = "passkey_found";
      debug.algorithm = passkey.algorithm;
      debug.deviceName = passkey.device_name;

      // Parse clientDataJSON
      let clientData;
      try {
        clientData = JSON.parse(new TextDecoder().decode(base64urlToBuffer(clientDataJSON)));
        debug.clientDataType = clientData.type;
        debug.clientDataOrigin = clientData.origin;
        debug.clientDataChallenge = clientData.challenge;
        debug.serverChallenge = challenge;
      } catch (parseErr) {
        debug.step = "clientData_parse_error";
        debug.parseError = parseErr.message;
        return Response.json({ success: false, error: "Invalid clientData", debug }, { status: 200 });
      }

      if (clientData.type !== "webauthn.get") {
        debug.step = "wrong_type";
        return Response.json({ success: false, error: "Invalid assertion type", debug }, { status: 200 });
      }

      // Verify challenge matches (compare base64url without padding)
      const normalizeB64url = (s: string) => s.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      const challengeMatch = normalizeB64url(clientData.challenge) === normalizeB64url(challenge);
      debug.challengeMatch = challengeMatch;
      if (!challengeMatch) {
        debug.step = "challenge_mismatch";
        return Response.json({ success: false, error: "Challenge mismatch", debug }, { status: 200 });
      }

      // Verify the signature
      const importParams = getKeyImportParams(passkey.algorithm);
      debug.importParams = importParams;

      let publicKey;
      try {
        publicKey = await crypto.subtle.importKey(
          'spki',
          base64urlToBuffer(passkey.public_key),
          importParams,
          false,
          ['verify']
        );
        debug.step = "key_imported";
      } catch (importErr) {
        debug.step = "key_import_failed";
        debug.importError = importErr.message;
        return Response.json({ success: false, error: "Key import failed: " + importErr.message, debug }, { status: 200 });
      }

      const authData = new Uint8Array(base64urlToBuffer(authenticatorData));
      const clientDataHash = new Uint8Array(await crypto.subtle.digest('SHA-256', base64urlToBuffer(clientDataJSON)));
      const signedData = new Uint8Array(authData.length + clientDataHash.length);
      signedData.set(authData, 0);
      signedData.set(clientDataHash, authData.length);

      const sigBuffer = base64urlToBuffer(clientSig);
      const sigBytes = new Uint8Array(sigBuffer);
      debug.authDataLen = authData.length;
      debug.clientDataHashLen = clientDataHash.length;
      debug.signedDataLen = signedData.length;
      debug.sigLen = sigBytes.length;
      debug.sigFirstBytes = Array.from(sigBytes.slice(0, 4)).map(b => b.toString(16)).join(' ');

      const verifyParams = getVerifyParams(passkey.algorithm);
      debug.verifyParams = verifyParams;

      // Try raw signature verification
      let verified = await crypto.subtle.verify(
        verifyParams,
        publicKey,
        sigBuffer,
        signedData
      );
      debug.rawVerifyResult = verified;

      // If raw verification fails and algorithm is ECDSA, try DER format
      if (!verified && passkey.algorithm === -7) {
        debug.step = "trying_der";
        try {
          const derSig = new Uint8Array(sigBuffer);
          if (derSig[0] === 0x30) {
            let offset = 2;
            const rLen = derSig[offset];
            offset++;
            let r = derSig.slice(offset, offset + rLen);
            offset += rLen;
            const sLen = derSig[offset];
            offset++;
            let s = derSig.slice(offset, offset + sLen);

            // Remove leading zero padding (DER adds 0x00 to positive numbers starting with 0x80+)
            if (r.length > 1 && r[0] === 0) r = r.slice(1);
            if (s.length > 1 && s[0] === 0) s = s.slice(1);

            // Pad to 32 bytes
            const rPadded = new Uint8Array(32);
            const sPadded = new Uint8Array(32);
            rPadded.set(r, Math.max(0, 32 - r.length));
            sPadded.set(s, Math.max(0, 32 - s.length));

            const rawSig = new Uint8Array(64);
            rawSig.set(rPadded, 0);
            rawSig.set(sPadded, 32);

            verified = await crypto.subtle.verify(verifyParams, publicKey, rawSig.buffer, signedData);
            debug.derVerifyResult = verified;
          }
        } catch (derErr) {
          debug.derError = derErr.message;
        }
      }

      if (!verified) {
        debug.step = "sig_verify_failed";
        return Response.json({ success: false, error: "Signature verification failed", debug }, { status: 200 });
      }

      debug.step = "verified";

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