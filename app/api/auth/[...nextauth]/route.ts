import { handlers } from "@/auth"

export const runtime = "edge"

const { GET: authGET, POST: authPOST } = handlers

export async function GET(request: Request) {
  try {
    return await authGET(request)
  } catch (error) {
    console.error("Auth GET error:", error)
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function POST(request: Request) {
  try {
    return await authPOST(request)
  } catch (error) {
    console.error("Auth POST error:", error)
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
