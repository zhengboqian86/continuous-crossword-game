export const runtime = "edge"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const callbackUrl = url.searchParams.get('callbackUrl') || '/'
  
  const response = Response.redirect(`${url.origin}${callbackUrl}`)
  response.headers.set('Set-Cookie', 'session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0')
  
  return response
}
