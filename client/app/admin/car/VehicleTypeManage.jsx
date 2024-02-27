"use client"
import DeleteIcon from '@/components/icon/DeleteIcon'
import EditIcon from '@/components/icon/EditIcon'
import PlusIcon from '@/components/icon/PlusIcon'
import { Button, Tooltip } from '@nextui-org/react'
import React from 'react'

const typeTypeManage = ({ types, className }) => {
    return (
        <div className={className}>
            <div className='flex justify-between'>
                <h1>ประเภทรถ</h1>
                <Button color="primary" className='rounded-2xl' endContent={<PlusIcon />}>
                </Button>
            </div>
            <table className='w-full mt-2'>
                <thead>
                    <tr className='border-1'>
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
                                    <td className='p-2 text-center'>{type?.type_name}</td>
                                    <td className='p-2'>
                                        <div className="relative flex items-center justify-center gap-2">
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
        </div>
    )
}

export default typeTypeManage