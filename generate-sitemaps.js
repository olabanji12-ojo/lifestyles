import { SitemapStream, streamToPromise, SitemapIndexStream } from 'sitemap';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// 1. SETUP ENVIRONMENT (ESM Compatible)
// Since package.json has "type": "module", we must use 'import' and polyfill __dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

// 2. CONFIGURATION
const HOSTNAME = 'https://goodthingsco.online';
// We write to 'dist' because this script runs 'postbuild' (after Vite has populated dist).
// If we wrote to 'public', the files wouldn't be included in the deployment artifact.
const OUTPUT_DIR = resolve(__dirname, 'dist');
const SITEMAPS_DIR = resolve(OUTPUT_DIR, 'sitemaps');

// API Endpoints
const API_PRODUCTS = 'https://goodthingsco.online/api/v1/products/all-slugs';
const API_CATEGORIES = 'https://goodthingsco.online/api/v1/categories/all-slugs';

// 3. DEFINE STATIC ROUTES (Based on App.tsx)
const staticPages = [
    // Primary Pages
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/shop', changefreq: 'weekly', priority: 0.9 },
    { url: '/personalize', changefreq: 'monthly', priority: 0.7 },
    { url: '/beinspired', changefreq: 'monthly', priority: 0.7 }, // Assuming /inspired redirects or maps here
    { url: '/about', changefreq: 'monthly', priority: 0.6 },

    // Auth & Utility (Lower priority)
    { url: '/login', changefreq: 'monthly', priority: 0.3 },
    { url: '/signup', changefreq: 'monthly', priority: 0.3 },
    // Cart/Checkout often excluded, but included with low priority if desired
    { url: '/cart', changefreq: 'weekly', priority: 0.5 },
];

/**
 * Helper: Fetch data safely from an API endpoint
 */
async function fetchData(url) {
    try {
        console.log(`fetching data from: ${url}`);
        // Node 18+ has native fetch. No extra dependency needed.
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();
        // Validation: Ensure it's an array
        if (!Array.isArray(data)) {
            console.warn(`⚠️ Warning: Expected array from ${url}, got ${typeof data}`);
            return [];
        }
        return data;
    } catch (error) {
        console.error(`❌ Failed to fetch from ${url}:`, error.message);
        return []; // Return empty array to keep process alive
    }
}

/**
 * Helper: Generate a single sitemap file (e.g., sitemaps/products.xml)
 */
async function generateChildSitemap(filename, links) {
    if (links.length === 0) return null;

    const stream = new SitemapStream({ hostname: HOSTNAME });
    const filePath = resolve(SITEMAPS_DIR, filename);
    const writeStream = createWriteStream(filePath);

    stream.pipe(writeStream);
    for (const link of links) {
        stream.write(link);
    }
    stream.end();

    await streamToPromise(stream);
    console.log(`✅ Generated ${filename} (${links.length} URLs)`);
    return `/sitemaps/${filename}`; // Return URL path for index
}

/**
 * Main Execution Function
 */
async function run() {
    try {
        // Ensure output directory exists (Vite should have created 'dist')
        if (!existsSync(OUTPUT_DIR)) {
            console.error("❌ Error: 'dist' directory missing. Run this script AFTER 'vite build'.");
            process.exit(1);
        }
        mkdirSync(SITEMAPS_DIR, { recursive: true });

        console.log('🚀 Starting Sitemap Generation...');

        // --- 1. Fetch Dynamic Data in Parallel ---
        const [productsData, categoriesData] = await Promise.all([
            fetchData(API_PRODUCTS),
            fetchData(API_CATEGORIES)
        ]);

        // --- 2. Map Data to Sitemap Format ---
        // Route: /product/:id -> /product/slug
        const productLinks = productsData.map(item => ({
            url: `/product/${item.slug}`,
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: item.lastmod || undefined
        }));

        // Route: /category/:categoryId -> /category/slug
        const categoryLinks = categoriesData.map(item => ({
            url: `/category/${item.slug}`,
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: item.lastmod || undefined
        }));

        // --- 3. Generate Child Sitemaps ---
        const sitemapPaths = [];

        // Static Pages
        const pagesPath = await generateChildSitemap('pages.xml', staticPages);
        if (pagesPath) sitemapPaths.push(pagesPath);

        // Products
        const productsPath = await generateChildSitemap('products.xml', productLinks);
        if (productsPath) sitemapPaths.push(productsPath);

        // Categories
        const categoriesPath = await generateChildSitemap('categories.xml', categoryLinks);
        if (categoriesPath) sitemapPaths.push(categoriesPath);

        // --- 4. Generate Master Index (sitemap.xml) ---
        if (sitemapPaths.length > 0) {
            const indexStream = new SitemapIndexStream({
                hostname: HOSTNAME,
                lastmodDate: new Date(),
                sitemaps: sitemapPaths.map(path => ({ url: HOSTNAME + path }))
            });

            const indexWriteStream = createWriteStream(resolve(OUTPUT_DIR, 'sitemap.xml'));
            indexStream.pipe(indexWriteStream);
            indexStream.end();
            console.log('🎉 Master sitemap.xml created at dist/sitemap.xml');
        } else {
            console.warn('⚠️ No sitemaps were generated.');
        }

    } catch (error) {
        console.error('🔥 Fatal Error to generate sitemap:', error);
        process.exit(1);
    }
}

run();