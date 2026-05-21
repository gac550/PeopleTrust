import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://peopletrust.vecttore.com/sitemap.xml',
    host: 'https://peopletrust.vecttore.com',
  }
}
