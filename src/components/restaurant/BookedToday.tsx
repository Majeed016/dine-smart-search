
import React from 'react';
import { Clock } from 'lucide-react';

interface BookedTodayProps {
  count: number;
}

const BookedToday: React.FC<BookedTodayProps> = ({ count }) => {
  return (
    <div className="flex items-center text-xs text-gray-500 mt-auto mb-2">
      <Clock className="h-3 w-3 mr-1" />
      <span>Booked {count} times today</span>
    </div>
  );
};

export default BookedToday;
