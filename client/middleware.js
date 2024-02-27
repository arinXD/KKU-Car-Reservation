import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse, NextRequest } from "next/server"

const auth = withAuth(
    async function middleware(req) {
        const path = req.nextUrl.pathname
        console.log("Middleware token: ", req?.nextauth?.token);

        if (path === "/" && req.nextauth.token.role === "admin") {
            const url = req.nextUrl.clone()
            url.pathname = '/admin'
            return NextResponse.redirect(url)
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorize: ({ token }) => {
                if (token) {
                    return true
                }
                return false
            }
        }
    }
)

export default auth

export const config = {
    matcher: [
        "/",
        "/reservation"
    ]
}