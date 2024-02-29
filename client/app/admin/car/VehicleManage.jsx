"use client"
import DeleteIcon from '@/components/icon/DeleteIcon'
import EditIcon from '@/components/icon/EditIcon'
import PlusIcon from '@/components/icon/PlusIcon'
import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link, Chip, Tooltip } from "@nextui-org/react";
import axios from 'axios';
import Swal from 'sweetalert2';
import { TbArrowsExchange } from "react-icons/tb";

const VehicleManage = ({ stateModal, types, getVehicles, vehicles, className }) => {
    const [vid, setVid] = useState()
    const [vehicle_name, set_vehicle_name] = useState("");
    const [brand, set_brand] = useState("");
    const [model, set_model] = useState("");
    const [seat, set_seat] = useState("");
    const [driver, set_driver] = useState("");
    const [license_code, set_license_code] = useState("");
    const [vehicle_type_id, set_vehicle_type_id] = useState("");
    const [preview, setPreview] = useState(undefined);
    const [selectedFile, setSelectedFile] = useState(undefined);

    const { isOpen: isOpenCreate, onOpen: onOpenCreate, onOpenChange: onOpenChangeCreate, onClose: onCloseCreate } = useDisclosure();
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onOpenChange: onOpenChangeUpdate, onClose: onCloseUpdate } = useDisclosure();

    function clearInsertForm() {
        setVid(null)
        set_vehicle_name("");
        set_brand("");
        set_model("");
        set_seat("");
        set_driver("");
        set_license_code("");
        set_vehicle_type_id("");
        setSelectedFile(undefined);
        setPreview(undefined);
    }
    async function sendData(formData) {
        try {
            await axios.post('http://localhost:8000/api/vehicles', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            getVehicles()
            stateModal("success", "เพิ่มข้อมูลสำเร็จ")
        } catch (error) {
            console.error('Error:', error);
            stateModal("error", "เพิ่มข้อมูลไม่สำเร็จ")
        } finally {
            clearInsertForm()
        }
    };

    function getFormData() {
        const formData = new FormData();
        formData.append('vehicle_name', vehicle_name);
        formData.append('brand', brand);
        formData.append('model', model);
        formData.append('seat', seat);
        formData.append('driver', driver);
        formData.append('license_code', license_code);
        formData.append('vehicle_type_id', vehicle_type_id);
        formData.append('image', selectedFile);
        return formData
    }

    function handleAddVehicle(event) {
        event.preventDefault();
        const formData = getFormData()
        onCloseCreate()
        sendData(formData);
    };
    async function deleteVehicle(id) {
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
                    await axios.delete(`http://localhost:8000/api/vehicles/${id}`);
                    getVehicles()
                    stateModal("success", "ลบข้อมูลสำเร็จ")
                } catch (error) {
                    console.error('Error:', error);
                    stateModal("error", "มีบางอย่างผิดพลาด")
                }
            }
        });
    }

    async function handleUpdateForm(id) {
        clearInsertForm()
        try {
            const url = `http://localhost:8000/api/vehicles/${id}/types`
            const res = await axios.get(url)
            const data = res.data.data

            setVid(id)
            set_vehicle_name(data?.vehicle_name)
            set_brand(data?.brand)
            set_model(data?.model)
            set_seat(data?.seat)
            set_driver(data?.driver)
            set_license_code(data?.license_code)
            set_vehicle_type_id(data?.vehicle_type_id)
            setPreview(data?.img)
            onOpenUpdate()
        } catch (err) {
            console.log(err);
            onCloseUpdate()
        }
    }
    async function sendUpdateFormEncode(form) {
        try {
            await axios.put(`http://localhost:8000/api/vehicles/${vid}/formendcode`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            stateModal("success", "แก้ไขข้อมูลสำเร็จ")
        } catch (err) {
            stateModal("success", "มีบางอย่างผิดพลาด")
        } finally {
            getVehicles()
            onCloseUpdate()
        }
    }
    async function sendUpdateJson(json) {
        try {
            await axios.put(`http://localhost:8000/api/vehicles/${vid}`, json);
            stateModal("success", "แก้ไขข้อมูลสำเร็จ")
        } catch (err) {
            stateModal("success", "มีบางอย่างผิดพลาด")
        } finally {
            getVehicles()
            onCloseUpdate()
        }
    }
    function handleSendUpdate(event) {
        event.preventDefault();
        let formData
        if (selectedFile) {
            formData = getFormData()
            console.log("formData");
            sendUpdateFormEncode(formData)
        } else {
            formData = {
                vehicle_name,
                brand,
                model,
                seat,
                driver,
                license_code,
                vehicle_type_id,
                img: selectedFile,
            }
            console.log("json");
            sendUpdateJson(formData)
        }
    }
    useEffect(() => {
        try {
            if (selectedFile) {
                setPreview(URL.createObjectURL(selectedFile));
            } else {
                setPreview(undefined);
            }
        } catch (err) {
            console.log(err);
            setPreview(undefined);
        }
    }, [selectedFile]);

    function onSelectFile(e) {
        console.log(e.target.files[0]);
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined);
            return;
        }

        setSelectedFile(e.target.files[0]);
    }
    async function inverseStatus(id) {
        try {
            await axios.put(`http://localhost:8000/api/vehicles/${id}/status`);
        } catch (err) {
            console.log(err);
        } finally {
            getVehicles()
        }
    }

    return (
        <div className={className}>
            <div className='flex justify-between'>
                <h1>รถทั้งหมด {vehicles?.length} คัน</h1>
                <Button onPress={() => {
                    clearInsertForm()
                    onOpenCreate()
                }} color="primary" className='rounded-2xl' endContent={<PlusIcon />}></Button>
            </div>
            <table className='w-full mt-2'>
                <thead className="bg-[#E6EAF2] text-gray-500">
                    <tr className='border-1 border-[#E6EAF2]'>
                        <th className='p-2'>รูป</th>
                        <th className='p-2 text-start'>ทะเบียน</th>
                        <th className='p-2 text-start'>ประเภท</th>
                        <th className='p-2 text-start'>แบรนด์</th>
                        <th className='p-2 text-start'>จำนวนที่นั่ง</th>
                        <th className='p-2 text-start'>พนักงานขับรถ</th>
                        <th className='p-2 text-start'>สถานะ</th>
                        <th className='p-2 text-start'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        !vehicles?.length ?
                            <tr className='border-1 border-[#E6EAF2]'>
                                <td colSpan={7} className='p-2 text-center'>ไม่มีข้อมูลรถ</td>
                            </tr>
                            :
                            vehicles?.map(vehicle => (
                                <tr className='border-1 border-[#E6EAF2]' key={vehicle?.id}>
                                    <td className='p-2 w-1/4'>
                                        <img src={vehicle?.img} alt="vehicle" className='rounded-md' />
                                    </td>
                                    <td className='p-2 w-1/12'>{vehicle?.license_code}</td>
                                    <td className='p-2 w-1/12'>{vehicle?.VehicleType?.type_name}</td>
                                    <td className='p-2 w-1/12'>{vehicle?.brand} {vehicle?.model}</td>
                                    <td className='p-2 w-1/12'>{vehicle?.seat}</td>
                                    <td className='p-2 w-1/12'>{vehicle?.driver}</td>
                                    <td className='p-2 w-1/12'>
                                        <div className='flex items-center justify-center'>
                                            <Chip variant="flat" color={`${vehicle?.reserve_status ? "danger" : "success"}`}>
                                                {vehicle?.reserve_status ? "จองแล้ว" : "ว่าง"}
                                            </Chip>
                                        </div>
                                    </td>
                                    <td className='p-2 w-1/12'>
                                        <div className="relative flex items-center justify-around gap-2">
                                            <button onClick={() => inverseStatus(vehicle?.id)}>
                                                <Tooltip content="เปลี่ยนสถานะรถ">
                                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                        <TbArrowsExchange />
                                                    </span>
                                                </Tooltip>
                                            </button>
                                            <button onClick={() => handleUpdateForm(vehicle?.id)}>
                                                <Tooltip content="แก้ไขข้อมูล">
                                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                        <EditIcon />
                                                    </span>
                                                </Tooltip>
                                            </button>
                                            <button onClick={() => deleteVehicle(vehicle?.id)}>
                                                <Tooltip color="danger" content="ลบข้อมูล">
                                                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                        <DeleteIcon />
                                                    </span>
                                                </Tooltip>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                    }
                </tbody>
            </table>

            {/* Create modal */}
            <Modal
                size='xl'
                isOpen={isOpenCreate}
                onOpenChange={onOpenChangeCreate}
                placement="top-center"
            >
                <ModalContent>
                    {(onCloseCreate) => (
                        <>
                            <form onSubmit={handleAddVehicle}>
                                <ModalHeader className="flex flex-col gap-1">เพิ่มรถ</ModalHeader>
                                <ModalBody>
                                    <div className='flex flex-row gap-4'>
                                        <div className='w-1/2 space-y-3'>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm">ประเภท: </label>
                                                <select className='selection border-1 rounded-lg px-2 py-1' onInput={() => set_vehicle_type_id(event.target.value)} required>
                                                    <option value="" hidden>เลือกประเภท</option>
                                                    {types?.length &&
                                                        types?.map(type => (
                                                            <option key={type.id} value={type.id}>{type.type_name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm">รุ่น: </label>
                                                <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="text" value={model} onInput={() => set_model(event.target.value)} required />
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm">ป้ายทะเบียน: </label>
                                                <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="text" value={license_code} onInput={() => set_license_code(event.target.value)} required />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm">พนักงานขับรถ: </label>
                                                <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="text" value={driver} onInput={() => set_driver(event.target.value)} required />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm">รูปรถ: </label>
                                                <input
                                                    className="block w-full text-sm text-slate-500 
                                                file:mr-4 file:py-2 file:px-4 file:rounded-md
                                                file:border-0 file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100" type="file"
                                                    onChange={onSelectFile} required />
                                            </div>
                                        </div>
                                        <div className='w-1/2 space-y-3'>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm">ชื่อรถ: </label>
                                                <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="text" value={vehicle_name} onInput={() => set_vehicle_name(event.target.value)} required />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm">แบรนด์: </label>
                                                <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="text" value={brand} onInput={() => set_brand(event.target.value)} required />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm">ที่นั่ง: </label>
                                                <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="number" value={seat} onInput={() => set_seat(event.target.value)} required />
                                            </div>
                                            <div className='h-[123px] border-1 rounded-lg'>
                                                {selectedFile && <img
                                                    className='block w-full h-full object-cover rounded-lg'
                                                    src={preview}
                                                />}
                                            </div>
                                        </div>
                                    </div>

                                </ModalBody>
                                <ModalFooter>
                                    <Button type='button' color="danger" variant="flat" onPress={() => {
                                        clearInsertForm()
                                        onCloseCreate()
                                    }}>
                                        ยกเลิก
                                    </Button>
                                    <Button type='submit' color="primary">
                                        เพิ่ม
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Update modal */}
            <Modal
                size='xl'
                isOpen={isOpenUpdate}
                onOpenChange={onOpenChangeUpdate}
                placement="top-center"
            >
                <ModalContent>
                    {(onCloseUpdate) => (
                        <>
                            <form onSubmit={handleSendUpdate}>
                                <ModalHeader className="flex flex-col gap-1">แก้ไขข้อมูลรถ</ModalHeader>
                                <ModalBody>
                                    <div className='flex flex-row gap-4'>
                                        <div className='w-1/2 space-y-3'>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm">ประเภท: </label>
                                                <select className='selection border-1 rounded-lg px-2 py-1' onInput={() => set_vehicle_type_id(event.target.value)} required>
                                                    <option value="" hidden>เลือกประเภท</option>
                                                    {types?.length &&
                                                        types?.map(type => (
                                                            <option selected={vehicle_type_id == type.id} key={type.id} value={type.id}>{type.type_name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm">รุ่น: </label>
                                                <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="text" value={model} onInput={() => set_model(event.target.value)} required />
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm">ป้ายทะเบียน: </label>
                                                <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="text" value={license_code} onInput={() => set_license_code(event.target.value)} required />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm">พนักงานขับรถ: </label>
                                                <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="text" value={driver} onInput={() => set_driver(event.target.value)} required />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm">รูปรถ: </label>
                                                <input
                                                    className="block w-full text-sm text-slate-500 
                                                file:mr-4 file:py-2 file:px-4 file:rounded-md
                                                file:border-0 file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100" type="file"
                                                    onChange={onSelectFile} />
                                            </div>
                                        </div>
                                        <div className='w-1/2 space-y-3'>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm">ชื่อรถ: </label>
                                                <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="text" value={vehicle_name} onInput={() => set_vehicle_name(event.target.value)} required />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm">แบรนด์: </label>
                                                <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="text" value={brand} onInput={() => set_brand(event.target.value)} required />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm">ที่นั่ง: </label>
                                                <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="number" value={seat} onInput={() => set_seat(event.target.value)} required />
                                            </div>
                                            <div className='h-[123px] border-1 rounded-lg'>
                                                {(selectedFile || preview) && <img
                                                    className='block w-full h-full object-cover rounded-lg'
                                                    src={preview}
                                                />}
                                            </div>
                                        </div>
                                    </div>

                                </ModalBody>
                                <ModalFooter>
                                    <Button type='button' color="danger" variant="flat" onPress={() => {
                                        clearInsertForm()
                                        onCloseUpdate()
                                    }}>
                                        ยกเลิก
                                    </Button>
                                    <Button type='submit' color="primary">
                                        เพิ่ม
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default VehicleManage