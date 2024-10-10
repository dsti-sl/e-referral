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
      accendants?: Array<any>;
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

export const aggregateRequestCounts = (data: DataItem[]) => {
  const flowTypeCountMap: Record<
    string,
    { flowName: string; root: string; total_requests: number }
  > = {};

  // Ensure data is not null or undefined
  if (!Array.isArray(data)) {
    return [];
  }

  // Loop through each data item
  data.forEach((item) => {
    const { parameters, request_count } = item;

    // Ensure parameters and flows are valid before processing
    if (parameters?.flows && Array.isArray(parameters.flows)) {
      parameters.flows.forEach((flow) => {
        // Generate unique key using flow name and root
        const key = `${parameters.root || 'Unknown Root'}`;

        // Initialize entry in map if it doesn't exist
        if (!flowTypeCountMap[key]) {
          flowTypeCountMap[key] = {
            flowName: flow.name,
            root: parameters.root || 'Unknown Root', // Provide default for root
            total_requests: 0,
          };
        }

        // Increment count
        flowTypeCountMap[key].total_requests += request_count || 0; // Safely handle undefined request_count
      });
    }
  });

  // Convert object to array for Recharts
  return Object.values(flowTypeCountMap);
};

export const data: Record<Service, Record<Period, number[]>> = {
  'Medical Services': {
    Daily: [10, 12, 40, 20, 15, 25, 30],
    'Last 24 Hours': [50, 60, 55, 70, 80],
    Monthly: [200, 90, 40, 100, 80, 80, 210, 240, 20],
  },
  'Psychosocial support': {
    Daily: [5, 12, 40, 15, 10, 20, 25],
    'Last 24 Hours': [30, 40, 35, 50, 60],
    Monthly: [100, 90, 40, 110, 80, 120, 110, 130, 150],
  },
  'Police Services': {
    Daily: [8, 12, 40, 12, 9, 14, 18],
    'Last 24 Hours': [40, 45, 42, 48, 55],
    Monthly: [150, 90, 40, 110, 80, 160, 155, 170, 180],
  },
  Hotline: {
    Daily: [6, 12, 40, 11, 8, 13, 17],
    'Last 24 Hours': [35, 38, 36, 43, 50],
    Monthly: [120, 90, 40, 110, 80, 130, 125, 140, 150],
  },
  'Case Management': {
    Daily: [7, 12, 40, 10, 12, 15, 22],
    'Last 24 Hours': [38, 42, 40, 46, 52],
    Monthly: [130, 90, 40, 110, 80, 140, 135, 150, 160],
  },
  'Protection/Shelter': {
    Daily: [9, 12, 40, 13, 11, 16, 20],
    'Last 24 Hours': [42, 48, 44, 51, 58],
    Monthly: [160, 90, 40, 110, 80, 170, 165, 180, 190],
  },
  'Further Support Protection/Shelter': {
    Daily: [10, 12, 40, 15, 12, 18, 24],
    'Last 24 Hours': [45, 50, 48, 55, 65],
    Monthly: [170, 90, 40, 110, 80, 180, 175, 190, 200],
  },
  'Education/Training Services': {
    Daily: [4, 12, 40, 9, 7, 11, 15],
    'Last 24 Hours': [30, 35, 32, 40, 45],
    Monthly: [110, 90, 40, 110, 80, 120, 115, 130, 140],
  },
  'Legal Aid': {
    Daily: [6, 12, 40, 8, 10, 12, 16],
    'Last 24 Hours': [32, 38, 35, 42, 48],
    Monthly: [120, 90, 40, 110, 80, 130, 125, 140, 150],
  },
  'Further Support Medical Services': {
    Daily: [8, 12, 40, 12, 11, 15, 19],
    'Last 24 Hours': [38, 44, 42, 49, 55],
    Monthly: [140, 90, 40, 110, 80, 150, 145, 160, 170],
  },
  'Further Support Psychosocial support': {
    Daily: [9, 12, 40, 14, 12, 18, 22],
    'Last 24 Hours': [42, 48, 45, 52, 60],
    Monthly: [160, 90, 40, 110, 80, 170, 165, 180, 190],
  },
  'Long Term Support Psychosocial support': {
    Daily: [7, 12, 40, 11, 9, 14, 18],
    'Last 24 Hours': [36, 40, 38, 45, 52],
    Monthly: [130, 90, 40, 110, 80, 140, 135, 150, 160],
  },
  'Livelihood services': {
    Daily: [6, 12, 40, 10, 8, 13, 17],
    'Last 24 Hours': [34, 39, 36, 43, 50, 90, 67, 68, 30, 70, 95],
    Monthly: [125, 90, 40, 110, 80, 135, 130, 145, 155],
  },
};

export const generatePieData = (data: any[]) => {
  const districtData: Record<string, number> = {};

  data.forEach((session) => {
    const district = extractDistrict(session.parameters.location_name);
    if (district) {
      if (!districtData[district]) {
        districtData[district] = 0;
      }
      districtData[district] += session.request_count;
    }
  });

  const labels = Object.keys(districtData);
  const dataValues = Object.values(districtData);

  return {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: generateColors(labels.length),
        hoverBackgroundColor: generateColors(labels.length),
      },
    ],
  };
};
export const generateChartData = (period: Period, service: Service) => {
  const dataArray = data[service][period];

  return {
    labels:
      period === 'Daily'
        ? [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ]
        : period === 'Last 24 Hours'
          ? [
              '1:00 AM',
              '2:00 AM',
              '3:00 AM',
              '4:00 AM',
              '5:00 AM',
              '6:00 AM',
              '7:00 AM',
              '8:00 AM',
              '9:00 AM',
              '10:00 AM',
              '11:00 AM',
              '12:00 PM',
              '1:00 PM',
              '2:00 PM',
              '3:00 PM',
              '4:00 PM',
              '5:00 PM',
              '6:00 PM',
              '7:00 PM',
              '8:00 PM',
              '9:00 PM',
              '10:00 PM',
              '11:00 PM',
              '12:00 AM',
            ]
          : [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ],
    datasets: [
      {
        label: `${period} Data for ${service}`,
        data: dataArray,
        backgroundColor: '#A85766',
        borderWidth: 1,
      },
    ],
  };
};

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
