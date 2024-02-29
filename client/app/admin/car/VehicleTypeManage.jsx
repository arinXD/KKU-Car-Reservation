"use client"
import DeleteIcon from '@/components/icon/DeleteIcon'
import EditIcon from '@/components/icon/EditIcon'
import PlusIcon from '@/components/icon/PlusIcon'
import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, useDisclosure } from '@nextui-org/react'
import axios from 'axios'
import React, { useState } from 'react'
import Swal from 'sweetalert2'

const typeTypeManage = ({ stateModal, types, getVehicles, className }) => {
    const [tid, setTid] = useState(null)
    const [type_name, set_type_name] = useState("")
    const { isOpen: isOpenCreate, onOpen: onOpenCreate, onOpenChange: onOpenChangeCreate, onClose: onCloseCreate } = useDisclosure();
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onOpenChange: onOpenChangeUpdate, onClose: onCloseUpdate } = useDisclosure();

    async function sendData(formData) {
        try {
            await axios.post('http://localhost:8000/api/types', formData);
            getVehicles()
            stateModal("success", "เพิ่มข้อมูลสำเร็จ")
        } catch (error) {
            console.error('Error:', error);
            stateModal("error", "เพิ่มข้อมูลไม่สำเร็จ")
        } finally {
            set_type_name("")
        }
    };

    function handleAddVehicle(event) {
        event.preventDefault();
        const formData = {
            type_name
        }

        onCloseCreate()
        sendData(formData);
    };

    async function handleUpdateVehicle(event) {
        event.preventDefault();
        const formData = {
            type_name
        }

        onCloseUpdate()
        try {
            await axios.put(`http://localhost:8000/api/types/${tid}`, formData);
            getVehicles()
            stateModal("success", "แก้ไขข้อมูลสำเร็จ")
        } catch (error) {
            console.error('Error:', error);
            stateModal("error", "แก้ไขข้อมูลไม่สำเร็จ")
        } finally {
            set_type_name("")
        }
    };
    function openUpdateForm(id) {
        setTid(id)
        set_type_name(document.querySelector(`#type-${id}`).innerHTML)
        onOpenUpdate()
    }

    async function deleteType(id) {
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
                    await axios.delete(`http://localhost:8000/api/types/${id}`);
                    getVehicles()
                    stateModal("success", "ลบข้อมูลสำเร็จ")
                } catch (error) {
                    console.error('Error:', error);
                    stateModal("error", "ลบข้อมูลไม่สำเร็จ")
                }
            }
        });
    }

    return (
        <div className={className}>
            <div className='flex justify-between'>
                <h1>ข้อมูล</h1>
                <Button onPress={onOpenCreate} color="primary" className='rounded-2xl' endContent={<PlusIcon />}>
                </Button>
            </div>
            <table className='w-full mt-2'>
                <thead className="bg-[#E6EAF2] text-gray-500">
                    <tr className='border-1 border-[#E6EAF2]'>
                        <th className='p-2'>ประเภท</th>
                        <th className='p-2'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        !types?.length ?
                            <tr className='border-1'>
                                <td colSpan={2} className='p-2 text-center'>ไม่มีข้อมูลประเภทรถ</td>
                            </tr>
                            :
                            types?.map(type => (
                                <tr className='border-1' key={type?.id}>
                                    <td id={`type-${type?.id}`} className='p-2 text-center'>{type?.type_name}</td>
                                    <td className='p-2'>
                                        <div className="relative flex items-center justify-center gap-2">
                                            <button onClick={() => openUpdateForm(type?.id)}>
                                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                    <EditIcon />
                                                </span>
                                            </button>
                                            <button onClick={() => deleteType(type?.id)}>
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
                size='lg'
                isOpen={isOpenCreate}
                onOpenChange={onOpenChangeCreate}
                placement="top-center"
            >
                <ModalContent>
                    {(onCloseCreate) => (
                        <>
                            <form onSubmit={handleAddVehicle}>
                                <ModalHeader className="flex flex-col gap-1">แก้ไขประเภทรถ</ModalHeader>
                                <ModalBody>
                                    <div className="flex flex-col gap-1">
                                        <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="text" value={type_name} onInput={() => set_type_name(event.target.value)} required />
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button type='button' color="danger" variant="flat" onPress={() => {
                                        set_type_name("")
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

            <Modal
                size='lg'
                isOpen={isOpenUpdate}
                onOpenChange={onOpenChangeUpdate}
                placement="top-center"
            >
                <ModalContent>
                    {(onCloseUpdate) => (
                        <>
                            <form onSubmit={handleUpdateVehicle}>
                                <ModalHeader className="flex flex-col gap-1">เพิ่มประเภทรถ</ModalHeader>
                                <ModalBody>
                                    <div className="flex flex-col gap-1">
                                        <input className='focus:outline-none focus:border-blue-500 border-1 rounded-lg px-2 py-1' type="text" value={type_name} onInput={() => set_type_name(event.target.value)} required />
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button type='button' color="danger" variant="flat" onPress={() => {
                                        set_type_name("")
                                        onCloseUpdate()
                                    }}>
                                        ยกเลิก
                                    </Button>
                                    <Button type='submit' color="primary">
                                        แก้ไข
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

export default typeTypeManage