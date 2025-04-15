
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Users, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAllTimeSlots } from '@/data/mockData';

const searchFormSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please select a time",
  }),
  partySize: z.string({
    required_error: "Please select number of people",
  }),
  location: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

const SearchForm: React.FC<{ className?: string; variant?: 'default' | 'hero' }> = ({ 
  className,
  variant = 'default'
}) => {
  const navigate = useNavigate();
  const timeSlots = getAllTimeSlots();
  const [date, setDate] = useState<Date>(new Date());
  
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      date: new Date(),
      time: '19:00',
      partySize: '2',
      location: '',
    },
  });
  
  function onSubmit(data: SearchFormValues) {
    navigate(`/search?date=${format(data.date, 'yyyy-MM-dd')}&time=${data.time}&partySize=${data.partySize}${data.location ? `&location=${data.location}` : ''}`);
  }
  
  const isHero = variant === 'hero';
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn(
        "flex flex-col md:flex-row md:items-end gap-3",
        isHero ? "bg-white p-4 md:p-6 rounded-lg shadow-lg" : "",
        className
      )}>
        {/* Date Picker */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex-1">
              {isHero && <div className="text-sm font-medium mb-2">Date</div>}
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (date) {
                        field.onChange(date);
                        setDate(date);
                      }
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        
        {/* Time Picker */}
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem className="flex-1">
              {isHero && <div className="text-sm font-medium mb-2">Time</div>}
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        {/* Party Size */}
        <FormField
          control={form.control}
          name="partySize"
          render={({ field }) => (
            <FormItem className="flex-1">
              {isHero && <div className="text-sm font-medium mb-2">Party Size</div>}
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <Users className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Number of people" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[...Array(20)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1} {i === 0 ? 'person' : 'people'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="flex-1">
              {isHero && <div className="text-sm font-medium mb-2">Location (Optional)</div>}
              <div className="relative w-full">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="City, state or zip"
                  className="pl-10"
                  {...field}
                />
              </div>
            </FormItem>
          )}
        />
        
        {/* Submit Button */}
        <Button type="submit" size={isHero ? "lg" : "default"} className={cn(
          "flex-shrink-0",
          isHero ? "px-8 bg-burgundy-800 hover:bg-burgundy-900" : ""
        )}>
          <Search className="mr-2 h-4 w-4" />
          Find a Table
        </Button>
      </form>
    </Form>
  );
};

export default SearchForm;
