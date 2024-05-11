import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { status, bulb } = await request.json();
    const bulbStatus = status === '1' ? 1 : 0;

    console.log("Updating bulb status in the database...");
    console.log("Bulb Name:", bulb);
    console.log("New Status:", bulbStatus);

    const response = await query({
      query: "UPDATE bulb SET bulb_status = ? WHERE bulb_name = ?",
      values: [bulbStatus, bulb] // Use the passed bulb name
    });

    console.log("Database response:", response);

    const result = {
      affectedRows: response.affectedRows
    };

    return NextResponse.json({ message: 'success', ...result });
  } catch (e) {
    console.error('Error updating bulb status:', e);
    return NextResponse.json({ message: 'error' });
  }
}
