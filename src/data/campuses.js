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
};

// Welk campus per specialiteit
export const specialtyCampus = {
  spec_cardiology:    'middelheim',
  spec_orthopedics:   'stuivenberg',
  spec_pediatrics:    'sint_erasmus',
  spec_ophthalmology: 'middelheim',
};

export function getCampusForSpecialty(specialty) {
  const id = specialtyCampus[specialty];
  return id ? campuses[id] : null;
}
