const mongoose = require("mongoose");
const Fitness = require("../models/fitnessModel");

// 2.1 Add Fitness Data
const addFitnessData = async (req,res) => {
    const { title, date, duration, caloriesBurned } = req.body;
    try {
        if (!title || !date || !duration) {
            res.status(400).json("All Fields must be filled")
        }
        const newFitness = new Fitness({title, date, duration, caloriesBurned});
        const addedFitnessData = await newFitness.save();
        res.status(201).json(addedFitnessData);
    } catch(error) {
        res.status(500).json("Internal Server Error (addFitnessData)");
    }
};

// 2.2 Get All Fitness Data
const getAllFitnessData = async (req,res) => {
    try{
        const allData = await Fitness.find({}).sort({createdAt: -1});
        res.status(200).json(allData);
    } catch (error) {
        res.status(500).json("Internal Server Error");
    }
    
};

// 2.3 Get Single Fitness Data by ID
const getFitnessData = async (req,res) => {
    const { id } = req.params;
    console.log(id)
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error:"No Such FitnessData Found"})
    }
    try {
        const fitnessData = await Fitness.findById( id )
        if (!fitnessData) {
            return res.status(404).json({ error: "No such Data found" })
        }
        res.status(200).json(fitnessData);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error (getFitnessData)" })
    }
};

// 2.4 Delete Fitness Data by ID
const deleteFitnessData = async (req,res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No Such Data Found" })
    }
    try {
        const deletedFitnessData = await Fitness.findByIdAndDelete(id)
        if (!deletedFitnessData) {
            res.status(404).json({ error: "No such Data Found" })
        }
        res.status(200).json({ message: "Fitness Data entry deleted successfully" })
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"})
    }
};

// 2.5 Update Fitness Data by ID
const updateFitnessData = async (req,res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such Data Found" })
    }

    try {
        const updatedFitnessData = await Fitness.findByIdAndUpdate(
            { _id : id},
            { ...req.body },
            { new: true}
            );
        if (!updatedFitnessData) {
            return res.status(404).json({ error: "No such Data found" })
        }
        res.status(200).json(updatedFitnessData)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
}


module.exports = { addFitnessData,
     getAllFitnessData, 
     getFitnessData, 
     deleteFitnessData, 
     updateFitnessData,
     };