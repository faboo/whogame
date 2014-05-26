'use strict';

app.
controller('GameOver', ['$rootScope', '$scope', 'Game',
function ($rootScope, $scope, Game){
	$scope.onRestart = function (){
		$scope.action();
	}
}]).
directive('gameOver',function() {
	return {
		restrict: 'E',
		templateUrl: 'GameOver.html',

		controller: 'GameOver',
		scope: {
			message: '@',
			button: '@',
			action: '&'
		},

		compile: function (element, attrs, transclude){
			return {
				pre: function (scope, element, attrs, controller){
				},
				post: function (scope, element, attrs, controller){
				}
			}
		}
	}
});

