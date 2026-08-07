import Student from "../models/Student.js";

export const CreateStudent = async(req,res)=>{
    const {fullname,email,StudentId,className,section,age,gender,phoneNumber,address} = req.body;
    try{
        let student = await Student.findOne({StudentId , isDeleted:false});
        if(student){
            return res.status(400).json({message:"Student Already Exists"});
         }  
        student = new Student({
            fullname,email,StudentId,className,section,age,gender,phoneNumber,address,  
                      createdBy:req.user.id
        });
        await student.save();
        res.status(201).json({message:"Student Created Successfully", student});
    }   
    catch(error){
        console.error("Error in CreateStudent",error);
        res.status(500).json({message:"Server Error"});
    }
}

export const getStudents = async(req,res)=>{
    try{
        const students = await Student.find({createdBy:req.user.id});
        res.status(200).json(students);
    }
    catch(error){
        console.error("Error in getStudents",error);
        res.status(500).json({message:"Server Error"});
     }  
}


export const getStudentById = async(req,res)=>{
    try{
        const student = await Student.findById(req.params.id);

        if(!student){   
            return res.status(404).json({message:"Student Not Found"});
        }
        if(student.createdBy.toString() !== req.user.id){
            return res.status(401).json({message:"Unauthorized"});
        }
        res.status(200).json(student);
    }
    catch(error){
        console.error("Error in getStudentById",error);
        res.status(500).json({message:"Server Error"});
    }
}


export const updateStudent = async(req,res)=>{
    const {fullname,email,StudentId,className,section,age,gender,phoneNumber,address} = req.body;
    try{
        let student = await Student.findById(req.params.id);    
        if(!student){
            return res.status(404).json({message:"Student Not Found"});
        }
        if(student.createdBy.toString() !== req.user.id){
            return res.status(401).json({message:"Unauthorized"});
        }   
        student.fullname = fullname || student.fullname;
        student.email = email || student.email;
        student.StudentId = StudentId || student.StudentId;
        student.className = className || student.className;
        student.section = section || student.section;
        student.age = age || student.age;
        student.gender = gender || student.gender;
        student.phoneNumber = phoneNumber || student.phoneNumber;
        student.address = address || student.address;

        await student.save();
        res.status(200).json({message:"Student Updated Successfully", student});
    }
    catch(error){
        console.error("Error in updateStudent",error);
        res.status(500).json({message:"Server Error"});
    }
}

export const deleteStudent = async(req,res)=>{
    try{
        const student = await Student.findById(req.params.id);
        if(!student){
            return res.status(404).json({message:"Student Not Found"});
        }
        if(student.createdBy.toString() !== req.user.id){
            return res.status(401).json({message:"Unauthorized"});
        }
        await student.deleteOne();
        res.status(200).json({message:"Student Deleted Successfully"});
    }
    catch(error){
        console.error("Error in deleteStudent",error);
        res.status(500).json({message:"Server Error"});
    }
}

