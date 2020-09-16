// Author: Haven Wilding
// This program will:
//     (a) create a Contestant from user input
//     (b) create a song title guessing game
//     (c) allow users to make guesses by inputting letters
//     (d) check those guesses against the predetermined song title
//     (e) keep track of guesses and games played
//     (f) ultimately show results of all contestants who played the game

// Global variables
// This array contains the songs with spaces removed
let asSongs = ["rocklobster", "peoplearepeople", "onceinalifetime", "sweetdreams", "missionaryman",
"safetydance", "onlyalad", "whipit", "99redballoons"];
var aoContestant = [];
var aoGamesPlayed = [];
var sCharAvail = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
var sCharUsed = "";
var titleIndex;
var songChoice = "";
var songHidden = "";

// Initialize classes
class GamesPlayed {
    guessCount;
    finishedGame;

    constructor() {
        this.guessCount = 0;
        this.finishedGame = false;
    }
}

class Person {
    firstname;
    lastname;
    age;
    
    constructor(firstname, lastname) {
        this.firstname = firstname;
        this.lastname = lastname;
    }
}

class Contestant extends Person {
    numGamesPlayed;
    totalGuesses;
    gamesPlayed = new GamesPlayed();

    constructor(numGamesPlayed, totalGuesses, firstname, lastname) {
        super(firstname, lastname)
        this.numGamesPlayed = 0;
        this.totalGuesses = 0;
    }

    getFullName() {
        return this.firstname + " " + this.lastname
    }

    showResults() {
        if (this.gamesPlayed.finishedGame) {
            return this.getFullName() + " has made " + this.gamesPlayed.guessCount + " guesses. <br>"
        }
        else {
            return "<strong>" + this.getFullName() + " has not finished a game.</strong> <br>"
        }
    }
}

function resetMe() {
    // Reset inputs
    localStorage.clear();
    aoContestant = [];
    sCharAvail = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    sCharUsed = "";
    songChoice = "";
    songHidden = "";

    // Show and hide appropriate HTML elements
    document.getElementById("btnPlayGame").style.display = "block";
    document.getElementById("btnPlayAgainSame").style.display = "none";
    document.getElementById("btnPlayAgainDiff").style.display = "none";
    document.getElementById("displayTitleName").style.display = "none";
    document.getElementById("titleNote").style.display = "none";
    document.getElementById("fsAvailable").style.display = "none";
    document.getElementById("fsUsed").style.display = "none";
    document.getElementById("fsPlay").style.display = "none"; 
}

//also "Play Game w/ Diff User"
function playGame() {
    var oContestant = new Contestant();
    var first, last;

    // Collect user input
    do {
        first = prompt("Enter first name:");
        oContestant.firstname = first;
    } while (oContestant.firstname == "");

    do {
        last = prompt("Enter last name:");
        oContestant.lastname = last;
    } while (oContestant.lastname == "");

    aoContestant.push(oContestant);

    // Show and hide appropriate HTML elements
    document.getElementById("btnPlayGame").style.display = "none";
    document.getElementById("displayTitleName").style.display = "block";
    document.getElementById("titleNote").style.display = "block";
    document.getElementById("fsAvailable").style.display = "block";
    document.getElementById("fsUsed").style.display = "block";
    document.getElementById("fsPlay").style.display = "block";
    document.getElementById("btnPlayAgainSame").style.display = "none";
    document.getElementById("btnPlayAgainDiff").style.display = "none";

    // Display letters
    document.getElementById("availableChars").innerHTML = sCharAvail;
    document.getElementById("usedChars").innerHTML = sCharUsed;

    // Pick song            
    // Random number between 1 & 9
    titleIndex = Math.floor(Math.random() * 9);
    songChoice = asSongs[titleIndex];
    console.log(songChoice);
    songChoice = songChoice.toUpperCase();
    
    // Replace with underscores
    for (var i = 0; i < songChoice.length; i++) {
        songHidden += "_";
    }
    document.getElementById("displayTitleName").innerHTML = songHidden;

    document.getElementById("inputLetter").focus();
}

function guessLetter() {
    // Check if letter is valid
    let guessLetter = document.getElementById("inputLetter").value.toUpperCase();
    let regex = /^[A-Za-z0-9]+$/
    let isValid = regex.test(document.getElementById("inputLetter").value.toUpperCase());

    if (!isValid) {
        alert("Invalid character.");
        document.getElementById("inputLetter").focus();
        document.getElementById("inputLetter").value = '';
        return;
    }
    
    // Check if letter has been used
    for (var i = 0; i < sCharUsed.length; i++) {
        if (guessLetter == sCharUsed.charAt(i)) {
            alert("Already used.");
            document.getElementById("inputLetter").focus();
            document.getElementById("inputLetter").value = '';
            return;
        }
    }
    
    // Check if letter is contained in song title
    for (i = 0; i < songChoice.length; i++) {
        if (guessLetter == songChoice.charAt(i)) {
            songHidden = songHidden.slice(0, i) + guessLetter + songHidden.slice(i + 1);
        }
    }

    // Move letter to Used
    for (i = 0; i < sCharAvail.length; i++) {
        if (guessLetter == sCharAvail.charAt(i)) {
            sCharAvail = sCharAvail.slice(0, i) + sCharAvail.slice(i + 1);
            break;
        }
    }

    // Update HTML
    document.getElementById("displayTitleName").innerHTML = songHidden;
    document.getElementById("availableChars").innerHTML = sCharAvail;
    sCharUsed += guessLetter;
    document.getElementById("usedChars").innerHTML = sCharUsed;
    aoContestant[aoContestant.length-1].gamesPlayed.guessCount++;
    document.getElementById("inputLetter").focus();
    document.getElementById("inputLetter").value = '';

    // Check if word has been completely guessed
    checkWin();
 }
 
 function guessTitle() {
     var finalGuess = document.getElementById("finalGuess").value;
 
     // If final guess is correct, add 1 to guess count, reveal song title, check win
     if (finalGuess.toUpperCase() == songChoice.toUpperCase()) {
         aoContestant[aoContestant.length-1].gamesPlayed.guessCount++;
         songHidden = songChoice;
         // Update HTML
         document.getElementById("displayTitleName").innerHTML = songChoice; //songHidden;
         checkWin();
     }
    //  If incorrect, add 26, reveal song title, and check win
     else {
         aoContestant[aoContestant.length-1].gamesPlayed.guessCount += 26;
         document.getElementById("displayTitleName").innerHTML = songChoice;
         checkWin();
     }
 }

 function checkWin() {
    // Redefine oContestant to be in scope for this function
    var oContestant = aoContestant[aoContestant.length-1];

    // Give appropriate alert depending on gameplay, then initiate end of game
    if ((songHidden.search("_") == "-1") && oContestant.gamesPlayed.guessCount < 26) {
        alert("Well done! You solved it with " + oContestant.gamesPlayed.guessCount + " guesses!");
        endGame();
        }
    else if ((songHidden != songChoice) && oContestant.gamesPlayed.guessCount >= 26) {
        alert("You took too many guesses.");
        endGame();
    }
}

function endGame() {
    var oContestant = aoContestant[aoContestant.length-1];
    oContestant.gamesPlayed.finishedGame = true;
    oContestant.totalGuesses += oContestant.gamesPlayed.guessCount;
    oContestant.numGamesPlayed++;
    
    // Reset gameplay
    sCharAvail = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    sCharUsed = "";
    document.getElementById("inputLetter").value = '';
    document.getElementById("availableChars").innerHTML = sCharAvail;
    document.getElementById("usedChars").innerHTML = sCharUsed;
    document.getElementById("fsAvailable").style.display = "none";
    document.getElementById("fsUsed").style.display = "none";
    document.getElementById("fsPlay").style.display = "none"; 
    document.getElementById("btnPlayAgainSame").style.display = "block";
    document.getElementById("btnPlayAgainDiff").style.display = "block";

    // Reset inputs
    localStorage.clear();
    sCharAvail = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    sCharUsed = "";
    songChoice = "";
    songHidden = "";
 }

 function sameUser() {
    // Show and hide appropriate HTML elements
    document.getElementById("btnPlayGame").style.display = "none";
    document.getElementById("displayTitleName").style.display = "block";
    document.getElementById("titleNote").style.display = "block";
    document.getElementById("fsAvailable").style.display = "block";
    document.getElementById("fsUsed").style.display = "block";
    document.getElementById("fsPlay").style.display = "block";
    document.getElementById("btnPlayAgainSame").style.display = "none";
    document.getElementById("btnPlayAgainDiff").style.display = "none";
    document.getElementById("finalGuess").value = "";

    // Display letters
    document.getElementById("availableChars").innerHTML = sCharAvail;
    document.getElementById("usedChars").innerHTML = sCharUsed;

    // Pick song            
    // Random number between 1 & 9
    titleIndex = Math.floor(Math.random() * 9);
    songChoice = asSongs[titleIndex];
    console.log(songChoice);
    songChoice = songChoice.toUpperCase();
    
    // Replace with underscores
    for (var i = 0; i < songChoice.length; i++) {
        songHidden += "_";
    }
    document.getElementById("displayTitleName").innerHTML = songHidden;

    document.getElementById("inputLetter").focus();
}


function showGames() {
    // Bubble sort
    var oTemp 
    for (var i = 0; i < aoContestant.length; i++) {
        for (var j = 0; j < aoContestant.length - 1; j++) {
            if (aoContestant[j].totalGuesses < aoContestant[j+1].totalGuesses) {
                let oTemp = aoContestant[j];
                aoContestant[j] = aoContestant[j+1];
                aoContestant[j+1] = oTemp;
            }
        }
    }     
    // Create output string 
    var sOutput = "";
    aoContestant.forEach(obj => { sOutput += (obj.showResults()) }); 

    // Store to local storage
    window.open("WGOutput.html");        
        localStorage.setItem("output", sOutput);
}