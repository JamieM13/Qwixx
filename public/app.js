let socket = io();

window.addEventListener('load', function () {

    //Open and connect socket

    //Listen for confirmation of connection
    socket.on('connect', function () {
        console.log("Connected");
    });

    createScoreCard(1);
    createScoreCard(2);
    createScoreCard(3);
    createScoreCard(4);


    // //Listen for messages named 'msg' from the server
    socket.on('msg', function (data) {
        console.log("Message arrived!");
        console.log(data);
        document.getElementById('player' + data.currentPlayer).appendChild(
            document.getElementById('diceButtons')
        );
        playerCount = data.currentPlayer;
    });

    socket.on('updateMarks', function (id) {
        document.getElementById(id).innerHTML = "X";
        hideSkips(id);
    });

    socket.on('updateUnMarks', function (id) {
        // id = this.id;
        idParts = id.split('_');
        player = idParts[0];
        i = idParts[1];
        j = idParts[2];
        document.getElementById(id).innerHTML = buttonText(i, j);
        reverseMove(id);
    })
});

function createScoreCard(player) {
    let scoreCard = [];
    let myScoreCard = document.createElement('table');
    scoreCard.push({
        color: 'red',
        class: 'redRow',
    });
    scoreCard.push({
        color: 'yellow',
        class: 'yelRow',
    });
    scoreCard.push({
        color: 'green',
        class: 'greenRow',
    });
    scoreCard.push({
        color: 'blue',
        class: 'blueRow',
    });
    for (i = 0; i < scoreCard.length; i++) {
        let row = document.createElement('tr');
        row.className = scoreCard[i].class;
        myScoreCard.appendChild(row);
        if (i < 5) {
            for (j = 2; j < 14; j++) {
                let cell = document.createElement('td');
                let button = document.createElement('button');
                button.innerHTML = buttonText(i, j);
                button.id = player + "_" + i + "_" + j;
                button.addEventListener("click", markButton);
                cell.appendChild(button);
                row.appendChild(cell);
            }
        }
    }
    document.getElementById('player' + player).appendChild(myScoreCard);
}

function buttonText(i, j) {
    if (i > 1) {
        num = 14 - j;
    } else {
        num = j;
    }
    if (j == 13) {
        num = "lock row";
    }
    return num;
}


function markButton() {
    console.log("clicked button " + this.id);
    let id = this.id;
    let idParts = id.split('_');
    let player = idParts[0];
    let i = idParts[1];
    let j = idParts[2];

    if (this.innerHTML == "X") {
        this.innerHTML = buttonText(i, j);
        reverseMove(this.id);
        socket.emit('unMarks', id);
    } else {
        this.innerHTML = "X";
        hideSkips(this.id);
        socket.emit('marks', id);
    }
}

function hideSkips(id){
    idParts = id.split('_');
    player = idParts[0];
    i = idParts[1];
    j = idParts[2];
    for (j = idParts[2]; j > 1; j--) {
        let button = document.getElementById(player + '_' + i + '_' + j);
        if (button.innerHTML == 'X') {
            button.style.visibility = "visible";
        } else {
            button.style.visibility = "hidden";
        }

    }
}

function reverseMove(id){
    idParts = id.split('_');
    player = idParts[0];
    i = idParts[1];
    j = idParts[2];
    for (j = idParts[2] - 1; j > 1; j--) {
        let button = document.getElementById(player + '_' + i + '_' + j);
        if (button.innerHTML == 'X') {
            break;
        } else {
            button.style.visibility = "visible";
        }

    }
}



let playerCount = 1;
let player = playerCount;
let die1 = document.getElementById('firstDie');
let die2 = document.getElementById('secondDie');
let die3 = document.getElementById('thirdDie');
let die4 = document.getElementById('fourthDie');
let die5 = document.getElementById('fifthDie');
let die6 = document.getElementById('sixthDie');
let roll = document.getElementById('rollDice');
let pass = document.getElementById('passDice');
let rollStatus = true;
let passStatus = false;
pass.style.visibility = "hidden";


roll.addEventListener("click", rollClicked);
pass.addEventListener("click", passClicked);

function rollClicked() {
    throwDice();
    changeRollStatus();
    showDice();
}

function passClicked() {
    resetDice();
    changePassStatus();

}

function throwDice() {
    //set the variables representing each die equal to a random number
    let diceNums = {
        d1: Math.floor(Math.random() * 6) + 1,
        d2: Math.floor(Math.random() * 6) + 1,
        d3: Math.floor(Math.random() * 6) + 1,
        d4: Math.floor(Math.random() * 6) + 1,
        d5: Math.floor(Math.random() * 6) + 1,
        d6: Math.floor(Math.random() * 6) + 1
    }
    console.log(diceNums);
    socket.emit('diceRolled', diceNums);
}

function showDice() {

    // die1.innerHTML = diceNums[diceNums.length].dieOne;
}

function resetDice() {
    diceNums = {
        d1: "X",
        d2: "X",
        d3: "X",
        d4: "X",
        d5: "X",
        d6: "X"
    }
    socket.emit('diceRolled', diceNums);
}

function changeRollStatus() {
    console.log("pressed the roll button");
    console.log(rollStatus);
    rollStatus = !rollStatus;
    if (rollStatus == true) {
        console.log("dont show roll button");
        roll.style.visibility = "visible";
        pass.style.visibility = "hidden";

    } else {
        console.log("dont show roll");
        roll.style.visibility = "hidden";
        pass.style.visibility = "visible";
    }
    socket.emit('msg', 'roll');
}

function changePassStatus() {
    console.log("pressed the pass button");
    console.log(passStatus);
    passStatus = !passStatus;
    playerCount++;
    if (playerCount > 4) {
        playerCount = 1;
    }
    document.getElementById('player' + playerCount).appendChild(
        document.getElementById('diceButtons')
    );

    changeRollStatus();

    console.log(playerCount);
    let data = { "currentPlayer": playerCount };
    socket.emit('msg', data);
}

let hideRules = document.getElementById('hideRules');
let showRules = document.getElementById('showRules');
let rules = document.getElementById('rules');
hideRules.addEventListener("click", hideTheRules());
showRules.addEventListener("click", showTheRules());
rules.style.visibility = "visible";

function hideTheRules() {
    rules.style.visibility = "hidden";
}

function showTheRules() {
    rules.style.visibility = "visible";
}


socket.on('updateDice', function (diceNums) {
    console.log("update dice " + diceNums);
    die1.innerHTML = diceNums.d1;
    die2.innerHTML = diceNums.d2;
    die3.innerHTML = diceNums.d3;
    die4.innerHTML = diceNums.d4;
    die5.innerHTML = diceNums.d5;
    die6.innerHTML = diceNums.d6;

});