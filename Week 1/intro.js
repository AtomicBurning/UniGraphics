function setupConsoleOutput(elementId) {
  const output = document.getElementById(elementId);

  function write(args) {
    const line = document.createElement("div");
    line.textContent = [...args].join(" ");
    output.appendChild(line);
  }
  console.log = (...args) => write(args);
}

setupConsoleOutput("console-output");
console.log("Lab 1 - Intro to JavaScript\n---------------------------");


//Variables
console.log("\nVariables\n---------------");
let score;
score = 10;
console.log("score: " + score);
score += 20;
console.log("score: " + score);


//const lives = 3; //TypeError - cannot change the value of a const
let lives = 3;
lives = 1;
console.log("lives: " + lives);

let myVariable;
console.log(`\nThe assigned value of myVariable is ${myVariable}
The data type of myVariable is ${typeof(myVariable)}`);

myVariable = 10;
console.log(`\nThe assigned value of myVariable is ${myVariable}
The data type of myVariable is ${typeof(myVariable)}`);

myVariable = "level one";
console.log(`\nThe assigned value of myVariable is ${myVariable}
The data type of myVariable is ${typeof(myVariable)}`);


//Math Library
console.log("\nMath Library\n----------------");
const angleInDegrees = 90;
const angleInRadians = angleInDegrees * (Math.PI / 180);
console.log(`${angleInDegrees} degrees is ${angleInRadians.toFixed(4)} radians`);
console.log(`cos(${angleInDegrees} degrees) = ` + Math.cos(angleInRadians));


//Arrays
console.log("\nArrays\n--------------");
const colours = ["red", "green", "blue"];
console.log("colours = " + colours);
console.log(`The colours array contains ${colours.length} values`);

colours[1] = 2; //Haven't changed type of array
console.log("colours = ", colours);
console.log("The first two values of the colours array are: " + colours.slice(0, 2));

colours.push(3.1416);
console.log("colours = " + colours);

const moreColours = ["black", "white"];
const concatenatedArray = colours.concat(moreColours);
console.log("concatenatedArray = " + concatenatedArray);


//Objects
console.log("\nObjects\n----------------");

const player =
{
    name: "Mario",
    lives: 3,
    score: 0
};

console.log("Name: " + player.name);
console.log("Lives: " + player["lives"]);

player.powerUp = "super";
player["score"] += 10;
console.log("Power up: " + player.powerUp);
console.log("Score: " + player.score);

const enemies = 
[
    { name: "Goomba", hitpoints: 1},
    { name: "Koopa Troopa", hitpoints: 2}
];


//Conditional statements
console.log("\nConditional statements\n-------------------");

//Power up state
if (player.powerUp === "fire")
    console.log(`${player.name} can throw fireballs`);
else if (player.powerUp === "super")
    console.log(`${player.name} is bigger and can break blocks`);
else
    console.log(`${player.name} is small`);

//Enemy interactions
const jumpedOnEnemy = true;
const enemyIndex = 1;

if (jumpedOnEnemy && enemies[enemyIndex].hitpoints <= 1)
{
    enemies[enemyIndex].hitpoints--;
    console.log(`${player.name} jumps on the ${enemies[enemyIndex].name} and defeats it`);
}
else if (jumpedOnEnemy)
{
    enemies[enemyIndex].hitpoints--;
    console.log(`${player.name} jumps on the ${enemies[enemyIndex].name} but it is not yet defeated`);
}
else if (player.powerUp === "fire" || player.powerUp === "super")
{
    player.powerUp = null;
    console.log(player.name + " lost their power up");
}
else
{
    player.lives--;
    console.log(player.name + " has lost a life");
}


//Loops
console.log("\nLoops\n--------");

for (let i = 0; i < enemies.length; i++)
    console.log(enemies[i].name);

console.log("\n");
let time = 0;
const maxTime = 100;

while (time < maxTime)
{
    time += 10;
    console.log("time = " + time);
}


//Functions
console.log("\nFunctions\n------------------")

function jump()
{
    console.log(player.name + " jumps!");
}

jump();

function moveRight(steps)
{
    console.log(`${player.name} moves ${steps} to the right`);
}

moveRight(5);
moveRight(10);

function checkGameOver(lives)
{
    if (lives <= 0)
        return "Game Over!";
    return "Continue playing";
}

console.log(checkGameOver(player.lives));


//Classes
console.log("\nClasses\n------------------");

class Racer
{
    constructor(name, position)
    {
        this.name = name;
        this.speed = 0;
        this.position = position;
        this.powerup = null;
    }

    accelerate()
    {
        this.speed += 5;
    }

    addPowerUp()
    {
        const powerUps =
        [
            "Mushroom",
            "Green Shell",
            "Red Shell",
            "Banana",
            "Star"
        ]

        const index = Math.floor(Math.random() * powerUps.length);
        this.powerUp = powerUps[index];
    }

    print()
    {
        console.log("\nRacer Details\n---------------");
        console.log("Name: " + this.name);
        console.log("Speed: " + this.speed);
        console.log("Position: " + this.position);
        console.log("Power up: " + this.powerUp);
    }
}

const toad = new Racer("Toad", 3);

console.log("Name: " + toad.name);
console.log("Speed: " + toad.speed);
console.log("Position: " + toad.position);
console.log("Power up: " + toad["powerUp"]);

toad.accelerate();
console.log("\nSpeed: " + toad.speed);

toad.print();

class Student
{
    constructor(name, id, course)
    {
        this.name = name;
        this.id = id;
        this.course = course;
        this.marks = [];
    }

    print()
    {
        console.log("\nStudent Information\n-------------------");
        console.log("Name: " + this.name);
        console.log("ID: " + this.id);
        console.log("Course: " + this.course);
    }
}

const students = 
[
    new Student("Ellie Willliams", 12345678, "Computer Science"),
]