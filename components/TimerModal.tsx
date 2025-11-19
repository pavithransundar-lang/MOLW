
import React, { useState, useEffect } from 'react';

interface TimerModalProps {
  durationInMinutes: number;
  onClose: () => void;
}

export const TimerModal: React.FC<TimerModalProps> = ({ durationInMinutes, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onClose();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onClose]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-800">Time in Progress</h2>
        <p className="text-gray-600 mt-2">Enjoy your laptop time! Your wallet has been updated.</p>
        <div className="my-8">
          <div className="text-7xl font-mono font-bold text-indigo-600">
            <span>{String(minutes).padStart(2, '0')}</span>:<span>{String(seconds).padStart(2, '0')}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
        >
          Finish Early
        </button>
      </div>
    </div>
  );
};
