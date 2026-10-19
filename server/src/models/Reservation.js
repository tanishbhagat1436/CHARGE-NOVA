import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  stationId: { 
    type: String, 
    required: true 
  },
  stationName: { 
    type: String, 
    required: true 
  },
  operator: { 
    type: String, 
    default: 'EV Network' 
  },
  code: { 
    type: String, 
    required: true 
  },
  powerKW: { 
    type: Number, 
    default: 60 
  },
  connector: { 
    type: String, 
    default: 'CCS2' 
  },
  rateINR: { 
    type: Number, 
    default: 19.5 
  },
  coords: { 
    type: [Number], 
    required: true // [lat, lng]
  },
  expiresAt: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Completed', 'Cancelled', 'Expired'], 
    default: 'Active' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

ReservationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Reservation', ReservationSchema);
