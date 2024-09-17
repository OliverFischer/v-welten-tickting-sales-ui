const { PrismaClient } = require('@prisma/client')

const serializableData = (o = {}) => JSON.parse(JSON.stringify(o))

const prisma = new PrismaClient({
    log: ['query','error']
})

const getBookedReservations = async (date = new Date()) => {
    const rawReservations = await prisma.reservierung.findMany({
        where:{
            veranstaltung : {
                veranstaltungsdatum : {
                    gt : date
                }
            },
            gebucht: {
                equals : true
            }
        },
        include: {
            veranstaltung : {
                select: {
                    id : true
                }
            }
        }
    })
    const result = serializableData(rawReservations)
    return result
}

/**
 * Returns a list of all upcoming events in the database
 */
const getAllUpcomingEvents = async (date = new Date()) => {
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


// A `main` function so that you can use async/await
async function main() {
    const date = new Date()
    // get a list of all (unfiltered) events from start date
    const allEvents = await getAllUpcomingEvents(date)
    // get a list of reservations containing booked events from start date 
    const yetBookedEvents = await getBookedReservations(date)

    // we only need the eventids to filter the list
    const bookedEventIds = yetBookedEvents.map((event) => event.veranstaltung_id)
    console.log(bookedEventIds)
    // shrink the allEvents list by those events already booked
    const filteredEvents = allEvents.filter((event) => !(bookedEventIds.indexOf(event.id)>-1))
    console.log(allEvents.length)
    console.log(filteredEvents.length)
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
