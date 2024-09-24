'use client';
import { useMemo, useState, useEffect, useCallback } from 'react';
import Card from '@/components/Card';
import {
  generateColors,
  Period,
  roundToTwoDecimals,
  extractDistrict,
  Service,
} from '@/utils/helpers';
import DropdownMenu from '@/components/dashboard/DropdownMenu';
import BarChart from '@/components/dashboard/BarChart';
import Swal from 'sweetalert2';
import LocationMap from '@/components/ui/LocationMap';
import InitiatorActivity from '@/components/dashboard/InitiatorActivity';

const data: Record<Service, Record<Period, number[]>> = {
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

const generatePieData = (data: any[]) => {
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

const generateChartData = (period: Period, service: Service) => {
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

export default function Home() {
  const BaseUrl = process.env.BASE_URL;
  const [stats, setStats] = useState({});
  const [sessions, setSessions] = useState([]);

  const pieData = useMemo(() => generatePieData(sessions), [sessions]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${BaseUrl}/channels/sessions/stats`);

      if (!response.ok) {
        Swal.fire({
          title: 'Error!',
          text: 'An unexpected error occurred.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.detail || 'An unexpected error occurred.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }, [BaseUrl]);

  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetch(`${BaseUrl}/channels/sessions/`);

      if (!response.ok) {
        Swal.fire({
          title: 'Error!',
          text: 'An unexpected error occurred.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
      const data = await response.json();
      setSessions(data); // Populate with real data
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.detail || 'An unexpected error occurred.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }, [BaseUrl]);

  useEffect(() => {
    fetchStats();
    fetchSessions();
  }, [fetchStats, fetchSessions]);

  const totalSessionData = [
    {
      name: 'Average Session Time',
      average: roundToTwoDecimals(stats?.average_duration_minutes) + ' mins',
    },
  ];
  const dailySessionData = [
    { name: 'Total Sessions', average: stats?.total_sessions },
  ];
  const closedSessionData = [
    { name: 'Closed Sessions', average: stats?.closed_sessions },
  ];
  const tolNumofRequest = [
    {
      name: 'Total number of Requests',
      average: stats?.total_number_of_requests,
    },
  ];

  const expireSession = [
    { name: 'Expired Sessions', average: stats?.expired_sessions },
  ];

  const [selectedPeriod, setSelectedPeriod] = useState<Period>('Daily');
  const [selectedService, setSelectedService] =
    useState<Service>('Medical Services');
  const [chartData, setChartData] = useState(() =>
    generateChartData('Daily', 'Medical Services'),
  );

  useEffect(() => {
    setChartData(generateChartData(selectedPeriod, selectedService));
  }, [selectedPeriod, selectedService]);

  const handlePeriodSelect = (period: Period) => {
    setSelectedPeriod(period);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  return (
    <div className="flex h-screen flex-col items-center p-4 text-black">
      <div className="mb-4 text-3xl font-bold">
        Welcome to e-Refferal Pathways
      </div>
      <h5 className="mb-8 text-center text-lg">
        e-Refferal Pathways Client Dashboard for creating and managing flows and
        data visualizations.
      </h5>
      <div className="flex w-full max-w-screen-lg flex-wrap">
        <div className="flex w-full flex-wrap">
          <div className="w-full p-1 sm:w-1/2 lg:w-1/3">
            {/* Adjust width as needed */}
            <Card topDisplay data={closedSessionData} />
          </div>
          <div className="w-full p-1 sm:w-1/2 lg:w-1/3">
            {/* Adjust width as needed */}
            <Card topDisplay data={tolNumofRequest} />
          </div>
          <div className="w-full p-1 sm:w-1/2 lg:w-1/3">
            {/* Adjust width as needed */}
            <Card topDisplay data={expireSession} />
          </div>
        </div>

        <div className="w-full flex-wrap px-4 sm:w-1/2 lg:w-4/12">
          {/* Card for Total Session */}
          <div className="mb-10 w-full sm:w-1/2 lg:w-full">
            <Card data={totalSessionData} />
          </div>

          {/* Card for Daily Session */}
          <div className="-mt-24 w-full pt-11 sm:w-1/2 lg:w-full">
            <Card data={dailySessionData} />
          </div>
        </div>

        {/* Card for Pie Chart */}
        <div className="w-full sm:w-1/2 lg:w-8/12">
          <Card title="Requests by Location" pieData={pieData} />
        </div>
      </div>

      <div className="relative w-full max-w-screen-lg">
        <LocationMap data={sessions || []} />
      </div>

      {/* <div className="relative mt-8 w-full max-w-screen-lg">
        <div className="absolute right-0 top-0 flex space-x-4">
          <label className="mt-4 text-ellipsis text-xl">Services:</label>
          <DropdownMenu
            onSelect={handleServiceSelect}
            selectedOption={selectedService}
            type="service"
          />
          <label className="mt-4 text-ellipsis text-xl">Periods:</label>
          <DropdownMenu
            onSelect={handlePeriodSelect}
            selectedOption={selectedPeriod}
            type="period"
          />
        </div>
        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-screen-lg">
            <BarChart data={chartData} />
          </div>
        </div>
      </div> */}
    </div>
  );
}
