import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const prompt = `You are a work-life balance expert. Provide a list of 5-7 real professional life coaches and wellness experts who specialize in work-life balance for students and young professionals.

For each expert, provide:
1. Full name
2. Credentials/qualifications
3. Area of expertise
4. Brief bio (2-3 sentences)
5. How to contact them (website, LinkedIn, or general contact method)
6. Average session cost range (if publicly available, otherwise "Contact for pricing")

Format as JSON:
{
  "coaches": [
    {
      "name": "",
      "credentials": "",
      "expertise": "",
      "bio": "",
      "contact": "",
      "pricing": ""
    }
  ]
}`;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a knowledgeable career counselor who provides information about professional coaches and wellness experts. Always respond with valid JSON and provide real, verifiable information." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`);
    }

    const openaiData = await openaiResponse.json();
    const coachingData = JSON.parse(openaiData.choices[0].message.content);

    return new Response(
      JSON.stringify(coachingData),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in work-life-coaching:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});