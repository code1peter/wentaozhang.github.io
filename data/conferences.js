/* ============================================================
   CONFERENCE DATA  —  THIS IS THE ONLY FILE YOU EDIT
   ============================================================

   TO ADD A CONFERENCE: copy a block below and edit it.

   ORDER: sorted newest year first. Within the same year, entries
   appear in the order they are listed here — so to reorder two
   conferences from the same year, just move the blocks.

   FIELDS
     name        Conference name as you'd write it on a CV
     city        City it was held in
     region      State abbreviation in the US ("CO"), country
                 elsewhere ("Germany"). Shown as "City, Region".
     country     Used only to count countries in the summary line.
     lat, lng    Decimal degrees. Google "<city> latitude longitude"
                 or use https://www.latlong.net
                 West longitude is NEGATIVE, south latitude is NEGATIVE.
     date        Display string, any format you like
     year        Number, used for sorting
     role        "Invited talk", "Talk", "Poster", "Attendee", ...
     title       Optional — the title of your talk/poster
     venue       Optional — host institution, shown in the tooltip
     placeholder true = unverified, shows a warning banner on the page
   ============================================================ */

window.HOME_BASE = {
  name: "Duke University",
  city: "Durham",
  region: "NC",
  country: "USA",
  lat: 35.9940,
  lng: -78.8986
};

window.CONFERENCES = [
  {
    name: "FHI-aims Developers' and Users' Meeting 2026",
    city: "Hamburg",
    region: "Germany",
    country: "Germany",
    lat: 53.5773,
    lng: 9.8794,
    date: "June 10–12, 2026",
    year: 2026,
    role: "Invited talk",
    title: "",          // add your talk title here
    venue: "Max Planck Institute for the Structure and Dynamics of Matter (MPSD)",
    placeholder: false
  },
  {
    name: "Electronic Structure Workshop (ESW26)",
    city: "Madison",
    region: "WI",
    country: "USA",
    lat: 43.0731,
    lng: -89.4012,
    date: "2026",       // CONFIRM the month
    year: 2026,
    role: "Poster",
    title: "",
    venue: "",
    placeholder: false
  },
  {
    name: "APS March Meeting",
    city: "Denver",
    region: "CO",
    country: "USA",
    lat: 39.7392,
    lng: -104.9903,
    date: "March 2026",  // CONFIRM the year
    year: 2026,
    role: "Talk",
    title: "",
    venue: "",
    placeholder: false
  }
];
