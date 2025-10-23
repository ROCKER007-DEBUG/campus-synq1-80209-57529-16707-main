import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const requestSchema = z.object({
  answers: z.record(z.string(), z.any()).refine(
    (data) => Object.keys(data).length > 0 && Object.keys(data).length <= 100,
    { message: "Answers object must have between 1 and 100 entries" }
  )
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
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
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate input
    const body = await req.json();
    const validated = requestSchema.parse(body);
    const { answers } = validated;
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Create a detailed prompt for AI analysis
    const prompt = `You are a career counselor AI. Analyze the following aptitude test answers and provide career recommendations.

Test Answers:
${JSON.stringify(answers, null, 2)}

Please provide:
1. Top 5 career recommendations that best match these answers
2. A summary explaining why these careers are recommended
3. Detailed information about the top career path including required skills, education, and career growth
4. A list of 10 top colleges/universities worldwide for the recommended career path

Format your response as JSON with this structure:
{
  "careers": ["Career 1", "Career 2", "Career 3", "Career 4", "Career 5"],
  "summary": "Brief explanation of why these careers match",
  "details": "Detailed information about the top career including required education, skills, typical career progression, salary expectations, and work environment",
  "colleges": ["College 1 - Country", "College 2 - Country", ...]
}

Consider diverse career options including:
- Technology (Software Engineering, Data Science, AI/ML, Cybersecurity, Cloud Architecture)
- Healthcare (Medicine, Nursing, Physical Therapy, Medical Research, Public Health)
- Business (Marketing, Finance, Consulting, Entrepreneurship, HR)
- Creative Fields (Design, Architecture, Film, Writing, Music)
- Engineering (Mechanical, Electrical, Civil, Chemical, Aerospace)
- Education (Teaching, Educational Technology, Curriculum Development)
- Science (Biology, Chemistry, Physics, Environmental Science)
- Law and Policy (Legal Practice, Policy Analysis, Diplomacy)
- Social Services (Social Work, Psychology, Counseling)
- Media and Communications (Journalism, PR, Digital Marketing)`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    const analysis = JSON.parse(analysisText);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-aptitude function:', error);
    
    // Handle validation errors specifically
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input format',
          details: error.errors 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
