"use client"
import React, { useEffect, useState } from 'react'
import { signOut } from "next-auth/react"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Skeleton } from "@nextui-org/react";
import { useSession } from "next-auth/react"
import Image from 'next/image';
import { MdOutlineLogout } from "react-icons/md";
import { usePathname } from 'next/navigation';
import { MdHistory } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";

const navLinks = [{
    url: "/",
    label: "ประวัติการจองรถ"
},
{
    url: "/reservation",
    label: "จองรถ"
}]
const userDdLink = [
    {
        url: "/",
        label: "ประวัติการจองรถ",
        icon: <MdHistory className='w-5 h-5' />

    },
]
const adminNavLinks = [
    {
        url: "/admin",
        label: "จัดการคำขอ"
    },
    {
        url: "/admin/car",
        label: "จัดการข้อมูลรถ"
    },
]
const adminDDLink = [
    {
        url: "/admin",
        label: "จัดการคำขอ",
        icon: <IoMdSettings className='w-5 h-5' />

    },
    {
        url: "/admin/car",
        label: "จัดการข้อมูลรถ",
        icon: <IoMdSettings className='w-5 h-5' />
    }
]
const NavbarComponent = () => {
    const url = usePathname();
    const { data: session, status } = useSession();
    const [links, setLinks] = useState([])
    const [ddLinks, setDDLinks] = useState([])

    useEffect(() => {
        if (session?.user?.role == "admin") {
            setLinks(adminNavLinks)
            setDDLinks(adminDDLink)
        } else {
            setLinks(navLinks)
            setDDLinks(userDdLink)
        }
    }, [session])
    return (
        <Navbar shouldHideOnScroll isBordered>
            <NavbarBrand>
                <Image width={20} height={20} className="h-6 w-auto me-2" src="/images/cp_kku.png" alt="cp logo" />
                <p className="font-bold text-inherit">Car Reservation</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {links.map(link => (
                    <NavbarItem key={link.url}>
                        <Link className={`${link.url == url ? "text-blue-600 font-bold" : null}`} color={link.url == url ? null : `foreground`} href={link.url}>
                            {link.label}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    {status == "authenticated" ?
                        <div className='relative hidden sm:flex justify-center items-center gap-5'>
                            <Dropdown
                                radius="sm"
                                classNames={{
                                    content: "p-0 border-small border-divider bg-background shadow-none",
                                }}
                            >
                                <DropdownTrigger>
                                    <Image
                                        id='user-profile'
                                        className='rounded-full active:scale-90 cursor-pointer'
                                        src={session?.user?.image}
                                        width={40} height={40}
                                        alt="user image"
                                    />
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Custom item styles"
                                    disabledKeys={["profile"]}
                                    className="p-2"
                                    variant="flat"
                                    itemClasses={{
                                        base: [
                                            "rounded-md",
                                            "text-default-500",
                                            "transition-opacity",
                                            "data-[hover=true]:text-foreground",
                                            "data-[hover=true]:bg-default-100",
                                            "dark:data-[hover=true]:bg-default-50",
                                            "data-[selectable=true]:focus:bg-default-50",
                                            "data-[pressed=true]:opacity-70",
                                            "data-[focus-visible=true]:ring-default-500",
                                        ],
                                    }}
                                >
                                    <DropdownSection aria-label="Profile & Actions" showDivider>
                                        <DropdownItem
                                            isReadOnly
                                            key="profile"
                                            className="h-14 gap-2 opacity-100"
                                        >
                                            <div className="flex gap-3 items-center">
                                                <Image
                                                    className='rounded-full'
                                                    src={session?.user?.image}
                                                    width={40} height={40}
                                                    alt="user image"
                                                />
                                                <div className='w-full'>
                                                    <p className='text-medium text-default-900'>{session.user.name}</p>
                                                    <p className='text-small text-default-500'>{session.user.email}</p>
                                                </div>
                                            </div>
                                        </DropdownItem>
                                    </DropdownSection>
                                    <DropdownSection
                                        aria-label="Help & Feedback"
                                        className="mb-0"
                                    >
                                        {
                                            ddLinks?.map((link, index) => (
                                                <DropdownItem key={index} className='mb-1'>
                                                    <Link className='text-gray-600' href={link.url}>
                                                        <div className='flex gap-3 items-center'>
                                                            {link.icon}
                                                            <span>{link.label}</span>
                                                        </div>
                                                    </Link>
                                                </DropdownItem>
                                            ))
                                        }
                                        <DropdownItem key="logout" onClick={() => signOut()}>
                                            <div className='text-gray-600 flex gap-3 items-center'>
                                                <MdOutlineLogout className='w-5 h-5' />
                                                <span>Log Out</span>
                                            </div>
                                        </DropdownItem>
                                    </DropdownSection>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        :
                        <div className='relative hidden sm:flex justify-center items-center gap-2'>
                            <div>
                                <Skeleton className="flex rounded-full w-[40px] h-[40px]" />
                            </div>
                        </div>

                    }
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}

export default NavbarComponent