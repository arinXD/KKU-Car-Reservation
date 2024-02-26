'use client';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSession } from "next-auth/react"
import { Skeleton, Accordion, AccordionItem, Avatar } from "@nextui-org/react";

export default function Home() {
    const [reverstions, setReservations] = useState([])
    const [fetching, setFetching] = useState(true)
    const { data: session, status } = useSession();
    useEffect(() => {
        async function getReservation(id) {
            setFetching(true)
            try {
                const res = await axios.get(`http://localhost:8000/api/reservations/users/${id}`)
                const data = res.data.data
                setReservations(data)
            } catch (error) {
                setReservations([])
            } finally {
                setFetching(false)
            }
        }
        getReservation(session?.user?.id)
    }, [session])

    return (
        <>
            <div className='flex flex-row justify-between items-center'>
                <h1 className='text-lg'>
                    ประวัติการจองรถของฉัน
                </h1>
            </div>
            {
                fetching ?
                    <div className="py-3 w-full flex flex-col gap-2">
                        <Skeleton className="h-3 w-3/5 rounded-lg" />
                        <Skeleton className="h-3 w-4/5 rounded-lg" />
                        <Skeleton className="h-3 w-2/5 rounded-lg" />
                    </div>
                    :
                    !reverstions.length ?
                        <div>
                            ไม่มีข้อมูลการจองรถ
                        </div>
                        :
                        <Accordion selectionMode="multiple">
                            {
                                reverstions.map((rev) => (
                                    <AccordionItem
                                        key={rev?.id}
                                        aria-label="Chung Miller"
                                        startContent={
                                            <Avatar
                                                isBordered
                                                color="default"
                                                radius="lg"
                                                src="/images/map.png"
                                            />
                                        }
                                        subtitle={`จอง ณ วันที่ ${rev?.createdAt}`}
                                        title={`${rev?.address} ตำบล ${rev?.sub_district} อำเภอ ${rev?.district} จังหวัด ${rev?.province}`}
                                    >
                                        <div className='space-y-4'>
                                            <div>
                                                <div>ผู้โดยสารทั้งหมด: {rev?.passengers_number}</div>
                                                <div>จุดขึ้นรถ: มหาวิทยาลัยขอนแก่น</div>
                                                <div>จุดหมาย: {rev?.address} ตำบล {rev?.sub_district} อำเภอ {rev?.district} จังหวัด {rev?.province}</div>
                                            </div>
                                            <div>
                                                <div>วันที่ออกเดินทาง: {rev?.departure_date}</div>
                                                <div>วันกลับ: {rev?.return_date}</div>
                                            </div>
                                            <div>
                                                <div>รถที่จอง: {rev?.Vehicle?.VehicleType?.type_name} - {rev?.Vehicle?.brand} {rev?.Vehicle?.vehicle_name} {rev?.Vehicle?.seat} ที่นั่ง</div>
                                                <div>คนขับรถ: {rev?.Vehicle?.driver}</div>
                                            </div>

                                        </div>
                                    </AccordionItem>

                                ))
                            }
                        </Accordion>

            }
        </>
    );
}
