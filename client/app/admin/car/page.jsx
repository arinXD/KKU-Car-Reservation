"use client"
import React, { useEffect, useState } from 'react'
import VehicleManage from './VehicleManage'
import VehicleTypeManage from './VehicleTypeManage'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
    const [fetching, setFetching] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [types, setTypes] = useState([])

    async function getVehicles() {
        try {
            setFetching(true)
            const res1 = await axios.get("http://localhost:8000/api/vehicles/types")
            const res2 = await axios.get("http://localhost:8000/api/types")
            const vehicles = res1.data.data
            const types = res2.data.data
            setVehicles(vehicles)
            setTypes(types)
        } catch (err) {
            setVehicles([])
            setTypes([])
        } finally {
            setFetching(false)
        }
    }

    useEffect(() => {
        getVehicles()
    }, [])

    function stateModal(type="success", message) {
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

    return (
        <div className='flex flex-row gap-10'>
            <VehicleManage stateModal={stateModal} vehicles={vehicles} getVehicles={getVehicles} types={types} className='w-[70%]' />
            <VehicleTypeManage stateModal={stateModal} types={types} getVehicles={getVehicles} className='w-[30%]' />
            <ToastContainer />
        </div>
    )
}

export default Page