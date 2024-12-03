export function normalizeUrl(url: string): string {
  if (!url) return '';
  
  // Remove any existing protocol
  let cleanUrl = url.replace(/^(https?:\/\/)/, '');
  
  // Remove any trailing slashes
  cleanUrl = cleanUrl.replace(/\/+$/, '');
  
  // Add https:// protocol
  return `https://${cleanUrl}`;
}