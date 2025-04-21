
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { format } from 'date-fns';

export interface CommentData {
  id: string;
  text: string;
  date: string | Date;
  employeeName?: string;
  rating?: 'راضي جدًا' | 'راضي' | 'محايد' | 'غير راضي' | 'غير راضي جدًا';
  serviceType?: string;
}

interface CommentCardProps {
  comment: CommentData;
  className?: string;
}

const getRatingColor = (rating?: string) => {
  switch (rating) {
    case 'راضي جدًا':
      return 'bg-green-100 text-green-800';
    case 'راضي':
      return 'bg-green-50 text-green-600';
    case 'محايد':
      return 'bg-gray-100 text-gray-600';
    case 'غير راضي':
      return 'bg-red-50 text-red-600';
    case 'غير راضي جدًا':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const CommentCard: React.FC<CommentCardProps> = ({ comment, className }) => {
  const formattedDate = comment.date instanceof Date 
    ? format(comment.date, 'dd/MM/yyyy')
    : format(new Date(comment.date), 'dd/MM/yyyy');

  return (
    <Card className={`${className} overflow-hidden border border-gray-200 shadow-sm hover:shadow transition-shadow duration-200`}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle className="text-sm font-medium">
            {comment.employeeName || 'موظف غير معروف'}
          </CardTitle>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        {comment.rating && (
          <span className={`px-2 py-1 rounded-full text-xs ${getRatingColor(comment.rating)}`}>
            {comment.rating}
          </span>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-gray-600">{comment.text}</p>
      </CardContent>
      {comment.serviceType && (
        <CardFooter className="px-4 py-2 bg-gray-50 text-xs text-gray-500">
          {comment.serviceType}
        </CardFooter>
      )}
    </Card>
  );
};

export default CommentCard;
