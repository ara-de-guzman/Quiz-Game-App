"use strict";

const questionHeader = document.querySelector("#question-header h1");
const submitBtn = document.querySelector(".submit-btn");
const choiceA = document.querySelector("#choice-one");
const choiceB = document.querySelector("#choice-two");
const choiceC = document.querySelector("#choice-three");
const choiceD = document.querySelector("#choice-four");
const answerBtns = document.querySelectorAll("#answer-btns button");
const answerBtnsContainer = document.querySelector("#answer-btns");
const correctAnswerBox = document.querySelector("#correct_answer");
const scoreBox = document.querySelector("#score_box");
const overlay = document.querySelector("#overlay");
const reloadBtn = document.querySelector("#reload_btn");
const resultContainer = document.querySelector("#result_container");

let index = 0;
let selected = false;

async function getData() {
  const questionContainer = [];
  const choicesContainer = [];
  const correctAnswerContainer = [];
  const mistakesContainer = [];

  try {
    const data = await fetch("https://the-trivia-api.com/v2/questions/");
    const results = await data.json();

    for (let item in results) {
      correctAnswerContainer.push(results[item].correctAnswer);
      choicesContainer.push(results[item].incorrectAnswers);
      questionContainer.push(results[item].question.text);
    }
  } catch (error) {
    throw new Error(error);
  }

  submitBtn.addEventListener("click", () => {
    answerBtnsContainer.style.display = "grid";
    let score = 10 - showAllMistakesModal(mistakesContainer).length;
    index++;
    removeButtonBg();
    overlay.style.display = "none";
    correctAnswerBox.textContent = "";
    submitBtn.textContent = "Next Question";
    if (index >= 10) {
      scoreBox.textContent = score;
      resultContainer.style.display = "flex";
      overlay.style.display = "block";
      overlay.style.zIndex = 9;
    } else {
    
      choicesContainer[index][3] = correctAnswerContainer[index];
      shuffle(choicesContainer[index]);
      questionHeader.innerText = questionContainer[index];
      choiceA.innerText = choicesContainer[index][0];
      choiceB.innerText = choicesContainer[index][1];
      choiceC.innerText = choicesContainer[index][2];
      choiceD.innerText = choicesContainer[index][3];

      showAllMistakesModal(mistakesContainer);

      answerBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          overlay.style.display = "block";
          removeButtonBg();
          btn.style.backgroundColor = "rgb(3, 138, 255)";
          if (e.target.innerText === correctAnswerContainer[index]) {
            correctAnswerBox.innerHTML = " &#9733; Your Correct &#9733;";
            correctAnswerBox.style.color = "rgb(3, 138, 255)";
          } else {
            mistakesContainer.push(questionContainer[index]);
            correctAnswerBox.textContent =
              "Correct answer : " + correctAnswerContainer[index];
            correctAnswerBox.style.color = "#880808";
          }
        });
      });
    }
  });
}
getData();

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function removeButtonBg() {
  answerBtns.forEach((btn) => {
    btn.style.backgroundColor = "#ededed";
  });
}

function showAllMistakesModal(arr) {
  if (!arr) {
    return false;
  } else {
    const result = arr.filter((item, idx) => arr.indexOf(item) === idx);
    return result;
  }
}

reloadBtn.addEventListener("click", () => {
  resultContainer.style.display = "none";
  location.reload();
});
