import { createClient } from '@supabase/supabase-js';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
const envPath = join(__dirname, '..', '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=');
      if (key && value) {
        process.env[key] = value;
      }
    }
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Missing Supabase credentials - generating static sitemap only');
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
const baseUrl = 'https://eran-fixer.com';

async function generateSitemap() {
  console.log('🗺️  Generating sitemap...');

  const entries = [];
  const today = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'weekly' },
    { url: '/services', priority: 0.9, changefreq: 'monthly' },
    { url: '/seo-israel', priority: 0.9, changefreq: 'monthly' },
    { url: '/portfolio', priority: 0.8, changefreq: 'weekly' },
    { url: '/blog', priority: 0.8, changefreq: 'daily' },
    { url: '/clients', priority: 0.7, changefreq: 'monthly' },
    { url: '/research', priority: 0.7, changefreq: 'monthly' },
    { url: '/contact', priority: 0.8, changefreq: 'monthly' },
    { url: '/about', priority: 0.6, changefreq: 'monthly' },
    { url: '/faq', priority: 0.6, changefreq: 'monthly' },
    { url: '/system', priority: 0.4, changefreq: 'monthly' },
    { url: '/accessibility', priority: 0.5, changefreq: 'yearly' },
    { url: '/privacy-policy', priority: 0.5, changefreq: 'yearly' },
    { url: '/terms-of-use', priority: 0.5, changefreq: 'yearly' }
  ];

  staticPages.forEach(page => {
    entries.push({
      url: `${baseUrl}${page.url}`,
      lastmod: today,
      changefreq: page.changefreq,
      priority: page.priority
    });
  });

  if (supabase) {
    try {
      // Fetch dynamic content
      console.log('📊 Fetching content from database...');

      const [pagesResult, postsResult, portfolioResult, researchResult] = await Promise.all([
        supabase.from('pages').select('slug, updated_at').eq('status', 'published').order('updated_at', { ascending: false }),
        supabase.from('blog_posts').select('slug, updated_at').eq('status', 'published').order('updated_at', { ascending: false }),
        supabase.from('portfolio_items').select('slug, updated_at').eq('status', 'published').order('updated_at', { ascending: false }),
        supabase.from('research_papers').select('slug, updated_at').eq('status', 'published').order('updated_at', { ascending: false })
      ]);

    // Add pages
    if (pagesResult.data) {
      pagesResult.data.forEach(page => {
        entries.push({
          url: `${baseUrl}/${page.slug}`,
          lastmod: page.updated_at.split('T')[0],
          changefreq: 'monthly',
          priority: 0.7
        });
      });
      console.log(`✅ Added ${pagesResult.data.length} pages`);
    } else if (pagesResult.error) {
      console.log('⚠️  Pages error:', pagesResult.error.message);
    }

    // Add blog posts
    if (postsResult.data) {
      postsResult.data.forEach(post => {
        entries.push({
          url: `${baseUrl}/blog/${post.slug}`,
          lastmod: post.updated_at.split('T')[0],
          changefreq: 'weekly',
          priority: 0.8
        });
      });
      console.log(`✅ Added ${postsResult.data.length} blog posts`);
    } else if (postsResult.error) {
      console.log('⚠️  Blog posts error:', postsResult.error.message);
    }

    // Add portfolio items
    if (portfolioResult.data) {
      portfolioResult.data.forEach(item => {
        entries.push({
          url: `${baseUrl}/portfolio/${item.slug}`,
          lastmod: item.updated_at.split('T')[0],
          changefreq: 'monthly',
          priority: 0.7
        });
      });
      console.log(`✅ Added ${portfolioResult.data.length} portfolio items`);
    } else if (portfolioResult.error) {
      console.log('⚠️  Portfolio error:', portfolioResult.error.message);
    }

    // Add research papers
    if (researchResult.data) {
      researchResult.data.forEach(paper => {
        entries.push({
          url: `${baseUrl}/research/${paper.slug}`,
          lastmod: paper.updated_at.split('T')[0],
          changefreq: 'monthly',
          priority: 0.7
        });
      });
      console.log(`✅ Added ${researchResult.data.length} research papers`);
    } else if (researchResult.error) {
      console.log('⚠️  Research error:', researchResult.error.message);
    }

    } catch (error) {
      console.error('⚠️  Error fetching content:', error.message);
    }
  } else {
    console.log('ℹ️  Skipping database fetch - using static pages only');
  }

  // Generate XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
`;

  entries.forEach(entry => {
    sitemap += `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>
`;
  });

  sitemap += '</urlset>';

  // Write to file
  const outputPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outputPath, sitemap);

  console.log(`\n🎉 Sitemap generated successfully!`);
  console.log(`📍 Location: public/sitemap.xml`);
  console.log(`📊 Total URLs: ${entries.length}`);
}

generateSitemap().catch(console.error);
