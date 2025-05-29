export function checkWebPSupport(): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = function() {
      // If the image loads successfully, WebP is supported
      resolve(true);
    };

    img.onerror = function() {
      // If the image fails to load, WebP is not supported
      resolve(false);
    };

    // Try to load a 1x1 pixel WebP image
    img.src = '/icons/1x1.webp';
  });
}
