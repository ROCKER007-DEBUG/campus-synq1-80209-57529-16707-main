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
    const { budget, currency, location } = await req.json();

    if (!budget || !currency || !location) {
      return new Response(
        JSON.stringify({ error: "Budget, currency, and location are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const prompt = `You are a nutrition planning expert. Create a detailed, budget-friendly meal plan for a student.

Budget: ${budget} ${currency}
Location: ${location}

Provide a realistic 7-day meal plan with:
1. Breakfast, lunch, dinner, and 2 snacks per day
2. Specific meal names and brief descriptions
3. Estimated cost per meal in ${currency}
4. Total daily cost
5. Shopping list for the week
6. Tips for saving money on groceries in ${location}
7. Local affordable stores or markets in ${location}

Format the response as JSON with this structure:
{
  "weeklyPlan": [
    {
      "day": "Monday",
      "meals": {
        "breakfast": { "name": "", "description": "", "cost": 0 },
        "lunch": { "name": "", "description": "", "cost": 0 },
        "dinner": { "name": "", "description": "", "cost": 0 },
        "snacks": [{ "name": "", "cost": 0 }]
      },
      "totalCost": 0
    }
  ],
  "shoppingList": [
    { "item": "", "quantity": "", "estimatedCost": 0 }
  ],
  "savingTips": [],
  "localStores": [],
  "totalWeeklyCost": 0
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
          { role: "system", content: "You are a nutrition planning expert who provides practical, budget-friendly meal plans. Always respond with valid JSON." },
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
    const mealPlan = JSON.parse(openaiData.choices[0].message.content);

    return new Response(
      JSON.stringify({ mealPlan }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in nutrition-planning:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});