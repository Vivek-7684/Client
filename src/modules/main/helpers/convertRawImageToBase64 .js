export const convertRawImageToBase64 = (buffer) => {
  if (!buffer) return null;
  let binary = '';
  const bytes = new Uint8Array(buffer); // binary array
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]); // long string from byto to character
  }
  return `data:image/jpeg;base64,${window.btoa(binary)}`; // string to Base64 encoding
};
