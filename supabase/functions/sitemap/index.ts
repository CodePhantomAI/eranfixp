import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const baseUrl = 'https://eran-fixer.com';
    const today = new Date().toISOString().split('T')[0];

    const entries: Array<{
      url: string;
      lastmod: string;
      changefreq: string;
      priority: number;
    }> = [];

    // דפים סטטיים
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
      { url: '/system', priority: 0.4, changefreq: 'monthly' }
    ];

    staticPages.forEach(page => {
      entries.push({
        url: `${baseUrl}${page.url}`,
        lastmod: today,
        changefreq: page.changefreq,
        priority: page.priority
      });
    });

    // טעינת כל התוכן המפורסם מהמסד
    const [pagesResult, postsResult, portfolioResult, researchResult] = await Promise.all([
      supabase.from('pages').select('slug, updated_at').eq('status', 'published').order('updated_at', { ascending: false }),
      supabase.from('blog_posts').select('slug, updated_at').eq('status', 'published').order('updated_at', { ascending: false }),
      supabase.from('portfolio_items').select('slug, updated_at').eq('status', 'published').order('updated_at', { ascending: false }),
      supabase.from('research_papers').select('slug, updated_at').eq('status', 'published').order('updated_at', { ascending: false })
    ]);

    // עמודים דינמיים
    if (pagesResult.data) {
      pagesResult.data.forEach(page => {
        entries.push({
          url: `${baseUrl}/${page.slug}`,
          lastmod: page.updated_at.split('T')[0],
          changefreq: 'monthly',
          priority: 0.7
        });
      });
    }

    // פוסטי בלוג
    if (postsResult.data) {
      postsResult.data.forEach(post => {
        entries.push({
          url: `${baseUrl}/blog/${post.slug}`,
          lastmod: post.updated_at.split('T')[0],
          changefreq: 'weekly',
          priority: 0.8
        });
      });
    }

    // פרויקטים
    if (portfolioResult.data) {
      portfolioResult.data.forEach(item => {
        entries.push({
          url: `${baseUrl}/portfolio/${item.slug}`,
          lastmod: item.updated_at.split('T')[0],
          changefreq: 'monthly',
          priority: 0.7
        });
      });
    }

    // מחקרים
    if (researchResult.data) {
      researchResult.data.forEach(paper => {
        entries.push({
          url: `${baseUrl}/research/${paper.slug}`,
          lastmod: paper.updated_at.split('T')[0],
          changefreq: 'monthly',
          priority: 0.7
        });
      });
    }

    // יצירת XML
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

    console.log(`Generated sitemap with ${entries.length} entries`);

    return new Response(sitemap, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      }
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        }
      }
    );
  }
});