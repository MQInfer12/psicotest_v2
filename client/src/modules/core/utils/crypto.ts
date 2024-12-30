import CryptoJS from "crypto-js";

const cryptToken = "psicotest";

export const cypherUrl = (data: string) => {
  const cryptedData = CryptoJS.AES.encrypt(data, cryptToken);
  return cryptedData.toString();
};

export const decyptherUrl = (data: string) => {
  const bytes = CryptoJS.AES.decrypt(data, cryptToken);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
};
