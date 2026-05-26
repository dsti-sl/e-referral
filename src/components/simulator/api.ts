import type { MenuResponse } from './types';

const BASE_URL = process.env.BASE_URL;

export async function fetchMenu(path: string): Promise<MenuResponse> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) throw new Error(`USSD request failed: ${response.status}`);
  return response.json() as Promise<MenuResponse>;
}

export function buildUssdPath(
  flowId: string,
  phoneNumber: string,
  location: string,
  limit: number,
): string {
  return (
    `/api/channels/ussd` +
    `?limit=${limit}` +
    `&initiator=${encodeURIComponent(phoneNumber)}` +
    `&location=${encodeURIComponent(location)}` +
    `&priority=1` +
    `&flow_id=${flowId}`
  );
}
