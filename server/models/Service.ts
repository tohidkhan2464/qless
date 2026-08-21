import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  departmentId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  averageServiceTime: number; // in minutes
  notificationThreshold: number; // e.g., 5 positions away
  assignedStaff: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema({
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
  name: { type: String, required: true },
  description: { type: String },
  averageServiceTime: { type: Number, default: 5 },
  notificationThreshold: { type: Number, default: 5 },
  assignedStaff: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
