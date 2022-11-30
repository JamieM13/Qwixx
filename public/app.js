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





    // /* --- Code to RECEIVE a socket message from the server --- */
    // let chatBox = document.getElementById('chat-box-msgs');

    // //Listen for messages named 'msg' from the server
    socket.on('msg', function (data) {
        console.log("Message arrived!");
        console.log(data);

        //     //Create a message string and page element
        //     let msgEl = document.createElement('p');
        //     msgEl.innerHTML = data;
        // //     //Add the element with the message to the page
        //     diceButtons.appendChild(msgEl);
        document.getElementById('player' + data.currentPlayer).appendChild(
            document.getElementById('diceButtons')
        );
        playerCount = data.currentPlayer;
    });

    socket.on('updateMarks', function(id){
        document.getElementById(id).innerHTML = "X";
    });

    // /* --- Code to SEND a socket message to the Server --- */
    // let nameInput = document.getElementById('name-input')
    // let msgInput = document.getElementById('msg-input');
    // let sendButton = document.getElementById('send-button');

    // sendButton.addEventListener('click', function () {
    //     let curName = nameInput.value;
    //     let curMsg = msgInput.value;
    //     let msgObj = { "name": curName, "msg": curMsg };

    //     //Send the message object to the server
    //     socket.emit('msg', msgObj);
    // });
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
            if (i < 2){
                for (j=2; j<14; j++){
                    let cell = document.createElement('td');
                    let button = document.createElement('button');
                    let num = j;
                    if (num == 13){
                        num = "lock row";
                    }
                    button.innerHTML = num;
                    button.id = player + "_" + i + "_" + num;
                    button.addEventListener("click", markButton);
                    cell.appendChild(button);
                    row.appendChild(cell);
                }
            } else {
                for (j=13; j>1; j--){
                    let cell = document.createElement('td');
                    let button = document.createElement('button');
                    let num = j-1;
                    if (num == 1){
                        num = "lock row";
                    }
                    button.innerHTML = num;
                    button.id = player + "_" + i + "_" + num;
                    button.addEventListener("click", markButton);
                    cell.appendChild(button);
                    row.appendChild(cell);
                }
            }
        }
        document.getElementById('player' + player).appendChild(myScoreCard);
}

function markButton(){
    console.log("clicked button " + this.id);
    this.innerHTML = "X";
    let id = this.id;
    socket.emit('marks', id);
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
    die1.innerHTML = "X";
    die2.innerHTML = "X";
    die3.innerHTML = "X";
    die4.innerHTML = "X";
    die5.innerHTML = "X";
    die6.innerHTML = "X";
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
    // socket.emit('msg', 'roll');
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

function hideTheRules(){
    rules.style.visibility = "hidden";
}

function showTheRules(){
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