"use client"
import { Tab, Tabs } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'
import ReservationTable from './ReservationTable';
import axios from 'axios';

const Page = () => {
    const [selected, setSelected] = useState("pending");
    const [reservations, setReservation] = useState([])
    const [pendingReservation, setPendingReservation] = useState([])
    const [successReservation, setSuccessReservation] = useState([])
    const [cancelReservation, setCancelReservation] = useState([])

    async function getReservation() {
        try {
            const res = await axios.get(`http://localhost:8000/api/reservations/`)
            const data = res.data.data
            const pending = data.filter(e => e.allow == null)
            const success = data.filter(e => e.allow == true)
            const cancel = data.filter(e => e.allow == false)
            setReservation(data)
            setPendingReservation(pending)
            setSuccessReservation(success)
            setCancelReservation(cancel)
        } catch (error) {
            setReservation([])
            setPendingReservation([])
            setSuccessReservation([])
            setCancelReservation([])
        }
    }

    useEffect(() => {
        getReservation()
    }, [])
    return (
        <div className="flex w-full flex-col">
            <Tabs
                aria-label="Options"
                selectedKey={selected}
                onSelectionChange={setSelected}
            >
                <Tab key="pending" title="รอรับการยืนยัน">
                    <ReservationTable
                        getReservation={getReservation}
                        data={pendingReservation} />
                </Tab>
                <Tab key="success" title="คำขอที่ยืนยัน">
                    <ReservationTable
                        action={false}
                        carStatus={false}
                        getReservation={getReservation}
                        data={successReservation} />
                </Tab>
                <Tab key="cancel" title="คำขอที่ยกเลิก">
                    <ReservationTable
                        action={false}
                        carStatus={false}
                        getReservation={getReservation}
                        data={cancelReservation} />
                </Tab>
                <Tab key="all-reservation" title="คำขอทั้งหมด">
                    <ReservationTable
                        action={false}
                        carStatus={false}
                        status={true}
                        getReservation={getReservation}
                        data={reservations} />
                </Tab>
            </Tabs>
        </div>
    )
}

export default Page