import * as Yup from 'yup';
import {setLocale} from 'yup';

//==============================================================================
// Yup integration
setLocale({
    mixed: {
        default: "${path} ist nicht gültig",
        required: "${path} ist ein notwendiges Feld",
        oneOf: "${path} muss eine der folgenden Felder enthalten: ${values}",
        notOneOf: "${path} darf keinen der folgenden Werte enthalten: ${values}",
        notType: (params) => {
            const isCast = params.originalValue != null && params.originalValue !== params.value;
            let msg =
                `${params.path} muss ein(e) \`${params.type == 'number' ? 'Zahl' : params.type}\` sein. `
            if (params.value === null) {
                msg += `\n Wenn "null" als Wert erlaubt sein soll, dann markieren Sie das Schema mit \`.nullable()\``;
            }

            return msg;
        },
        defined: "${path} muss definiert werden"
    }
})

export const validationSchema = Yup.object({
    vorname: Yup
        .string()
        .required('Bitte den Vornamen des Besuchers eingeben'),
    nachname: Yup
        .string()
        .required('Bitte den Nachnamen des Besuchers eingeben'),
    strasse: Yup
        .string()
        .required('Bitte die Strasse des Besuchers eingeben'),
    hausnummer: Yup
        .string()
        .required('Hausnummer!'),
    wohnort: Yup
        .string()
        .min(2,"Wohnort muss länger als 2 Zeichen sein")
        .required('Bitte den Wohnort eingeben'),
    plz: Yup
        .string()
        .min(5,"PLZ muss 5-stellig sein")
        .required('Bitte die PLZ eingeben'),
    firma: Yup
        .string()
        .required('Bitte eine Firma angeben'),
    anzahlBesucher: Yup.number()
        .positive('Die Anzahl muss größer 0 sein')
        .min(0)
        .required('Bitte die Anzahl der Besucherkarten angeben'),
    anzahlBetreuer: Yup.number()
        .positive('Die Anzahl muss größer 0 sein')
        .min(0)
        .required('Bitte die Anzahl der Betreuerkarten angeben'),
    // position: Yup
    //     .string()
    //     .required('Bitte eine Position auswählen'),
    kostenstelle: Yup
        .string()
        .required('Bitte eine Kostenstelle wählen'),
    kostenstelle_id: Yup // backed id from the kostenstelle
        .number(),
    // objektnummer: Yup
    //     .string()
    //     .required('Bitte eine Objektnummer eingeben'),
    sitzkategorie_id: Yup
        .number(),
    sitzkategorie: Yup
        .string()
        .required('Bitte eine Sitzkategorie auswählen'),
})
// End Yup integration
//==============================================================================
