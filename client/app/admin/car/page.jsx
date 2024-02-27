"use client"
import React, { useEffect, useState } from 'react'
import VehicleManage from './VehicleManage'
import VehicleTypeManage from './VehicleTypeManage'
import axios from 'axios'

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

    useEffect(()=>{
        getVehicles()
    },[])

    return (
        <div className='flex flex-row gap-10'>
            <VehicleManage vehicles={vehicles} className='w-[70%]' />
            <VehicleTypeManage types={types} className='w-[30%]' />
        </div>
    )
}

export default Page