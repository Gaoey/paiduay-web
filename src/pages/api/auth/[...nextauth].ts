import jwt_decode from 'jwt-decode'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import axiosInstance from 'src/@core/services'
import auth from 'src/@core/services/auth'

type jwt = {
  sub: string
  iat: Date
  exp: Date
}

const nextAuthOption: NextAuthOptions = {
  secret: process.env.SECRET,
  jwt: {
    secret: process.env.SECRET
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      checks: ['none'],
      idToken: true,
      userinfo: {
        request: async (props): Promise<any> =>
          await auth(axiosInstance('', process.env.CORE_SERVER_API)).login({
            data: {
              access_token: props?.tokens?.access_token,
              provider: props.provider?.id
            }
          })
      },
      profile(profile): any {
        const { sub }: jwt = jwt_decode(profile?.access_token)

        return {
          id: sub
        }
      }
    })
  ],
  pages: {
    signIn: '/pages/login',
    error: '/500',
    verifyRequest: '/'
  },
  callbacks: {
    async jwt(props: any) {
      const { token, profile } = props
      if (profile) {
        token.accessToken = profile?.access_token
      }

      return token
    },
    async session(props: any): Promise<any> {
      const { token } = props
      if (!props) {
        return { accessToken: '', id: '' }
      }

      return { accessToken: token?.accessToken, id: token?.sub }
    },
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true // Add any custom sign-in logic if needed
      if (isAllowedToSignIn) {
        return true // Redirect to callbackUrl if provided, else to the default page
      } else {
        // Return false to deny access
        return false 
      }
    }
  }
}

const nextAuth = NextAuth(nextAuthOption)
export default nextAuth
