import React, {useState, useEffect, useMemo} from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from "@mui/material/Autocomplete";


const TicketForm = ({kostenstellen, sitzkategorien, kartenkosten, formik, plaetze}) =>{

    const kartenKosten = useMemo(
        () => {
            if(formik.values.sitzkategorie_id == null){
                return `Bitte wählen Sie eine Sitzkategorie.`
            }else{
                const kartenkontingent = plaetze.filter(platz => platz?.kartenkontingent?.sitzkategorie?.id === formik.values.sitzkategorie_id)[0].kartenkontingent // das sollte funktionieren
                const personen = parseInt(formik.values.anzahlBesucher) + parseInt(formik.values.anzahlBetreuer)
                //console.log(personen)
                const cateringKosten = kartenkontingent?.kosten_catering * personen
                const kartenkosten = kartenkontingent?.kosten_karte * personen
                return `
            Die Gesamtkosten für die Reservierung betragen ${cateringKosten + kartenkosten} Euro, hiervon
            entfallen ${cateringKosten} Euro auf das Catering und ${kartenkosten} Euro auf die Tickets.
        `
            }
        },[formik.values.anzahlBesucher,formik.values.anzahlBetreuer,formik.values.sitzkategorie_id]

    )

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FormControl sx={{ m: 1, minWidth: '100%' }}>
                        <Autocomplete
                            disablePortal
                            id="kostenstelle-select-autocomplete"
                            options={kostenstellen}
                            disableClearable
                            onChange={(e, {value, label}) => {
                                formik.setFieldValue("kostenstelle_id", value !== null ? value : formik.values.kostenstelle_id)
                                formik.setFieldValue("kostenstelle", value !== null ? label : formik.values.kostenstelle)
                            }}
                            isOptionEqualToValue={(option, value) => {
                                if(value.value === null)
                                    return false
                                return option.value === value.value
                            }}
                            getOptionLabel={option => option.label || ''}
                            autoHighlight
                            defaultValue={() => {
                                if(formik.values.position_id != null){
                                    return {value:formik.values.kostenstelle_id, label: formik.values.kostenstelle }
                                }else{
                                    return null
                                }
                            }}
                            renderInput={(params) => (
                                <TextField {...params}
                                    label="Kostenstelle"
                                    name="kostenstelle"
                                />
                            )}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl sx={{ m: 1, minWidth: '100%' }}>
                        <Autocomplete
                            disablePortal
                            id="kostenstelle-select-sitzkeatgorien"
                            options={sitzkategorien}
                            clearOnBlur={true}
                            disableClearable
                            onChange={(e, {value, label}) => {
                                formik.setFieldValue("sitzkategorie_id", value !== null ? value : formik.values.sitzkategorie_id)
                                formik.setFieldValue("sitzkategorie", value !== null ? label : formik.values.sitzkategorie)
                            }}
                            isOptionEqualToValue={(option, value) => {
                                if(value.value === null)
                                    return false
                                return option.value === value.value
                            }}
                            getOptionLabel={option => option.label || ''}
                            autoHighlight
                            defaultValue={() => {
                                if(formik.values.position_id != null){
                                    return {value:formik.values.sitzkategorie_id, label: formik.values.sitzkategorie }
                                }else{
                                    return null
                                }
                            }}
                            renderInput={(params) => (
                                <TextField {...params}
                                    label="Plätze"
                                    name="sitzkategorie"
                                />
                            )}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="anzahlBesucher"
                        name="anzahlBesucher"
                        label="Anzahl Besucherkarten"
                        fullWidth
                        variant="standard"
                        type="number"
                        value={formik.values.anzahlBesucher}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.anzahlBesucher && Boolean(formik.errors.anzahlBesucher)}
                        helperText={formik.touched.anzahlBesucher && formik.errors.anzahlBesucher}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="anzahlBetreuer"
                        name="anzahlBetreuer"
                        label="Anzahl Betreuerkarten"
                        fullWidth
                        variant="standard"
                        type="number"
                        value={formik.values.anzahlBetreuer}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.anzahlBetreuer && Boolean(formik.errors.anzahlBetreuer)}
                        helperText={formik.touched.anzahlBetreuer && formik.errors.anzahlBetreuer}
                    />
                </Grid>
                <Grid item xs={12}>
                    <p>
                        {kartenKosten}
                    </p>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default TicketForm