'use client';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSession } from "next-auth/react"
import { Skeleton, Accordion, AccordionItem, Avatar, Tabs, Tab, Card, CardBody, CardHeader } from "@nextui-org/react";

export default function Home() {
    const [selected, setSelected] = useState("reservation-history");
    const [reverstionHistories, setReverstionHistories] = useState([])
    const [pendingReservation, setPendingReservation] = useState([])
    const [fetching, setFetching] = useState(true)
    const { data: session, status } = useSession();
    useEffect(() => {
        async function getReservation(id) {
            setFetching(true)
            try {
                const res = await axios.get(`http://localhost:8000/api/reservations/users/${id}`)
                const data = res.data.data
                const history = data.filter(e => e.allow)
                const pending = data.filter(e => !e.allow)
                setReverstionHistories(history)
                setPendingReservation(pending)
            } catch (error) {
                setReverstionHistories([])
                setPendingReservation([])
            } finally {
                setFetching(false)
            }
        }
        getReservation(session?.user?.id)
    }, [session])

    return (
        <>
            <div className="flex w-full flex-col">
                <Tabs
                    aria-label="Options"
                    selectedKey={selected}
                    onSelectionChange={setSelected}
                >
                    <Tab key="reservation-history" title="ประวัติการจอง">
                        {
                            fetching ?
                                <div className="py-3 w-full flex flex-col gap-2">
                                    <Skeleton className="h-3 w-3/5 rounded-lg" />
                                    <Skeleton className="h-3 w-4/5 rounded-lg" />
                                    <Skeleton className="h-3 w-2/5 rounded-lg" />
                                </div>
                                :
                                // pendingReservation
                                !reverstionHistories.length ?
                                    <div>
                                        ไม่มีข้อมูลการจองรถ
                                    </div>
                                    :
                                    <Accordion selectionMode="multiple">
                                        {
                                            reverstionHistories.map((rev) => (
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
                                                            <div>จุดนัดรับ: {rev?.pick_up_point}</div>
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
                    </Tab>
                    <Tab key="pending" title="รอรับการยืนยัน">
                        {
                            !pendingReservation.length ?
                                <div>
                                    ไม่มีข้อมูลการจองรถ
                                </div>
                                :
                                <Accordion selectionMode="multiple">
                                    {
                                        pendingReservation.map((rev) => (
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
                    </Tab>
                </Tabs>
            </div>
        </>
    );
}
