import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, index: true },
  description: { type: String, required: true, trim: true },
  overview: { type: String, required: true, trim: true },
  image: { type: String, required: true, trim: true },
  venue: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  mode: { type: String, required: true, trim: true },
  audience: { type: String, required: true, trim: true },
  agenda: { type: [String], required: true },
  organizer: { type: String, required: true, trim: true },
  tags: { type: [String], required: true }
}, {
  timestamps: true
});

// Pre-save hook for slug generation and date/time normalization
EventSchema.pre('save', function (next) {
  // Generate slug only if title is modified or document is new
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Normalize date to ISO format if modified
  if (this.isModified('date')) {
    const dateObj = new Date(this.date);
    if (isNaN(dateObj.getTime())) {
      return next(new Error('Invalid date format'));
    }
    this.date = dateObj.toISOString().split('T')[0];
  }

  // Normalize time format (HH:MM)
  if (this.isModified('time')) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    const match = this.time.match(timeRegex);
    if (!match) {
      return next(new Error('Time must be in HH:MM format'));
    }
    // Normalize to HH:MM format
    const [_, hours, minutes] = match;
    this.time = `${hours.padStart(2, '0')}:${minutes}`;
  }

  next();
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);