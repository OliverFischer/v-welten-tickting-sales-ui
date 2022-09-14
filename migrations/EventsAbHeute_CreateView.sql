-- drop manually created view
drop view if exists EventsAbHeute;
-- create summary view for all events starting from today
create view EventsAbHeute as
select
    v.ID AS id,
    CAST(v.id AS CHAR) AS 'key',
    s.ID AS sponsoringaktivitaet_id,
    u.ID AS unternehmen_id,
    m.ID AS marke_id,
    v.name AS 'name',
    s.name AS sponsoringaktivitaet_name,
    u.name AS unternehmen_name,
    m.name AS marke_name,
    v.beschreibung AS beschreibung,
    DATE_FORMAT(v.veranstaltungsdatum, "%d.%m.%Y") AS veranstaltungsdatum,
    v.datum_steht_nicht_fest AS datum_steht_nicht_fest,
    s.VERANSTALTUNGSORT AS veranstaltungsort,
    s.BESCHREIBUNG AS sponsoringaktivitaet_beschreibung
from
    veranstaltung v,
    sponsoringaktivitaet s,
    unternehmen u,
    marke m
where
    v.SPONSORINGAKTIVITAET_ID = s.ID AND
    s.MARKE_ID = m.ID AND
    m.UNTERNEHMEN_ID = u.ID AND
    v.VERANSTALTUNGSDATUM >= CURDATE();
