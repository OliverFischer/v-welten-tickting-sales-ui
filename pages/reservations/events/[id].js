/**
 * A classical wizard based form to create a new reservation based on an event passed.
 */
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ReviewForm from './ReviewForm';
import TicketForm from './TicketForm';
import VisitorForm from './VisitorForm';
import {getKostenstellen, getPositionen, getUpcomingEvent} from '../../../prisma/ticketing-adapter'
import { useFormik } from 'formik';
import {validationSchema} from '../../../services/yup-form-support'
import { userService } from '../../../services';

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://www.carlsberg.com/">
                Ticketing Carlsberg by V-Welten
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
const steps = ['Ticketauswahl', 'Besucherinformationen', 'Überprüfen'];

function getStepContent(step,props, formik) {
    switch (step) {
        case 0:
            return <TicketForm kostenstellen={props.kostenstellen} sitzkategorien={props.sitzkategorien} formik={formik} plaetze={props.eventSeats} />;
        case 1:
            return <VisitorForm positionen={props.positionen} formik={formik} plaetze={props.eventSeats}/>;
        case 2:
            return <ReviewForm props={props} formik={formik} plaetze={props.eventSeats} event={props.event} />;
        default:
            throw new Error('Unknown step');
    }
}

export async function getServerSideProps({ params }){

    // get the kostenstellen
    const veranstaltungId = parseInt(params.id)
    let kostenstellen = await getKostenstellen()
    kostenstellen = kostenstellen
        .map(({ id, kostenstelle}) => ({value:id, label:kostenstelle}))

    // get the positionen
    let positionen = await getPositionen()
    positionen = positionen
        .map(({id, name}) => ({value:id, label:name}))

    // get the seatcategories by querying the event data
    const event = await getUpcomingEvent(veranstaltungId)
    const eventSeats = event.veranstaltung_kartenkontingent
    // default fallback for the selection, if nothing is provided

    let sitzkategorien = [{value: 'invalid', label: 'Keine verfügbaren Plätze!' }]
    if(Array.isArray(eventSeats) && eventSeats.length > 0){
        sitzkategorien = [] // delete fallback option
        // OLLI: Was machen wir eigentlich, wenn wir hier auf dem Srver merken, dass keine da sind??
        sitzkategorien = eventSeats.map(eventSeatOption => {
            const value = eventSeatOption.kartenkontingent?.sitzkategorie?.id
            let label = eventSeatOption.kartenkontingent?.sitzkategorie?.name
            const cateringAvailable = eventSeatOption.kartenkontingent?.kosten_catering > 0
            const cateringTerm = cateringAvailable ? ` / Catering: ${eventSeatOption.kartenkontingent?.kosten_catering}€ p.P.` : ''
            const costTerm = `Ticket: ${eventSeatOption.kartenkontingent?.kosten_karte}€ p.P`
            label += `  (${costTerm}${cateringTerm})`
            return {value, label}
        })
    }

    return {
        props : { kostenstellen, sitzkategorien, positionen, eventSeats, event }
    }
}


export default function Reservation(props) {
    // React State
    const [activeStep, setActiveStep] = React.useState(0)
    const handleNext = () => setActiveStep(activeStep + 1)
    const handleBack = () => setActiveStep(activeStep - 1)

    //console.log(userService.userValue)

    const olliRecordFake = {
        vorname: 'Olli',
        nachname: 'Fischer',
        strasse: 'Handweg',
        hausnummer: '47',
        wohnort: 'Hamburg',
        //position: null,
        firma: 'V-Welten',
        objektnummer: '47110815',
        plz : '21077',
        einladungsgrund: '',

        anzahlBesucher: 3,
        anzahlBetreuer: 4,
        kostenstelle: "100300",
        kostenstelle_id : 145,
        sitzkategorie: null,
        sitzkategorie_id : null,
        position: null,
        position_id : null,
        veranstaltung_id : props.event.id,
        aussendienstmitarbeiter_id : userService.userValue.id
    }

    const emptyRecord = {
        vorname: '',
        nachname: '',
        strasse: '',
        hausnummer: '',
        wohnort: '',
        firma: '',
        objektnummer: '',
        plz : '',
        einladungsgrund: '',

        anzahlBesucher: 1,
        anzahlBetreuer: 0,
        kostenstelle: null,
        kostenstelle_id : null,
        sitzkategorie: null,
        sitzkategorie_id : null,
        position: null,
        position_id : null,
        veranstaltung_id : props.event.id,
        aussendienstmitarbeiter_id : userService.userValue.id
    }

    // Formik integration
    const formik = useFormik({
        initialValues : emptyRecord,
        validationSchema,
        onSubmit: async (values) => {
            // was ist mit Valiierungsfehlern auf der letzen Seite?
            fetch('/api/reservations/create',{
                method: 'POST',
                body: JSON.stringify(values)
            })
            .then(async response=>{
                const jsonResponse = await response.json()
                // go to the success page
                handleNext()
            })
            .catch(error => {
                alert(JSON.stringify(error))
            })
        }
    })

    const makeReservation = async () =>{
        const f = formik
        const validationResults = await f.validateForm()
        if(Object.keys(validationResults).length == 0){
            await f.submitForm()
        }else{
            //console.log(f.values)
            console.error(validationResults)
        }
    }

    return (
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <form id="reservation-form"  onSubmit={formik.handleSubmit}>
                    <Typography component="h1" variant="h4" align="center">
                        Reservierung
                    </Typography>
                    <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <React.Fragment>
                        {activeStep === steps.length ? (
                            <React.Fragment>
                                <Typography variant="h5" gutterBottom>
                                    Vielen Dank für die Reservierung.
                                </Typography>
                                <Typography variant="subtitle1">
                                    Es erfolgt eine Information per e-mail ob die beantragte Kartenanzahl und Kartenart genehmigt wurde!
                                </Typography>

                                <Button
                                    variant="contained"
                                    sx={{ mt: 3, ml: 1 }}
                                    href="/">
                                    Weitere Reservierung
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 3, ml: 1 }}
                                    href="/reservations">
                                    Meine Reservierungen
                                </Button>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {getStepContent(activeStep, props, formik)}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    {activeStep !== 0 && (
                                        <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                                            Zurück
                                        </Button>
                                    )}
                                    {
                                        // if we are at the last stage, we need to make the button a submit button
                                        // otherwise it is a simple navigation button
                                        activeStep === steps.length-1 ? (
                                            <Button
                                                onClick={makeReservation}
                                                variant="contained"
                                                sx={{ mt: 3, ml: 1 }}
                                            >
                                                Reservieren
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                onClick={handleNext}
                                                sx={{ mt: 3, ml: 1 }}
                                            >
                                                Weiter
                                            </Button>
                                        )
                                    }

                                </Box>
                            </React.Fragment>
                        )}
                    </React.Fragment>
                </form>
            </Paper>
            <Copyright />
        </Container>
    );
}
