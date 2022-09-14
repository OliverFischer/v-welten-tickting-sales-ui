'use strict';

import {createNewReservation} from '../../../prisma/ticketing-adapter'
/**
 * Saves a new reservation in the system based on the user passed. 
 *  
 * @param {*} req - the incoming request
 * @param {*} res - our response object
 */
export default async function handler(req, res){
    
    const reservierung = await createNewReservation(JSON.parse(req.body))

    res.status(200).json({
        message: 'Die Reservierung wurde im System gespeichert'
    })
    
}