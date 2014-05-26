'use strict';

app.
controller('Score', ['$rootScope', '$scope', 'Game',
function ($rootScope, $scope, Game){
}]).
directive('score',function() {
	return {
		restrict: 'E',
		templateUrl: 'Score.html',

		controller: 'Score',

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

