const clone = input => JSON.parse(JSON.stringify(input))
const apply = (src,data,op='noop') => {

    let result = clone(src),
    set = data ? Object.keys(data) : {}

    switch(op){
        case 'delete' : {
            set.forEach(key => {
                delete result[key]
            })
            break
        }
        case 'merge' : {
            set.forEach(key => {
                result[key] = set[key]
            })
            break
        }
        default:{ // no op

        }
    }

    return result
    
}

export const OP_DEL = 'delete'
export const OP_MERGE = 'merge'

export const fixture = (data, op) => {

    let fixture = {
        vorname: "Olli",
        nachname: "Fischer",
        strasse: "Handweg",
        hausnummer: "47",
        wohnort: "Hamburg",
        firma: "V-Welten",
        objektnummer: "47110815",
        plz: "21077",
        anzahlBesucher: 3,
        anzahlBetreuer: 4,
        kostenstelle: "129510702",
        kostenstelle_id: 124,
        sitzkategorie: "Tribüne  (Ticket: 50€ p.P)",
        sitzkategorie_id: 3,
        position: "Geschäftsführer/in",
        position_id: 1,
        veranstaltung_id : 391,
        aussendienstmitarbeiter_id: 1
    }

    return apply(fixture, data, op)    
    
}

