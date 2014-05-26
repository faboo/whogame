'use strict';

var app = angular.module('app', []).
config([function(){
}]).
run(['$rootScope', 'Game', function ($rootScope, Game){
	$rootScope.game = Game;
	Game.start();
}]).
factory('Game', ['$rootScope', function ($rootScope){
	var DALEK_CHARACTER = '#';
	var PLAYER_CHARACTER = '@';
	var TRASH_CHARACTER = '*';
	var DEAD_CHARACTER = '&';
	var BOARD_WIDTH = 50;
	var BOARD_HEIGHT = 25;
	var SCREW_DRIVER_USES = 2;
	var TELEPORT_USES = 1;
	var TOTAL_DALEKS = 12;
	var TOTAL_SCREW_DRIVERS = 5;
	var TOTAL_TRANSPORTERS = 2;

	var DALEK_POINTS = 50;
	var SCREW_DRIVER_POINTS = -100;
	var TRANSPORTER_POINTS = -25;

	function addTrash(game){
		var totalTrash = Math.max(TOTAL_DALEKS - game.level, 0);
		var trash;

		for(var trashes = 0; trashes < totalTrash; trashes += 1){
			trash = findFreePosition(game);

			game.trash.push(trash);
			game.everything[trash] = TRASH_CHARACTER;
		}
	}

	function addDaleks(game){
		var dalek;

		for(var daleks = 0; daleks < TOTAL_DALEKS; daleks += 1){
			dalek = findFreePosition(game);

			game.daleks.push(dalek);
			game.everything[dalek] = daleks;
		}
	}

	function addPlayer(game){
		var player = findFreePosition(game);

		game.player = player;
		game.everything[player] = PLAYER_CHARACTER;
	}

	function findFreePosition(game){
		var position = [
			Math.floor(Math.random()*BOARD_WIDTH),
			Math.floor(Math.random()*BOARD_HEIGHT)
		];

		while(game.everything[position] !== undefined){
			if(Math.random() < .5)
				position[0] += 1;
			else
				position[1] += 1;

			if(position[0] >= BOARD_WIDTH)
				position[0] = 0;
			else if(position[1] >= BOARD_HEIGHT)
				position[1] = 0;
		}

		return position;
	}

	function sign(num){
		if(num > 0)
			return 1;
		else if(num < 0)
			return -1;
		else
			return 0;
	}

	function truncate(num){
		if(num > 0)
			return Math.floor(num);
		else if(num < 0)
			return Math.ceil(num);
		else
			return 0;
	}

	return {
		score: null,
		level: null,
		dead: null,
		won: null,
		everything: null,
		player: null,
		daleks: null,
		trash: null,

		resetBoard: function (){
			this.won = false;
			this.screwDriversLeft = TOTAL_SCREW_DRIVERS;
			this.transportersLeft = TOTAL_TRANSPORTERS;
			this.everything = { };
			this.daleks = [];
			this.trash = [];

			addTrash(this);
			addDaleks(this);
			addPlayer(this);
		},

		start: function (){
			this.level = 1;
			this.score = 0;
			this.dead = false;
			this.resetBoard();
		},

		nextLevel: function (){
			this.level += 1;
			this.resetBoard();
		},

		getBoardWidth: function (){
			return BOARD_WIDTH;
		},

		getBoardHeight: function (){
			return BOARD_HEIGHT;
		},

		killDalekAt: function (everything, position){
			var killed = null;

			// Daleks are represented by their position in the daleks array.
			if(typeof everything[position] === "number"){
				this.daleks.splice(everything[position], 1);

				killed = everything[position];
				everything[position] = TRASH_CHARACTER;
				this.trash.push(position);

				this.score += DALEK_POINTS;
			}

			return killed;
		},

		move: function (horizontal, vertical){
			var moved = false;

			if(this.player[0]+horizontal >= 0 && this.player[0]+horizontal < BOARD_WIDTH){
				this.player[0] += horizontal;
				moved = true;
			}
			if(this.player[1]+vertical >= 0 && this.player[1]+vertical < BOARD_HEIGHT){
				this.player[1] += vertical;
				moved = true;
			}

			if(moved){
				delete this.everything[this.player];

				if(this.everything[this.player] !== undefined){
					this.dead = true;
				}

				this.everything[this.player] = PLAYER_CHARACTER;
			}

			return this.tick();
		},

		tick: function(){
			var newEverything = { };
			var daleksKilled = false;
			var killed;

			for(var trash in this.trash){
				newEverything[this.trash[trash]] = TRASH_CHARACTER;
			}

			for(var dalek = 0; dalek < this.daleks.length;){
				this.moveDalek(this.daleks[dalek]);

				if(newEverything[this.daleks[dalek]] !== undefined){
					killed = this.killDalekAt(newEverything, this.daleks[dalek]);

					if(killed === null || killed > dalek){
						this.daleks.splice(dalek, 1);
					}
					else{
						dalek -= 1;
						this.daleks.splice(dalek, 1);
					}

					daleksKilled = true;
					this.score += DALEK_POINTS;
				}
				else{
					newEverything[this.daleks[dalek]] = dalek;
					dalek += 1;
				}
			}

			this.everything = newEverything;

			if(this.everything[this.player] !== undefined){
				this.dead = true;
			}
			this.everything[this.player] = PLAYER_CHARACTER;

			if(this.daleks.length === 0)
				this.won = true;

			return daleksKilled;
		},

		moveDalek: function (dalek){
			var dx = this.player[0] - dalek[0];
			var dy = this.player[1] - dalek[1];
			var m;

			if(dx){
				m = dy/dx;

				if(m > 1){
					dalek[0] = dalek[0] + (truncate(1/m) && sign(dx));
					dalek[1] = dalek[1] + sign(dy);
				}
				else{
					dalek[0] = dalek[0] + sign(dx);
					dalek[1] = dalek[1] + (truncate(m) && sign(dy));
				}
			}
			else{
				dalek[1] += sign(dy);
			}
		},

		moveW: function (){
			return this.move(-1, 0);
		},

		moveE: function (){
			return this.move(1, 0);
		},

		moveN: function (){
			return this.move(0, -1);
		},

		moveS: function (){
			return this.move(0, 1);
		},

		moveNW: function (){
			return this.move(-1, -1);
		},

		moveNE: function (){
			return this.move(1, -1);
		},

		moveSW: function (){
			return this.move(-1, 1);
		},

		moveSE: function (){
			return this.move(1, 1);
		},

		sonicScrewdriver: function (){
			var player = this.player;
			var kill = function (position){
				this.killDalekAt(this.everything, position);
			}.bind(this);

			kill([player[0], player[1]+1]);
			kill([player[0], player[1]-1]);
			kill([player[0]+1, player[1]-1]);
			kill([player[0]-1, player[1]-1]);
			kill([player[0]+1, player[1]+1]);
			kill([player[0]-1, player[1]+1]);
			kill([player[0]+1, player[1]]);
			kill([player[0]-1, player[1]]);
			// TODO: flashy animation
			
			this.score += SCREW_DRIVER_POINTS;

			this.screwDriversLeft -= 1;

			if(this.daleks.length === 0)
				this.won = true;
		},

		transporter: function (){
			var newPosition = findFreePosition(this);

			delete this.everything[this.player];
			this.player = newPosition;
			this.everything[this.player] = PLAYER_CHARACTER;

			this.score += TRANSPORTER_POINTS;

			this.transportersLeft -= 1;
		}
	}
}]);
