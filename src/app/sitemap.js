export default function sitemap() {
  const baseUrl = 'https://creatorskit.com';
  
  // Define public routes
  const routes = [
    '',
    '/product',
    '/blog',
    '/about',
    '/contact',
    '/faq',
    '/terms',
    '/privacy',
    '/return-policy'
  ];

  const sitemapRoutes = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' || route === '/blog' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  return sitemapRoutes;
}
