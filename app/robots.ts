import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.avero.academy'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/api/', '/forgot-password', '/reset-password', '/onboarding'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
