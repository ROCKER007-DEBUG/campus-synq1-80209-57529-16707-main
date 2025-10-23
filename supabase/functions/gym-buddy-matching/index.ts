import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (req.method === "POST") {
      const { location, preferences } = await req.json();

      if (!location) {
        return new Response(
          JSON.stringify({ error: "Location is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { data: existingMatches, error: matchError } = await supabase
        .from("gym_buddy_requests")
        .select("*, profiles!gym_buddy_requests_user_id_fkey(username, full_name)")
        .eq("location", location)
        .eq("status", "searching")
        .neq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (matchError) {
        throw matchError;
      }

      if (existingMatches) {
        const { error: updateError1 } = await supabase
          .from("gym_buddy_requests")
          .update({ 
            status: "matched", 
            matched_with: user.id,
            matched_at: new Date().toISOString()
          })
          .eq("id", existingMatches.id);

        if (updateError1) throw updateError1;

        const { data: newRequest, error: insertError } = await supabase
          .from("gym_buddy_requests")
          .insert({
            user_id: user.id,
            location,
            preferences: preferences || {},
            status: "matched",
            matched_with: existingMatches.user_id,
            matched_at: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) throw insertError;

        const { data: matchedProfile } = await supabase
          .from("profiles")
          .select("username, full_name")
          .eq("id", existingMatches.user_id)
          .single();

        return new Response(
          JSON.stringify({
            status: "matched",
            match: {
              id: existingMatches.user_id,
              username: matchedProfile?.username,
              full_name: matchedProfile?.full_name,
              location: existingMatches.location,
            },
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      } else {
        const { data: newRequest, error: insertError } = await supabase
          .from("gym_buddy_requests")
          .insert({
            user_id: user.id,
            location,
            preferences: preferences || {},
            status: "searching",
          })
          .select()
          .single();

        if (insertError) throw insertError;

        return new Response(
          JSON.stringify({ status: "searching", requestId: newRequest.id }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    if (req.method === "GET") {
      const url = new URL(req.url);
      const requestId = url.searchParams.get("requestId");

      if (!requestId) {
        return new Response(
          JSON.stringify({ error: "Request ID is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { data: request, error: requestError } = await supabase
        .from("gym_buddy_requests")
        .select("*")
        .eq("id", requestId)
        .eq("user_id", user.id)
        .single();

      if (requestError) throw requestError;

      if (request.status === "matched" && request.matched_with) {
        const { data: matchedProfile } = await supabase
          .from("profiles")
          .select("username, full_name")
          .eq("id", request.matched_with)
          .single();

        return new Response(
          JSON.stringify({
            status: "matched",
            match: {
              id: request.matched_with,
              username: matchedProfile?.username,
              full_name: matchedProfile?.full_name,
              location: request.location,
            },
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ status: "searching" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in gym-buddy-matching:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});