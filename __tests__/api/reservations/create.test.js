import { createNewReservation } from "../../../prisma/ticketing-adapter";
import { PrismaClientValidationError} from '@prisma/client'
import {fixture, OP_DEL, OP_MERGE} from "../../../__fixtures__/api/reservations/reservation.fixture"

describe('Create reservation', () => {
    
    it('succeeds on passing the correct data', async() => {
        const reservation = await createNewReservation(fixture())
        expect(reservation).toBeDefined()
    })

    describe('fails with meesage', () => {
        it('on missing kostenstelleId', async () => {
            let reservation = fixture({
                kostenstelleId : null
            },OP_DEL)
            try{
                await createNewReservation(reservation)
                return false
            }catch(e){
                expect(e instanceof PrismaClientValidationError)
            }
        })
    })
})