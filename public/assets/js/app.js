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

controllers.controller('YearController', ['$scope', 'Selection', '$http', function($scope, Selection, $http) {
    var ftClient = new FTClient("AIzaSyDICo1qGOtGnd0DD3QEY_rQ2_xcFGLNYto");
    var query = {
        fields:["ano"],
        table: "1ELTXADIfpiUWfQfL9D8ia8p4VTw17UOoKXxsci4",
        tail: "GROUP BY ano ORDER BY ano"
    };

    ftClient.query(query, function(rows) {
        $scope.years = rows.map(function(row) { return row[0] });
        $scope.$apply();
    })

    $scope.select = function(year) {
        Selection.year = year;
    }
}])

