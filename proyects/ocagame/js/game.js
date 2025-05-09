// Game state
let currentPlayerPosition = 0;
const totalSquares = 63;
let questions = [];
let currentQuestion = null;
let extraTurn = false;

const OCA_SQUARES = [5, 9, 14, 18, 23, 27, 32, 36, 41, 45, 51, 54, 59, 63];
const PUENTE_SQUARES = { 15: 30, 30: 15 };
const CALAVERA_SQUARE = 58;
const START_SQUARE = 1;
const FINISH_SQUARE = 63;
const ANIMATION_STEP_DELAY = 300; // ms for animation speed

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

// Board layout for an 8x12 table spiral with a 2x6 empty center
const boardCellsLayout = [
    [  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12],
    [ 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 13],
    [ 35,  0,  0,  0,  0,  0,  0,  0,  0,  0, 47, 14],
    [ 34, 63,  0,  0,  0,  0,  0,  0,  0,  0, 48, 15],
    [ 33, 62,  0,  0,  0,  0,  0,  0,  0,  0, 49, 16],
    [ 32, 61,  0,  0,  0,  0,  0,  0,  0,  0, 50, 17],
    [ 31, 59, 58, 57, 56, 55, 54, 53, 52, 51, 60, 18],
    [ 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19]
];

// --- Game Board Setup ---
function createBoard() {
    boardContainer.innerHTML = ''; // Clear previous board
    const table = document.createElement('table');
    table.classList.add('game-board');

    boardCellsLayout.forEach(rowData => {
        const tr = document.createElement('tr');
        rowData.forEach(cellNumber => {
            const td = document.createElement('td');
            td.classList.add('square');
            if (cellNumber > 0) {
                td.id = `square-${cellNumber}`;
                td.textContent = cellNumber;

                if (OCA_SQUARES.includes(cellNumber)) {
                    td.classList.add('square-oca');
                    if (cellNumber === FINISH_SQUARE) td.classList.add('square-fin');
                } else if (PUENTE_SQUARES.hasOwnProperty(cellNumber)) {
                    td.classList.add('square-puente');
                } else if (cellNumber === CALAVERA_SQUARE) {
                    td.classList.add('square-calavera');
                } else if (cellNumber === START_SQUARE && currentPlayerPosition === 0) { // Initial start before any move
                    td.classList.add('square-start');
                } else if (cellNumber === FINISH_SQUARE) {
                    td.classList.add('square-fin');
                }
                else {
                    td.classList.add('square-normal');
                }
            } else {
                td.classList.add('square-empty'); // For empty cells in layout
            }
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    boardContainer.appendChild(table);
    updatePlayerMarker();
}

function updatePlayerMarker(positionToMark = currentPlayerPosition) {
    // Remove existing player marker
    boardContainer.querySelectorAll('.player-marker').forEach(marker => marker.classList.remove('player-marker'));

    // Add new player marker if the square exists
    if (positionToMark >= START_SQUARE && positionToMark <= FINISH_SQUARE) {
        const currentSquare = document.getElementById(`square-${positionToMark}`);
        if (currentSquare) { // Check if the square element exists on the board
            currentSquare.classList.add('player-marker');
        }
    }
    // Update the text span to reflect the (potentially animated) position
    playerPositionSpan.textContent = positionToMark === 0 ? "Inicio" : positionToMark;
}

// --- Dice Rolling ---
function rollDice() {
    if (rollDiceButton.disabled) return;
    rollDiceButton.disabled = true; // Disable button during roll and animation

    if (extraTurn) {
        extraTurn = false;
    }

    const diceValue = Math.floor(Math.random() * 6) + 1;
    diceResultSpan.textContent = diceValue;

    let initialLogicalPos = currentPlayerPosition; // This is the position before the current roll
    let targetPosAfterDiceRoll = initialLogicalPos === 0 ? diceValue : initialLogicalPos + diceValue;

    if (targetPosAfterDiceRoll > FINISH_SQUARE) {
        alert(`Tirada (${diceValue}) demasiado alta. Te quedas en la casilla ${initialLogicalPos === 0 ? 'Inicio' : initialLogicalPos}.`);
        diceResultSpan.textContent = `${diceValue} (Demasiado alto)`;
        if (!extraTurn) { 
             rollDiceButton.disabled = false;
        } else {
            rollDiceButton.disabled = false;
        }
        return;
    }

    animateDiceMove(initialLogicalPos, targetPosAfterDiceRoll, initialLogicalPos); // Pass initialLogicalPos as positionBeforeThisRoll
}

// --- Player Movement Animation ---
function animateDiceMove(startPos, endPos, positionBeforeThisRoll) { // Added positionBeforeThisRoll
    let visualPath = [];
    if (startPos === 0) { // Moving from off-board ("Inicio")
        for (let i = 1; i <= endPos; i++) {
            visualPath.push(i);
        }
    } else { // Moving from an on-board square
        for (let i = startPos + 1; i <= endPos; i++) {
            visualPath.push(i);
        }
    }

    let currentPathIndex = 0;

    function stepAnimation() {
        if (currentPathIndex >= visualPath.length) {
            currentPlayerPosition = endPos; 
            updatePlayerMarker(); 
            handleSquareLanding(positionBeforeThisRoll); // Pass positionBeforeThisRoll here
            return;
        }

        let squareToLightUp = visualPath[currentPathIndex];
        updatePlayerMarker(squareToLightUp); // Visually move marker to this step in path

        currentPathIndex++;
        setTimeout(stepAnimation, ANIMATION_STEP_DELAY);
    }

    if (visualPath.length > 0) {
        stepAnimation();
    } else { 
        currentPlayerPosition = endPos;
        updatePlayerMarker();
        handleSquareLanding(positionBeforeThisRoll); // Pass positionBeforeThisRoll here
    }
}

// --- Player Movement ---
function movePlayer(steps) {
    let targetPosition = currentPlayerPosition === 0 ? steps : currentPlayerPosition + steps;

    if (targetPosition > FINISH_SQUARE) {
        alert(`Movimiento (${steps}) demasiado alto. Te quedas en la casilla ${currentPlayerPosition}.`);
        return;
    }
     if (targetPosition < START_SQUARE && targetPosition !== 0) { // e.g. movePlayer(-2) from square 1
        targetPosition = START_SQUARE;
    }

    currentPlayerPosition = targetPosition;
    updatePlayerMarker(); 

    if (currentPlayerPosition === FINISH_SQUARE) {
        if (!OCA_SQUARES.includes(currentPlayerPosition) || currentPlayerPosition !== FINISH_SQUARE) {
             alert("¡Felicidades! ¡Has ganado!");
             resetGame();
             return;
        }
    }
}

// --- Square Effects ---
function findNextOca(currentOcaPos) {
    if (currentOcaPos === FINISH_SQUARE) return FINISH_SQUARE; // Already at the final Oca

    const currentIndex = OCA_SQUARES.indexOf(currentOcaPos);
    if (currentIndex < OCA_SQUARES.length - 1) {
        return OCA_SQUARES[currentIndex + 1];
    }
    return currentOcaPos; // Should not happen if 63 is the last Oca
}

function handleSquareLanding(positionBeforeThisRoll) { // Added positionBeforeThisRoll
    const pos = currentPlayerPosition;
    updatePlayerMarker(); 

    if (OCA_SQUARES.includes(pos)) {
        const nextOca = findNextOca(pos);
        alert(`¡Oca en ${pos}! De oca a oca y tiro porque me toca. Vas a la casilla ${nextOca}.`);
        currentPlayerPosition = nextOca;
        updatePlayerMarker();
        extraTurn = true;
        rollDiceButton.disabled = false; // Enable for extra turn

        if (currentPlayerPosition === FINISH_SQUARE) {
            alert("¡Felicidades! ¡Has ganado llegando a la Oca final!");
            resetGame();
        }
    } else if (PUENTE_SQUARES.hasOwnProperty(pos)) {
        const targetPuente = PUENTE_SQUARES[pos];
        alert(`¡Puente en ${pos}! Cruzas a la casilla ${targetPuente}.`);
        currentPlayerPosition = targetPuente;
        updatePlayerMarker();
        rollDiceButton.disabled = false;
    } else if (pos === CALAVERA_SQUARE) {
        alert(`¡Calavera en ${pos}! Vuelves a la casilla inicial (1).`);
        currentPlayerPosition = START_SQUARE;
        updatePlayerMarker();
        rollDiceButton.disabled = false;
    } else if (pos > 0 && pos < FINISH_SQUARE) { 
        if (questions.length > 0) {
            askQuestion(positionBeforeThisRoll); // Pass positionBeforeThisRoll here
        } else {
            alert("Casilla normal. No hay preguntas cargadas.");
            rollDiceButton.disabled = false;
        }
    } else {
        rollDiceButton.disabled = false;
    }
}

// --- Question Handling ---
function askQuestion(positionBeforeThisRoll) { // Added positionBeforeThisRoll
    if (questions.length === 0) {
        alert("No hay preguntas disponibles.");
        rollDiceButton.disabled = false;
        return;
    }
    rollDiceButton.disabled = true; 
    currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    currentQuestion.positionBeforeRoll = positionBeforeThisRoll; // Store the position
    questionTextElement.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';

    const allOptions = [...currentQuestion.options];
    const correctAnswer = currentQuestion.correctAnswer;

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
}

function checkAnswer(selectedOptionText, correctAnswerText) {
    questionModal.style.display = 'none';

    if (selectedOptionText === correctAnswerText) {
        alert("¡Correcto! Permaneces en la casilla.");
        if (!extraTurn) { 
            rollDiceButton.disabled = false;
        } else {
            alert("¡Tienes un turno extra por la Oca! Tira el dado de nuevo.");
            rollDiceButton.disabled = false; 
        }
    } else {
        alert(`Incorrecto. La respuesta correcta era: ${correctAnswerText}. Vuelves a la casilla desde donde lanzaste el dado.`);
        // Retrieve the position from before the roll that led to this question
        let returnPosition = currentQuestion.positionBeforeRoll; 
        
        currentPlayerPosition = returnPosition; // Go back to where the dice was rolled from
        updatePlayerMarker(); 

        if (!extraTurn) {
            rollDiceButton.disabled = false;
        } else {
             alert("¡Tienes un turno extra por la Oca (a pesar del error)! Tira el dado de nuevo.");
             rollDiceButton.disabled = false; 
        }
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
                const columns = row.split(',').map(col => col.trim().replace(/^"|"$/g, ''));

                if (columns.length < 3) {
                    console.error(`Row ${index + 1} has too few columns: ${row}`);
                    throw new Error(`Invalid CSV format at row ${index + 1}. Each row must have at least Question, CorrectAnswer, Option2.`);
                }

                const questionText = columns[0];
                const correctAnswer = columns[1];
                const options = [correctAnswer];

                for (let i = 2; i < columns.length; i++) {
                    if (columns[i]) {
                        options.push(columns[i]);
                    }
                }
                if (options.length < 2) {
                    console.error(`Row ${index + 1} does not have enough options: ${row}`);
                    throw new Error(`Invalid CSV format at row ${index + 1}. Must have at least two options (correct + one other).`);
                }

                return {
                    question: questionText,
                    options: options,
                    correctAnswer: correctAnswer
                };
            });
            questions = questions.concat(parsedQuestions);
            alert(parsedQuestions.length + " questions loaded from CSV!");
            console.log("Current questions:", questions);
            csvFileInput.value = '';
        } catch (error) {
            alert("Error parsing CSV: " + error.message);
            console.error("Error parsing CSV:", error);
            csvFileInput.value = '';
        }
    };
    reader.readAsText(file);
}

// --- Game Initialization and Reset ---
function resetGame() {
    currentPlayerPosition = 0; // Player is at "start", before square 1
    diceResultSpan.textContent = '-';
    questionModal.style.display = 'none';
    rollDiceButton.disabled = false;
    extraTurn = false;
    createBoard(); // This also calls updatePlayerMarker for position 0
}

// Event Listeners
rollDiceButton.addEventListener('click', rollDice);
addQuestionButton.addEventListener('click', addQuestionManually);
uploadCsvButton.addEventListener('click', () => csvFileInput.click());
csvFileInput.addEventListener('change', loadQuestionsFromCSV);

settingsButton.addEventListener('click', () => {
    settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
});

closeSettingsButton.addEventListener('click', () => {
    settingsPanel.style.display = 'none';
});

submitAnswerButton.addEventListener('click', () => {
    // This button's main logic is now handled by the dynamically created option buttons.
});

// Initial setup
createBoard();
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