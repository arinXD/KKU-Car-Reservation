"use client"
import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, getKeyValue, Button } from "@nextui-org/react";
import { dmy } from "@/util/dateFormat";
import axios from "axios";
import Swal from "sweetalert2";


const ReservationTable = ({ data, getReservation, action = true, carStatus = true, status = false }) => {

    async function allow(id, allow) {
        try {
            const res = await axios.put(`http://localhost:8000/api/reservations/${id}/allow`, { allow })
            const data = res.data

            console.log(data);
            const icon = data.ok ? "success" : "error"
            getReservation()
            Swal.fire({
                title: data?.message,
                icon
            });
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    }

    return (
        <div>
            <table className="w-full">
                <thead className="bg-[#E6EAF2] text-gray-500">
                    <tr className="border-1 border-[#E6EAF2]">
                        <th className="p-2 text-start">จุดนัดรับ</th>
                        <th className="p-2 text-start">จุดหมาย</th>
                        <th className="p-2 text-start">ผู้โดยสาร</th>
                        <th className="p-2 text-start">วันที่ออกเดินทาง</th>
                        <th className="p-2 text-start">วันกลับ</th>
                        <th className="p-2 text-start">ทะเบียน</th>
                        <th className="p-2 text-start">รถที่จอง</th>
                        {
                            status &&
                            <th className="p-2 text-start">สถานะการจอง</th>
                        }
                        {
                            carStatus &&
                            <th className="p-2 text-start">สถานะรถ</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {data?.length == 0 ?
                        <tr>
                            <td className="text-center border-1 border-[#E6EAF2] p-2" colSpan={8}>ไม่มีข้อมูลการจอง</td>
                        </tr>
                        :
                        data?.map((item) => (
                            <React.Fragment key={item.id}>
                                <tr key={item.id} className="border-1 border-[#E6EAF2]">
                                    <td className="p-2 w-1/12">{item?.pick_up_point}</td>
                                    <td className="p-2 w-1/12">{item?.address} <br /> ต.{item?.sub_district} <br /> อ.{item?.district} <br /> จ.{item?.province}</td>
                                    <td className="p-2 w-1/12">{item?.passengers_number} คน</td>
                                    <td className="p-2 w-1/12">{dmy(item?.departure_date)}</td>
                                    <td className="p-2 w-1/12">{dmy(item?.return_date)}</td>
                                    <td className="p-2 w-1/12">{item?.Vehicle?.license_code} </td>
                                    <td className="p-2 w-1/12">{item?.Vehicle?.vehicle_name} <br /> {item?.Vehicle?.seat} ที่นั่ง</td>
                                    {
                                        status &&
                                        <th className="p-2 w-1/12 text-start">{item?.allow == null ? "รอรับการยืนยัน": item?.allow == true ? "ยอมรับคำขอ" : "ยกเลิกคำขอ"}</th>
                                    }
                                    {
                                        carStatus &&
                                        <td className="p-2 w-1/12">{item?.Vehicle?.reserve_status ? "จองแล้ว" : "ว่าง"}</td>
                                    }
                                </tr>
                                {
                                    action &&
                                    <tr key={`${item.id}-action`}>
                                        <td colSpan={8} className="border-1 p-2 w-1/4">
                                            <div className="flex gap-2 items-center justify-end">
                                                <Button onClick={() => allow(item.id, true)}>ยืนยัน</Button>
                                                <Button onClick={() => allow(item.id, false)}>ยกเลิก</Button>
                                            </div>
                                        </td>
                                    </tr>
                                }
                            </React.Fragment>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReservationTable