import dotenv from 'dotenv';
dotenv.config();
// No need to load api/.env on Vercel as variables should be in the Dashboard
if (!process.env.VERCEL) {
    dotenv.config({ path: 'api/.env' });
}

import { SitemapStream, streamToPromise, SitemapIndexStream } from 'sitemap';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getAdmin } from './api/_firebaseAdmin.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- VERCEL FIX: Force the path to the current working directory's 'dist' folder ---
const HOSTNAME = 'https://goodthingsco.online';
const OUTPUT_DIR = resolve(process.cwd(), 'dist'); 
const SITEMAPS_DIR = resolve(OUTPUT_DIR, 'sitemaps');

const staticPages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/shop', changefreq: 'weekly', priority: 0.9 },
    { url: '/personalize', changefreq: 'monthly', priority: 0.7 },
    { url: '/beinspired', changefreq: 'monthly', priority: 0.7 },
    { url: '/about', changefreq: 'monthly', priority: 0.6 },
    { url: '/login', changefreq: 'monthly', priority: 0.3 },
    { url: '/signup', changefreq: 'monthly', priority: 0.3 },
    { url: '/cart', changefreq: 'weekly', priority: 0.5 },
];

async function fetchData(collectionName) {
    try {
        console.log(`📡 Fetching ${collectionName} directly from Firestore...`);
        const { db } = getAdmin();
        const snapshot = await db.collection(collectionName).get();

        if (snapshot.empty) {
            console.warn(`⚠️ Warning: Collection '${collectionName}' is empty.`);
            return [];
        }

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                slug: data.slug || doc.id,
                lastmod: doc.updateTime ? doc.updateTime.toDate() : new Date()
            };
        });
    } catch (error) {
        console.error(`❌ Admin SDK Error for ${collectionName}:`, error.message);
        return [];
    }
}

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
    return `/sitemaps/${filename}`;
}

async function run() {
    try {
        // Ensure dist exists before we write to it
        if (!existsSync(OUTPUT_DIR)) {
            console.log('📁 Creating dist directory...');
            mkdirSync(OUTPUT_DIR, { recursive: true });
        }
        
        if (!existsSync(SITEMAPS_DIR)) {
            mkdirSync(SITEMAPS_DIR, { recursive: true });
        }

        console.log('🚀 Starting Sitemap Generation with Admin SDK...');

        const [productsData, categoriesData] = await Promise.all([
            fetchData('products'),
            fetchData('categories')
        ]);

        const productLinks = productsData.map(item => ({
            url: `/product/${item.slug}`,
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: item.lastmod
        }));

        const categoryLinks = categoriesData.map(item => ({
            url: `/category/${item.slug}`,
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: item.lastmod
        }));

        const sitemapPaths = [];

        const pPath = await generateChildSitemap('pages.xml', staticPages);
        if (pPath) sitemapPaths.push(pPath);

        const prodPath = await generateChildSitemap('products.xml', productLinks);
        if (prodPath) sitemapPaths.push(prodPath);

        const catPath = await generateChildSitemap('categories.xml', categoryLinks);
        if (catPath) sitemapPaths.push(catPath);

        if (sitemapPaths.length > 0) {
            const indexStream = new SitemapIndexStream({
                hostname: HOSTNAME,
                lastmodDate: new Date(),
                sitemaps: sitemapPaths.map(path => ({ url: HOSTNAME + path }))
            });

            const indexPath = resolve(OUTPUT_DIR, 'sitemap.xml');
            const indexWriteStream = createWriteStream(indexPath);
            indexStream.pipe(indexWriteStream);
            indexStream.end();
            console.log(`🎉 Master sitemap.xml created at: ${indexPath}`);
        }

    } catch (error) {
        console.error('🔥 Fatal Error:', error);
        process.exit(1);
    }
}

run();