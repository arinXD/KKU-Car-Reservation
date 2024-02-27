"use client"
import React, { useEffect, useState } from 'react'
import { useSession, signIn } from "next-auth/react"
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image';

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
        <div className='flex flex-col h-[100vh] items-center justify-center gap-20'>
            <section className='flex flex-row gap-8'>
                <Image width={130} height={130} src="/images/cp_kku.png" />
                <div>
                    <h1 className='text-[4em]'>Car Reservation</h1>
                    <h2 className='px-2 text-[1em] text-justify w-full'>College of Computing, Khon Kaen University</h2>
                </div>
            </section>
            <section>
                <div onClick={signInGoogle} className='px-4 border border-blue-600 rounded-lg flex flex-row gap-4 items-center justify-center py-3 w-full cursor-pointer text-white bg-blue-500 hover:bg-blue-600 hover:border-blue-600'>
                    {/* <Image width={100} height={100} className='w-5 h-auto' src="/images/kku_icon.png" /> */}
                    <span className='text-sm'>
                        เข้าสู่ระบบด้วยบัญชี KKU account
                    </span>
                </div>
            </section>
        </div>
    )
}

export default SignIn