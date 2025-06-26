import { getClientSideURL } from '@/utilities/getURL'

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  // If the URL is already a full URL (from S3/R2), return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return cacheTag ? `${url}?${cacheTag}` : url
  }

  // For relative URLs that start with /media (local development)
  if (url.startsWith('/media')) {
    const baseUrl = getClientSideURL()
    return cacheTag ? `${baseUrl}${url}?${cacheTag}` : `${baseUrl}${url}`
  }

  // Clean up the URL path
  const cleanUrl = url
    .replace('/api/media', '/media') // Remove API prefix
    .replace('/file/', '/') // Remove file/ prefix
    .replace(/^\/+/, '/') // Remove leading slashes
    .replace(/\/+$/, '') // Remove trailing slashes

  // For all other URLs, use the Payload API endpoint (fallback)
  const baseUrl = getClientSideURL()
  const apiUrl = `${baseUrl}/api/media${cleanUrl}`

  return cacheTag ? `${apiUrl}?${cacheTag}` : apiUrl
}
