import { getClientSideURL } from '@/utilities/getURL'

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  // If the URL is already a full URL, return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return cacheTag ? `${url}?${cacheTag}` : url
  }

  // If the URL starts with /api/media, convert it to use the public directory
  if (url.startsWith('/api/media')) {
    const publicPath = url.replace('/api/media', '/media')
    const baseUrl = getClientSideURL()
    return cacheTag ? `${baseUrl}${publicPath}?${cacheTag}` : `${baseUrl}${publicPath}`
  }

  // For all other URLs, prepend the base URL
  const baseUrl = getClientSideURL()
  return cacheTag ? `${baseUrl}${url}?${cacheTag}` : `${baseUrl}${url}`
}
