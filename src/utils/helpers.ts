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

export const extractDistrict = (location: string): string | null => {
  // Split the string by commas
  const parts = location?.split(',').map((part) => part?.trim());
  if (parts?.length >= 3) {
    return parts[2]; // retruns the third word(s) after  second comma
  }
  return null; // Return null if the location format is unexpected
};

export const roundToTwoDecimals = (number: number) => {
  return Math.round(number * 100) / 100;
};

// Define the type for the input data
export interface DataItem {
  initiator: string;
  start: string; // ISO date string
  end: string; // ISO date string
  parameters: {
    initiator: string;
    location: string;
    priority: string;
    parent_id: number;
    flows: Array<{
      id: number;
      name: string;
      priority: number;
      message: string;
      path: string;
      parent_id: number | null;
      validator: any; // or define specific type if known
      terminator: any; // or define specific type if known
      allow_custom_feedback: boolean;
      descendants?: Array<any>; // or define specific type if known
    }>;
    root: string;
    location_name: string;
    [key: string]: any; // Allow additional properties
  };
  location: string;
  request_count: number;
  is_active: boolean;
}

// Define the type for the output data
interface ChartData {
  date: string; // YYYY-MM-DD
  count: number;
}
export const eRoseColor = '#A85766';

const monthAbbreviations: Record<number, string> = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
};

// The modified prepareData function
export const prepareData = (data: DataItem[]): ChartData[] => {
  const dateMap: Record<string, number> = {};

  data.forEach((item) => {
    const date = new Date(item.end).toISOString().split('T')[0]; // Extracting date (YYYY-MM-DD)
    if (!dateMap[date]) {
      dateMap[date] = 0; // Initialize if date not exists
    }
    dateMap[date] += 1; // Increment count for that day
  });

  // Convert to an array, format date, and sort by date
  return Object.entries(dateMap)
    .map(([date, count]) => {
      const dateObj = new Date(date);
      const formattedDate = `${monthAbbreviations[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
      return { date: formattedDate, count };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

interface GroupedData {
  date: string; // Date formatted as "Mon Day, Year"
  root: string; // Category used for grouping
  count: number; // Count of items in that category for that date
}
export interface DataItem {
  end: string; // Assuming 'end' is a string representing a date
  root: string; // Example property to group by
}

export const groupRootData = (data: DataItem[]): GroupedData[] => {
  const dateMap: Record<string, Record<string, number>> = {};

  data.forEach((item) => {
    const date = new Date(item.end).toISOString().split('T')[0]; // Extracting date (YYYY-MM-DD)
    const root = item.root; // Assume root is available

    if (!dateMap[date]) {
      dateMap[date] = {};
    }

    if (!dateMap[date][root]) {
      dateMap[date][root] = 0; // Initialize if root does not exist
    }

    dateMap[date][root] += 1; // Increment count for that root on that day
  });

  // Convert to an array
  return Object.entries(dateMap).flatMap(([date, root]) =>
    Object.entries(root).map(([root, count]) => ({
      date,
      root,
      count,
    })),
  );
};
