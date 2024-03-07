import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTE = ['/']

/** @param {import("next/server").NextRequest} req */
export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  const session = await getToken({
    req,
    secret: process.env.SECRET,
    secureCookie: process.env.NEXTAUTH_URL?.startsWith('https://') && true
  })

  if (PROTECTED_ROUTE.includes(url.pathname)) {
    url.pathname = `/pages/login?callback=${url}`

    // if (!session) return NextResponse.redirect(`/login?callback=${url.href}`);
  }
  if (url.search?.includes('OAuthCallback')) {
    if (session) return NextResponse.redirect(url)
    url.pathname = `/pages/login?error=oauth`

    return NextResponse.redirect(url)
  }
  if (url.pathname === '/admin') {
    url.pathname = '/admin/dashboard'
    if (session) return NextResponse.redirect(url)
  }
  if (url.pathname === '/login') {
    url.pathname = '/'
    if (session) return NextResponse.redirect(url)
  }
  if (url.pathname === '/') {
    url.pathname = '/'
    if (session) return NextResponse.redirect(url)
  }
  const test_regex = /test\/.*$/
  if (process.env.APP_ENV !== 'dev' && test_regex.test(url.pathname)) {
    url.pathname = '/404'

    return NextResponse.redirect(url)
  }
}
