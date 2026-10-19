import mongoose from 'mongoose';

const RouteHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  title: { type: String, required: true },
  sourceName: { type: String, required: true },
  destName: { type: String, required: true },
  sourceCoords: { type: [Number], required: true }, // [lat, lng]
  destCoords: { type: [Number], required: true },   // [lat, lng]
  vehicleName: { type: String },
  distanceKm: { type: Number },
  durationMins: { type: Number },
  stopsCount: { type: Number, default: 0 },
  chargingCostINR: { type: Number },
  savedCostINR: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

RouteHistorySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('RouteHistory', RouteHistorySchema);
