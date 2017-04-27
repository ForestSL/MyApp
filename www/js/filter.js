
angular.module('phoneNumberFilter', [])
    .filter('phoneNumberFilter', function() {
        return function(input) {
            return input.replace(/tank/, "=====")
        };
    });