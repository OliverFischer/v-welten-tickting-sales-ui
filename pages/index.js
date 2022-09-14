// Main/Homepage of the app allows the user to directly jump to an event
import * as React from "react";
import Typography from "@mui/material/Typography"
import MUIDataTable from "mui-datatables";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router'
import {getUpcomingEvents, isEmpty} from '../prisma/ticketing-adapter'
import Box from '@mui/material/Box';

export async function getServerSideProps({ params }){

    const dateAsString = date => isEmpty(date) ? 'Termin unbekannt' : date.split('T')[0].split('-').reverse().join('.')
    const rawEvents = await getUpcomingEvents()
    const getKartenText = kontingente => {
        let text = ``
        kontingente.forEach(kontingent => {
            if(text.length > 0){
                text += ','
            }
            text += kontingent?.kartenkontingent?.kartenanzahl + 'x ' + kontingent?.kartenkontingent?.sitzkategorie?.name
        })
        return text
    }

    const dateAsFilter = date => {
        const months = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
        if (isEmpty(date)){
            return 'Termin unbekannt'
        }else{
            if(!date['split']){
                debugger
            }
            const parts = date.split('T')[0].split('-').reverse()
            const month = months[parseInt(parts[1])-1]
            const year = parts[2]
            return `${year}/${parts[1]}`
        }
    }

    const events = rawEvents
        // we map the data to a simple array containing two columns, one for the
        // icon and the other for the data
        .map( (evt) => {
            let data = []
            data.push(evt.sponsoringaktivitaet_id)
            data.push({
                id: evt.id,
                name : evt.name,
                veranstaltungsdatum : dateAsString(evt.veranstaltungsdatum),
                karten: getKartenText(evt?.veranstaltung_kartenkontingent)
            })
            data.push(evt.name) // we use this for the search
            data.push(evt.id)
            data.push(evt?.Sponsoringktivitaet.Marke?.name)
            data.push(dateAsFilter(evt.veranstaltungsdatum))
            return data
        })


    return {
        props : { events }
    }
}

const columns = [
    {
        name:'ort', // this is the icon column
        label: 'Ort',
        empty: true,
        options: {
            filter : true,
            searchable: false,
            filterOptions: {
                renderValue: v => <Image width={36} height={36} src={'/logos/' + v + '.png'}/>
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
            searchable: false,
            customBodyRender: (value) => {
                return (
                    <Box sx={{color: '#284A41'}}>
                        <b style={{fontSize:'16px'}}>{value.name}</b>
                        <div>Datum: {value.veranstaltungsdatum}</div>
                        <div>Karten: {value.karten}</div>
                    </Box>
                )
            }
        }
    },{
        name: 'searchCol',
        label: 'searchColumn',
        options:{
            filter : false,
            display: 'excluded',
            searchable: true
        }
    },{
        name : 'id',
        label: 'id',
        options: {
            filter : false,
            display: 'excluded',
            searchable : false
        }
    },{
        name: 'marke_name',
        label: 'Marke',
        options: {
            filter: true,
            display: false,
            searchable : false
        }
    },{
        name: 'dateFilter',
        label: 'Monat',
        options: {
            filter: true,
            display: false,
            searchable: true
        }
    }
];

let options = {

    tableId: 'events-data-table-1',
    print: false,
    download: false,
    searchAlwaysOpen: true,
    viewColumns: false,
    fixedHeader:true,
    filterType : 'checkbox',
    responsive: 'simple',
    tableBodyHeight:'800px',
    selectableRows:'none',
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
    },

    /**
     * Overridden search function because a search in hidden columns is not possible, see:
     * https://stackoverflow.com/questions/63981558/mui-datatables-search-on-hidden-column
     * and
     * https://github.com/gregnb/mui-datatables/blob/fde3497a552040505f70c274466715fce1d7e8ab/src/MUIDataTable.js#L1023
     */
    customSearch: (searchQuery, currentRow, columns) => {
        let isFound = false;
        currentRow.forEach((col,idx) => {
            if (col && columns[idx]?.searchable === true && col.toString().indexOf(searchQuery) >= 0) {
                isFound = true;
            }
        });
        return isFound;
    },
};


export default function Home(props){

    // based on the explanations of https://reactjs.org/docs/hooks-rules.html
    // we need to declare the router outside of the event handling
    const router = useRouter()
    options.onRowClick = (value, meta) => {
        router.push('/events/' + value[3])
    }

    return(
        
        <MUIDataTable
            data={props.events}
            columns={columns}
            options={options}
        />
        
    )
}