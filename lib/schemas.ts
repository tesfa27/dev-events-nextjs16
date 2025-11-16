import { z } from 'zod';

export const EventCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be at most 200 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be at most 500 characters'),
  overview: z.string().min(10, 'Overview must be at least 10 characters').max(1000, 'Overview must be at most 1000 characters'),
  venue: z.string().min(2, 'Venue must be at least 2 characters').max(100, 'Venue must be at most 100 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters').max(100, 'Location must be at most 100 characters'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format').refine((date) => new Date(date) > new Date(), 'Date must be in the future'),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/, 'Time must be in HH:MM format'),
  mode: z.enum(['Online', 'In-Person', 'Hybrid'], { errorMap: () => ({ message: 'Mode must be Online, In-Person, or Hybrid' }) }),
  audience: z.string().min(2, 'Audience must be at least 2 characters').max(100, 'Audience must be at most 100 characters'),
  organizer: z.string().min(2, 'Organizer must be at least 2 characters').max(100, 'Organizer must be at most 100 characters'),
  tags: z.array(z.string().min(1, 'Tag cannot be empty').max(50)).min(1, 'At least one tag is required').max(10, 'Maximum 10 tags allowed'),
  agenda: z.array(z.string().min(1, 'Agenda item cannot be empty').max(500)).min(1, 'At least one agenda item is required').max(20, 'Maximum 20 agenda items allowed'),
});

export const EventUpdateSchema = EventCreateSchema.partial();

export type EventCreate = z.infer<typeof EventCreateSchema>;
export type EventUpdate = z.infer<typeof EventUpdateSchema>;
