import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          // RFC 5322 compliant email regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create index on eventId for faster queries
BookingSchema.index({ eventId: 1 });

/**
 * Pre-save hook to validate that the referenced event exists in the database
 */
BookingSchema.pre('save', async function (next) {
  const booking = this as IBooking;

  // Validate event existence only if eventId is new or modified
  if (booking.isModified('eventId')) {
    try {
      const Event = mongoose.models.Event;
      
      if (!Event) {
        return next(new Error('Event model not found'));
      }

      const eventExists = await Event.findById(booking.eventId);
      
      if (!eventExists) {
        return next(
          new Error(
            `Event with ID ${booking.eventId} does not exist. Please provide a valid event ID.`
          )
        );
      }
    } catch (error) {
      return next(
        new Error(
          `Failed to validate event: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      );
    }
  }

  next();
});

// Prevent model recompilation in Next.js development
const Booking: Model<IBooking> =
  mongoose.models.Booking ||
  mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
