import Link from 'next/link'
import MUIDataTable from "mui-datatables";
import Image from "next/image";
import {getUserReservierungen, isEmpty} from '../../prisma/ticketing-adapter'
import React, {useState} from "react";
import Box from '@mui/material/Box';
import {userService} from '../../services/user.service'


export async function getServerSideProps({ params }){

    const dateAsString = date => isEmpty(date) ? 'Termin unbekannt' : date.split('T')[0].split('-').reverse().join('.')
    const tickets = r => `${r.anzahl_besucher_karten}x Besucher & ${r.anzahl_betreuer_karten > 0 ? r.anzahl_betreuer_karten + 'x' : 'kein(e)'} Betreuer`
    const visitor = v => `${v.anrede} ${v.vorname} ${v.nachname}, von Firma :  ${v.firma}`
    
    const rawReservations = await getUserReservierungen(userService.userValue.id, new Date())
    const reservations = rawReservations
        .filter(rawReservation => rawReservation != null)
        .map(rawReservation => {
            let data = []
            data.push(rawReservation?.veranstaltung?.Sponsoringktivitaet?.id) // logo column
            data.push({
                eventName : rawReservation?.veranstaltung?.name,
                eventDate : dateAsString(rawReservation?.veranstaltung?.veranstaltungsdatum),
                tickets : tickets(rawReservation),
                visitor : visitor(rawReservation.besucher)
            })
            data.push(rawReservation?.veranstaltung?.name) // search column
            data.push(rawReservation.id) // reservationId
            return data
        })
    return {
        props : { reservations }
    }
}

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

    const [data, setData] = useState(props.reservations)
    const [rowsSelected, setRowsSelected] = useState([])

    options.rowsSelected = rowsSelected
    options.onRowsDelete = (rowsDeleted, newData) => {
        let data = props.reservations
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
            fetch('/api/reservations/delete',{
                method: 'DELETE',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    userId : userService.userValue.id,
                    reservationIds : reservationIds
                })
            })
                .then(handleErrors)
                .then(response => response.json())
                .then(data => {
                    setData(newData)
                    setRowsSelected([])
                })
                //.catch(console.error)
                .catch(error => {
                    alert(`Entschuldigung, ein Fehler ist aufgetreten.\nBitte versuchen Sie es noch einmal.\n\nDetails : ${JSON.stringify(error,null,"    ")}`)
                })
        } // no else case here, the user simply cancelled

        return false
    }

    return(
        <MUIDataTable
            data={data}
            columns={columns}
            options={options}
            title="Meine Reservierungen"
        />
    )
}