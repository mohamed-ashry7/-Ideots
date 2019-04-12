const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const validator = require("../../validations/taskValidations");
const Joi = require("joi");
// We will be connecting using database
const Task = require("../../models/Task");

router.get("/", async (req, res) => {
  const tasks = await Task.find()
    .populate("partnerID")
    .populate("consultancyID");
  res.json({ data: tasks });
});

// Get Tasks in range
router.get("/WithRange/:limit/:offset", async (req, res) => {
  const schema = {
    limit: Joi.required(),
    offset: Joi.required()
  };
  const result = Joi.validate(req.params, schema);
  if (result.error)
    return res.status(400).send({ error: result.error.details[0].message });
  const limit = parseInt(req.params.limit, 10);
  const offset = parseInt(req.params.offset, 10);
  const task = await Task.find()
    .skip(offset)
    .limit(limit);
  res.json({ data: task });
});

router.get("/:id", async (req, res) => {
  try {
    const taskID = req.params.id;
    const task = await Task.findOne({ _id: taskID })
      .populate("partnerID")
      .populate("consultancyID");
    if (!task) return res.status(400).send({ error: "Task does not exist" });
    return res.json({ task });
  } catch (error) {
    console.log(error);
  }
});
//get my tasks
router.get("/Partner/:id", async (req, res) => {
    try {
      const partnerId = req.params.id;
      const task = await Task.find({ partnerID: partnerId })
        .populate("partnerID")
        .populate("consultancyID");
      if (!task) return res.status(400).send({ error: "Task does not exist" });
      return res.json({ task });
    } catch (error) {
      console.log(error);
    }
  });

router.post("/", async (req, res) => {
  try {
    const isValidated = validator.createValidation(req.body);
    if (isValidated.error)
      return res
        .status(400)
        .send({ error: isValidated.error.details[0].message });
    const newTask = await Task.create(req.body);
    res.json({ msg: "Task was created successfully", data: newTask });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const taskID = req.params.id;
    const taskApplicant = req.body.applicant;

    const task = await Task.findById(taskID);
    if (!task) return res.status(400).send({ error: "Task does not exist" });
    const isValidated = validator.updateValidation(req.body);
    if (isValidated.error)
      return res
        .status(400)
        .send({ error: isValidated.error.details[0].message });
    if (!taskApplicant) {
    } else {
      Task.update(
        { _id: taskID },
        { $addToSet: { applicants: taskApplicant } }
      );
    }
    const updatedTask = await Task.updateOne({ _id: taskID }, req.body);
    res.json({ msg: "Task updated successfully" });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const taskID = req.params.id;
    const deletedTask = await Task.findByIdAndRemove(taskID);
    if (!deletedTask)
      return res.status(400).send({ error: "task does not exist" });
    res.json({ msg: "Task was deleted successfully", data: deletedTask });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

// **searching for tasks**

//search by category
router.get("/search/category=:cat", async (req, res) => {
  const cat = req.params.cat;
  const tasks = await Task.find({ category: cat })
    .populate("partnerID")
    .populate("consultancyID");
  // if(tasks.length==0)return res.status(404).send({error: 'no tasks found'})
  return res.json({ data: tasks });
});

//search by year of experience
router.get("/search/experience=:exp", async (req, res) => {
  const exp = req.params.exp;
  const tasks = await Task.find({ yearsOfExperience: exp })
    .populate("partnerID")
    .populate("consultancyID");
  // if(tasks.length==0) return res.status(404).send({error: 'no tasks found'})
  return res.json({ data: tasks });
});

//search by monetary compensation *********************************************************************************************
router.get("/search/payment=:pay", async (req, res) => {
  const pay = req.params.pay;
  const min = Number(pay) - 50;
  const max = Number(pay) + 50;
  const tasks = await Task.find({ payment: { $lte: max, $gte: min } })
    .populate("partnerID")
    .populate("consultancyID");
  // if(tasks.length==0) return res.status(404).send({error: 'no tasks found'})
  return res.json({ data: tasks });
});

//recommended tasks
router.get("/recommended/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id)
    .populate("partnerID")
    .populate("consultancyID");
  const userSkills = user.skills;
  const tasks = await Task.find({ requiredSkills: { $in: userSkills } });
  // if(tasks.length==0) return res.status(404).send({error: 'No tasks suitable for you at the moment, Try something new ?'})
  return res.json({ data: tasks });
});

module.exports = router;
