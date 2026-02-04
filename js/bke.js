let currentPlayer = 'X'; // Het eerste speler is 'X' bij de start van het spel
let gameActive = true; // Het spel is actief, het spel is begonnen.

// Selecteren van HTML-elementen
const cells = document.querySelectorAll('.cell');
const resetButton = document.querySelector('.reset-button');
const speler1Hits = document.querySelector('#speler1-hits');
const speler2Hits = document.querySelector('#speler2-hits');
const speler1Wins = document.querySelector('#speler1-wins');
const speler2Wins = document.querySelector('#speler2-wins');
const speler1Losses = document.querySelector('#speler1-losses');
const speler2Losses = document.querySelector('#speler2-losses');
const messageDiv = document.querySelector('#message');
const messagePanel = document.querySelector('#message-panel');
const overlay = document.querySelector('#overlay');
const speler1NameInput = document.querySelector('#speler1-name');
const speler1DisplayName = document.querySelector('#speler1-display-name');
const startScreen = document.querySelector('#start-screen');
const gameContainer = document.querySelector('#game-container');
const startGameButton = document.querySelector('#start-game-button');

// De beginstatus van het speelbord
let board = ['', '', '', '', '', '', '', '', ''];

//Ongeldige woord / tekens
const invalidWords = ['scheldwoord', '#', '%', '$'];

// Winnende combinaties (rijen, kolommen, diagonalen)
const winningConditions = [
    [0, 1, 2], // bovenste rij
    [3, 4, 5], // middelste rij
    [6, 7, 8], // onderste rij
    [0, 3, 6], // linker kolom
    [1, 4, 7], // middelste kolom
    [2, 5, 8], // rechter kolom
    [0, 4, 8], // diagonale lijn van linksboven naar rechtsonder
    [2, 4, 6]  // diagonale lijn van rechtsboven naar linksonder
];

// Functie om de naam van de speler te controleren
function validateName(name) {
    for (let word of invalidWords) { // Controleer op elk verboden woord of teken
        if (name.includes(word)) { // Als de naam een verboden item bevat
            alert('Ongeldige naam ingevoerd.'); // Toon een foutmelding
            return false; // Naam is ongeldig
        }
    }
    return true; // Naam is geldig
}

// Functie om de naam van de speler op te slaan en weer te geven
startGameButton.addEventListener('click', () => {
    const name = speler1NameInput.value.trim(); // Haal de ingevoerde naam op en verwijder spaties
    if (validateName(name) && name !== '') { // Controleer of naam geldig en niet leeg is
        speler1DisplayName.textContent = name; // Zet de naam op het scherm
        startScreen.style.display = 'none'; // Verberg het startscherm
        gameContainer.style.display = 'flex'; // Toon het spel
    }
});

// Luister naar het klikken op de cellen
cells.forEach(cell => cell.addEventListener('click', handleCellClick)); // Elke cel krijgt een klikfunctie

// Functie om te bepalen wat er gebeurt als een cel wordt aangeklikt
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target; // Haal de aangeklikte cel op
    const clickedCellIndex = parseInt(clickedCell.id.replace('cell-', '')); // Haal het cijfer uit de ID van de cel
    if (board[clickedCellIndex] !== '' || !gameActive) { // Als de cel al is gevuld of het spel is gestopt
        return; // Doe niets
    }
    board[clickedCellIndex] = currentPlayer; // Zet het huidige symbool ('X' of 'O') op het bord
    clickedCell.innerHTML = currentPlayer; // Toon de letter in de cel
    clickedCell.classList.add(currentPlayer.toLowerCase()); // Voeg een CSS-klasse toe (x of o)
    checkResult(); // Controleer of er iemand heeft gewonnen
    if (gameActive && currentPlayer === 'O') { // Als de computer (O) aan zet is
        setTimeout(computerMove, 500); // Wacht een halve seconde en doe dan een zet
    }
}

// Bewegingsfunctie voor de computer speler
function computerMove() {
    let availableCells = []; // Lege array om vrije vakjes op te slaan
    cells.forEach((cell, index) => {
        if (board[index] === '') { // Als de cel leeg is
            availableCells.push(index); // Voeg de index toe aan de lijst
        }
    });
    if (availableCells.length > 0) { // Als er minstens één lege plek is
        const randomIndex = Math.floor(Math.random() * availableCells.length); // Kies een willekeurige cel
        const chosenCell = availableCells[randomIndex]; // Haal de gekozen index op
        board[chosenCell] = 'O'; // Zet 'O' op het bord
        cells[chosenCell].innerHTML = 'O'; // Toon 'O' in de cel
        cells[chosenCell].classList.add('o'); // Voeg de CSS-klasse toe
        checkResult(); // Controleer opnieuw het resultaat
    }
}

// Functie om de spelresultaten te controleren
function checkResult() {
    let roundWon = false; // Begin met geen winnaar
    for (let i = 0; i < winningConditions.length; i++) { // Doorloop alle winnende combinaties
        const [a, b, c] = winningConditions[i]; // Haal drie vakjes op per mogelijke winnende lijn
        if (board[a] && board[a] === board[b] && board[a] === board[c]) { // Controleer of drie dezelfde symbolen op een rij staan
            roundWon = true; // Speler heeft drie op een rij
            break; // Stop de lus als er een winnaar is
        }
    }

    // Update statistieken van de winnende speler en toon het bericht
    if (roundWon) { // Als iemand heeft gewonnen
        if (currentPlayer === 'X') { // Als de huidige speler 'X' is
            speler1Hits.textContent = parseInt(speler1Hits.textContent) + 1; // Verhoog het aantal gewonnen rondes van speler 1
            if (parseInt(speler1Hits.textContent) >= 5) { // Als speler 1 vijf rondes heeft gewonnen
                speler1Hits.textContent = 0; // Reset het ronde-aantal
                speler1Wins.textContent = parseInt(speler1Wins.textContent) + 1; // Verhoog aantal gewonnen spellen voor speler 1
                speler2Losses.textContent = parseInt(speler2Losses.textContent) + 1; // Verhoog aantal verloren spellen voor speler 2
                speler2Hits.textContent = 0;  // Reset de rondes van speler 2
                messageDiv.innerHTML = 'Speler 1 wint het spel!'; // Toon winnaar van het spel
            } else {
                messageDiv.innerHTML = 'Speler 1 wint deze ronde!'; // Toon winnaar van de ronde
            }
        } else { // Als de huidige speler 'O' is
            speler2Hits.textContent = parseInt(speler2Hits.textContent) + 1; // Verhoog het aantal gewonnen rondes van speler 2
            if (parseInt(speler2Hits.textContent) >= 5) { // Als speler 2 vijf rondes heeft gewonnen
                speler2Hits.textContent = 0; // Reset het ronde-aantal
                speler2Wins.textContent = parseInt(speler2Wins.textContent) + 1; // Verhoog aantal gewonnen spellen voor speler 2
                speler1Losses.textContent = parseInt(speler1Losses.textContent) + 1; // Verhoog aantal verloren spellen voor speler 1
                speler1Hits.textContent = 0;  // Reset de rondes van speler 1
                messageDiv.innerHTML = 'Speler 2 wint het spel!'; // Toon winnaar van het spel
            } else {
                messageDiv.innerHTML = 'Speler 2 wint deze ronde!'; // Toon winnaar van de ronde
            }
        }
        gameActive = false; // Stop het spel zodat er geen extra zetten meer kunnen worden gedaan
        showMessagePanel(); // Toon het berichtpaneel met de uitslag
        return; // Stop de functie
    }

    // Als het bord vol is en niemand heeft gewonnen
    let roundDraw = !board.includes(''); // Als er geen lege vakjes meer zijn
    if (roundDraw) {
        messageDiv.innerHTML = 'Gelijkspel!'; // Toon gelijkspel-bericht
        gameActive = false; // Stop het spel
        showMessagePanel(); // Toon het berichtpaneel
        return;
    }

    // Wissel van speler
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Functie om het berichtenpaneel weer te geven
function showMessagePanel() {
    messagePanel.style.display = 'flex'; // Maak het berichtpaneel zichtbaar
    overlay.style.display = 'block'; // Activeer de overlay op de achtergrond
}

// Functie om het spel te resetten
resetButton.addEventListener('click', function resetGame() {
    board = ['', '', '', '', '', '', '', '', '']; // Zet alle vakjes van het bord leeg
    currentPlayer = 'X'; // Speler 1 (X) begint opnieuw
    gameActive = true; // Maak het spel weer actief
    cells.forEach(cell => {
        cell.innerHTML = ''; // Verwijder de inhoud van elke cel
        cell.classList.remove('x', 'o'); // Verwijder toegevoegde CSS-klassen van de vorige ronde
    });
    messagePanel.style.display = 'none'; // Verberg het resultaatbericht
    overlay.style.display = 'none'; // Verberg de overlay-achtergrond
})

// Spelregels tonen/verbergen
const rulesButton = document.querySelector('.rules-button'); // Selecteer de knop voor de regels
const rulesPanel = document.querySelector('.rules-panel'); // Selecteer het regels-paneel

rulesButton.addEventListener('click', function() {
    if (rulesPanel.style.display === 'block') { // Als de regels al zichtbaar zijn
        rulesPanel.style.display = 'none'; // Verberg de regels
    } else {
        rulesPanel.style.display = 'block';  // Toon de regels
    }
});