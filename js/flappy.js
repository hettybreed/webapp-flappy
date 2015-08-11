// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

var score = -3;
var labelScore;
var player;
var pipes = [];



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
game.load.image("backgroundImg", "../assets/THEBATMAN.jpg");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("pipe","../assets/Skyscraper.png")
    game.load.audio("MUSIC","../assets/BatmanSong.mp3")
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



    generatePipe();
    game.physics.startSystem(Phaser.Physics.ARCADE);
   player = game.add.sprite(80, 200, "playerImg");
    player.scale.x = 0.8;
    player.scale.y = 0.8;
    game.physics.arcade.enable(player);

    player.body.velocity.x = 40;
    player.body.velocity.y = -80;
    player.body.gravity.y = 900;

    pipeInterval=3;
    game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generatePipe);

    var music = game.sound.play("MUSIC");
    music.loop = true;

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
    changeScore();
}

function changeScore() {

   score = score+1;
    realScore = Math.max(0, score);
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
    var gapStart = game.rnd.integerInRange(1, 5);
        var gap = game.rnd.integerInRange(1 ,5);


    for (var count=0; count<8; count++) {
        if (count != gap && count != gap+1) {
            addPipeBlock(800, count*50);}}

    changeScore();
}
/*function addPipeBlock (x,y){
    var block = game.add.sprite(x,y,"pipe");
    pipes.push(block);
}*/
function playerJump() {
    player.body.velocity.y = -250;
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
/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    for(var index=0; index<pipes.length; index++){
        game.physics.arcade
            .overlap(player,
        pipes[index],
        gameOver);
}
toolow();
}

function gameOver(){
    //location.reload();
    game.destroy();
    $("#greeting").show();
    $("#score").val(score.toString());

}
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

function isEmpty(str) {
    return (!str || 0 === str.length);
}
if(isEmpty(fullName)) {
    response.send("Please make sure you enter your name.");
}
