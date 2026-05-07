export const campuses = {
  middelheim: {
    id: 'middelheim',
    nameKey: 'campus_middelheim',
    address: 'Lindendreef 1, 2020 Antwerpen',
    icon: '🏥',
    mapsUrl: 'https://maps.google.com/?q=Lindendreef+1+Antwerpen',
    transport: 'Bus 17, 32 · Tram 7',
  },
  stuivenberg: {
    id: 'stuivenberg',
    nameKey: 'campus_stuivenberg',
    address: 'Lange Beeldekensstraat 267, 2060 Antwerpen',
    icon: '🏨',
    mapsUrl: 'https://maps.google.com/?q=Lange+Beeldekensstraat+267+Antwerpen',
    transport: 'Bus 21, 22 · Premetro P',
  },
  sint_erasmus: {
    id: 'sint_erasmus',
    nameKey: 'campus_sint_erasmus',
    address: 'Kroonstraat 20, 2000 Antwerpen',
    icon: '🏢',
    mapsUrl: 'https://maps.google.com/?q=Kroonstraat+20+Antwerpen',
    transport: 'Bus 23 · Tram 4, 8',
  },
  wilrijkse_plein: {
    id: 'wilrijkse_plein',
    nameKey: 'campus_wilrijkse_plein',
    address: 'Wilrijkse Plein 10, 2610 Wilrijk',
    icon: '🏩',
    mapsUrl: 'https://maps.google.com/?q=Wilrijkse+Plein+10+Wilrijk',
    transport: 'Bus 8, 32 · Tram 15',
  },
  ekeren: {
    id: 'ekeren',
    nameKey: 'campus_ekeren',
    address: 'Ekkergemstraat 93, 2180 Ekeren',
    icon: '🏦',
    mapsUrl: 'https://maps.google.com/?q=Ekkergemstraat+93+Ekeren',
    transport: 'Bus 60, 61',
  },
};

// Welk campus per specialiteit
export const specialtyCampus = {
  spec_cardiology:        'middelheim',
  spec_orthopedics:       'stuivenberg',
  spec_pediatrics:        'sint_erasmus',
  spec_ophthalmology:     'middelheim',
  spec_neurology:         'wilrijkse_plein',
  spec_dermatology:       'sint_erasmus',
  spec_gastroenterology:  'ekeren',
};

export function getCampusForSpecialty(specialty) {
  const id = specialtyCampus[specialty];
  return id ? campuses[id] : null;
}
