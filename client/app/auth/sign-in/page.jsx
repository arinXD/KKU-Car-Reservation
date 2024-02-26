"use client"
import React, { useRef, useEffect, useState } from 'react'
import { useSession, signIn } from "next-auth/react"
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'

const SignIn = () => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') ?? "/"
    const router = useRouter()
    const { data: session } = useSession();

    // ======================
    // Google sign in
    // ======================
    const signInGoogle = async () => {
        await signIn("google", undefined, {
            redirect: true,
            callbackUrl: callbackUrl,
            prompt: 'select_account',
        })
    }

    // ======================
    // Redirect if has session
    // ======================
    useEffect(() => {
        if (session) {
            router.push(callbackUrl);
            router.refresh()
        }
    }, [session, router]);

    return (
        <div>
            <h1>Sign In</h1>
            <div className="mt-3">
                <div onClick={signInGoogle} className='border border-slate-500 rounded-lg flex flex-row gap-4 items-center justify-center py-3 w-full cursor-pointer text-gray-500 hover:text-blue-500 hover:border-blue-500'>
                    <img className='w-5 h-auto' src="/LogoKKU.png" />
                    <span className='text-sm'>
                        เข้าสู่ระบบด้วยบัญชี KKU Mail
                    </span>
                </div>
            </div>
        </div>
    )
}

export default SignIn