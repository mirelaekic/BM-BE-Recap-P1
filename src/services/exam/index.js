const express = require("express");
const { check, validationResult } = require("express-validator");
const {
  getExam,
  writExam,
  getQuestion,
  writeQuestion,
} = require("../../fsUtilities");
const uniqid = require("uniqid");

const examRouter = express.Router();

examRouter.post(
  "/exam/start",
  [check("candidateName").exists().withMessage("Name is required!")],
  async (req, res, next) => {
    try {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        const error = new Error();
        error.httpStatusCode = 400;
        error.message = validationErrors;
        next(error);
      } else {
        const exam = await getExam();
        const questions = await getQuestion();
        const randomQuestions = questions.sort(() => Math.random() - 0.5);
        const fiveQuestions = randomQuestions.slice(1, 6);
        const newExam = {
          ...req.body,
          examDate: new Date(),
          isCompleted: false,
          name: "Admission Test",
          selectedAnswer: null,
          selectedQuestion:null,
          TotalDuration: 0,
          _id: uniqid(),
          questions: fiveQuestions,
        };
        newExam.questions.map((quiz) =>
          quiz.answers.map((answer) => delete answer.isCorrect)
        );
        exam.push(newExam);
        await writExam(exam);
        res.status(201).send(exam);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
examRouter.post("/exam/:id/answer", async (req, res, next) => {
  try {
    const exams = await getExam();
    const exam = exams.find((exam) => exam._id === req.params.id);
    if (exam) {
      const indexOfQuestion = req.body.question;
      const selectedQuestion = exam.questions[indexOfQuestion];
      const selectedAnswer = req.body.answer;
      selectedQuestion.selectedAnswer = selectedAnswer;
      const score =
        selectedQuestion.answers[selectedAnswer].isCorrect === true ? 20 : 0;
      exam.totalScore += score;
      await writExam(exam);
      res.status(201).send(exam);
    } else {
      const err = new Error();
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
module.exports = examRouter;
