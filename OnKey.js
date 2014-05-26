'use strict';

app.
directive('onKey',function() {
	return {
		restrict: 'A',

		compile: function (element, attrs, transclude){
			return {
				pre: function (scope, element, attrs){
debugger;
				},
				post: function (scope, element, attrs){
					debugger;
					//element.onKeypress
				}
			}
		}
	}
});
