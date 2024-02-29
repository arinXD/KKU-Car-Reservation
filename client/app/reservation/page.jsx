'use client';
import React, { useEffect, useState } from 'react'
import { Card, CardFooter, Image, Button, Skeleton, Chip } from "@nextui-org/react";
import axios from 'axios';
import { useSession } from "next-auth/react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
    const [types, setTypes] = useState([])
    const [fetching, setFetching] = useState(true)
    const { data: session } = useSession();
    const [vehicleId, setVehicleId] = useState(null)
    const [subDistrict, setSubDistrict] = useState("")
    const [district, setDistrict] = useState("")
    const [province, setProvince] = useState("")
    const [address, setAddress] = useState("")
    const [pickUpPoint, setpickUpPoint] = useState("")
    const [departureDate, setDepartureDate] = useState("")
    const [returnDate, setReturnDate] = useState("")
    const [passengersNumber, setPassengersNumber] = useState("")
    const [thaiProvinces, setthaiProvinces] = useState([])
    const [thaiDistrict, setThaiDistrict] = useState([])
    const [thaiSubDistrict, setThaiSubDistrict] = useState([])

    const fetchProvinces = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json');
            const data = await response.json();
            setthaiProvinces(data);
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    };

    useEffect(() => {
        fetchProvinces()
    }, [])

    useEffect(() => {
        async function getTypes() {
            setFetching(true)
            try {
                const res = await axios.get(`http://localhost:8000/api/types/vehicles`)
                const data = res.data.data
                setTypes(data)
            } catch (error) {
                setTypes([])
            } finally {
                setFetching(false)
            }
        }
        getTypes()
    }, [session])

    function checkedVehicle(id) {
        document.querySelector(`#vehicle_${id}`).checked = true
        setVehicleId(id)
    }
    function selectProvince(province) {
        setProvince(province)
        const thDistrict = thaiProvinces.filter(pv => pv.name_th == province)
        setThaiDistrict(thDistrict[0]?.amphure)

    }
    function selectDistrict(district) {
        setDistrict(district)
        const thSubDistrict = thaiDistrict.filter(ds => ds.name_th == district)
        setThaiSubDistrict(thSubDistrict[0]?.tambon)
    }
    vehicleId
    subDistrict
    district
    province
    address
    pickUpPoint
    departureDate
    returnDate
    passengersNumber
    function validateFormData(vehicleId, subDistrict, district, province, address, pickUpPoint, departureDate, returnDate, passengersNumber) {
        if (!vehicleId) {
            alert("Please select a vehicle.");
            return false;
        }
        if (!subDistrict) {
            alert("Please select a sub-district.");
            return false;
        }
        if (!district) {
            alert("Please select a district.");
            return false;
        }
        if (!province) {
            alert("Please select a province.");
            return false;
        }
        if (!address) {
            alert("Please enter an address.");
            return false;
        }
        if (!pickUpPoint) {
            alert("Please enter a pick-up point.");
            return false;
        }
        if (!departureDate) {
            alert("Please select a departure date.");
            return false;
        }
        if (!returnDate) {
            alert("Please select a return date.");
            return false;
        }
        if (!passengersNumber || passengersNumber <= 0) {
            alert("Please enter a valid number of passengers.");
            return false;
        }

        return true;
    }
    async function handleSubmit(event) {
        event.preventDefault()
        if (!validateFormData(vehicleId, subDistrict, district, province, address, pickUpPoint, departureDate, returnDate, passengersNumber)) {
            return;
        }
        const formData = {
            vehicle_id: vehicleId,
            sub_district: subDistrict,
            district: district,
            province: province,
            address: address,
            pick_up_point: pickUpPoint,
            departure_date: departureDate,
            return_date: returnDate,
            passengers_number: passengersNumber,
            user_id: session?.user?.id,
        }

        try {
            await axios.post("http://localhost:8000/api/reservations", { data: formData })
            toast.success('บันทึกข้อมูลการจองของคุณเรียบร้อย', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "light",
            });
            setTimeout(() => {
                window.location.href = "/"
            }, 2000);
        } catch (err) {
            console.error(err);
            toast.error('ไม่สามารถบันทึกการจอง', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "light",
            });
        } finally {
            setVehicleId("")
            setSubDistrict("")
            setDistrict("")
            setProvince("")
            setAddress("")
            setpickUpPoint("")
            setDepartureDate("")
            setReturnDate("")
            setPassengersNumber("")
            document.querySelectorAll(".selection").forEach(e => {
                e.value = ""
            })
        }
    }
    return (
        <>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <div className='flex gap-2'>
                    <div className='w-1/2 h-fit border-1 p-3 rounded-md'>
                        {
                            fetching ?
                                <div className='space-y-4'>
                                    <ul className='grid grid-cols-4 gap-4'>
                                        <div className='flex flex-col items-center justify-center gap-2'>
                                            <Skeleton className="h-[100px] w-full rounded-lg" />
                                            <Skeleton className="h-5 w-5 rounded-full" />
                                        </div>
                                        <div className='flex flex-col items-center justify-center gap-2'>
                                            <Skeleton className="h-[100px] w-full rounded-lg" />
                                            <Skeleton className="h-5 w-5 rounded-full" />
                                        </div>
                                        <div className='flex flex-col items-center justify-center gap-2'>
                                            <Skeleton className="h-[100px] w-full rounded-lg" />
                                            <Skeleton className="h-5 w-5 rounded-full" />
                                        </div>
                                        <div className='flex flex-col items-center justify-center gap-2'>
                                            <Skeleton className="h-[100px] w-full rounded-lg" />
                                            <Skeleton className="h-5 w-5 rounded-full" />
                                        </div>
                                    </ul>
                                    <ul className='grid grid-cols-4 gap-4'>
                                        <div className='flex flex-col items-center justify-center gap-2'>
                                            <Skeleton className="h-[100px] w-full rounded-lg" />
                                            <Skeleton className="h-5 w-5 rounded-full" />
                                        </div>
                                        <div className='flex flex-col items-center justify-center gap-2'>
                                            <Skeleton className="h-[100px] w-full rounded-lg" />
                                            <Skeleton className="h-5 w-5 rounded-full" />
                                        </div>
                                    </ul>
                                </div>
                                :
                                !types.length ?
                                    <div>ไม่มีรายการรถ</div>
                                    :
                                    <>
                                        <h1 className='mb-3'>เลือกรถที่ต้องการจอง</h1>
                                        {types.map(type => (
                                            <div key={type.id}>
                                                {/* <h2 className='mb-2'>{type.type_name}</h2> */}
                                                {!type?.Vehicles?.length ?
                                                    <div>ยังไม่มีรายการรถ</div>
                                                    :
                                                    <>
                                                        <h2 className='mb-2'>{type?.type_name}</h2>
                                                        <ul className='w-full overflow-x-auto flex gap-4 pb-4'>
                                                            {type?.Vehicles?.map(vehicle => (
                                                                <li key={vehicle.id} className='relative basis-[38%] shrink-0 flex flex-col gap-3'>
                                                                    {vehicle?.reserve_status &&
                                                                        <Chip className="absolute z-50 top-1 right-1" color="danger">
                                                                            จองแล้ว
                                                                        </Chip>
                                                                    }
                                                                    <Card
                                                                        shadow='none'
                                                                        isFooterBlurred
                                                                        radius="lg"
                                                                        className="border-1"
                                                                    >
                                                                        <Image
                                                                            alt="vehicle"
                                                                            className={`${vehicle?.reserve_status ? "opacity-60" : ""} rounded-none`}
                                                                            height={100}
                                                                            src={vehicle?.img}
                                                                        />
                                                                        <CardFooter className="text-small justify-start flex-col gap-2">
                                                                            <div className='w-full space-y-1'>
                                                                                <p className="text-tiny text-black/80">{vehicle.vehicle_name} {vehicle.seat} ที่นั่ง</p>
                                                                                <p className="text-tiny text-black/80">{vehicle.brand} {vehicle?.model}</p>
                                                                                <p className="text-tiny text-black/80">พนักงานขับรถ: {vehicle.driver}</p>
                                                                            </div>
                                                                            <Button disabled={vehicle?.reserve_status} onClick={() => checkedVehicle(vehicle.id)} className={`${vehicle?.reserve_status ? "bg-blue-200" : "bg-blue-500"} w-full text-tiny text-white`} variant="flat" color="primary" radius="lg" size="sm">
                                                                                เลือก
                                                                            </Button>
                                                                        </CardFooter>
                                                                    </Card>
                                                                    <input disabled={vehicle?.reserve_status} type="radio" name="vehicle_id" value={vehicle.id} id={`vehicle_${vehicle.id}`} />
                                                                </li>

                                                            ))
                                                            }
                                                        </ul>
                                                    </>
                                                }
                                            </div>
                                        ))}
                                    </>
                        }
                    </div>
                    <div className='w-1/2 border-1 p-3 space-y-4 rounded-md'>
                        <h3 className='mb-3'>กรอกรายละเอียดการจอง</h3>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm">จังหวัด: </label>
                            <select className='selection border-1 rounded-lg px-2 py-1' onInput={() => selectProvince(event.target.value)} required>
                                <option value="" hidden>เลือกจังหวัด</option>
                                {
                                    thaiProvinces.length &&
                                    thaiProvinces.map((thaiProvince, index) => (
                                        <option key={index} value={thaiProvince.name_th}>{thaiProvince.name_th}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm">อำเภอ: </label>
                            <select className='selection border-1 rounded-lg px-2 py-1' onInput={() => selectDistrict(event.target.value)} required>
                                <option value="" hidden>เลือกอำเภอ</option>
                                {
                                    thaiDistrict?.length &&
                                    thaiDistrict?.map((tdt, index) => (
                                        <option key={index} value={tdt.name_th}>{tdt.name_th}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm">ตำบล: </label>
                            <select className='selection border-1 rounded-lg px-2 py-1' onInput={() => setSubDistrict(event.target.value)} required>
                                <option value="" hidden>เลือกตำบล</option>
                                {
                                    thaiSubDistrict?.length &&
                                    thaiSubDistrict?.map((sdt, index) => (
                                        <option key={index} value={sdt.name_th}>{sdt.name_th}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm">จุดนัดรับ: </label>
                            <textarea className='border-1 rounded-lg px-2 py-1' value={pickUpPoint} onInput={() => setpickUpPoint(event.target.value)}></textarea>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm">จุดหมาย: </label>
                            <textarea className='border-1 rounded-lg px-2 py-1' value={address} onInput={() => setAddress(event.target.value)}></textarea>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm">วันที่ออกเดินทาง: </label>
                            <input className='border-1 rounded-lg px-2 py-1' type="date" value={departureDate} onInput={() => setDepartureDate(event.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm">วันที่กลับ: </label>
                            <input className='border-1 rounded-lg px-2 py-1' type="date" value={returnDate} onInput={() => setReturnDate(event.target.value)} />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm">จำนวนผู้เดินทาง: </label>
                            <input className='border-1 rounded-lg px-2 py-1' type="number" value={passengersNumber} onInput={() => setPassengersNumber(event.target.value)} />
                        </div>
                        <Button type='submit' color='primary' className='w-full'>จอง</Button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default Page