'use strict';

import {getUserReservierungen, isEmpty} from '../../../../prisma/ticketing-adapter'

const dateAsString = date => isEmpty(date) ? 'Termin unbekannt' : date.split('T')[0].split('-').reverse().join('.')
const tickets = r => `${r.anzahl_besucher_karten}x Besucher & ${r.anzahl_betreuer_karten > 0 ? r.anzahl_betreuer_karten + 'x' : 'kein(e)'} Betreuer`
const visitor = v => `${v.anrede} ${v.vorname} ${v.nachname}, von Firma :  ${v.firma}`

/**
 * Returns the reservations for a user.
 *  
 * @param {*} req - the incoming request
 * @param {*} res - our response object
 */
 export default async function handler(req, res){
    
    const userId = parseInt(req.query.userId)
    const rawReservations = await getUserReservierungen(userId, new Date())
    const reservations = rawReservations
        .filter(rawReservation => rawReservation != null)
        .map(rawReservation => {
            let data = []
            data.push(rawReservation?.veranstaltung?.Sponsoringktivitaet?.id) // logo column
            data.push({
                eventName : rawReservation?.veranstaltung?.name,
                eventDate : dateAsString(rawReservation?.veranstaltung?.veranstaltungsdatum),
                tickets : tickets(rawReservation),
                visitor : visitor(rawReservation.besucher),
                invitationCause: rawReservation.einladungsgrund
            })
            data.push(rawReservation?.veranstaltung?.name) // search column
            data.push(rawReservation.id) // reservationId
            return data
        })
    
    res.json(reservations)
    
}