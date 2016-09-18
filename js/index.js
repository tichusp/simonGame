$(document).ready(function() {
	var Obj = function(buttn, audio, normalColor, activeColor) {
		this.buttn = buttn;
		this.audio = audio;
		this.normalColor = normalColor;
		this.activeColor = activeColor;
	}
	var topLeftAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
	var topRightAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
	var bottomLeftAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
	var bottomRightAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
	var computerSequence = [];
	var playerSequence = [];
	var on = false;
	var strict = false;
	var topLeft = new Obj($('.outter-btn-top-left'), topLeftAudio, 'green', '#0F0');
	var topRight = new Obj($('.outter-btn-top-right'), topRightAudio, 'darkred', '#F00');
	var bottomLeft = new Obj($('.outter-btn-bottom-left'), bottomLeftAudio, '#CC0', '#FF3');
	var bottomRight = new Obj($('.outter-btn-bottom-right'), bottomRightAudio, 'darkblue', '#22F');
	
	function buttonPressed(obj) {
		obj.audio.play();
		obj.buttn.css({'background-color': obj.activeColor});
    setTimeout(function() {
         obj.buttn.css({'background-color': obj.normalColor});
    }, 350);		
	}
	
	function checkPlay() {
		var index = playerSequence.length - 1;
		if (playerSequence[index] !== computerSequence[index]) {
			removeEvents();
			$('#step').text('XX');
			playerSequence = [];
			topLeft.buttn.css({'background-color': topLeft.activeColor});
			topRight.buttn.css({'background-color': topRight.activeColor});
			bottomLeft.buttn.css({'background-color': bottomLeft.activeColor});
			bottomRight.buttn.css({'background-color': bottomRight.activeColor});
			setTimeout(function() {
				topLeft.buttn.css({'background-color': topLeft.normalColor});
				topRight.buttn.css({'background-color': topRight.normalColor});
				bottomLeft.buttn.css({'background-color': bottomLeft.normalColor});
				bottomRight.buttn.css({'background-color': bottomRight.normalColor});
				if (strict) {
					$('#step').text('00');
					computerSequence = [];
					addEvents();
				} else {
					$('#step').text(computerSequence.length < 10 ?
													'0' + computerSequence.length :
													computerSequence.length);
					playComputerMoves();
				}
			}, 1500);
		} else {
			return true;
		}
	}
	
	function playerButtonPressed() {
    buttonPressed(this);
		if (computerSequence.length) {
			playerSequence.push(this);
			if (checkPlay()) {
				if (computerSequence.length === 20 && playerSequence.length === 20) {
					$('#step').text('00');
					playerSequence = [];
					computerSequence = [];
					alert(strict ? 'Congratulations, you have beaten the game in strict mode!' : 'Congratulations, you have beaten the game in normal mode. For a bigger challenge activate strict mode next time you play');
				} else {
					if (playerSequence.length === computerSequence.length) {
						playerSequence = [];
						setTimeout(computerMove(), 500);
					}
				}
			}
		}
	}
	
	function strictStatus() {
		strict = strict ? false : true;
		$('#led').css({'background-color': strict ? 'red' : '#303030'});
	}
	
	function playComputerMoves() {
		removeEvents();
		for (let i = 0, length = computerSequence.length; i < length; i++) {
			setTimeout(function() {
				buttonPressed(computerSequence[i]);
			}, 700 * (i + 1));
		}
		setTimeout(function() {
			if (on) {
				addEvents();
			}
		}, 700 * (computerSequence.length + 1));
	}
	
	function computerMove() {
		var random = Math.floor(Math.random() * 4);
		var whichObj;
		switch(random) {
			case 0:
				whichObj = topLeft;
				break;
			case 1:
				whichObj = topRight;
				break;
			case 2:
				whichObj = bottomLeft;
				break;
			case 3:
				whichObj = bottomRight;		
		}
		computerSequence.push(whichObj);
		$('#step').text(computerSequence.length < 10 ?
										'0' + computerSequence.length :
										computerSequence.length);
		playComputerMoves();
	}
	
	function addEvents() {
		if (!computerSequence.length) {
			$('#start').on('click', computerMove);
		}
		if (!computerSequence.length) {
			$('#strict').on('click', strictStatus);
		}
		topLeft.buttn.on('mousedown',
										 playerButtonPressed.bind(topLeft));
		topRight.buttn.on('mousedown', 
											playerButtonPressed.bind(topRight));
		bottomLeft.buttn.on('mousedown', 
												playerButtonPressed.bind(bottomLeft));
		bottomRight.buttn.on('mousedown',
												 playerButtonPressed.bind(bottomRight));
	}
	
	function removeEvents() {
		$('#start').off('click');
		$('#strict').off('click');
		topLeft.buttn.off('mousedown');
		topRight.buttn.off('mousedown');
		bottomLeft.buttn.off('mousedown');
		bottomRight.buttn.off('mousedown');
	}	
	
	$('.toggle').on('click', function() {
		if (on) {
			on = false;
			$('.toggle').css({left: '2px'});
			$('#step').text('');
			strict = false;
			$('#led').css({'background-color': '#303030'});
			removeEvents();
		} else {
			on = true;
			$('.toggle').css({left: '27px'});
			$('#step').css({color: 'red'});
			$('#step').text('00');
			addEvents();
		}
		computerSequence = [];
		playerSequence = [];
	});	
});