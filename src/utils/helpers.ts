// Function to generate a random hex color, excluding white and black
export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color;
  do {
    color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  } while (color === '#FFFFFF' || color === '#000000'); // Exclude white and black
  return color;
};

// Function to generate an array of random colors based on the number of labels
export const generateColors = (count: number) => {
  return Array.from({ length: count }, () => getRandomColor());
};

// Update the Period type
export type Period = 'Daily' | 'Last 24 Hours' | 'Monthly';

export type Service =
  | 'Medical Services'
  | 'Psychosocial support'
  | 'Police Services'
  | 'Hotline'
  | 'Case Management'
  | 'Protection/Shelter'
  | 'Further Support Protection/Shelter'
  | 'Education/Training Services'
  | 'Legal Aid'
  | 'Further Support Medical Services'
  | 'Further Support Psychosocial support'
  | 'Long Term Support Psychosocial support'
  | 'Livelihood services';

export const isValidUrl = (url: string) => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // Protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // Domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // Port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // Query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  );
  return !!urlPattern.test(url);
};

export interface FormsField {
  id: string;
  label: string;
  type:
    | 'text'
    | 'textarea'
    | 'number'
    | 'email'
    | 'password'
    | 'date'
    | 'checkbox'
    | 'radio'
    | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string; labelDescription?: string }[];
}

export const formFields: FormsField[] = [
  {
    id: 'name',
    label: 'Name*',
    type: 'text',
    placeholder: 'Enter flow name',
    required: true,
  },
  {
    id: 'allow_custom_feedback',
    label: '',
    type: 'checkbox',
    options: [
      {
        label: 'Allow Custom Input ',
        labelDescription: '(Allowing users to enter custom input)',
        value: 'allow_custom_feedback',
      },
    ],
  },
  {
    id: 'message',
    label: 'Message*',
    type: 'text',
    placeholder: 'Enter flow message',
    required: true,
  },
  { id: 'priority', label: 'Priority*', type: 'number', required: true },
  {
    id: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter detailed description about the flow',
    required: false,
  },
  {
    id: 'terminate',
    label: '',
    type: 'checkbox',
    options: [{ label: 'Terminate', value: 'terminate' }],
  },
  {
    id: 'validate',
    label: '',
    type: 'checkbox',
    options: [{ label: 'Validate', value: 'validate' }],
  },
];
