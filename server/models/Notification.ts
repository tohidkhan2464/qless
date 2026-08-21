import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  queueEntryId?: mongoose.Types.ObjectId;
  type: 'TURN_APPROACHING' | 'YOUR_TURN' | 'QUEUE_UPDATE';
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  queueEntryId: { type: Schema.Types.ObjectId, ref: 'QueueEntry' },
  type: { 
    type: String, 
    enum: ['TURN_APPROACHING', 'YOUR_TURN', 'QUEUE_UPDATE'], 
    required: true 
  },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
