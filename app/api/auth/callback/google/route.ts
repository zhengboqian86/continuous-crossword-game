export const runtime = "edge"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  
  if (!code) {
    return Response.redirect(`${url.origin}/?error=no_code`)
  }
  
  const googleClientId = process.env.AUTH_GOOGLE_ID
  const googleClientSecret = process.env.AUTH_GOOGLE_SECRET
  
  if (!googleClientId || !googleClientSecret) {
    return Response.redirect(`${url.origin}/?error=config`)
  }
  
  // Exchange code for token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: googleClientId,
      client_secret: googleClientSecret,
      redirect_uri: `${url.origin}/api/auth/callback/google`,
      grant_type: 'authorization_code',
    }),
  })
  
  const tokens = await tokenResponse.json()
  
  if (!tokens.access_token) {
    return Response.redirect(`${url.origin}/?error=token_failed`)
  }
  
  // Get user info
  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })
  
  const user = await userResponse.json()
  
  // Create session cookie
  const sessionData = JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    picture: user.picture,
  })
  
  const response = Response.redirect(decodeURIComponent(state || '/'))
  response.headers.set('Set-Cookie', `session=${btoa(sessionData)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`)
  
  return response
}
