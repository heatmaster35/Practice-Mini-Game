//jsfiddle link:https://jsfiddle.net/heatmaster35/b4nb8tLt/20/
canvas = document.getElementById("snow");
context = canvas.getContext('2d');

var lose = false;
var Factor = 1;
var RIGHT_KEYCODE = 39;
var LEFT_KEYCODE = 37;
var UP_KEYCODE = 38;
var DOWN_KEYCODE = 40;
var SPACE_KEYCODE = 32;
var keysPressed = {};
keysPressed[RIGHT_KEYCODE] = false;
keysPressed[LEFT_KEYCODE] = false;
keysPressed[UP_KEYCODE] = false;
keysPressed[DOWN_KEYCODE] = false;
keysPressed[SPACE_KEYCODE] = false;
var coolDownCount = 15;
var timeStopCount = 5;
var coolDownCounter = setInterval(coolDown,1000);
var timeStopCounter = setInterval(timeStop,1000);
var difficultyCounter = setInterval(difficulty, 1000);
var needCoolDown = false;
var duringTimeStop = false;
var returnSpeed = false;
var score = 0;
var status1 = "ready!";

function difficulty()
{
	score++;
	if(!duringTimeStop)
		Factor = Factor*1.00001;
}

function coolDown()
{
	//console.log("reaches cooldown");
	if(needCoolDown)
		coolDownCount--;
	if(coolDownCount<=0)
	{
		//clearInterval(coolDownCounter);
		needCoolDown = false;
		coolDownCount = 15;
	}
}

function timeStop()
{
	//console.log("reaches timestop");
	if(duringTimeStop)
		timeStopCount--;
	if(timeStopCount<=0)
	{
		//clearInterval(timeStopCounter);
		duringTimeStop = false;
		needCoolDown = true;
		returnSpeed = true;
		timeStopCount = 5;
	}
}

function Particle(x,y,speed,lifetime)
{
	this.x = x;
	this.y = y;
	this.lifetime = lifetime;
	this.radius = 15;
	this.speed = speed;
	this.slowSpeed = speed/5;
	this.fastSpeed = speed;
}

var particles = new Array();

function particle_system(numParticles)
{
	for(var iter = 0; iter < numParticles; iter++)
	{
		particles.push(new Particle(Math.random()*canvas.width, -20, 1 + Math.random()*2,canvas.height));
	}
}

particle_system(20);

function Player()
{
	this.x = canvas.width/2;
	this.y = canvas.height/2;
	this.width = 10;
	this.height = 10;
	this.color = 'green';
}

var Player = new Player();

function update()
{
	//for the particles
	for(var iter=0;iter<particles.length;iter++)
	{
		if(particles[iter].y > canvas.height)
		{
			particles[iter].x = canvas.width*Math.random();
			particles[iter].y = 0;
			particles[iter].lifetime = canvas.height;
		}
		particles[iter].y += particles[iter].speed;
		particles[iter].lifetime--;
	}
	
	//for the player
	if(keysPressed[RIGHT_KEYCODE])
		Player.x += 2;
	if(Player.x >= canvas.width - Player.width)
		Player.x = canvas.width - Player.width;
	
	if(keysPressed[LEFT_KEYCODE])
		Player.x -= 2;
	if(Player.x<=0)
		Player.x = 0;
	
	if(keysPressed[UP_KEYCODE])
		Player.y -= 2;
	if(Player.y <=0)
		Player.y = 0;
	
	if(keysPressed[DOWN_KEYCODE])
		Player.y += 2;
	if(Player.y >= canvas.height - Player.height)
		Player.y = canvas.height - Player.height;
	
	if(keysPressed[SPACE_KEYCODE]&&!(needCoolDown))
		duringTimeStop = true;
	
	//collusion detection
	for(var i = 0;i < particles.length;i++)
	{
		var tempEnemy = particles[i];
		if(Player.x + Player.width >= tempEnemy.x&& Player.x <= tempEnemy.x + 
		tempEnemy.radius&&Player.y >= tempEnemy.y && Player.y <= tempEnemy.y + tempEnemy.radius)
		{
			lose = true;
			console.log("you lose");
		}
	}
	
	//slow down time
	if(duringTimeStop)
	{
		for(var i = 0;i < particles.length;i++)
		{
			particles[i].speed = particles[i].slowSpeed;
		}	
	}
	//return original speed
	if(returnSpeed)
	{
		for(var i = 0;i < particles.length;i++)
		{
			particles[i].speed = particles[i].fastSpeed;
		}
		returnSpeed = false;
	}
	
	//difficulty spike
	if(!duringTimeStop)
	{
		for(var i = 0;i < particles.length;i++)
		{
			particles[i].speed = particles[i].speed*Factor;
			particles[i].fastSpeed = particles[i].fastSpeed*Factor;
		}
	}
	
	if(!needCoolDown&&!duringTimeStop)
		status1 = "ready!"
	else
		status1 = "cooling down...";
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(evt)
{
	if(evt.keyCode in keysPressed)
  	keysPressed[evt.keyCode] = true;
}

function keyUp(evt)
{
	if(evt.keyCode in keysPressed)
  	keysPressed[evt.keyCode] = false;
}

function restartGame()
{
	lose = false;
	Factor = 1;
	keysPressed[RIGHT_KEYCODE] = false;
	keysPressed[LEFT_KEYCODE] = false;
	keysPressed[UP_KEYCODE] = false;
	keysPressed[DOWN_KEYCODE] = false;
	keysPressed[SPACE_KEYCODE] = false;
	coolDownCount = 15;
	timeStopCount = 5;
	coolDownCounter = setInterval(coolDown,1000);
	timeStopCounter = setInterval(timeStop,1000);
	difficultyCounter = setInterval(difficulty, 1000);
	needCoolDown = false;
	duringTimeStop = false;
	returnSpeed = false;
	score = 0;
	status1 = "ready!";
	

	for(var i = 0;i < particles.length;i++)
	{
		particles[i].speed = 1+Math.random()*2;
		particles[i].fastSpeed = particles[i].speed;
		particles[i].x = canvas.width*Math.random() - particles[i].radius;
		particles[i].y = -40;

	}
	
	Player.x = canvas.width/2;
	Player.y = canvas.height/2;
}

function draw()
{
	canvas.width = canvas.width;
	context.fillStyle='black';
	context.fillRect(0,0,canvas.width,canvas.height);
	context.fill();
	
	context.fillStyle = "pink";
	context.font = "10px Arial";
	context.fillText("score = "+score+" pts",10,50);
	context.fillText("Time Stop: " + status1,10,70);
	context.fillText("Move with ARROW KEYS and slow down time with SPACE KEY",0,canvas.height - 10);
  
	//for the particles
	for(var iter = 0; iter<particles.length;iter++)
	{
		context.fillStyle='white';
		context.fillRect(particles[iter].x, particles[iter].y, particles[iter].radius, particles[iter].radius);
		context.fill();
	}
	
	//for the player
	context.fillStyle = Player.color;
	context.fillRect(Player.x,Player.y,Player.width,Player.height);
	context.fill();
	
		//make loser
	if(lose)
	{
		window.alert("GAME OVER\ntry again? press OK");
		restartGame();
	}
}

function game_loop()
{
	update();
	draw();
}

setInterval(game_loop,30);

