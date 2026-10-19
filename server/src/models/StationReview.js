import mongoose from 'mongoose';

const StationReviewSchema = new mongoose.Schema({
  stationId: { 
    type: String, 
    required: true, 
    index: true 
  },
  userName: { 
    type: String, 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    default: 5 
  },
  testedPowerKW: { 
    type: Number, 
    default: 60 
  },
  gunStatus: { 
    type: String, 
    default: 'Working 100%' 
  },
  comment: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

StationReviewSchema.index({ stationId: 1, createdAt: -1 });

export default mongoose.model('StationReview', StationReviewSchema);
