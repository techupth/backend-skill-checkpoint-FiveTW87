import { Router, json } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const questionRounter = Router();

const collection = db.collection("questions");

questionRounter.get("/", async (req, res) => {
  const questions = await collection.find({}).toArray();
  return res.status(200).json({
    data: questions,
  });
});

questionRounter.get("/:id", async (req, res) => {
  const questionId = new ObjectId(req.params.id);
  const questions = await collection.find(questionId).toArray();
  return res.status(200).json({
    data: questions,
  });
});

questionRounter.post("/", async (req, res) => {
  const questionData = {
    ...req.body,
  };
  const questions = await collection.insertOne(questionData);
  return res.status(200).json({
    message: "Create question succed",
  });
});

questionRounter.put("/:id", async (req, res) => {
  const questionId = new ObjectId(req.params.id);
  const newquestion = { ...req.body };
  await collection.updateOne(
    {
      _id: questionId,
    },
    {
      $set: newquestion,
    }
  );
  return res.status(200).json({
    message: "Update question succeed",
  });
});

questionRounter.delete("/:id", async (req, res) => {
  try {
    const questionId = new ObjectId(req.params.id);
    await collection.deleteOne({
      _id: questionId,
    });
    return res.status(200).json({
      message: "delete question succeed",
    });
  } catch (error) {
    return res.status(404).json({
      message: `${error}`,
    });
  }
});

export default questionRounter;
