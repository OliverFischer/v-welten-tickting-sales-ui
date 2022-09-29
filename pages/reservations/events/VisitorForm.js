
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import * as React from 'react';
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import TextareaAutosize from '@mui/material/TextareaAutosize';

const VisitorForm = ({positionen, formik}) =>{
    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="firma"
                        name="firma"
                        label="Firma"
                        fullWidth
                        variant="standard"
                        value={formik.values.firma}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.firma && Boolean(formik.errors.firma)}
                        helperText={formik.touched.firma && formik.errors.firma}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl sx={{ m: 1, minWidth: '100%' }}>
                        <Autocomplete
                            disablePortal
                            id="position-select-autocomplete"
                            options={positionen}
                            disableClearable
                            onChange={(e, {value, label}) => {
                                formik.setFieldValue("position_id", value !== null ? value : formik.values.position_id)
                                formik.setFieldValue("position", value !== null ? label : formik.values.position)
                            }}
                            isOptionEqualToValue={(option, value ) => {
                                if(value.value === null)
                                    return false
                                return option.value === value.value
                            }}
                            getOptionLabel={option => option.label || ''}
                            autoHighlight
                            defaultValue={() => {
                                if(formik.values.position_id != null){
                                    return {value:formik.values.position_id, label: formik.values.position }
                                }else{
                                    return null
                                }
                            }}
                            renderInput={(params) =>
                                <TextField {...params}
                                           label="Position"
                                           name="position"
                                 />
                            }
                        />
                    </FormControl>
                </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        id="vorname"
                        name="vorname"
                        label="Vorname"
                        fullWidth
                        variant="standard"
                        value={formik.values.vorname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.vorname && Boolean(formik.errors.vorname)}
                        helperText={formik.touched.vorname && formik.errors.vorname}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="nachname"
                        name="nachname"
                        label="Nachname"
                        fullWidth
                        variant="standard"
                        value={formik.values.nachname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.nachname && Boolean(formik.errors.nachname)}
                        helperText={formik.touched.nachname && formik.errors.nachname}
                    />
                </Grid>
                <Grid item xs={12} sm={9}>
                    <TextField
                        required
                        id="strasse"
                        name="strasse"
                        label="Strasse"
                        fullWidth
                        variant="standard"
                        value={formik.values.strasse}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.strasse && Boolean(formik.errors.strasse)}
                        helperText={formik.touched.strasse && formik.errors.strasse}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        required
                        id="hausnummer"
                        name="hausnummer"
                        label="Haus Nr."
                        fullWidth
                        variant="standard"
                        value={formik.values.hausnummer}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.hausnummer && Boolean(formik.errors.hausnummer)}
                        helperText={formik.touched.hausnummer && formik.errors.hausnummer}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        required
                        id="plz"
                        name="plz"
                        label="PLZ"
                        fullWidth
                        variant="standard"
                        value={formik.values.plz}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.plz && Boolean(formik.errors.plz)}
                        helperText={formik.touched.plz && formik.errors.plz}
                    />
                </Grid>
                <Grid item xs={12} sm={9}>
                    <TextField
                        required
                        id="wohnort"
                        name="wohnort"
                        label="Wohnort"
                        fullWidth
                        variant="standard"
                        value={formik.values.wohnort}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.wohnort && Boolean(formik.errors.wohnort)}
                        helperText={formik.touched.wohnort && formik.errors.wohnort}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        rows={4}
                        multiline
                        placeholder="Einladungsgrund"
                        id="einladungsgrund"
                        name="einladungsgrund"
                        label="Einladungsgrund"
                        fullWidth
                        value={formik.values.einladungsgrund}
                        onChange={formik.handleChange}
                        />
                </Grid>
                
            </Grid>
        </React.Fragment>
    )
}

export default VisitorForm