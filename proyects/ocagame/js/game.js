// Game state
let currentPlayerPosition = 0;
const totalSquares = 63; // Standard 63 squares for Juego de la Oca
let questions = []; // To store loaded questions
let currentQuestion = null;

// DOM Elements
const boardContainer = document.getElementById('board-container');
const playerPositionSpan = document.getElementById('player-position');
const rollDiceButton = document.getElementById('roll-dice-button');
const diceResultSpan = document.getElementById('dice-result');

const questionModal = document.getElementById('question-modal');
const questionTextElement = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const submitAnswerButton = document.getElementById('submit-answer-button');

const newQuestionInput = document.getElementById('new-question');
const option1Input = document.getElementById('option1'); // Correct answer
const option2Input = document.getElementById('option2');
const option3Input = document.getElementById('option3');
const option4Input = document.getElementById('option4');
const addQuestionButton = document.getElementById('add-question-button');

const csvFileInput = document.getElementById('csv-file-input');
const uploadCsvButton = document.getElementById('upload-csv-button');

const settingsButton = document.getElementById('settings-button');
const settingsPanel = document.getElementById('settings-panel');
const closeSettingsButton = document.getElementById('close-settings-button');

// --- Game Board Setup ---
function createBoard() {
    boardContainer.innerHTML = ''; // Clear previous board
    for (let i = 1; i <= totalSquares; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.id = `square-${i}`;
        square.textContent = i;
        // Add special squares later (Oca, Puente, Dados, Posada, Pozo, Laberinto, Carcel, Calavera, Fin)
        boardContainer.appendChild(square);
    }
    updatePlayerMarker();
}

function updatePlayerMarker() {
    // Remove existing player marker
    const existingMarker = boardContainer.querySelector('.player-marker');
    if (existingMarker) {
        existingMarker.classList.remove('player-marker');
    }

    // Add new player marker
    if (currentPlayerPosition > 0 && currentPlayerPosition <= totalSquares) {
        const currentSquare = document.getElementById(`square-${currentPlayerPosition}`);
        if (currentSquare) {
            currentSquare.classList.add('player-marker');
        }
    }
    playerPositionSpan.textContent = currentPlayerPosition;
}


// --- Dice Rolling ---
function rollDice() {
    const diceValue = Math.floor(Math.random() * 6) + 1;
    diceResultSpan.textContent = diceValue;
    movePlayer(diceValue);
}

// --- Player Movement ---
function movePlayer(steps) {
    const newPosition = currentPlayerPosition + steps;

    if (newPosition >= totalSquares) {
        currentPlayerPosition = totalSquares;
        updatePlayerMarker();
        alert("Congratulations! You reached the end!");
        // Reset game or other end-game logic
        resetGame();
        return;
    }

    currentPlayerPosition = newPosition;
    updatePlayerMarker();
    playerPositionSpan.textContent = currentPlayerPosition;

    // Check for special squares or question triggers
    // For now, let's assume every 5th square triggers a question
    if (currentPlayerPosition % 5 === 0 && questions.length > 0) {
        askQuestion();
    }
}

// --- Question Handling ---
function askQuestion() {
    if (questions.length === 0) {
        alert("No questions available to ask!");
        return;
    }
    currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    questionTextElement.textContent = currentQuestion.question;
    optionsContainer.innerHTML = ''; // Clear previous options

    const allOptions = [...currentQuestion.options]; // Create a mutable copy
    const correctAnswer = currentQuestion.correctAnswer; // This is the text of the correct answer

    // Shuffle options (Fisher-Yates shuffle)
    for (let i = allOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }

    allOptions.forEach(optionText => {
        const button = document.createElement('button');
        button.textContent = optionText;
        button.onclick = () => checkAnswer(optionText, correctAnswer);
        optionsContainer.appendChild(button);
    });
    questionModal.style.display = 'block';
    rollDiceButton.disabled = true; // Disable dice rolling while question is active
}

function checkAnswer(selectedOptionText, correctAnswerText) {
    questionModal.style.display = 'none';
    rollDiceButton.disabled = false; // Re-enable dice rolling

    if (selectedOptionText === correctAnswerText) {
        alert("Correct!");
        // Player can roll again or gain some advantage (optional)
    } else {
        alert(`Incorrect. The correct answer was: ${correctAnswerText}. You move back 2 spaces.`);
        movePlayer(-2); // Penalty for wrong answer
    }
    currentQuestion = null;
}


// --- Question Management ---
function addQuestionManually() {
    const question = newQuestionInput.value.trim();
    const opt1 = option1Input.value.trim(); // Correct answer
    const opt2 = option2Input.value.trim();
    const opt3 = option3Input.value.trim();
    const opt4 = option4Input.value.trim();

    if (!question || !opt1 || !opt2) {
        alert("Please provide a question, a correct answer (Option 1), and at least one other option (Option 2).");
        return;
    }

    const newQ = {
        question: question,
        options: [opt1, opt2],
        correctAnswer: opt1
    };
    if (opt3) newQ.options.push(opt3);
    if (opt4) newQ.options.push(opt4);

    questions.push(newQ);
    alert("Question added!");
    // Clear input fields
    newQuestionInput.value = '';
    option1Input.value = '';
    option2Input.value = '';
    option3Input.value = '';
    option4Input.value = '';
    console.log("Current questions:", questions);
}

function loadQuestionsFromCSV(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n').filter(row => row.trim() !== ''); // Handle potential empty lines

        try {
            const parsedQuestions = rows.map((row, index) => {
                // Assuming CSV format: Question,CorrectAnswer,Option2,Option3,Option4
                // Option3 and Option4 can be empty
                const columns = row.split(',').map(col => col.trim().replace(/^"|"$/g, '')); // Trim and remove surrounding quotes

                if (columns.length < 3) {
                    console.error(`Row ${index + 1} has too few columns: ${row}`);
                    throw new Error(`Invalid CSV format at row ${index + 1}. Each row must have at least Question, CorrectAnswer, Option2.`);
                }

                const questionText = columns[0];
                const correctAnswer = columns[1];
                const options = [correctAnswer]; // Correct answer is always the first in the options array internally

                for (let i = 2; i < columns.length; i++) {
                    if (columns[i]) { // Only add non-empty options
                        options.push(columns[i]);
                    }
                }
                 if (options.length < 2) { // Must have at least correct + 1 other
                    console.error(`Row ${index + 1} does not have enough options: ${row}`);
                    throw new Error(`Invalid CSV format at row ${index + 1}. Must have at least two options (correct + one other).`);
                }


                return {
                    question: questionText,
                    options: options, // All provided options
                    correctAnswer: correctAnswer // The text of the correct answer
                };
            });
            questions = questions.concat(parsedQuestions);
            alert(parsedQuestions.length + " questions loaded from CSV!");
            console.log("Current questions:", questions);
            csvFileInput.value = ''; // Reset file input
        } catch (error) {
            alert("Error parsing CSV: " + error.message);
            console.error("Error parsing CSV:", error);
            csvFileInput.value = ''; // Reset file input
        }
    };
    reader.readAsText(file);
}


// --- Game Initialization and Reset ---
function resetGame() {
    currentPlayerPosition = 0;
    diceResultSpan.textContent = '-';
    questionModal.style.display = 'none';
    rollDiceButton.disabled = false;
    createBoard(); // This also calls updatePlayerMarker
    // Optionally clear questions or keep them:
    // questions = [];
    // alert("Game Reset!");
}

// Event Listeners
rollDiceButton.addEventListener('click', rollDice);
addQuestionButton.addEventListener('click', addQuestionManually);
uploadCsvButton.addEventListener('click', () => csvFileInput.click()); // Trigger file input
csvFileInput.addEventListener('change', loadQuestionsFromCSV);

settingsButton.addEventListener('click', () => {
    settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
});

closeSettingsButton.addEventListener('click', () => {
    settingsPanel.style.display = 'none';
});

submitAnswerButton.addEventListener('click', () => {
    // This button's main logic is now handled by the dynamically created option buttons.
    // However, if you want a generic submit that relies on selected radio buttons (not implemented here yet):
    // const selectedOption = document.querySelector('input[name="q_option"]:checked');
    // if (selectedOption) {
    //     checkAnswer(selectedOption.value);
    // } else {
    //     alert("Please select an answer.");
    // }
});


// Initial setup
createBoard();
// Example: Add a default question if none are loaded
if (questions.length === 0) {
    questions.push({
        question: "What is 2 + 2?",
        options: ["3", "4", "5"],
        correctAnswer: "4"
    });
     questions.push({
        question: "Capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: "Paris"
    });
}