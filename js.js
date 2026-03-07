const questionBank = {
  mcQuestions: [
    "What language is spoken in Brazil?",
    "What is the capital of Korea?",
    "Who won the most recent FIFA World Cup held in 2022?"
  ],
  mcOptions: [
    ["1. Spanish", "2. Portuguese", "3. English", "4. French"],
    ["1. Madrid", "2. Manila", "3. Seoul", "4. Tokyo"],
    ["1. Germany", "2. Brazil", "3. France", "4. Argentina"]
  ],
  mcAnswers: [2, 3, 4],

  blankQuestions: [
    "The largest planet in solar system is ______.",
    "The last olympics was held in city _____."
  ],
  blankAnswers: ["jupiter", "paris"]
};
// 문제들 

const state = {
  scores: [0, 0],
  currentPlayer: 0,
  phase: "mc", // "mc" or "blank"
  questionIndex: 0,
  started: false
};

const menuScreen = document.getElementById("menuScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const startBtn = document.getElementById("startBtn");
const exitBtn = document.getElementById("exitBtn");
const restartBtn = document.getElementById("restartBtn");
const backMenuBtn = document.getElementById("backMenuBtn");
const submitBtn = document.getElementById("submitBtn");

const menuMessage = document.getElementById("menuMessage");
const feedback = document.getElementById("feedback");

const playerTurn = document.getElementById("playerTurn");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const progressText = document.getElementById("progressText");
const questionTitle = document.getElementById("questionTitle");
const questionType = document.getElementById("questionType");
const optionsBox = document.getElementById("optionsBox");
const blankBox = document.getElementById("blankBox");
const blankInput = document.getElementById("blankInput");

const finalScore1 = document.getElementById("finalScore1");
const finalScore2 = document.getElementById("finalScore2");
const winnerText = document.getElementById("winnerText");

function showScreen(screen) {
  menuScreen.classList.remove("active");
  quizScreen.classList.remove("active");
  resultScreen.classList.remove("active");
  screen.classList.add("active");
}

function resetGame() {
  state.scores = [0, 0];
  state.currentPlayer = 0;
  state.phase = "mc";
  state.questionIndex = 0;
  state.started = true;

  clearMessage(feedback);
  updateScoreboard();
  renderQuestion();
  showScreen(quizScreen);
}

function updateScoreboard() {
  score1.textContent = `Player 1: ${state.scores[0]}`;
  score2.textContent = `Player 2: ${state.scores[1]}`;
  playerTurn.textContent = `Player ${state.currentPlayer + 1} Turn`;
}

function setMessage(element, text, type = "info") {
  element.textContent = text;
  element.className = `message ${type}`;
}

function clearMessage(element) {
  element.textContent = "";
  element.className = "message";
}

function renderQuestion() {
  updateScoreboard();
  clearMessage(feedback);

  const playerNumber = state.currentPlayer + 1;

  if (state.phase === "mc") {
    const qIndex = state.questionIndex;
    const total = questionBank.mcQuestions.length;

    progressText.textContent = `Multiple Choice ${qIndex + 1} / ${total}`;
    questionTitle.textContent = `[Player ${playerNumber}] ${questionBank.mcQuestions[qIndex]}`;
    questionType.textContent = "This is multiple choice question. Please choose the answer.";

    optionsBox.innerHTML = "";
    blankBox.classList.add("hidden");

    questionBank.mcOptions[qIndex].forEach((optionText, index) => {
      const label = document.createElement("label");
      label.className = "option-item";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "mcOption";
      radio.value = String(index + 1);

      const span = document.createElement("span");
      span.textContent = optionText;

      label.appendChild(radio);
      label.appendChild(span);
      optionsBox.appendChild(label);
    });
  } else {
    const qIndex = state.questionIndex;
    const total = questionBank.blankQuestions.length;

    progressText.textContent = `Fill in the Blank ${qIndex + 1} / ${total}`;
    questionTitle.textContent = `[Player ${playerNumber}] ${questionBank.blankQuestions[qIndex]}`;
    questionType.textContent = "This is blank space question. Enter the answer.";

    optionsBox.innerHTML = "";
    blankBox.classList.remove("hidden");
    blankInput.value = "";
    blankInput.focus();
  }
}

function handleSubmit() {
  if (state.phase === "mc") {
    submitMcAnswer();
  } else {
    submitBlankAnswer();
  }
}

function submitMcAnswer() {
  const selected = document.querySelector('input[name="mcOption"]:checked');

  if (!selected) {
    setMessage(feedback, "Please select the number.", "error");
    return;
  }

  const answer = Number(selected.value);
  const correctAnswer = questionBank.mcAnswers[state.questionIndex];

  if (answer === correctAnswer) {
    state.scores[state.currentPlayer]++;
    setMessage(feedback, "Correct!", "success");
  } else {
    setMessage(feedback, "Wrong!", "error");
  }

  updateScoreboard();
  moveToNextTurn();
}

function submitBlankAnswer() {
  const answer = blankInput.value.trim().toLowerCase();

  if (!answer) {
    setMessage(feedback, "Enter the anser.", "error");
    return;
  }

  const correctAnswer = questionBank.blankAnswers[state.questionIndex];

  if (answer === correctAnswer) {
    state.scores[state.currentPlayer]++;
    setMessage(feedback, "Correct!", "success");
  } else {
    setMessage(feedback, "Wrong!", "error");
  }

  updateScoreboard();
  moveToNextTurn();
}

function moveToNextTurn() {
  setTimeout(() => {
    if (state.currentPlayer === 0) {
      state.currentPlayer = 1;
      renderQuestion();
      return;
    }

    state.currentPlayer = 0;
    state.questionIndex++;

    if (state.phase === "mc") {
      if (state.questionIndex < questionBank.mcQuestions.length) {
        renderQuestion();
      } else {
        state.phase = "blank";
        state.questionIndex = 0;
        renderQuestion();
      }
    } else {
      if (state.questionIndex < questionBank.blankQuestions.length) {
        renderQuestion();
      } else {
        showResults();
      }
    }
  }, 800);
}

function showResults() {
  const totalQuestions =
    questionBank.mcQuestions.length + questionBank.blankQuestions.length;

  finalScore1.textContent = `Player 1: ${state.scores[0]} / ${totalQuestions}`;
  finalScore2.textContent = `Player 2: ${state.scores[1]} / ${totalQuestions}`;

  if (state.scores[0] > state.scores[1]) {
    winnerText.textContent = "Player 1 Wins! Congratulations.";
  } else if (state.scores[1] > state.scores[0]) {
    winnerText.textContent = "Player 2 Wins! Congratulations.";
  } else {
    winnerText.textContent = "It's a Draw!";
  }

  showScreen(resultScreen);
}

startBtn.addEventListener("click", resetGame);

exitBtn.addEventListener("click", () => {
  setMessage(menuMessage, "Thanks for playing! Goodbye :)", "success");
});

restartBtn.addEventListener("click", resetGame);

backMenuBtn.addEventListener("click", () => {
  clearMessage(menuMessage);
  showScreen(menuScreen);
});

submitBtn.addEventListener("click", handleSubmit);

blankInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && state.phase === "blank") {
    handleSubmit();
  }
});
