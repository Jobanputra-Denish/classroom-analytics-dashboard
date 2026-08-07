import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student', 
         },
         fullname:{
            type: String,
            required: true,
         },
         className:{
            type: String,
            required: true,
         },
         section:{
            type: String,
            required: true,  
         },
         marks:{
            type: Number,
            required: true,
         },
         attendance:{
            type: Number,
            required: true,
         }
})

const Analytics = mongoose.model('Analytics',analyticsSchema);

export default Analytics;