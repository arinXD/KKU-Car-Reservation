"use client"
import DeleteIcon from '@/components/icon/DeleteIcon'
import EditIcon from '@/components/icon/EditIcon'
import PlusIcon from '@/components/icon/PlusIcon'
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";


const VehicleManage = ({ vehicles, className }) => {
    const [vehicle_name, set_vehicle_name] = useState("")
    const [brand, set_brand] = useState("")
    const [img, set_img] = useState("")
    const [model, set_model] = useState("")
    const [seat, set_seat] = useState("")
    const [driver, set_driver] = useState("")
    const [license_code, set_license_code] = useState("")
    const [vehicle_type_id, set_vehicle_type_id] = useState("")
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <div className={className}>
            <div className='flex justify-between'>
                <h1>รถทั้งหมด {vehicles?.length} คัน</h1>
                <Button onPress={onOpen} color="primary" className='rounded-2xl' endContent={<PlusIcon />}></Button>
            </div>
            <table className='w-full mt-2'>
                <thead>
                    <tr className='border-1'>
                        <th className='p-2'>รูป</th>
                        <th className='p-2'>ทะเบียน</th>
                        <th className='p-2'>ประเภท</th>
                        <th className='p-2'>แบรนด์</th>
                        <th className='p-2'>จำนวนที่นั่ง</th>
                        <th className='p-2'>พนักงานขับรถ</th>
                        <th className='p-2'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        !vehicles?.length ?
                            <tr className='border-1'>
                                <td colSpan={7} className='p-2 text-center'>ไม่มีข้อมูลรถ</td>
                            </tr>
                            :
                            vehicles?.map(vehicle => (
                                <tr className='border-1' key={vehicle?.id}>
                                    <td className='p-2'>{vehicle?.img}</td>
                                    <td className='p-2'>{vehicle?.license_code}</td>
                                    <td className='p-2'>{vehicle?.VehicleType?.type_name}</td>
                                    <td className='p-2'>{vehicle?.brand} {vehicle?.model}</td>
                                    <td className='p-2'>{vehicle?.seat}</td>
                                    <td className='p-2'>{vehicle?.driver}</td>
                                    <td className='p-2'>
                                        <div className="relative flex items-center justify-around gap-2">
                                            <button>
                                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                    <EditIcon />
                                                </span>
                                            </button>
                                            <button>
                                                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                    <DeleteIcon />
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                    }
                </tbody>
            </table>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">เพิ่มรถ</ModalHeader>
                            <ModalBody>
                                <div className='flex flex-row gap-4'>
                                    <div className='w-1/2 space-y-3'>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm">ประเภท: </label>
                                            <select className='selection border-1 rounded-lg px-2 py-1' onInput={() => set_vehicle_type_id(event.target.value)} required>
                                                <option value="" hidden>เลือกประเภท</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm">รุ่น: </label>
                                            <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="text" value={model} onInput={() => set_model(event.target.value)} />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm">ป้ายทะเบียน: </label>
                                            <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="text" value={license_code} onInput={() => set_license_code(event.target.value)} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm">พนักงานขับรถ: </label>
                                            <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="text" value={driver} onInput={() => set_driver(event.target.value)} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm">รูปรถ: </label>
                                            <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="file" value={img} onInput={() => set_img(event.target.value)} />
                                        </div>
                                    </div>
                                    <div className='w-1/2 space-y-3'>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm">ชื่อรถ: </label>
                                            <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="text" value={vehicle_name} onInput={() => set_vehicle_name(event.target.value)} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm">แบรนด์: </label>
                                            <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="text" value={brand} onInput={() => set_brand(event.target.value)} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm">ที่นั่ง: </label>
                                            <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="number" value={seat} onInput={() => set_seat(event.target.value)} />
                                        </div>
                                        
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    ยกเลิก
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    เพิ่มรถ
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default VehicleManage