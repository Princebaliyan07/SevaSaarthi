import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    medicineId: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    genericName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    brandName: {
      type: String,
      required: true,
      index: true,
    },
    janAushadhiPrice: {
      type: Number,
      required: true,
    },
    commercialPrice: {
      type: Number,
      required: true,
    },
    savingsPercentage: {
      type: Number,
    },
    category: {
      type: String,
      default: 'Essential',
      index: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    whenToSeeDoctor: {
      type: String,
      default: 'If symptoms persist beyond 48 hours or worsen rapidly.',
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockCount: {
      type: Number,
      default: 50,
    },
  },
  { timestamps: true }
);

medicineSchema.pre('save', function (next) {
  if (this.commercialPrice > 0) {
    this.savingsPercentage = Math.round(
      ((this.commercialPrice - this.janAushadhiPrice) / this.commercialPrice) * 100
    );
  }
  next();
});

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;
