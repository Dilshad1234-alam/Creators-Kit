export function getImageUrl(imagePath) {
  if (!imagePath) return '/placeholder.jpg';
  
  // Safely handle Next.js static image imports which are objects with a .src property
  if (typeof imagePath === 'object') {
    if (imagePath.src) {
      imagePath = imagePath.src;
    } else {
      return '/placeholder.jpg';
    }
  }
  
  if (typeof imagePath !== 'string') return '/placeholder.jpg';
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  if (!endpoint || endpoint.trim() === '') return imagePath;

  const baseUrl = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${baseUrl}${path}`;
}
