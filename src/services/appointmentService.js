import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE  = 'service_z3oiuww';
const EMAILJS_TEMPLATE = 'template_jewyixe';
const EMAILJS_KEY      = '1-6DRGxOV4Ph6kX5a';
const STORAGE_KEY      = 'bookedSlots';

export function getBookedSlots() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

export function saveAppointment({ formData, questionnaireAnswers, questionnaireNotes, needsQuestionnaire, campus }) {
  const slots = getBookedSlots();
  slots.push({
    doctorId:      formData.doctorId,
    date:          formData.date,
    time:          formData.time,
    email:         formData.email,
    campusId:      campus?.id ?? null,
    questionnaire: needsQuestionnaire ? questionnaireAnswers : null,
    notes:         questionnaireNotes?.trim() || null,
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
}

export function sendConfirmationEmail(formData, subject, message) {
  const params = {
    to_email: formData.email,
    subject,
    message,
  };
  return emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, params, EMAILJS_KEY);
}

export function isSlotBooked(doctorId, dateStr, timeSlot) {
  return getBookedSlots().some(
    b => b.doctorId === doctorId && b.date === dateStr && b.time === timeSlot
  );
}
