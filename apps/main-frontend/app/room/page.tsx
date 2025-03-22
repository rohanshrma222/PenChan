'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HTTP_BACKEND } from '@/config';
import { House } from 'lucide-react';

export default function RoomPage() {
    const [roomName, setRoomName] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const createRoom = async () => {
        setError('');
        const token = localStorage.getItem('token'); // Token is available as user is logged in

        try {
            const response = await fetch(`${HTTP_BACKEND}/room`, {
                method: 'POST',
                //@ts-ignore
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({ name: roomName }),
            });

            // Ensure response is valid JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid server response');
            }

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create room');
            }

            router.push(`/canvas/${data.roomId}`); // Redirect to the Canvas page
        } catch (error) {
            //@ts-ignore
            setError(error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-r from-yellow-100 to-orange-500">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-96">
                <h1 className="text-2xl flex justify-center font-black pb-4">Create a Room</h1>
               <label className="block text-gray-700 font-black">Room Name</label>
               <div className="flex items-center border border-black rounded-md px-3 py-2">  
                    <House className="text-gray-500 mr-2" size={20} />
                    <input
                        type="text"
                        name="name"
                        className="w-full outline-none bg-transparent"
                        placeholder="piggies"
                        required
                    />
              </div>
                <button
                    onClick={createRoom}
                    className="w-full mt-2 py-2 bg-[#EB5B00] text-white rounded-md hover:bg-[#FFB200]"
                >
                    Create Room
                </button>
                {error && <p className="mt-2 text-red-500">{error}</p>}
            </div> 
        </div>
    );
}
