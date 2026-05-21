import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://peopletrust.vecttore.com'
  const now = new Date()
  return [
    { url: `${base}/`,          lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/precios`,   lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/contacto`,  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
