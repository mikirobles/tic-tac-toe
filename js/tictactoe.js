var selectX = document.getElementById("selectx");
var selectO = document.getElementById("selecto");

var selectWindow = document.getElementById("selectwindow");
var gameOverWindow = document.getElementById("gameOverWindow");
var gameOverText = document.getElementById("gameOverText");

var replayButton = document.getElementById("replay");

var titleCard = document.getElementById("titlecard");
var tiles = [];

var player = "";
var computer = "";

var playerPicks = [];
var computerPicks = [];


const winningCombinations = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];

var gameStarted = false;
var yourTurn = false;
var gameFinished = false;

function removeSelectWindow(){
	//$("#selectwindow").animateCss('fadeOut');
	selectwindow.style.display = "none";
	
	//titleCard.style.justifyContent = "center";
}

function choosePlayer(val){
	if (val == "O") {
		player = val;
		computer = "X";
	} else {
		player = "X";
		computer = "O";
	}
	removeSelectWindow();
	gameStarted = true;
	computerTurn();
}

function getRandomPick() {
    const number = Math.floor(Math.random()*9)+1;
    const isNumberRepeated = playerPicks.includes(number) || computerPicks.includes(number);
    return isNumberRepeated ? getRandomPick() : number;
};

function nextGenAIPick(){
	if (playerPicks.length > 0 && computerPicks.length > 0){
	var playerCombinations = winningCombinations.slice();
	playerCombinations.forEach(function(combination){
		playerCombinations.push(combination.filter(function(val){
			return !playerPicks.includes(val);
		}));
	})
	var computerCombinations = winningCombinations.slice();
	computerCombinations.forEach(function(combination){
		computerCombinations.push(combination.filter(function(val){
			return !computerPicks.includes(val);
		}));
	})
	/*playerCombinations.forEach(function(combination){
		computerPicks.forEach(function(val){
			if (combination.includes(val) && computerPicks.includes(val)){
				combination.pop();
			}
		});
	})*/
	playerCombinations = playerCombinations.filter(String);
	//var potentialCombinations = playerCombinations.slice(8, 16);
	//potentialCombinations.sort(function(a,b){return a.length>b.length})
	let allPicks = playerPicks.concat(computerPicks);

	defensiveCombination = playerCombinations.sort(function(a,b){return a.length-b.length})[0]
	offensiveCombination = computerCombinations.sort(function(a,b){return a.length-b.length})[0]

	defensivePick = playerCombinations.sort(function(a,b){return a.length-b.length})[0][0];
	offensivePick = computerCombinations.sort(function(a,b){return a.length-b.length})[0][0]

	if (((defensiveCombination.length <= offensiveCombination.length) && !allPicks.includes(defensivePick)) || (allPicks.includes(offensivePick) && !allPicks.includes(defensivePick))){
		return defensivePick;
	} else if ((offensiveCombination.length < defensiveCombination.length && !allPicks.includes(offensivePick)) || (allPicks.includes(defensivePick) && !allPicks.includes(offensivePick))){
		return offensivePick;
	} else if (allPicks.includes(defensivePick) && allPicks.includes(offensivePick)){
		return getRandomPick();
	}
	} else {
		return getRandomPick();
	}
}





function playerTurn(val){
	//console.log(tiles);
	if (gameStarted && yourTurn && tiles[val].innerHTML == ""){
		tiles[val].innerHTML = player;
		playerPicks.push(val);
		return check(playerPicks) ? gameOver(player) : (yourTurn = false, tieCheck(), computerTurn());
	}
	//yourTurn = false;
	//computerTurn();
}

function computerTurn(){
	if (gameStarted && !yourTurn){
		var pick = nextGenAIPick();
		//var pick = getRandomPick();
		//console.log(pick);
		console.log(computerPicks);
		tiles[pick].innerHTML = computer;
		computerPicks.push(pick);
	}

	return check(computerPicks) ? gameOver(computer) : (yourTurn = true, tieCheck());

	/*check();
	yourTurn = true;*/
}

function gameStart(){
	gameStarted = true;
}

function check(who, next){
	for (var k = 0; k < winningCombinations.length; k++) {
		if (who.includes(winningCombinations[k][0]) && who.includes(winningCombinations[k][1]) && who.includes(winningCombinations[k][2])){
			return true;
		}
	};
}

function tieCheck(){
	if (playerPicks.length + computerPicks.length == 9){
		gameOver();
	}
}

function gameOver(who){
	gameStarted = false;
	yourTurn = false;
	gameFinished = true;

	if (who == player){
		(gameOverText.innerHTML = "You won!, Replay?");
	} else if (who == computer){
		(gameOverText.innerHTML = "You lose, Replay?");
	} else {
		(gameOverText.innerHTML = "It's a tie!, Replay?");
	}
	$("#gameOverWindow").animateCss('fadeIn');
	gameOverWindow.style.display = "flex"
}

function replay(){
	$("#title").animateCss('pulse');
	if (!gameStarted && gameFinished){
		for (var i = 1; i < 10; i++){
			tiles[i].innerHTML = "";
		}
	$("#selectwindow").animateCss('fadeIn');
	selectwindow.style.display = "flex";
	gameOverWindow.style.display = "none"
	yourTurn = true;
	gameStarted = false;
	gameFinished = false;
	playerPicks = [];
	computerPicks = [];
	}
}

document.addEventListener("DOMContentLoaded", function (event) {
	
	

	for (var i = 1; i < 10; i++){
		tiles[i] = document.getElementById(i.toString());
		tiles[i].onclick = function(){playerTurn(i);}
	}

	tiles[1].onclick = function(){playerTurn(1);}
	tiles[2].onclick = function(){playerTurn(2);}
	tiles[3].onclick = function(){playerTurn(3);}
	tiles[4].onclick = function(){playerTurn(4);}
	tiles[5].onclick = function(){playerTurn(5);}
	tiles[6].onclick = function(){playerTurn(6);}
	tiles[7].onclick = function(){playerTurn(7);}
	tiles[8].onclick = function(){playerTurn(8);}
	tiles[9].onclick = function(){playerTurn(9);}

	selectO.onclick = function(){choosePlayer("O")};
	selectX.onclick = function(){choosePlayer("X")};

	replayButton.onclick = function(){replay()};

	$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

	$("body").animateCss('fadeIn');
	$("body").css("display", "flex");

})
