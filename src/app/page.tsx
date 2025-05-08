'use client';
import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';

import Card from '@/components/Card';
import RequestCountChart from '@/components/dashboard/RequestCountChart';
import TimeSeriesChart from '@/components/dashboard/TimeSeries';
import { roundToTwoDecimals, generatePieData } from '@/utils/helpers';

// Dynamically import LocationMap to fix SSR window error
const LocationMap = dynamic(() => import('@/components/ui/LocationMap'), {
  ssr: false,
});

export default function Home() {
  const BaseUrl = process.env.BASE_URL;
  const [stats, setStats] = useState<any>({});
  const [sessions, setSessions] = useState<any>([]);

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
    } catch (error: any) {
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
    } catch (error: any) {
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
  const activeSession = [
    { name: 'Active Sessions', average: stats?.active_sessions },
  ];

  return (
    <div className="flex h-screen flex-col items-center p-6 text-black">
      <div className="mb-4 text-center text-3xl font-bold">
        Welcome to e-Refferal Pathways
      </div>
      <h5 className="mb-8 text-center text-lg">
        e-Refferal Pathways Client Dashboard for creating and managing flows and
        data visualizations.
      </h5>

      <div className="flex w-full max-w-screen-xl flex-wrap">
        {/* Main Cards Section */}
        <div className="flex w-full flex-wrap">
          <div className="w-full p-1 sm:w-1/2 lg:w-1/3">
            <Card topDisplay data={closedSessionData} />
          </div>
          <div className="w-full p-1 sm:w-1/2 lg:w-1/3">
            <Card topDisplay data={activeSession} />
          </div>
          <div className="w-full p-1 sm:w-1/2 lg:w-1/3">
            <Card topDisplay data={expireSession} />
          </div>
        </div>

        {/* Additional Cards Section */}
        <div className="w-full px-2 py-4 sm:w-1/2 lg:w-4/12">
          <div className="mb-4 w-full">
            <Card topDisplay data={totalSessionData} />
          </div>
          <div className="mb-4 w-full">
            <Card topDisplay data={tolNumofRequest} />
          </div>
          <div className="w-full">
            <Card topDisplay data={dailySessionData} />
          </div>
        </div>

        {/* Bar Chart Card */}
        <div className="w-full py-4 sm:w-1/2 lg:w-8/12">
          <Card title="Requests by Location" pieData={pieData} />
        </div>
      </div>

      {/* Location Map Section */}
      <div className="w-full max-w-screen-xl">
        <LocationMap data={sessions || []} />
      </div>

      {/* Charts Section */}
      <div className="flex w-full max-w-screen-xl flex-wrap">
        <div className="p-1 sm:w-full md:w-1/2 lg:w-1/2">
          <TimeSeriesChart data={sessions || []} />
        </div>
        <div className="p-1 sm:w-full md:w-1/2 lg:w-1/2">
          <RequestCountChart data={sessions || []} />
        </div>
      </div>
    </div>
  );
}
