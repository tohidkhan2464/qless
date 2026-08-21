import mongoose, { Schema, Document } from 'mongoose';

export interface IQueue extends Document {
  serviceId: mongoose.Types.ObjectId;
  date: Date;
  status: 'ACTIVE' | 'PAUSED' | 'CLOSED';
  currentTokenNumber: number;
  lastTokenNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

const QueueSchema: Schema = new Schema({
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['ACTIVE', 'PAUSED', 'CLOSED'], default: 'ACTIVE' },
  currentTokenNumber: { type: Number, default: 0 },
  lastTokenNumber: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Queue || mongoose.model<IQueue>('Queue', QueueSchema);
