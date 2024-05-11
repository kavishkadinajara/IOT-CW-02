'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '@/components/NavBar';

export default function Home() {
  const [bulbOn1, setBulbOn1] = useState(false);
  const [bulbOn2, setBulbOn2] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('/api/getBulbStatus', { method: 'GET' })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        console.log("Fetched data:", data);
        data.forEach((bulbData: { bulb_id: number; bulb_status: any; }) => {
          console.log("Bulb data:", bulbData);
          if (bulbData.bulb_id === 1) {
            console.log("Setting bulbOn1:", bulbData.bulb_status);
            setBulbOn1(Boolean(bulbData.bulb_status));
          } else if (bulbData.bulb_id === 2) {
            console.log("Setting bulbOn2:", bulbData.bulb_status);
            setBulbOn2(Boolean(bulbData.bulb_status));
          }
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  const toggleBulb = async (bulbId: number, currentStatus: boolean, setterFunction: { (value: React.SetStateAction<boolean>): void; (value: React.SetStateAction<boolean>): void; (arg0: { (prevState: any): boolean; (prevState: any): boolean; }): void; }) => {
    setterFunction((prevState: any) => !prevState); // Toggle the local state immediately
    try {
      // Make an API call to update the bulb status in the database
      await axios.post('/api/updateBulbStatus', {
        status: currentStatus ? '0' : '1',
        bulb: `Bulb ${bulbId}`
      });
    } catch (error) {
      // If there's an error, revert the state change
      setterFunction(prevState => !prevState);
      console.error('Error updating bulb status:', error);
    }
  }

  return (
    <div className="min-h-screen container">
      <main className="relative">
        <div className='absolute top-0 w-64 h-full rotate-45 lg:rotate-45 opacity-65 lg:opacity-45 blur-3xl rounded-full left-0 -translate-x-1/2  lg:left-auto lg:right-0 lg:transform-none bg-gradient-to-br from-purple-950 to-pink-800 z-0'></div>
        <NavBar/>
        <div className="p-12 z-10">
          {/* led 01 */}
          <div className="mt-20" key={'bulb1'}>
            <h2 className="flex justify-center text-green-500 text-2xl">LED 01</h2>
            <div className="flex justify-center mt-10 mx-1">
              <button className={`px-10 py-4 border-2 border-double rounded-full font-semibold ${bulbOn1 ? 'bg-gradient-to-br from-green-700 to-green-900 text-yellow-600' : 'bg-gradient-to-br from-red-700 to-pink-900 text-yellow-600'}`} onClick={() => toggleBulb(1, bulbOn1, setBulbOn1)}>
                {bulbOn1 ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* led 02 */}
          <div className="mt-20" key={'bulb2'}>
            <h2 className="flex justify-center text-green-500 text-2xl">LED 02</h2>
            <div className="flex justify-center mt-10">
              <button className={`px-10 py-4 border-2 border-double rounded-full font-semibold ${bulbOn2 ? 'bg-gradient-to-br from-green-700 to-green-900 text-yellow-600' : 'bg-gradient-to-br from-red-700 to-pink-900 text-yellow-600'}`} onClick={() => toggleBulb(2, bulbOn2, setBulbOn2)}>
                {bulbOn2 ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
