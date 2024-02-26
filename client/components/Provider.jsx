"user client"
import React from 'react'
import AuthProvider from './Authprovider'
import { NextUIProvider } from "@nextui-org/react";

const Main = ({ children }) => {
    return (
        <NextUIProvider>
            <AuthProvider>
                <main>
                    {children}
                </main>
            </AuthProvider>
        </NextUIProvider>
    )
}

export default Main