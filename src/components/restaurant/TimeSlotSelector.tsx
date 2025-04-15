
import React from 'react';
import { Users } from 'lucide-react';

interface TimeSlotSelectorProps {
  availableTimes: string[];
  partySize?: number;
  date?: string;
  onSelectTime?: (time: string) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  availableTimes,
  partySize,
  date,
  onSelectTime
}) => {
  if (availableTimes.length === 0 || !partySize || !date) {
    return null;
  }

  return (
    <div className="mt-3 bg-gray-50 p-3 rounded-lg">
      <div className="flex items-center text-sm text-gray-700 mb-2">
        <Users className="h-4 w-4 mr-2 text-burgundy-800" />
        <span className="font-medium">Table for {partySize} on {date}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {availableTimes.map(time => (
          <button
            key={time}
            className="time-slot-button time-slot-button-available"
            onClick={() => onSelectTime && onSelectTime(time)}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
