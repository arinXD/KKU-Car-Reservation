import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import axios from "axios";
import jwt from "jsonwebtoken"

const handler = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            async profile(profile) {
                return {
                    id: profile.sub,
                    email: profile.email,
                    name: profile.name,
                    firstName: profile.given_name,
                    lastName: profile.family_name,
                    image: profile.picture,
                }
            },
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        async signIn({
            user,
            account
        }) {
            if (account.provider === "google") {
                const accessDomain = ["@kku.ac.th", "@kkumail.com"];

                if (!accessDomain.some(domain => user?.email.endsWith(domain))) {
                    throw new Error("Please login by kkumail.");
                }
                const signUserData = jwt.sign({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                }, process.env.TOKEN_KEY, {
                    expiresIn: "6h"
                });

                const options = {
                    url: `http://localhost:8000/api/auth/signin/google`,
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                    data: {
                        signUserData
                    }
                };

                try {
                    const result = await axios(options)
                    let userData = result.data.data
                    if (userData) {
                        for (let key in userData) {
                            if (!(user.hasOwnProperty(key))) {
                                user[key] = userData[key];
                            }
                        }
                    }
                    user.id = userData?.id
                } catch (error) {
                    const message = error.response.data.message
                    throw new Error(message)
                }

            }
            return user
        },
        async signOut({
            token,
            session
        }) {
            res.setHeader("Set-Cookie", "");
            token = {};
            session = {};
        },

        async jwt({
            token,
            user
        }) {
            if (user) {
                user.picture = token.picture
                token = user
            }
            return token
        },
        async session({
            session,
            token
        }) {
            session.user = token
            return session
        }
    },
    pages: {
        signIn: "/auth/sign-in",
        error: '/auth/sign-in',
    },
})

export {
    handler as GET, handler as POST
}