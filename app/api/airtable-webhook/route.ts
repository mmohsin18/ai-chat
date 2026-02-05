export async function POST(req: Request) {
  try {
    const body = await req.json()

    const AIRTABLE_WEBHOOK_URL = process.env.AIRTABLE_WEBHOOK_URL
    if (!AIRTABLE_WEBHOOK_URL) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing AIRTABLE_WEBHOOK_URL" }),
        { status: 200, headers: corsHeaders() }
      )
    }

    const r = await fetch(AIRTABLE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    return new Response(
      JSON.stringify({ ok: r.ok, status: r.status }),
      { status: 200, headers: corsHeaders() }
    )
  } catch (e: any) {
    return new Response(
      JSON.stringify({ ok: false, error: e?.message || "Server error" }),
      { status: 200, headers: corsHeaders() }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  }
}
