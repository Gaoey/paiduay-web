import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTE = [
  '/admin/*',
  '/booking/*'
];

/** @param {import("next/server").NextRequest} req */
export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  const session = await getToken({
    req,
    secret: process.env.SECRET,
    secureCookie: process.env.NEXTAUTH_URL?.startsWith('https://') && true
  })

  if (req.nextUrl.pathname.startsWith('/admin') && !session) {
    return NextResponse.redirect(getAbsoluteURL(`/pages/login?callback=${encodeURIComponent(url.pathname)}`));
  }

  if (req.nextUrl.pathname.startsWith('/booking') && !session) { 
    console.log('protected', url.pathname)
    console.log('href', url.href)

    return NextResponse.redirect(getAbsoluteURL(`/pages/login?callback=${encodeURIComponent(url.pathname)}`));
  }

  if (url.search?.includes('OAuthCallback')) {
    if (session) return NextResponse.redirect(url.href)
    url.pathname = `/pages/login?error=oauth`

    return NextResponse.redirect(url.href)
  }

  const test_regex = /test\/.*$/
  if (process.env.APP_ENV !== 'dev' && test_regex.test(url.pathname)) {
    url.pathname = '/404'

    return NextResponse.redirect(url.href)
  }

  return NextResponse.next(); 
}

function getAbsoluteURL(relativePath: string) {
  const baseURL = process.env.NEXTAUTH_URL || 'http://localhost:9000' // Adapt for your project
  
  return new URL(relativePath, baseURL).toString();
}