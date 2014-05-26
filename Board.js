'use strict';

app.
controller('Board', ['$rootScope', '$scope', '$window', 'Game',
function ($rootScope, $scope, $window, Game){
	$scope.build = function (){
		this.width = Game.getBoardWidth();
		this.height = Game.getBoardHeight();
		this.game = Game;
		this.end = []

		$window.addEventListener('keyup', $scope.onKeypress);
	}

	$scope.onKeypress = function ($event){
		if(!Game.dead && !Game.won){
			$scope.$apply(function (){
				var daleksKilled = false;

				if(($event.keyIdentifier||$event.key) === 'Left' ||
					$event.keyCode === 72 ||
					$event.keyCode === 100){
					daleksKilled = Game.moveW();
				}
				else if(($event.keyIdentifier||$event.key) === 'Right' ||
					$event.keyCode === 76 ||
					$event.keyCode === 102){
					daleksKilled = Game.moveE();
				}
				else if(($event.keyIdentifier||$event.key) === 'Up' ||
					$event.keyCode === 75 ||
					$event.keyCode === 104){
					daleksKilled = Game.moveN();
				}
				else if(($event.keyIdentifier||$event.key) === 'Down' ||
					$event.keyCode === 74 ||
					$event.keyCode === 98){
					daleksKilled = Game.moveS();
				}
				else if($event.keyIdentifier === '' ||
					$event.keyCode === 89 ||
					$event.keyCode === 103){
					daleksKilled = Game.moveNW();
				}
				else if($event.keyIdentifier === '' ||
					$event.keyCode === 85 ||
					$event.keyCode === 105){
					daleksKilled = Game.moveNE();
				}
				else if($event.keyIdentifier === '' ||
					$event.keyCode === 66 ||
					$event.keyCode === 97){
					daleksKilled = Game.moveSW();
				}
				else if($event.keyIdentifier === '' ||
					$event.keyCode === 78 ||
					$event.keyCode === 99){
					daleksKilled = Game.moveSE();
				}

				else if($event.keyIdentifier === 'U+0053' ||
					$event.keyCode === 83){
					if(Game.screwDriversLeft > 0){
						$scope.screwdriverSound.play();
						Game.sonicScrewdriver();
					}
				}
				else if($event.keyIdentifier === 'U+0054' ||
					$event.keyCode === 84){
					if(Game.transportersLeft > 0){
						$scope.transporterSound.play();
						Game.transporter();
					}
				}
				else if($event.keyIdentifier === 'U+00BE' ||
					$event.keyCode === 190 ||
					$event.keyCode === 101){
					daleksKilled = Game.tick();
				}

				if (Game.dead){
					$scope.exterminateSound.play();
				}
				else if(Game.won){
					$scope.tardisSound.play();
				}
				else if(daleksKilled){
					$scope.crashSound.play();
				}

				$event.preventDefault();
			});
		}
	}
}]).
directive('board',['$document', function($document) {
	return {
		restrict: 'E',
		templateUrl: 'Board.html',

		controller: 'Board',

		compile: function (element, attrs, transclude){
			return {
				pre: function (scope, element, attrs, controller){
					scope.build();
				},
				post: function (scope, element, attrs, controller){
					scope.screwdriverSound = $document[0].getElementById('screwdriver-sound');
					scope.transporterSound = $document[0].getElementById('transporter-sound');
					scope.crashSound = $document[0].getElementById('crash-sound');
					scope.exterminateSound = $document[0].getElementById('exterminate-sound');
					scope.tardisSound = $document[0].getElementById('tardis-sound');
				}
			}
		}
	}
}]);
