'use strict'


// The app
var app = angular.module('votaciones', ['votaciones.services', 'votaciones.controllers']);

// The services
var services = angular.module('votaciones.services', []);

services.factory('Selection', function() {
    return {
        year: null,
        date: null,
        file : null
    }
})

// The controllers
var controllers = angular.module('votaciones.controllers', ['votaciones.services']);

controllers.controller('SelectionController', ['$scope', 'Selection', function($scope, Selection) {
    $scope.selection = Selection;

    votaciones.init();

    var ftClient = new FTClient('AIzaSyDICo1qGOtGnd0DD3QEY_rQ2_xcFGLNYto');
    var yearsQuery = {
        fields:['ano'],
        table: '1ELTXADIfpiUWfQfL9D8ia8p4VTw17UOoKXxsci4',
        tail: 'GROUP BY ano ORDER BY ano'
    };

    ftClient.query(yearsQuery, function(rows) {
        $scope.years = rows.map(function(row) { return row[0] });
        $scope.$apply();
    })

    $scope.selectYear = function(year) {
        $scope.selection.year = year;
        $scope.selection.date = null;
        $scope.dates = null;
        $scope.selection.file = null;
        $scope.files = null;

        var datesQuery = {
            fields:['fecha'],
            table: '1ELTXADIfpiUWfQfL9D8ia8p4VTw17UOoKXxsci4',
            tail: 'WHERE ano="' + year + '" GROUP BY fecha ORDER BY fecha'
        }
        ftClient.query(datesQuery, function(rows) {
            $scope.dates = rows.map(function(row) { return row[0] });
            $scope.$apply();
        })
    }

    $scope.selectDate = function(date) {
        $scope.selection.date = date;
        $scope.selection.file = null;
        $scope.files = null;

        var filesQuery = {
            fields:['asunto', 'asuntoId'],
            table: '1ELTXADIfpiUWfQfL9D8ia8p4VTw17UOoKXxsci4',
            tail: "WHERE fecha = '" + date + "'"
        }
        ftClient.query(filesQuery, function(rows) {
            $scope.files = rows.map(function(row) { return { name: row[0], id: row[1] } });
            $scope.$apply();
        })
    }

    $scope.selectFile = function(file) {
        $scope.selection.file = file;
        votaciones.showVote(file.id);
    }
}])

