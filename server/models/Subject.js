import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true,
    },
    subjectCode: { 
        type: String,
        required: true,
        unique: true,
    },
    className: {
        type: String,
        required: true,
    },
    semester: {
        type: Number,
        required: true,
    },
    credits:{
        type: Number,
        required: true,
    },
    description:{
        type: String,
        default:'',
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedAt:{
        type:Date,
        default:null
    }


},
{timestamps:true});

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;