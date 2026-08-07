import mongoose from 'mongoose';

const markSchema = new mongoose.Schema({
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    },
    subjectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
    },
    term:{
        type: String,
        enum: ['Mid-Term', 'Final-Term'],
    },
    obtainedMarks:{
        type: Number,
        required: true,
        min : 0,
    },
    totalMarks:{
        type: Number,
        default: 100,
        min:1,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    
}   
,{timestamps:true});

markSchema.virtual('percentage').get(function(){
    return ((this.obtainedMarks / this.totalMarks) * 100).toFixed(2);
});
markSchema.set("toJSON", { virtuals: true });
markSchema.set("toObject", { virtuals: true });

const Mark = mongoose.model('Mark',markSchema);

export default Mark;    