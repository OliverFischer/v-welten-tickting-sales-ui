// Page using swr as fetching for the items of the reservations
import MUIDataTable from "mui-datatables";
import Image from "next/image";
import React, {useState} from "react";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import {reservationService} from '../../services/reservation.service'
import {userService} from '../../services/user.service'
import { useSWRConfig } from "swr";

// MUI - Table descriptor
const columns = [{
    name:'ort', // this is the icon column
    label: 'Ort',
    empty: true,
    options: {
        filter : true,
        filterOptions: {
            renderValue: v => <Image width={32} height={32} src={'/logos/' + v + '.png'}/>
        },
        customBodyRender: (value) => {
            return (
                <Image
                    width={64}
                    height={64}
                    src={'/logos/' + value + '.png'}
                />
            )
        }
    }
},{
    name: 'event', // this is the content column
    label: 'Event',
    empty: true,
    options: {
        filter : false,
        customBodyRender: (value) => {
            return (
                <Box sx={{color: '#284A41'}}>
                    <div><b>{value.eventName}</b></div>
                    <div>Datum : {value.eventDate}</div>
                    <div>Karten : {value.tickets}</div>
                    <div>{value.visitor}</div>
                </Box>
            )
        }
    }
},{
    name: 'searchCol',
    label: 'searchColumn',
    options:{
        filter : false,
        display: false
    }
},{
    name : 'id',
    label: 'id',
    options: {
        filter : false,
        display: 'excluded'
    }
}]

let options = {

    tableId: 'reservations-data-table-1',
    print: false,
    filter : true,
    search: false,
    download: false,
    searchOpen: false,
    viewColumns: false,
    fixedHeader:true,
    filterType : 'checkbox',
    responsive: 'standard',
    tableBodyHeight: '800px',
    selectableRows: 'multiple',
    selectableRowsOnClick: false,


    /**
     * We use the raw integer value of the logo column and the search column
     * to sort the other columns.
     * @returns {Array} sorted data set dependant on colIndex and order
     */
    customSort: (data, colIndex, order) => {
        const idx = colIndex === 1 ? 2 : colIndex
        return data.sort((a,b) => {
            return (a.data[idx] < b.data[idx] ? -1 : 1) * (order === 'desc' ? 1 : -1)
        })
    }
};


export default function Reservations (props){

    const {reservations,isLoading,isError} = reservationService.useReservations()
    const [rowsSelected, setRowsSelected] = useState([])
    const {mutate} = useSWRConfig()

    options.rowsSelected = rowsSelected
    options.onRowsDelete = async (rowsDeleted, newData) => {
        let data = reservations
        const text = `Wollen Sie die selektierte(n) ${rowsDeleted.data.length} Reservierung(en) wirklich löschen?`

        const handleErrors = async response => {
            if(!response.ok){
                const errorData = await response.json()
                throw errorData
            }
            return response
        }

        if(confirm(text) == true){
            // build the list of reservation id's to delete
            const reservationIds = rowsDeleted.data
                .map(row => data[row.dataIndex])
                .map(row => row[3])
            try {
                await reservationService.deleteMany(reservationIds)
                //mutate('/reservations-swr')
            } catch (error) {
                alert(`Entschuldigung, ein Fehler ist aufgetreten.\nBitte versuchen Sie es noch einmal.\n\nDetails : ${JSON.stringify(error,null,"    ")}`)
            }
        }
        return false
    }

    if(isLoading) return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress />
        </Box>
    )
    
    if(isError) return (
        <Alert severity="error">im Moment können ihre Reservierungen nicht geladen werden.</Alert>
    )

    return(
        <MUIDataTable
            data={reservations}
            columns={columns}
            options={options}
            title="Meine Reservierungen"
        />
    )
}