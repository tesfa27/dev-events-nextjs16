import mongoose, { Document, Schema } from 'mongoose';
import Event from './event.model';

export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  eventId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true,
    index: true
  },
  email: { 
    type: String, 
    required: true, 
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  }
}, {
  timestamps: true
});

// Pre-save hook to validate event existence
BookingSchema.pre('save', async function(next) {
  if (this.isModified('eventId') || this.isNew) {
    try {
      const eventExists = await Event.findById(this.eventId);
      if (!eventExists) {
        return next(new Error('Referenced event does not exist'));
      }
    } catch (error) {
      return next(new Error('Error validating event reference'));
    }
  }
  next();
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);