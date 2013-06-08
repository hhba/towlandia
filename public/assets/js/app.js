'use strict'


// The app
var app = angular.module('votaciones', ['votaciones.services', 'votaciones.controllers']);

// The services
var services = angular.module('votaciones.services', []);

services.factory('Selection', function() {
    return {
       year: null
    }
})

// The controllers
var controllers = angular.module('votaciones.controllers', ['votaciones.services']);

controllers.controller('SelectionController', ['$scope', 'Selection', function($scope, Selection) {
    $scope.selection = Selection;
}])

controllers.controller('YearController', ['$scope', 'Selection', function($scope, Selection) {
    //TODO(gb): unwire this
    $scope.years = [2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013];

    $scope.select = function(year) {
        Selection.year = year;
    }
}])

