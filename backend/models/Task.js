import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    course: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 5000, default: '' },
    dueDate: { type: Date, default: null },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_document, result) {
        result.id = result._id.toString();
        result.userId = result.userId.toString();
        delete result._id;
        return result;
      },
    },
  }
);

taskSchema.index({ userId: 1, status: 1, dueDate: 1 });

export default mongoose.models.Task || mongoose.model('Task', taskSchema);
