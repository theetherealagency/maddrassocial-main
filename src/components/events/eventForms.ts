/* Enquiry form definitions for the catering landing page.

   Every kind of catering asks the same questions, so they share one field list
   and simply pre-fill the Occasion field. */

export type FieldType =
  | 'text'
  | 'tel'
  | 'email'
  | 'date'
  | 'time'
  | 'number'
  | 'select'
  | 'textarea'
  | 'checkboxes';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  helper?: string;
  placeholder?: string;
  options?: string[];
  /** Also persist this answer to a dedicated leads column. */
  column?: 'dietary_preferences' | 'dish_suggestions';
}

export interface EventFormDef {
  id: string;
  /** Written to leads.form_type. */
  formType: string;
  formTitle: string;
  formIntro?: string;
  subject: string;
  /** Which field supplies the required leads.name value. */
  nameField: string;
  consentLabel: string;
  submitLabel: string;
  fields: FieldDef[];
  /** Pre-filled answers, e.g. Occasion on an event-type form. */
  initialValues?: Record<string, string>;
}

/* The occasions we cater. An event-type page pre-fills one of these, so every
   value here must match a buildCateringForm() argument exactly — a prefill that
   is not in this list renders the dropdown blank. */
export const OCCASIONS = [
  'Kitty Party',
  'Birthday Party',
  'Private Event',
  'Corporate Event',
  'Wedding / Event Catering',
  'Festival / Pooja',
  'Family Gathering',
  'Other',
];

/* Every question is required — a partial catering enquiry cannot be quoted. */
const CATERING_FIELDS: FieldDef[] = [
  {
    name: 'fullName',
    label: 'Full Name',
    type: 'text',
    required: true,
    placeholder: 'Enter your full name',
  },
  {
    name: 'phone',
    label: 'Number',
    type: 'tel',
    required: true,
    placeholder: 'Enter your mobile number',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'Enter your email address',
  },
  {
    name: 'occasion',
    label: 'Occasion',
    type: 'select',
    required: true,
    options: OCCASIONS,
  },
  { name: 'eventDate', label: 'Date', type: 'date', required: true },
  {
    name: 'guests',
    label: 'Guests',
    type: 'number',
    required: true,
    placeholder: 'E.g. 50 guests',
  },
  {
    name: 'budget',
    label: 'Budget',
    type: 'text',
    required: true,
    placeholder: 'Enter your Budget',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    required: true,
    placeholder: 'Tell us about the gathering you have in mind',
    column: 'dish_suggestions',
  },
];

const CONSENT = 'I agree to be contacted by Madras Mami regarding this enquiry.';

const buildCateringForm = (id: string, title: string, occasion: string): EventFormDef => ({
  id,
  formType: `catering_${id.replace(/-/g, '_')}`,
  formTitle: `${title} Enquiry`,
  formIntro: 'Fill in the details below and our catering team will get in touch.',
  subject: `${title} catering enquiry`,
  nameField: 'fullName',
  consentLabel: CONSENT,
  submitLabel: 'Send Enquiry',
  fields: CATERING_FIELDS,
  initialValues: { occasion },
});

export interface EventType {
  def: EventFormDef;
  title: string;
  blurb: string;
  highlights: string[];
}

/* The four kinds of catering Madras Mami does — all pure vegetarian, all at
   your venue. */
export const eventTypes: EventType[] = [
  {
    def: buildCateringForm('weddings', 'Weddings & Celebrations', 'Wedding / Event Catering'),
    title: 'Weddings & Celebrations',
    blurb: 'Sadhya on banana leaf, for the day everything begins.',
    highlights: [
      'We come and cook, from the morning tiffin to the last payasam',
      'Banana leaf service, or a buffet if the hall prefers it',
      'We have cooked for twenty and for five hundred',
    ],
  },
  {
    def: buildCateringForm('kitty-parties', 'Kitty Parties & Brunches', 'Kitty Party'),
    title: 'Kitty Parties & Brunches',
    blurb: 'Filter coffee, warm tiffins, and a morning nobody rushes.',
    highlights: [
      'Portioned for a small circle, not a banquet',
      'Snacks, a full brunch, or only the sweets',
      'Tell us your favourites and we will make them',
    ],
  },
  {
    def: buildCateringForm('corporate', 'Corporate Catering', 'Corporate Event'),
    title: 'Corporate Catering',
    blurb: 'Office lunches people actually look forward to.',
    highlights: [
      'Packed individually, or platters for the table',
      'We arrive when we said we would',
      'Ten people, or a full conference floor',
    ],
  },
  {
    def: buildCateringForm('festivals', 'Festivals & Poojas', 'Festival / Pooja'),
    title: 'Festivals & Poojas',
    blurb: 'Pongal, Diwali, a gruhapravesam — cooked the way the day asks.',
    highlights: [
      'Sattvic cooking for pooja days',
      'Festival menus that follow the calendar',
      'Early morning delivery and setup',
    ],
  },
];
