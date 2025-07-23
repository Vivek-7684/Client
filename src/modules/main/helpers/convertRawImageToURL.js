exports.convertRawImageToURL = (rawData) => {
    const binaryData = new Uint8Array(rawData); // convert rawData to binary 
    const blobData = new Blob([binaryData]); // convert binary  to blob
    const image = URL.createObjectURL(blobData); // temporary url link
    return image;
}