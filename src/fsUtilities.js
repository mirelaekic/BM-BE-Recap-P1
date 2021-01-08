  
const { readJSON, writeJSON } = require("fs-extra");
const { join } = require("path");

const examPath = join(__dirname, "./services/exam/exam.json");
const questionsPath = join(__dirname, "./services/exam/questions.json");
const resultsPath = join(__dirname, "./services/exam/results.json");

const readDB = async filePath => {
  try {
    const fileJson = await readJSON(filePath)
    return fileJson
  } catch (error) {
    throw new Error(error)
  }
};

const writeDB = async (filePath, fileContent) => {
  try {
    await writeJSON(filePath, fileContent)
  } catch (error) {
    throw new Error(error)
  }
};

module.exports = {
    getExam: async () => readDB(examPath),
    writExam: async examData => writeDB(examPath, examData),
    getQuestion: async () => readDB(questionsPath),
    writeQuestion: async questionsData => writeDB(questionsPath, questionsData),
    getResults: async () => readDB(resultsPath),
    writeResults: async resultsData => writeDB(resultsPath, resultsData),
  };