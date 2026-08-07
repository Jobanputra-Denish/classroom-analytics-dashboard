import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    StudentId: {
        type: String,
        required: true,
        unique: true,
    },
    className: {
        type: String,
        required: true,
    },
    section: {
        type: String,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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

const Student = mongoose.model('Student', studentSchema);

export default Student;