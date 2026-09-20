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

function getKeyImportParams(alg: number): { name: string; namedCurve?: string } {
  if (alg === -7) return { name: 'ECDSA', namedCurve: 'P-256' };
  if (alg === -35) return { name: 'ECDSA', namedCurve: 'P-384' };
  if (alg === -36) return { name: 'ECDSA', namedCurve: 'P-521' };
  return { name: 'RSASSA-PKCS1-v1_5' };
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

      const { credentialId, publicKey, algorithm, challenge, challengeSignature, deviceName } = body;

      const valid = await verifyChallenge(challenge, challengeSignature);
      if (!valid) return Response.json({ error: "Invalid challenge" }, { status: 400 });

      // Check duplicate
      const existing = await base44.asServiceRole.entities.Passkey.filter({ credential_id: credentialId });
      if (existing && existing.length > 0) {
        return Response.json({ error: "Credential already exists" }, { status: 400 });
      }

      await base44.entities.Passkey.create({
        credential_id: credentialId,
        public_key: publicKey,
        algorithm: algorithm,
        device_name: deviceName || "Dispositivo",
        counter: 0,
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

      // Get all passkeys using service role (user is not authenticated yet)
      const allPasskeys = await base44.asServiceRole.entities.Passkey.filter({});
      const allowCredentials = allPasskeys.map((p: any) => p.credential_id);

      return Response.json({
        challenge,
        challengeSignature,
        allowCredentials,
      });
    }

    if (action === "finishAuth") {
      const { credentialId, authenticatorData, clientDataJSON, signature: clientSig, challenge, challengeSignature } = body;

      const valid = await verifyChallenge(challenge, challengeSignature);
      if (!valid) return Response.json({ error: "Invalid challenge" }, { status: 400 });

      // Find the passkey by credential ID using service role
      const passkeys = await base44.asServiceRole.entities.Passkey.filter({ credential_id: credentialId });
      if (!passkeys || passkeys.length === 0) {
        return Response.json({ error: "Credential not found" }, { status: 404 });
      }

      const passkey = passkeys[0];

      // Parse clientDataJSON
      const clientData = JSON.parse(new TextDecoder().decode(base64urlToBuffer(clientDataJSON)));
      if (clientData.type !== "webauthn.get") {
        return Response.json({ error: "Invalid assertion type" }, { status: 400 });
      }

      // Verify challenge matches
      if (clientData.challenge !== challenge) {
        return Response.json({ error: "Challenge mismatch" }, { status: 400 });
      }

      // Verify the signature
      const importParams = getKeyImportParams(passkey.algorithm);
      const publicKey = await crypto.subtle.importKey(
        'spki',
        base64urlToBuffer(passkey.public_key),
        importParams,
        false,
        ['verify']
      );

      const authData = new Uint8Array(base64urlToBuffer(authenticatorData));
      const clientDataHash = new Uint8Array(await crypto.subtle.digest('SHA-256', base64urlToBuffer(clientDataJSON)));
      const signedData = new Uint8Array(authData.length + clientDataHash.length);
      signedData.set(authData, 0);
      signedData.set(clientDataHash, authData.length);

      const verifyParams = getVerifyParams(passkey.algorithm);
      const verified = await crypto.subtle.verify(
        verifyParams,
        publicKey,
        base64urlToBuffer(clientSig),
        signedData
      );

      if (!verified) {
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

      return Response.json({ success: true, email: userEmail });
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}