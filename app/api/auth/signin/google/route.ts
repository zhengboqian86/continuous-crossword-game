export const runtime = "edge"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const callbackUrl = url.searchParams.get('callbackUrl') || '/'
  
  const googleClientId = process.env.AUTH_GOOGLE_ID
  
  if (!googleClientId) {
    return new Response('Google Client ID not configured', { status: 500 })
  }
  
  const redirectUri = `${url.origin}/api/auth/callback/google`
  const state = encodeURIComponent(callbackUrl)
  
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  googleAuthUrl.searchParams.set('client_id', googleClientId)
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri)
  googleAuthUrl.searchParams.set('response_type', 'code')
  googleAuthUrl.searchParams.set('scope', 'openid email profile')
  googleAuthUrl.searchParams.set('state', state)
  
  return Response.redirect(googleAuthUrl.toString())
}
