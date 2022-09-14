import {deleteReservationsForUser} from '../../../../prisma/ticketing-adapter'

export default async function handler(req, res){

    const userId = parseInt(req.query.userId)
    const {reservationIds} = req.body
    console.log(req.body)
    // debug stuff, delete
    
    // 1. Check right method
    // 2. Check user is present
    // 3. Check if reservation is present and suitable
    if(req.method !== 'DELETE'){
        res.status(405).json({
            message : 'Invalid method call. Use DELETE method.'
        })
    }else if(!userId){
        res.status(400).json({
            status: 'error',
            message: 'A userId to pass in the body is mandatory.'
        })
    }else if(!reservationIds || (!Array.isArray(reservationIds))){
        res.status(400).json({
            status: 'error',
            message: 'An array of reservationIds is needed for this operation.'
        })
    }else{
        // main functional part
        try{
            const results = await deleteReservationsForUser(userId,reservationIds)    
            console.log(results)   
            res.status(200).json({
                message: 'Delete (partially) successful',
                reservationIds : results
            })
        }catch(error){
            console.log(error)
            res.status(500).json(error)
        }
        
    }
}