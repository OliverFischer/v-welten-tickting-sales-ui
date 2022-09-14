/**
 * Class encapsulates the whole db read and write stuff.
 */
import { PrismaClient } from '@prisma/client'
import crypto from "crypto";
const prisma = new PrismaClient({
    log: ['query','error']
})

const serializableData = any => JSON.parse(JSON.stringify(any))
const logger = require('pino')()

/**
 * Returns true if the passed value is empty, false otherwise. The value is deemed to be
 * empty if it is either:
 *
 * - `null`
 * - `undefined`
 * - a zero-length array
 * - a zero-length string (Unless the `allowEmptyString` parameter is set to `true`)
 *
 * @param {Object} value The value to test.
 * @param {Boolean} [allowEmptyString=false] `true` to allow empty strings.
 * @return {Boolean}
 */
export const isEmpty = (value,allowEmptyString) => (value == null) || (!allowEmptyString ? value === '' : false) || (Array.isArray(value) && value.length === 0)

/**
 * Decides based on the date passed if a fallback text should be displayed
 * @param date
 * @returns {string}
 */
export const dateAsString = date => isEmpty(date) ? 'Termin unbekannt' : date

/**
 * Returns a list of all upcoming events in the database
 */
export const getUpcomingEvents = async (date = new Date()) => {
    const rawEvents = await prisma.veranstaltung.findMany({
        where: {
            veranstaltungsdatum : {
                gt : date
            }
        },
        include: {
            veranstaltung_kartenkontingent: {
                include: {
                    kartenkontingent: {
                        include: {
                            sitzkategorie: true
                        }
                    }
                }
            },
            Sponsoringktivitaet: {
                include: {
                    Marke: true
                }
            }
        },
        orderBy:[{veranstaltungsdatum: 'asc'}]
    })
    return serializableData(rawEvents)
}


/**
 * Returns an event by its database id. Includes kartenkontingente, sitzkategorien
 * @param id
 * @returns {Promise<any>}
 */
export const getUpcomingEvent = async (eventId) => {
    const id = eventId
    const rawEvent = await prisma.veranstaltung.findUnique({
        where: {
            id
        },
        include: {
            veranstaltung_kartenkontingent: {
                include: {
                    kartenkontingent: {
                        include: {
                            sitzkategorie: true
                        }
                    }
                }
            }
        }
    })
    const event = serializableData(rawEvent)

    logger.info(event)
    return event
}

/**
 * Returns all kostenstellen in the system marked as active
 * @returns {Promise<any>}
 */
export const getKostenstellen = async () => {

    const rawKostenstellen = await prisma.kostenstelle.findMany({
        where: {
            NOT : {
                deleted: {
                    equals: 1
                }
            }
        },
        orderBy:[{kostenstelle: 'asc'}]
    })
    return serializableData(rawKostenstellen)
}

export const getPositionen = async () => {

    const rawPositionen = await prisma.position.findMany({
        orderBy:[{name: 'asc'}]
    })

    return serializableData(rawPositionen)
}

/**
 * Returns a list of reservations for the current user
 * @param userId
 * @param date
 * @returns {Promise<Array>}
 */
export const getUserReservierungen = async (userId, date = new Date()) => { //TODO: fixes Datum wegnehmen!!
    console.log(userId)
    const rawUserReservierungen = await prisma.reservierung.findMany({
        where:{
            aussendienstmitarbeiter_id: userId,
            veranstaltung : {
                veranstaltungsdatum : {
                    gt : date
                }
            },
            gebucht: {
                equals : false
            }
        },
        include: {
            besucher: true,
            kostenstelle : true,
            sitzkategorie : true,
            veranstaltung : {
                include : {
                    Sponsoringktivitaet: true // for the logo
                }
            }
        },
    })

    return serializableData(rawUserReservierungen)
}

const shaStringDecoder = input => crypto.createHash('sha1').update(input).digest('hex')

export const getUserByCredits = async (username, password) => {

    const decoded = shaStringDecoder(password)

    const user = await prisma.benutzer.findFirst({
        where: {
            benutzer_name:  username,
            passwort : decoded
        }
    })

    return serializableData(user)
}

/**
 * Increases the unsuccessful login attempts by 1 and returns the user.
 * @param username
 * @returns {Promise<any>}
 */
export const increaseUnsuccessfulLoginAttempts = async (username) =>{

    const updateUser = await prisma.benutzer.update({
        where: {
            benutzer_name: username
        },
        data: {
            fehlgeschlagene_anmeldeversuche: {
                increment: 1
            }
        }
    })

    const user = await prisma.benutzer.findUnique({
        where: {
            benutzer_name: username
        }
    })

    return serializableData(user)
}

export const blockUserPermanent = async (userId) => {
    const updateUser = await prisma.benutzer.updateOne({
        where: {
            id : userId
        },
        data: {
            konto_gesperrt : 1
        }
    })

    return serializableData(updateUser)
}

/**
 * Creates a prisma readabla insert statement for a new besucher in the database.
 * @param {*} data 
 * @returns 
 */
const prepareInsertDataForNewBesucher = data => {
    
    const erzeugt_am = new Date()
    const {vorname, nachname,strasse, hausnummer,wohnort,firma,objektnummer,plz,position_id, ...rest} = data
    
    let besucherData = {vorname, nachname,strasse, hausnummer,
        ort : wohnort,
        firma,
        anrede : 'Herr/Frau',
        objekt_nummer : objektnummer,
        plz : parseInt(plz),
        position: {
            connect: {
                id: position_id,
            }
        }}
    const besucherInsertData = {
        ...besucherData,
        erzeugt_am
    }
    return besucherInsertData
}

/**
 * Creates a prisma readable insert statement for a new reservation.
 * @param {*} data 
 */
const prepareInsertDataForNewReservation = data => {
    
    const erzeugt_am = new Date()
    const gebucht = false
    const zu_absage_per_mail_verschickt = false
    const optlock = 0
    const reservierung_eingegangen_am = erzeugt_am
    

    const {anzahlBesucher, anzahlBetreuer,kostenstelle_id,sitzkategorie_id,veranstaltung_id, aussendienstmitarbeiter_id} = data
    let reservierungData = {
        anzahl_besucher_karten : anzahlBesucher, 
        anzahl_betreuer_karten : anzahlBetreuer,
        kostenstelle_id,
        sitzkategorie_id,
        veranstaltung_id,
        gebucht,
        zu_absage_per_mail_verschickt,
        optlock
    }

    const reservierung = {
        ...reservierungData,
        erzeugt_am,
        reservierung_eingegangen_am, 
        aussendienstmitarbeiter_id
    }

    return reservierung
}

/**
 * The data passed is a <b>flat</b> object containing all properties from the reservation.
 * @param {*} data 
 * @returns 
 */
export const createNewReservation = async data => {

    const besucherInsertData = prepareInsertDataForNewBesucher(data)
    const reservierungInputData = prepareInsertDataForNewReservation(data)
   
    const createdBesucher = await  prisma.besucher.create({
        data: besucherInsertData
    })

    const createdReservation = await prisma.reservierung.create({
        data : {
            ...reservierungInputData,
            besucher_id: createdBesucher.id
        }
    })

    return serializableData(createdReservation)
}

export const deleteReservationsForUser = async (userId, ids) => {
    const deleted = await prisma.reservierung.deleteMany({
        where : {
            id: {in: ids},
            aussendienstmitarbeiter_id: {equals:userId}
        }
    })
    return serializableData(deleted)
}