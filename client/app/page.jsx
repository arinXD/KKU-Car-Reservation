'use client';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSession } from "next-auth/react"
import { Skeleton, Accordion, AccordionItem, Avatar, Tabs, Tab, Card, CardBody, CardHeader, Chip, Button } from "@nextui-org/react";
import { dmy } from '@/util/dateFormat';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
    const [selected, setSelected] = useState("success");
    const [reverstionHistories, setReverstionHistories] = useState([])
    const [pendingReservation, setPendingReservation] = useState([])
    const [successReservation, setSuccessReservation] = useState([])
    const [fetching, setFetching] = useState(true)
    const { data: session, status } = useSession();

    async function getReservation(id) {
        setFetching(true)
        try {
            const res = await axios.get(`http://localhost:8000/api/reservations/users/${id}`)
            const data = res.data.data
            const history = data.filter(e => e)
            const pending = data.filter(e => e.allow == null)
            const success = data.filter(e => e.allow == true)
            setReverstionHistories(history)
            setPendingReservation(pending)
            setSuccessReservation(success)
        } catch (error) {
            setReverstionHistories([])
            setPendingReservation([])
        } finally {
            setFetching(false)
        }
    }

    useEffect(() => {
        getReservation(session?.user?.id)
    }, [session])

    function stateModal(type = "success", message) {
        const options = {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
        };

        if (type === "success") {
            toast.success(message, options);
        } else if (type === "error") {
            toast.error(message, options);
        }
    }

    async function delReserv(id) {
        Swal.fire({
            title: "ต้องการลบหรือไม่ ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3b82f6",
            cancelButtonColor: "#ef4444",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:8000/api/reservations/${id}`);
                    getReservation(session?.user?.id)
                    stateModal("success", "ลบข้อมูลสำเร็จ")
                } catch (error) {
                    console.error('Error:', error);
                    stateModal("error", "ลบข้อมูลไม่สำเร็จ")
                }
            }
        });
    }

    return (
        <>
            <div className="flex w-full flex-col">
                <ToastContainer />
                <Tabs
                    aria-label="Options"
                    selectedKey={selected}
                    onSelectionChange={setSelected}
                >
                    <Tab key="success" title="จองสำเร็จ">
                        {
                            fetching ?
                                <div className="py-3 w-full flex flex-col gap-2">
                                    <Skeleton className="h-3 w-3/5 rounded-lg" />
                                    <Skeleton className="h-3 w-4/5 rounded-lg" />
                                    <Skeleton className="h-3 w-2/5 rounded-lg" />
                                </div>
                                :
                                !successReservation.length ?
                                    <div>
                                        ไม่มีข้อมูลการจอง
                                    </div>
                                    :
                                    <Accordion selectionMode="multiple">
                                        {
                                            successReservation.map((rev) => (
                                                <AccordionItem
                                                    key={rev?.id}
                                                    aria-label="Chung Miller"
                                                    startContent={
                                                        <Avatar
                                                            isBordered
                                                            color="default"
                                                            radius="lg"
                                                            src="/images/map.png"
                                                            className='me-2'
                                                        />
                                                    }
                                                    subtitle={`จอง ณ วันที่ ${dmy(rev?.createdAt)}`}
                                                    title={
                                                        <div>
                                                            <div className='font-bold'>ออกเดินทางวันที่ {dmy(rev?.departure_date)}</div>
                                                            <div className='font-normal'>{rev?.address} ต.{rev?.sub_district} อ.{rev?.district} จ.{rev?.province}</div>
                                                        </div>
                                                    }
                                                >
                                                    <div className='space-y-4'>
                                                        <div>
                                                            <div>ผู้โดยสารทั้งหมด: {rev?.passengers_number}</div>
                                                            <div>จุดขึ้นรถ: {rev?.pick_up_point}</div>
                                                            <div>จุดหมาย: {rev?.address} ตำบล {rev?.sub_district} อำเภอ {rev?.district} จังหวัด {rev?.province}</div>
                                                        </div>
                                                        <div>
                                                            <div>วันที่ออกเดินทาง: {dmy(rev?.departure_date)}</div>
                                                            <div>วันกลับ: {dmy(rev?.return_date)}</div>
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
                            fetching ?
                                <div className="py-3 w-full flex flex-col gap-2">
                                    <Skeleton className="h-3 w-3/5 rounded-lg" />
                                    <Skeleton className="h-3 w-4/5 rounded-lg" />
                                    <Skeleton className="h-3 w-2/5 rounded-lg" />
                                </div>
                                :
                                !pendingReservation.length ?
                                    <div>
                                        ไม่มีข้อมูลการจอง
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
                                                            className='me-2'
                                                        />
                                                    }
                                                    subtitle={`จอง ณ วันที่ ${dmy(rev?.createdAt)}`}
                                                    title={
                                                        <div>{rev?.address} ต.{rev?.sub_district} อ.{rev?.district} จ.{rev?.province}</div>
                                                    }
                                                >
                                                    <div className='space-y-4'>
                                                        <div>
                                                            <div>ผู้โดยสารทั้งหมด: {rev?.passengers_number}</div>
                                                            <div>จุดขึ้นรถ: {rev?.pick_up_point}</div>
                                                            <div>จุดหมาย: {rev?.address} ตำบล {rev?.sub_district} อำเภอ {rev?.district} จังหวัด {rev?.province}</div>
                                                        </div>
                                                        <div>
                                                            <div>วันที่ออกเดินทาง: {dmy(rev?.departure_date)}</div>
                                                            <div>วันกลับ: {dmy(rev?.return_date)}</div>
                                                        </div>
                                                        <div>
                                                            <div>รถที่จอง: {rev?.Vehicle?.VehicleType?.type_name} - {rev?.Vehicle?.brand} {rev?.Vehicle?.vehicle_name} {rev?.Vehicle?.seat} ที่นั่ง</div>
                                                            <div>คนขับรถ: {rev?.Vehicle?.driver}</div>
                                                        </div>

                                                    </div>
                                                    <div className='flex justify-end items-center'>
                                                        <Button color='danger' onClick={() => delReserv(rev.id)}>ลบการจอง</Button>
                                                    </div>
                                                </AccordionItem>
                                            ))
                                        }
                                    </Accordion>
                        }
                    </Tab>
                    <Tab key="reservation-history" title="ประวัติการจอง">
                        {
                            fetching ?
                                <div className="py-3 w-full flex flex-col gap-2">
                                    <Skeleton className="h-3 w-3/5 rounded-lg" />
                                    <Skeleton className="h-3 w-4/5 rounded-lg" />
                                    <Skeleton className="h-3 w-2/5 rounded-lg" />
                                </div>
                                :
                                !reverstionHistories.length ?
                                    <div>
                                        ไม่มีข้อมูลการจอง
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
                                                            className='me-2'
                                                        />
                                                    }
                                                    subtitle={`จอง ณ วันที่ ${dmy(rev?.createdAt)}`}
                                                    title={
                                                        <div>
                                                            <div className='font-bold'>
                                                                <Chip className={`${rev.allow == null ? "bg-orange-300" : ""}`} color={rev.allow == true ? "success" : rev.allow == false ? "danger" : "default"} variant="solid">
                                                                    {rev.allow == true ? "จองสำเร็จ" : rev.allow == false ? "จองไม่สำเร็จ" : "รอรับการยืนยัน"}
                                                                </Chip>
                                                            </div>
                                                            <div>{rev?.address} ต.{rev?.sub_district} อ.{rev?.district} จ.{rev?.province}</div>
                                                        </div>
                                                    }
                                                >
                                                    <div className='space-y-4'>
                                                        <div>
                                                            <div>ผู้โดยสารทั้งหมด: {rev?.passengers_number}</div>
                                                            <div>จุดขึ้นรถ: {rev?.pick_up_point}</div>
                                                            <div>จุดหมาย: {rev?.address} ตำบล {rev?.sub_district} อำเภอ {rev?.district} จังหวัด {rev?.province}</div>
                                                        </div>
                                                        <div>
                                                            <div>วันที่ออกเดินทาง: {dmy(rev?.departure_date)}</div>
                                                            <div>วันกลับ: {dmy(rev?.return_date)}</div>
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
