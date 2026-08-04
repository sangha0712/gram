export const timeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) return Math.floor(interval) + '년';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + '개월';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + '일';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + '시간';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + '분';
  return Math.floor(seconds) + '초';
};

export const processMedia = (file: File): Promise<{ url: string, type: 'image' | 'video' }> => {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith('video/')) {
      // For video, use Object URL (will expire on reload, but avoids localStorage quota issues during session)
      resolve({ url: URL.createObjectURL(file), type: 'video' });
    } else if (file.type.startsWith('image/')) {
      // Resize image and convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1080;
          const MAX_HEIGHT = 1080;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve({ url: canvas.toDataURL('image/jpeg', 0.8), type: 'image' });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      reject(new Error('Unsupported file type'));
    }
  });
};
