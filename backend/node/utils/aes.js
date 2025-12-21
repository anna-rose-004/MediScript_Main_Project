import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(process.env.AES_MASTER_KEY, "hex");

/* Encrypt diagnosis */
export function encryptDiagnosis(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag();

  return JSON.stringify({
    iv: iv.toString("base64"),
    content: encrypted,
    tag: authTag.toString("base64"),
  });
}

/* Decrypt diagnosis */
export function decryptDiagnosis(encryptedText) {
  const data = JSON.parse(encryptedText);

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    KEY,
    Buffer.from(data.iv, "base64")
  );

  decipher.setAuthTag(Buffer.from(data.tag, "base64"));

  let decrypted = decipher.update(data.content, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
