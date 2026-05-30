// src/utils/preloadImages.js
export const preloadImages = (totalFrames, imagePrefix) => {
  const imageArray = [];

  for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    const frameNumber = i.toString().padStart(4, "0");
    img.src = `${imagePrefix}${frameNumber}.png`;  // PNG frames
    imageArray.push(img);
  }

  return imageArray;
};