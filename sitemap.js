const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');

// List of static routes from your App.js
const routes = [
  '/', // Home route
  '/home', // Home route
  '/about', // About route
  '/cart', // Cart route
  '/profile', // Profile route
  '/privacy-policy', // Profile route
  '/refund-policy', // Profile route
  '/shipping-policy', // Profile route
  '/terms', // Profile route
  '/services/:product_id', // Profile route
  '/products/:product_id', // Profile route
  '/decoration', // Profile route
  '/disposable', // Profile route
  '/party', // Profile route
];

// Generate the sitemap using the static routes
async function generateSitemap() {
  const sitemap = new SitemapStream({
    hostname: 'https://www.partydecorhub.com',
  });

  // Add routes to the sitemap
  routes.forEach((route) => {
    sitemap.write({ url: route, changefreq: 'daily', priority: 0.5 });
  });

  // End the stream and save the sitemap
  sitemap.end();

  const sitemapXml = await streamToPromise(sitemap);
  fs.writeFileSync(
    path.resolve(__dirname, 'public', 'sitemap.xml'),
    sitemapXml
  );
  console.log('Sitemap generated successfully!');
}

// Run the sitemap generator
generateSitemap();