import { serve } from 'std/server';

// This function expects SUPABASE_URL and SUPABASE_SERVICE_ROLE set in function secrets
// It verifies the incoming request includes Supabase Auth session in the Authorization header
// and then calls the credit_xp RPC using service_role key to safely increment XP.

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE');
    if (!supabaseUrl || !serviceRole) {
      return new Response(JSON.stringify({ error: 'Server not configured' }), { status: 500 });
    }

    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing Authorization' }), { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify session and extract user id using Supabase REST API
    const verifyRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!verifyRes.ok) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401 });
    }

    const verifyJson = await verifyRes.json();
    const userId = verifyJson?.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Could not determine user' }), { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const amount = Number(body?.amount || 0);
    if (!amount || isNaN(amount)) {
      return new Response(JSON.stringify({ error: 'Invalid amount' }), { status: 400 });
    }

    // Call the RPC using service role key
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/credit_xp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRole}`,
        'apikey': serviceRole
      },
      body: JSON.stringify({ target_user: userId, amount })
    });

    if (!rpcRes.ok) {
      const txt = await rpcRes.text();
      return new Response(JSON.stringify({ error: 'RPC failed', detail: txt }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
});
