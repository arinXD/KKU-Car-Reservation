"use client"
import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, getKeyValue, Button } from "@nextui-org/react";
import { dmy } from "@/util/dateFormat";
import axios from "axios";
import Swal from "sweetalert2";


const ReservationTable = ({ data, getReservation, action = true }) => {

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
                <thead>
                    <tr>
                        <th className="border-1 p-2">จุดนัดรับ</th>
                        <th className="border-1 p-2">จุดหมาย</th>
                        <th className="border-1 p-2">ผู้โดยสาร</th>
                        <th className="border-1 p-2">วันที่ออกเดินทาง</th>
                        <th className="border-1 p-2">วันกลับ</th>
                        <th className="border-1 p-2">ทะเบียน</th>
                        <th className="border-1 p-2">รถที่จอง</th>
                        <th className="border-1 p-2">สถานะรถ</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.length == 0 ?
                        <tr>
                            <td className="text-center border-1 p-2" colSpan={8}>ไม่มีข้อมูลการจอง</td>
                        </tr>
                        :
                        data?.map((item) => (
                            <React.Fragment key={item.id}>
                                <tr key={item.id}>
                                    <td className="border-1 p-2 w-1/6">{item?.pick_up_point}</td>
                                    <td className="border-1 p-2 w-1/4">{item?.address} <br /> ต.{item?.sub_district} <br /> อ.{item?.district} <br /> จ.{item?.province}</td>
                                    <td className="border-1 p-2">{item?.passengers_number} คน</td>
                                    <td className="border-1 p-2 w-1/6">{dmy(item?.departure_date)}</td>
                                    <td className="border-1 p-2 w-1/6">{dmy(item?.return_date)}</td>
                                    <td className="border-1 p-2 w-1/6">{item?.Vehicle?.license_code} </td>
                                    <td className="border-1 p-2 w-1/6">{item?.Vehicle?.vehicle_name} <br /> {item?.Vehicle?.seat} ที่นั่ง</td>
                                    <td className="border-1 p-2 w-1/6">{item?.Vehicle?.reserve_status ? "จองแล้ว" : "ว่าง"}</td>
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