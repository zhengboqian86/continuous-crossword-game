
export async function GET(request: Request) {
  const cookie = request.headers.get('cookie')
  const sessionMatch = cookie?.match(/session=([^;]+)/)
  
  if (!sessionMatch) {
    return Response.json({ user: null })
  }
  
  try {
    const sessionData = JSON.parse(atob(sessionMatch[1]))
    return Response.json({ user: sessionData })
  } catch {
    return Response.json({ user: null })
  }
}
