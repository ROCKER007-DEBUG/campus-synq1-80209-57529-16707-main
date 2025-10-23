import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { field, level } = await req.json();
    console.log('Scholarship discovery request for:', field, level);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const prompt = `You are a scholarship research specialist. Find 8-10 real or realistic scholarships for ${level} students studying ${field}.

For each scholarship, provide:
- Official name
- Granting organization/foundation
- Award amount (specific dollar amount)
- Application deadline (use realistic future dates in 2025)
- Brief description (2-3 sentences)
- Eligibility requirements (3-5 specific requirements)
- Application link (realistic format: https://organization.org/scholarships/name)
- Current status (Open/Closing Soon)

Format your response as JSON:
{
  "scholarships": [
    {
      "name": "Scholarship Name",
      "organization": "Organization Name",
      "amount": "$X,XXX - $XX,XXX",
      "deadline": "Month DD, 2025",
      "description": "Brief description of the scholarship",
      "requirements": [
        "Requirement 1",
        "Requirement 2",
        "Requirement 3"
      ],
      "eligible": "Who can apply",
      "applyLink": "https://...",
      "status": "Open"
    }
  ]
}

Make the scholarships diverse in amount ($1,000 to $20,000) and from various sources (universities, foundations, companies, government). Use realistic dates and requirements.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const scholarshipData = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(scholarshipData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in scholarship-discovery function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
