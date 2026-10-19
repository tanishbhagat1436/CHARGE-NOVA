import mongoose from 'mongoose';

const StationSchema = new mongoose.Schema({
  openChargeMapId: { type: Number, unique: true, sparse: true },
  title: { type: String, required: true },
  operator: { type: String, default: 'Independent' },
  address: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  powerKW: { type: Number, default: 50 },
  connectionTypes: [{ type: String }],
  isFastCharger: { type: Boolean, default: true },
  status: { type: String, default: 'Operational' },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// 2dsphere index for GeoJSON spatial corridor queries
StationSchema.index({ location: '2dsphere' });

export default mongoose.model('Station', StationSchema);
