import { userService } from "./user.service";
import getConfig from 'next/config';

import useSWR from "swr"
const fetcher = (...args) => fetch(...args).then(res => res.json())

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/reservations`;

async function deleteMany(reservationIds){
    
    const response = await fetch(`${baseUrl}/delete/${userService.userValue.id}`,{
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            reservationIds
        })
    })
    return response
}

function useReservations(){
    
    const {data, error} = useSWR(`${baseUrl}/read/${userService.userValue.id}`, fetcher)

    return {
        reservations : data,
        isLoading: !error && !data,
        isError: error
    }
}

export const reservationService = {
    useReservations,
    deleteMany
}