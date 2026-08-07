import Subject from "../models/Subject.js";

export const addSubject = async(req,res)=>{
    try{
        const {subjectName , subjectCode , className , semester , credits , description} = req.body;
        const existing =  await Subject.findOne({subjectCode});
        if(existing){
            return res.status(400).json({message:'Subject  already exists'});
        }
        const subject = new Subject({subjectName , subjectCode , className , semester , credits , description});
        await subject.save();
        res.status(201).json(subject);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

export const getSubjects = async(req,res)=>{
    try{
        const subjects = await Subject.find({isDeleted:false})
        .sort({subjectName:1});
        res.status(200).json(subjects);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

export const getSubjectById = async(req,res)=>{
    try{
       const subject = await Subject.findOne({_id:req.params.id,isDeleted:false});
        if(!subject){
            return res.status(404).json({message:'Subject not found'});
        }
        res.status(200).json(subject);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

export const updateSubject = async(req,res)=>{
    try{
        const {subjectName , subjectCode, className , semester , credits , description} = req.body;
        const subject = await Subject.findById(req.params.id);
        if(!subject){
            return res.status(404).json({message:"Subject not found"});
        }
        subject.subjectName = subjectName || subject.subjectName;
        subject.subjectCode = subjectCode || subject.subjectCode;
        subject.className = className || subject.className;
        subject.semester = semester || subject.semester;
        subject.credits = credits || subject.credits;
        subject.description = description || subject.description;
        await subject.save();
        res.status(200).json(subject);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

 export const deleteSubject = async(req,res)=>
    {
        try{
            const subject = await Subject.findById(req.params.id);
            if(!subject){
                return res.status(404).json({message:"Subject not found"});
            }
            subject.isDeleted = true;
            subject.deletedAt = new Date();

            await subject.save();
            res.status(200).json({message:"Subject deleted successfully"});
        }

        catch(error){
            res.status(500).json({message:error.message});
        }
    }

    export const searchSubjects = async(req,res)=>{
        try{
            const {query} = req.query;
            const subjects = await Subject.find({
                $or:[
                    {subjectName:{$regex:query,$options:'i'}},
                    {subjectCode:{$regex:query,$options:'i'}},
                    {className:{$regex:query,$options:'i'}},
                    {semester:{$regex:query,$options:'i'}},
                ]
            });
            res.status(200).json(subjects);
        }
        catch(error){
            res.status(500).json({message:error.message});
        }
    }