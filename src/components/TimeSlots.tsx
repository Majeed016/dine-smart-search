
import React from 'react';
import { Restaurant } from '@/data/mockData';

interface TimeSlotsProps {
  restaurant: Restaurant;
  date: string;
  availableTimes: string[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({
  restaurant,
  date,
  availableTimes,
  selectedTime,
  onSelectTime,
}) => {
  if (!availableTimes.length) {
    return (
      <p className="text-gray-500 italic">
        No available times for the selected date. Please try another date.
      </p>
    );
  }

  return (
    <div>
      <h3 className="font-medium mb-3">Available times:</h3>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {availableTimes.map((time) => (
          <button
            key={time}
            className={`time-slot-button ${
              selectedTime === time
                ? 'time-slot-button-selected'
                : 'time-slot-button-available'
            }`}
            onClick={() => onSelectTime(time)}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlots;
