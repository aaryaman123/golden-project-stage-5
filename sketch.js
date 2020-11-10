// matter.js stuff
const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;

// gamestate
var gameState=0;

// sprites
var world,engine;
var boy, runningBoy, runningBoyLeft, deadBoy, idleBoy, deadBoyImg;
var fireballAnim;
var mode1,mode2,mode3,mode4;
var fireballGrp,bulletGrp;
var score=0;
var invisibleGround;
var a=0;
var back;
var dbin, dbinImg;
var lives=3;
var spaceShip,spaceShipImg;
var backGround, bground;
var gunSound, gameOverSound;
var livesImg, live1,live2,live3;

function preload(){
    // animations & pics(i think only animations)
    fireballAnim=loadAnimation("fireball/fireball_1.png","fireball/fireball_2.png","fireball/fireball_3.png","fireball/fireball_4.png","fireball/fireball_5.png","fireball/fireball_6.png","fireball/fireball_7.png","fireball/fireball_8.png")
    idleBoy=loadAnimation("idle_boy/idle1.png","idle_boy/idle2.png","idle_boy/idle3.png","idle_boy/idle4.png","idle_boy/idle5.png","idle_boy/idle6.png","idle_boy/idle7.png","idle_boy/idle8.png","idle_boy/idle9.png","idle_boy/idle10.png","idle_boy/idle11.png","idle_boy/idle12.png","idle_boy/idle13.png","idle_boy/idle14.png","idle_boy/idle15.png");
    runningBoy=loadAnimation("running_boy/run (1).png","running_boy/run (2).png","running_boy/run (3).png","running_boy/run (4).png","running_boy/run (5).png","running_boy/run (6).png","running_boy/run (7).png","running_boy/run (8).png","running_boy/run (9).png","running_boy/run (10).png","running_boy/run (11).png","running_boy/run (12).png","running_boy/run (13).png","running_boy/run (14).png","running_boy/run (15).png");
    runningBoyLeft=loadAnimation("runningleft_boy/run (1).png","runningleft_boy/run (2).png","runningleft_boy/run (3).png","runningleft_boy/run (4).png","runningleft_boy/run (5).png","runningleft_boy/run (6).png","runningleft_boy/run (7).png","runningleft_boy/run (8).png","runningleft_boy/run (9).png","runningleft_boy/run (10).png","runningleft_boy/run (11).png","runningleft_boy/run (12).png","runningleft_boy/run (13).png","runningleft_boy/run (14).png","runningleft_boy/run (15).png");
    deadBoy=loadAnimation("dead_boy/Dead (1).png","dead_boy/Dead (2).png","dead_boy/Dead (3).png","dead_boy/Dead (4).png","dead_boy/Dead (5).png","dead_boy/Dead (6).png","dead_boy/Dead (7).png","dead_boy/Dead (8).png","dead_boy/Dead (9).png","dead_boy/Dead (10).png","dead_boy/Dead (11).png","dead_boy/Dead (12).png","dead_boy/Dead (13).png","dead_boy/Dead (14).png","dead_boy/Dead (15).png");
    deadBoyImg=loadImage("dead_boy/Dead (15).png");
    dbinImg=loadImage("dustbin.png");
    spaceShipImg=loadImage("rocket1.png");
    backGround=loadImage("background.jpg");
    gunSound=loadSound("gun.mp3");
    gameOverSound=loadSound("game-over.mp3");
    livesImg=loadImage("live.png");

}
function setup(){
    // canvas
    createCanvas(800,500);

    // definition of everything according to gamestate
    boy=createSprite(400,430,10,10);
    back=createSprite(30,75,20,20);
    back.shapeColor="red";
    boy.addAnimation("idle",idleBoy);
    boy.addAnimation("left",runningBoyLeft);
    boy.addAnimation("right",runningBoy);
    boy.addAnimation("die",deadBoy);
    boy.addAnimation("stop",deadBoyImg);
    boy.frameDelay=1;
    boy.scale=0.3;
    boy.visible=false;

    live1=createSprite(750,50,10,10);
    live1.addImage(livesImg);
    live1.visible=false;
    live1.scale=0.1;
    
    live2=createSprite(700,50,10,10);
    live2.addImage(livesImg);
    live2.visible=false;
    live2.scale=0.1;

    live3=createSprite(650,50,10,10);
    live3.addImage(livesImg);
    live3.visible=false;
    live3.scale=0.1;

    i=0;

    mode1=createSprite(200,200,50,50);
    mode2=createSprite(300,200,50,50);
    mode3=createSprite(400,200,50,50);
    mode4=createSprite(500,200,50,50);
    invisibleGround=createSprite(400,490,800,10);
    invisibleGround.visible=false;

    fireballGrp=new Group();
    bulletGrp=new Group();

    dbin=createSprite(400,430,10,10);
    dbin.addImage(dbinImg);
    dbin.visible=false;
    lives=3;

    spaceShip=createSprite(400,430,10,10);
    spaceShip.addImage(spaceShipImg);
    spaceShip.visible=false;

}

function draw(){
    background(backGround);
    boy.setCollider("rectangle",-150,0,220,400);
    // if gamestate=__ {play this mode}
    if(mousePressedOver(back)){
        gameState=0;
        score=0;
        boy.visible=false;
        spaceShip.visible=false;
        dbin.visible=false;
    }
    if(gameState===0){
        mode1.visible=true;
        mode2.visible=true;
        mode3.visible=true;
        mode4.visible=true;
        lives=3;
        if(mousePressedOver(mode1)){
            gameState=1;
        }
        if(mousePressedOver(mode2)){
            gameState=2
        }

        if(mousePressedOver(mode3)){
            gameState=3
        }
    }
    if(gameState===1){
        boy.visible=true;
        mode1.visible=false;
        mode2.visible=false;
        mode3.visible=false;
        mode4.visible=false;

        spawnFireball();
        if(fireballGrp.isTouching(boy)){
            boy.looping=false;
            boy.changeAnimation("die");
            boy.frameDelay=1;
            fireballGrp.destroyEach();
            textSize(50);
            strokeWeight(20);
            stroke(0,255,0);
            text("Game Over",350,250);
            gameOverSound.play();
        }

    for(var i=0; i<fireballGrp.length; i++){
        if(fireballGrp.get(i).isTouching(invisibleGround)){
            score=score+1;
            fireballGrp.get(i).remove();
        }
    }
        if(keyWentDown(RIGHT_ARROW)){
            boy.velocityX=10;
            boy.changeAnimation("right");
            boy.frameDelay=1;
        }
        if(keyWentUp(RIGHT_ARROW)){
        boy.velocityX=0;
        boy.changeAnimation("idle");
        }
        
        if(keyDown(LEFT_ARROW)){
            boy.velocityX=-10;
            boy.changeAnimation("left");
            boy.frameDelay=1;
            boy.setCollider("rectangle",0,0,220,400);
        }
        if(keyWentUp(LEFT_ARROW)){
        boy.velocityX=0;
        boy.changeAnimation("idle");
        }

        //if gamestate = 2
    }else if(gameState===2){
        spaceShip.visible=true;
        mode1.visible=false;
        mode2.visible=false;
        mode3.visible=false;
        mode4.visible=false;
        spawnBullets();
        spawnFireball();
        for(var i=0; i<fireballGrp.length; i++){
            if(fireballGrp.get(i).isTouching(bulletGrp)){
                fireballGrp.get(i).remove();
                score=score+1;    
        }
        }
        for(var i=0; i<fireballGrp.length; i++){
            if(fireballGrp.get(i).isTouching(spaceShip)){
                fireballGrp.get(i).remove();
                lives=lives-1;    
        }
        }
        for(var i=0; i<fireballGrp.length; i++){
            if(fireballGrp.get(i).isTouching(invisibleGround)){
                lives=lives-1;
                fireballGrp.get(i).remove();
            }
        }
        if(keyDown(LEFT_ARROW)){
            spaceShip.velocityX=-10;
        }
        if(keyWentUp(LEFT_ARROW)){
            spaceShip.velocityX=0;
        }
        if(keyDown(RIGHT_ARROW)){
            spaceShip.velocityX=10;
        }
        if(keyWentUp(RIGHT_ARROW)){
            spaceShip.velocityX=0;
        }
        if(lives<=0){
            stroke(0,255,0);
            strokeWeight(10);
            textSize(50);
            text("game over",300,250);
            fireballGrp.destroyEach();
            gameOverSound.play();
            gameOverSound.stop();
        }
        if(lives===3){
            live1.visible=true;
            live2.visible=true;
            live3.visible=true;
        }
        if(lives===2){
            live1.visible=true;
            live2.visible=true;
            live3.visible=false;
        }
        if(lives===1){
            live1.visible=true;
            live2.visible=false;
            live3.visible=false;
        }
        if(lives===0){
            live1.visible=false;
            live2.visible=false;
            live3.visible=false;
        }

        //if gamestate=3
    }else if(gameState===3){
        dbin.visible=true;
        spawnFireball();
        mode1.visible=false;
        mode2.visible=false;
        mode3.visible=false;
        mode4.visible=false;
        dbin.scale=0.5;

        if(keyDown(LEFT_ARROW)){
            dbin.velocityX=-10;
        }
        if(keyWentUp(LEFT_ARROW)){
        dbin.velocityX=0;
        }
        if(keyWentDown(RIGHT_ARROW)){
            dbin.velocityX=10;
            }
        if(keyWentUp(RIGHT_ARROW)){
        dbin.velocityX=0;
        }
        for(var i=0; i<fireballGrp.length; i++){
            if(fireballGrp.get(i).isTouching(invisibleGround)){
                lives=lives-1;
                fireballGrp.get(i).remove();
            }
        }
        for(var i=0; i<fireballGrp.length; i++){
            if(fireballGrp.get(i).isTouching(dbin)){
                score=score+1;
                fireballGrp.get(i).remove();
            }
        }
        if(lives<=0){
            stroke(0,255,0);
            strokeWeight(10);
            textSize(50);
            text("game over",300,250);
            fireballGrp.destroyEach();
        }
        if(lives===3){
            live2.visible=true;
            live1.visible=true;
            live3.visible=true;
        }
        if(lives===2){
            live1.visible=true;
            live2.visible=true;
            live3.visible=false;
        }
        if(lives===1){
            live1.visible=true;
            live2.visible=false;
            live3.visible=false;
        }
        if(lives==0){
            live1.visible=false;
            live2.visible=false;
            live3.visible=false;
        }

    }

    text("score: "+ score,10,40)
    drawSprites();
}

function spawnFireball(){
    if(frameCount %30===0){
        var fireball=createSprite(random(0,800));
        fireball.lifetime=150;
        fireballGrp.add(fireball);
        fireball.addAnimation("fire",fireballAnim);
        fireball.velocityY=random(5,10);
        fireball.scale=random(1,1.5);

    }

}

function spawnBullets(){
    if(keyWentDown("space")){
        var bullet=createSprite(spaceShip.x,spaceShip.y,10,10);
        bullet.lifetime=150;
        bulletGrp.add(bullet);
        bullet.shapeColor="green";
        bullet.velocityY=-10;
        gunSound.play();
    }
}