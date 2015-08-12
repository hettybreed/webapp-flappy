// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var width = 790;
var height = 400;
var gameSpeed = 200;
var gameGravity = 200;
var jumpPower = 200;



var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', stateActions);

var score = -3;
var labelScore;
var player;
var pipes = [];
var gapSize= 100;
var gapMargin= 50;
var blockHeight= 50;
var balloons= [];
var Joker=[];

//$.get("/score", function(scores){
//    //var scores = JSON.parse(data);
//    //console.log(data);
//    console.log(scores);
//    for (var i = 0; i < scores.length; i++) {
//        $("#scoreBoard").append("<li>" + scores[i].name + ": " +
//        scores[i].score + "</li>");
//    }});
 $.get("/score", function(scores){

 console.log("Data: ",scores);
 scores.sort(function (scoreA, scoreB) {
 var difference = scoreB.score - scoreA.score;
 return difference;
 });
 for (var i = 0; i < 5; i++) {
 $("#scoreBoard").append(
 "<li>" +
 scores[i].name + ": " + scores[i].score +
 "</li>");
 }

 });

/*
 * Loads all resources for the game and gives them names.
 */

jQuery("#greeting-form").on("submit", function(event_details) {
    var greeting = "Hello ";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + name;
    jQuery("#greeting-form").hide();
    jQuery("#greeting").append("<p>" + greeting_message + "</p>");
});


function preload() {
game.load.image("playerImg","../assets/flappy_batman.png");
game.load.image("backgroundImg", "../assets/THEBATMAN.png");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("pipe","../assets/Skyscraper.png");
    game.load.audio("MUSIC","../assets/BatmanSong.mp3");
    game.load.image("balloons","../assets/Logo.png");
    game.load.image("Joker","../assets/Joker.png");
    game.load.audio("Laugh","../assets/EvilLaugh.mp3");

}

/*
 * Initialises the game. This function is only called once.
 */
function  create() {

    game.stage.setBackgroundColor("#ACFFFF");
    game.add.image(0, -50, "backgroundImg");
    game.add.text(20, 310, "DUNU NUNU NUNU NUNU BATMAN!",
        {font: "45px Consolas", fill: "#FFFFFF"});
   // game.add.sprite(50, 250, "playerImg");

    //alert(score);

    labelScore = game.add.text(20, 20, "0",{font: "45px Consolas", fill: "#FFFFFF"});
  //  player = game.add.sprite(100, 200, "playerImg");


    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
        .onDown.add(moveRight);
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
        .onDown.add(moveLeft);
    game.input.keyboard.addKey(Phaser.Keyboard.UP)
        .onDown.add(moveUp);
    game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
        .onDown.add(moveDown);

    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump, spaceHandler);



    //generate();
    game.physics.startSystem(Phaser.Physics.ARCADE);
   player = game.add.sprite(80, 200, "playerImg");
    player.scale.x = 0.8;
    player.scale.y = 0.8;
    game.physics.arcade.enable(player);
    player.anchor.setTo(0.5, 0.5);

    player.body.velocity.x = 0;
    player.body.velocity.y = -80;
    player.body.gravity.y = 900;

    pipeInterval=3;
    game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generate);

    var music = game.sound.play("MUSIC");
    music.loop = true;


    //gameGravity;

}


function clickHandler(event) {
    alert("The position is: " + event.x + "," + event.y);
    game.add.sprite(event.x, event.y, "playerImg");
    game.sound.play("score");

  //  changeScore();

}
function spaceHandler(event){
    alert("The position is: " + event.x + "," + event.y);
    game.add.sprite(event.x, event.y, "playerImg");
    game.sound.play("score");
    //changeScore();
}

function changeScore() {

   score = score+1;
    realScore = Math.max(-3, score);
    labelScore.setText(realScore.toString(),
        {font: "45px Consolas", fill: "#FFFFFF"});
}

function moveRight() {
    player.x = player.x + 10;
}
function moveLeft() {
    player.x = player.x - 10;
}
function moveUp() {
    player.y = player.y - 20;
}
function moveDown() {
    player.y = player.y + 10;
}
function generatePipe() {
    var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

    for(var y=gapStart; y > 0 ; y -= blockHeight){
        addPipeBlock(width,y - blockHeight);
    }
    for(var y = gapStart + gapSize; y < height; y += blockHeight) {
        addPipeBlock(width, y);
    }
    changeScore();
}
/*function addPipeBlock (x,y){
    var block = game.add.sprite(x,y,"pipe");
    pipes.push(block);
}*/
function playerJump() {
    player.body.velocity.y = -250;
    jumpPower;
}
function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x,y,"pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -90;
}
function toolow (){
    if (player.y > 400)
        gameOver();
}

function generateBalloons() {
    var bonus = game.add.sprite(width, height, "balloons");
    balloons.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -200;
    bonus.body.velocity.y = -game.rnd.integerInRange(60, 100);
    console.log("balloon");

}

function generateJoker(){
    var bonus=game.add.sprite(width, 0, "Joker");

    Joker.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x= -75;
    bonus.body.velocity.y= game.rnd.integerInRange(60, 100);
    console.log("Joker");

}
function generate() {
    var diceRoll = game.rnd.integerInRange(1, 10);
    if(diceRoll==1) {
        generateBalloons();
    } if(diceRoll==2) {
        generateJoker();
    } else {
        generatePipe();
    }
}

function update() {
    for(var index=0; index<pipes.length; index++) {
        game.physics.arcade
            .overlap(player,
            pipes[index],
            gameOver);
    }
    for(var index=0; index<Joker.length; index++) {
        game.physics.arcade
            .overlap(player,
            Joker[index],
            gameOver);
    }

    for(var index=0; index<balloons.length; index++) {
        game.physics.arcade
            .overlap(player,
            balloons[index],
            function() {
                score = score + 2;
                labelScore.setText(score.toString(),
                    {font: "45px Consolas", fill: "#FFFFFF"});
                balloons[index].kill();
            });
    }
        player.rotation += 1;
        player.rotation = Math.atan(player.body.velocity.y / 650);
        toolow();
        if (player.y < 0) {
            gameOver();

            gameSpeed;
        }
    }

function scoreadd (index){
    console.log(index);
    score = score+2;
    balloons[index].kill();
}
    //game.paused<(true)>;
/*function keyDown(e) {
    if (e.keyCode == 80) pauseGame();
}

function pauseGame() {
    if (!gamePaused) {
        game = clearTimeout(game);
        gamePaused = true;
    } else if (gamePaused) {
        game = setTimeout(gameLoop, 1000 / 30);
        gamePaused = false;
    }
}*/
function changeGravity(g) {
    gameGravity += g;
    player.body.gravity.y = gameGravity;
}

function gameOver(){
    //location.reload();
    game.state.restart();
    game.destroy();
    $("#greeting").show();

    $("#score").val(score.toString());
    gameGravity = 200;

}


function isEmpty(str) {
    return (!str || 0 === str.length);
}

//if(isEmpty(fullName)) {
//    response.send("Please make sure you enter your name.");
//}
