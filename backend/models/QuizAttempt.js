import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject: { type: String, required: true, trim: true, maxlength: 160 },
    activityType: { type: String, enum: ['Mock Viva', 'Quiz'], default: 'Mock Viva' },
    score: { type: Number, required: true, min: 0, max: 100 },
    answers: [{
      question: { type: String, trim: true, maxlength: 2000 },
      answer: { type: String, trim: true, maxlength: 10000 },
      score: { type: Number, min: 0, max: 100 },
    }],
    completedAt: { type: Date, default: Date.now },
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

quizAttemptSchema.index({ userId: 1, completedAt: -1 });

export default mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', quizAttemptSchema);
