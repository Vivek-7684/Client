export const convertRawImageToBase64 = (buffer) => {
  if (!buffer) return null;
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:image/jpeg;base64,${window.btoa(binary)}`;
};
