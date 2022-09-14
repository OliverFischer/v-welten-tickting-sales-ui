import {getUserByCredits, blockUserPermanent, increaseUnsuccessfulLoginAttempts} from '../../../prisma/ticketing-adapter'

export default async function handler(req, res){

    const username = req.body.username
    const password = req.body.password

    try{
        const user = await getUserByCredits(username, password)
        if(user == null){
            const failLoginUser = await increaseUnsuccessfulLoginAttempts(username)
            if(failLoginUser.fehlgeschlagene_anmeldeversuche >= 3){
                await blockUserPermanent(failLoginUser.id)
                throw Error('Blocked user permanently, too many unsuccessful login attempts')
            }
        }else{
            const {anrede, benutzer_name, email, mobilfunknummer, nachname, vorname, personalnummer, id} = user
            const flyweightUser = {anrede, benutzer_name, email, mobilfunknummer, nachname, vorname, personalnummer, id}
            res.status(200).json(flyweightUser)
        }
    }catch(e){
        res.status(403).json({
            status: 'error',
            message: 'Kombination aus Benutzername und Passwort nicht gültig.'
        })
    }


}