/**
 * Voorbereiding per specialiteit.
 * Niet elke specialiteit heeft instructies — alleen de specialiteiten
 * die specifieke voorbereiding van de patiënt vereisen.
 */
export const preparationInstructions = {
  spec_gastroenterology: {
    icon: '🍽️',
    titleKey: 'prep_gastro_title',
    alertKey: 'prep_gastro_alert',   // korte samenvatting voor op de portal
    items: ['prep_gastro_1', 'prep_gastro_2', 'prep_gastro_3'],
  },
  spec_cardiology: {
    icon: '💊',
    titleKey: 'prep_cardio_title',
    alertKey: 'prep_cardio_alert',
    items: ['prep_cardio_1', 'prep_cardio_2', 'prep_cardio_3'],
  },
  spec_neurology: {
    icon: '😴',
    titleKey: 'prep_neuro_title',
    alertKey: 'prep_neuro_alert',
    items: ['prep_neuro_1', 'prep_neuro_2', 'prep_neuro_3'],
  },
  spec_dermatology: {
    icon: '🧴',
    titleKey: 'prep_derm_title',
    alertKey: 'prep_derm_alert',
    items: ['prep_derm_1', 'prep_derm_2'],
  },
};

export function getPreparationForSpecialty(specialty) {
  return preparationInstructions[specialty] ?? null;
}
