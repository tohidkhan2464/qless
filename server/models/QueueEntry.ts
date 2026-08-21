import mongoose, { Schema, Document } from 'mongoose';

export interface IQueueEntry extends Document {
  queueId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  tokenNumber: number;
  position: number;
  requestDescription?: string;
  status: 'WAITING' | 'NOTIFIED' | 'SERVING' | 'COMPLETED' | 'SKIPPED' | 'CANCELLED';
  joinedAt: Date;
  notifiedAt?: Date;
  servingAt?: Date;
  completedAt?: Date;
  updatedAt: Date;
}

const QueueEntrySchema: Schema = new Schema({
  queueId: { type: Schema.Types.ObjectId, ref: 'Queue', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tokenNumber: { type: Number, required: true },
  position: { type: Number, required: true },
  requestDescription: { type: String },
  status: { 
    type: String, 
    enum: ['WAITING', 'NOTIFIED', 'SERVING', 'COMPLETED', 'SKIPPED', 'CANCELLED'], 
    default: 'WAITING' 
  },
  joinedAt: { type: Date, default: Date.now },
  notifiedAt: { type: Date },
  servingAt: { type: Date },
  completedAt: { type: Date },
}, { timestamps: true });

export default mongoose.models.QueueEntry || mongoose.model<IQueueEntry>('QueueEntry', QueueEntrySchema);
