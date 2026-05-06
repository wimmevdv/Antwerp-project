export const questionnaires = {
  spec_cardiology: [
    { id: 'chest_pain',       questionKey: 'q_cardio_chest_pain',       options: ['opt_yes', 'opt_no', 'opt_sometimes'] },
    { id: 'shortness_breath', questionKey: 'q_cardio_shortness_breath', options: ['opt_yes', 'opt_no', 'opt_sometimes'] },
    { id: 'palpitations',     questionKey: 'q_cardio_palpitations',     options: ['opt_yes', 'opt_no', 'opt_sometimes'] },
    { id: 'family_history',   questionKey: 'q_cardio_family_history',   options: ['opt_yes', 'opt_no', 'opt_unknown'] },
    { id: 'blood_pressure',   questionKey: 'q_cardio_blood_pressure',   options: ['opt_yes', 'opt_no', 'opt_unknown'] },
  ],
  spec_orthopedics: [
    { id: 'pain_location',    questionKey: 'q_ortho_pain_location',     options: ['opt_shoulder', 'opt_knee', 'opt_hip', 'opt_back', 'opt_other'] },
    { id: 'pain_duration',    questionKey: 'q_ortho_pain_duration',     options: ['opt_less_week', 'opt_one_month', 'opt_several_months', 'opt_more_year'] },
    { id: 'accident',         questionKey: 'q_ortho_accident',          options: ['opt_yes', 'opt_no'] },
    { id: 'daily_limit',      questionKey: 'q_ortho_daily_limit',       options: ['opt_yes', 'opt_no', 'opt_sometimes'] },
    { id: 'previous_surgery', questionKey: 'q_ortho_previous_surgery',  options: ['opt_yes', 'opt_no'] },
  ],
  spec_pediatrics: [
    { id: 'child_age',          questionKey: 'q_peds_child_age',          options: ['opt_age_0_2', 'opt_age_3_6', 'opt_age_7_12', 'opt_age_13_18'] },
    { id: 'fever',              questionKey: 'q_peds_fever',              options: ['opt_yes', 'opt_no'] },
    { id: 'symptoms_duration',  questionKey: 'q_peds_symptoms_duration',  options: ['opt_less_2days', 'opt_2_7days', 'opt_more_week'] },
    { id: 'allergies',          questionKey: 'q_peds_allergies',          options: ['opt_yes', 'opt_no', 'opt_unknown'] },
    { id: 'vaccinations',       questionKey: 'q_peds_vaccinations',       options: ['opt_complete', 'opt_partial', 'opt_no'] },
  ],
  spec_ophthalmology: [
    { id: 'blurry_vision',  questionKey: 'q_opht_blurry_vision',  options: ['opt_yes', 'opt_no', 'opt_sometimes'] },
    { id: 'spots_flashes',  questionKey: 'q_opht_spots_flashes',  options: ['opt_yes', 'opt_no', 'opt_sometimes'] },
    { id: 'glasses',        questionKey: 'q_opht_glasses',        options: ['opt_glasses', 'opt_lenses', 'opt_no'] },
    { id: 'dry_eyes',       questionKey: 'q_opht_dry_eyes',       options: ['opt_yes', 'opt_no', 'opt_sometimes'] },
    { id: 'family_eye',     questionKey: 'q_opht_family_eye',     options: ['opt_yes', 'opt_no', 'opt_unknown'] },
  ],
};
