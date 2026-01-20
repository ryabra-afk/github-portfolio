let inventory = "";
let gameOver = false;

function startGame() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gridBox").style.display = "grid";
    initGame();
}

function endGame(msg) {
    outputText(msg);
    gameOver = true;
}

let rooms = [], roomNum
const MAPWIDTH = 3 //number of columns

function checkInput(e) { //function runs each time key pressed

    if (e.key == "Enter") {  //checks if player pressed enter - if not: function won't run
        command = cli.textContent; // use the typed command
        cli.innerHTML = "" //clears input box so it becomes empty again
        parser(command) //sends typed command into parser() function
        e.preventDefault() //stops browser adding a new line - dw ab this
    }
}



function showRoom() { //looks up current room
    outputText("<strong>" + rooms[roomNum].name + "</strong>") //prints room name in bold where html tags embedded in tags and concatenated with +
    outputText(rooms[roomNum].description) //prints room name
    if (rooms[roomNum].exits !== "") { //only output "you can go.." if its not a death deck/gameover where exits are not defined
        outputText("<span style='color: darkgreen;'>You can go " + rooms[roomNum].exits + "</span>")
        //prints available exits
    }

}


function outputText(txt) { //takes argument txt to be displayed on screen
    // add txt to a new paragraph
    let newPara = document.createElement("p") //creates new <p> element on document
    newPara.innerHTML = txt //sets    context of <p> to whatever passed in txt
    output.appendChild(newPara) //adds a new paragraph
    newPara.scrollIntoView() //auto scrolls page for visibility
}


function parser(cmd) {
    if (gameOver) return; // checks if gameover = true - if so, function dont run so game ends
    let cmdWords = cmd.trim().toUpperCase().split(" "); // "go north" → ["GO", "NORTH"]
    let verb = cmdWords[0]; //first verb = command e.g."TAKE KEY" → verb is "TAKE"
    let noun = cmdWords.slice(1).join(" "); // keeps rest of words   ["TAKE", "SILVER", "KEY"] → noun = "SILVER KEY"switch (verb) {

    switch (verb) {

        case "NORTH": case "N":
            if (rooms[roomNum].exits.includes("N")) {
                roomNum -= MAPWIDTH;


                if (rooms[roomNum].description.includes("GAME OVER")) {
                    endGame("GAME OVER - You stepped into a fatal deck.");
                    return;
                }
                if (rooms[roomNum].name === "Escape Bay") {
                    endGame("ESCAPED: You made it. Stars guide you home - back to Earth.");
                    return;
                }
                showRoom(); //show room AFTER checks so 2 outputs not given

            } else {
                outputText("You can't go that way");
            }
            break;


        case "SOUTH": case "S":
            if (rooms[roomNum].exits.includes("S")) {
                roomNum += MAPWIDTH;


                if (rooms[roomNum].description.includes("GAME OVER")) {
                    endGame("GAME OVER - You stepped into a fatal deck.");
                    return;
                }
                if (rooms[roomNum].name === "Escape Bay") {
                    endGame("You made it. Stars guide you home.");
                    return;
                }
                showRoom();//show room AFTER checks so 2 outputs not given

            } else {
                outputText("You can't go that way");
            }
            break;


        case "EAST": case "E":
            if (rooms[roomNum].exits.includes("E")) {
                roomNum += 1;

                if (rooms[roomNum].description.includes("GAME OVER")) {
                    endGame("GAME OVER - You stepped into a fatal deck.");
                    return;
                }
                if (rooms[roomNum].name === "Escape Bay") {
                    endGame("You made it. Stars guide you home.");
                    return;
                }
                showRoom();//show room AFTER checks so 2 outputs not given

            } else {
                outputText("You can't go that way");
            }
            break;


        case "WEST": case "W":
            if (rooms[roomNum].exits.includes("W")) {
                roomNum -= 1;

                if (rooms[roomNum].description.includes("GAME OVER")) {
                    endGame("GAME OVER - You stepped into a fatal deck.");
                    return;
                }
                if (rooms[roomNum].name === "Escape Bay") {
                    endGame("You made it. Stars guide you home.");
                    return;
                }
                showRoom();//show room AFTER checks so 2 outputs not given

            } else {
                outputText("You can't go that way");
            }
            break;


        case "USE":
            if (rooms[roomNum].name === "Bio-Lab" && inventory.includes("Green Key")) {
                rooms[roomNum].exits += "S";
                outputText("You hear a hiss as the south door unlocks!");
            } else {
                outputText("A green-lit panel flashes: ACCESS DENIED.");
            }
            break;


        case "HELP": case "H":
            outputText("Commands: N, S, E, W, USE, INVENTORY, RESTART");
            break;

        case "RESTART": case "R":
            gameOver = false;
            output.innerHTML = "";
            initGame();
            break;

    }
}



function initGame() {
    inventory += "Green Key" + ","
    rooms = []; // reset rooms array

    rooms[1] = { name: "Start / Crew Quarters", exits: "SE", description: "You're in this mess - don't think about anything else just get out. Dim corridors hum with low engine vibration. Doors line both sides, identical and silent. Pick the wrong one and it opens into cold, infinite space." };
    rooms[2] = { name: "Engineering Room", exits: "WES", description: "Pipes hiss overhead and warning lights flicker nonstop. Heat radiates from reactors behind sealed bulkheads. Some doors lead to maintenance shafts… one leads straight outside." };
    rooms[3] = { name: "Storage Room", exits: "SE", description: "Crates float weightlessly where gravity flickers. Labels are faded, shadows long, everything rearranges itself. One wrong hatch drops you out into the void instantly. GAME OVER." };
    rooms[4] = { name: "Bio-Lab", exits: "S", description: "Green emergency glows replace normal lighting. Glass tanks hum with unknown lifeforms. Half the doors go to lab rooms, the other half eject contaminated waste — into space. Remember the Green Key in your inventory." }; //usng green key adds direction South which leads to exit
    rooms[5] = { name: "Navigation Array", exits: "WENS", description: "A massive viewing dome shows stars drifting past. Control panels blink with unreadable symbols. Dead-end doors open directly into star-lit nothingness." };
    rooms[6] = { name: "Deck 5", exits: "", description: "Metal grates echo every footstep. Half-dismantled escape pods hang in suspension clamps. Misread a sign and you open a door that’s actually an airlock. GAME OVER." };
    rooms[7] = { name: "Escape Bay", exits: "", description: "You trusted yourself. You focused. Now the stars guide you home — back to Earth." };
    rooms[8] = { name: "Deck 7", exits: "", description: "As soon as you step in, the door clicks shut and the hull opens beneath you. You’re ejected into the void of space. GAME OVER." };
    rooms[9] = { name: "Deck 8", exits: "", description: "The corridor seems empty, but the floor suddenly disappears. You float helplessly into the stars. GAME OVER." };

    roomNum = 1; // starting room
    showRoom();  // show start immediately
}
