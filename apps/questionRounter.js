import { Router, json } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const questionRounter = Router();

const collectionQuiz = db.collection("questions");
const collectionAnswer = db.collection("answers");

questionRounter.get("/", async (req, res) => {
  const keywords = req.query.keywords;
  const category = req.query.category;
  const query = {};
  if (keywords) {
    query.title = new RegExp(keywords, "i");
  }
  if (category) {
    query.category = category;
  }
  const questions = await collectionQuiz.find(query).limit(10).toArray();
  return res.status(200).json({
    data: questions,
  });
});

questionRounter.get("/:id", async (req, res) => {
  const questionId = new ObjectId(req.params.id);
  const questions = await collectionQuiz.find(questionId).toArray();
  return res.status(200).json({
    data: questions,
  });
});

questionRounter.post("/", async (req, res) => {
  const questionData = {
    ...req.body,
  };
  const questions = await collectionQuiz.insertOne(questionData);
  return res.status(200).json({
    message: "Create question succed",
  });
});

questionRounter.put("/:id", async (req, res) => {
  const questionId = new ObjectId(req.params.id);
  const newquestion = { ...req.body };
  await collectionQuiz.updateOne(
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

questionRounter.put("/:id/like", async (req, res) => {
  const questionId = new ObjectId(req.params.id);
  const questionData = await collectionQuiz.findOne(questionId);
  const updateLike = questionData.like + 1;
  await collectionQuiz.updateOne(
    { _id: questionId },
    { $set: { like: updateLike } }
  );
  return res.json({
    message: "Add like on question complete",
  });
});

questionRounter.put("/:id/dislike", async (req, res) => {
  const questionId = new ObjectId(req.params.id);
  const questionData = await collectionQuiz.findOne(questionId);
  const updateLike = questionData.like - 1;
  await collectionQuiz.updateOne(
    { _id: questionId },
    { $set: { like: updateLike } }
  );
  return res.json({
    message: "Add dislike on question complete",
  });
});

questionRounter.delete("/:id", async (req, res) => {
  const questionId = new ObjectId(req.params.id);
  await collectionQuiz.deleteOne({
    _id: questionId,
  });
  await collectionAnswer.deleteMany({
    questionId: questionId,
  });
  return res.status(200).json({
    message: "delete question succeed",
  });
});

questionRounter.post("/:id/answer", async (req, res) => {
  const questionId = new ObjectId(req.params.id);
  const answerData = { questionId: questionId, ...req.body };
  const answer = await collectionAnswer.insertOne(answerData);
  if (answerData.answer.length > 300) {
    return res.status(404).json({
      message: "Answer must less than 300",
    });
  }
  return res.status(200).json({
    message: "Answer has been created",
  });
});

questionRounter.get("/:id/answer", async (req, res) => {
  const questionId = new ObjectId(req.params.id);
  const answers = await collectionAnswer.find({}).toArray();
  return res.status(200).json({
    data: answers,
  });
});

questionRounter.put("/answer/:answerId/like", async (req, res) => {
  const answerId = new ObjectId(req.params.answerId);
  const answerData = await collectionAnswer.findOne(answerId);
  const updateLike = answerData.like + 1;
  await collectionAnswer.updateOne(
    { _id: answerId },
    { $set: { like: updateLike } }
  );
  return res.json({
    message: "Add like on answer complete",
  });
});

questionRounter.put("/answer/:answerId/dislike", async (req, res) => {
  const answerId = new ObjectId(req.params.answerId);
  const answerData = await collectionAnswer.findOne(answerId);
  const updateLike = answerData.like - 1;
  await collectionAnswer.updateOne(
    { _id: answerId },
    { $set: { like: updateLike } }
  );
  return res.json({
    message: "Add dislike on answer complete",
  });
});
export default questionRounter;
