
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Star, ThumbsUp } from 'lucide-react';
import { Review } from '@/data/mockData';

interface ReviewsListProps {
  reviews: Review[];
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews }) => {
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {reviews.length === 0 ? (
        <p className="text-gray-500 italic">No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{review.userName}</h4>
                <div className="flex items-center mt-1">
                  {renderStarRating(review.rating)}
                  <span className="ml-2 text-gray-600 text-sm">
                    {format(parseISO(review.date), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-burgundy-600 flex items-center text-sm">
                <ThumbsUp className="h-4 w-4 mr-1" />
                Helpful
              </button>
            </div>
            <p className="mt-3 text-gray-700">{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewsList;
