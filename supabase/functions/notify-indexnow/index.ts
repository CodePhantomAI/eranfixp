interface RequestPayload {
  url: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          }
        }
      );
    }

    const { url }: RequestPayload = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          }
        }
      );
    }

    // IndexNow API call
    const indexNowUrl = 'https://api.indexnow.org/indexnow';
    
    const indexNowPayload = {
      host: 'eran-fixer.com',
      key: 'eranfixer2025',
      keyLocation: `https://eran-fixer.com/eranfixer2025.txt`,
      urlList: [url]
    };

    console.log('Sending to IndexNow:', indexNowPayload);

    const indexNowResponse = await fetch(indexNowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'EranFixer-CMS/1.0'
      },
      body: JSON.stringify(indexNowPayload)
    });

    if (indexNowResponse.ok) {
      console.log('Successfully submitted to IndexNow:', url);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'URL submitted to IndexNow successfully',
          url: url
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          }
        }
      );
    } else {
      console.error('IndexNow API error:', indexNowResponse.status, await indexNowResponse.text());
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `IndexNow API returned ${indexNowResponse.status}`,
          url: url
        }),
        {
          status: indexNowResponse.status,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          }
        }
      );
    }

  } catch (error) {
    console.error('Error in notify-indexnow function:', error);
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