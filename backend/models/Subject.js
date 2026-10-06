import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      default: '',
      maxlength: 2000,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
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

subjectSchema.index({ userId: 1, createdAt: -1 });
subjectSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.models.Subject || mongoose.model('Subject', subjectSchema);
