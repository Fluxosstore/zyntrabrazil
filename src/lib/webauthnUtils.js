// Base64url helpers
export function bufferToBase64url(buffer) {
  const bytes = new Uint8Array(buffer);
  let str = "";
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function base64urlToBuffer(base64url) {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (base64.length % 4)) % 4;
  const binary = atob(base64 + "=".repeat(padLen));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export function isWebAuthnSupported() {
  return typeof window !== "undefined" && window.PublicKeyCredential && typeof navigator.credentials !== "undefined";
}

export function detectDeviceName() {
  const ua = navigator.userAgent || "";
  if (/iPhone/.test(ua)) return "iPhone";
  if (/iPad/.test(ua)) return "iPad";
  if (/Macintosh|Mac OS X/.test(ua)) return "Mac";
  if (/Windows/.test(ua)) return "Windows";
  if (/Android/.test(ua)) return "Android";
  if (/Linux/.test(ua)) return "Linux";
  return "Dispositivo";
}

// Registration: creates a passkey on the device
export async function createPasskey({ challenge, rpId, rpName, userId, userEmail }) {
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: base64urlToBuffer(challenge),
      rp: { name: rpName, id: rpId },
      user: {
        id: base64urlToBuffer(userId),
        name: userEmail,
        displayName: userEmail,
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 },
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "preferred",
        residentKey: "preferred",
      },
      timeout: 60000,
      attestation: "none",
    },
  });

  const response = credential.response;
  const publicKey = response.getPublicKey ? response.getPublicKey() : null;
  const algorithm = response.getPublicKeyAlgorithm ? response.getPublicKeyAlgorithm() : -7;

  if (!publicKey) {
    throw new Error("Não foi possível obter a chave pública do dispositivo.");
  }

  return {
    credentialId: credential.id,
    publicKey: bufferToBase64url(publicKey),
    algorithm,
  };
}

// Authentication: verifies identity with biometrics
export async function authenticatePasskey({ challenge, rpId, allowCredentials }) {
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: base64urlToBuffer(challenge),
      rpId: rpId,
      allowCredentials: (allowCredentials || []).map((c) => ({
        type: "public-key",
        id: base64urlToBuffer(c),
      })),
      userVerification: "preferred",
      timeout: 60000,
    },
  });

  return {
    credentialId: assertion.id,
    authenticatorData: bufferToBase64url(assertion.response.authenticatorData),
    clientDataJSON: bufferToBase64url(assertion.response.clientDataJSON),
    signature: bufferToBase64url(assertion.response.signature),
  };
}