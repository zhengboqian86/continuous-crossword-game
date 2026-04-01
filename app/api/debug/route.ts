export const runtime = "edge"

export async function GET(request: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (request as any).env || {}
    
    return Response.json({
      hasAuthSecret: !!process.env.AUTH_SECRET,
      hasGoogleId: !!process.env.AUTH_GOOGLE_ID,
      hasGoogleSecret: !!process.env.AUTH_GOOGLE_SECRET,
      authSecretLength: process.env.AUTH_SECRET?.length || 0,
      cloudflareEnv: Object.keys(env),
    })
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 })
  }
}
