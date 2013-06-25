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

controllers.controller('SelectionController', ['$scope', '$filter', 'Selection', function($scope, $filter, Selection) {
    $scope.selection = Selection;
    var ftClient = new FTClient('AIzaSyDICo1qGOtGnd0DD3QEY_rQ2_xcFGLNYto');

    $scope.viz = new Votaciones();
    $scope.vizShown = false;

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
            $scope.dates = rows.map(function(row) { return Date.parse(row[0]) });
            $scope.$apply();
        })
    }

    $scope.selectDate = function(date) {
        $scope.selection.date = date;
        $scope.selection.file = null;
        $scope.files = null;

        var $date = $filter('date');

        var filesQuery = {
            fields:['asunto', 'asuntoId', 'titulo'],
            table: '1ELTXADIfpiUWfQfL9D8ia8p4VTw17UOoKXxsci4',
            tail: "WHERE fecha = '" + $date(date, 'MM/dd/yyyy') + "' ORDER BY hora"
        }
        ftClient.query(filesQuery, function(rows) {
            $scope.files = rows.map(function(row) { return { name: row[0], id: row[1], titulo: row[2]} });
            $scope.$apply();
        })
    }

    $scope.selectFile = function(file) {
        $scope.selection.file = file;
        var fileQuery = {
            fields:['*'],
            table: '1ELTXADIfpiUWfQfL9D8ia8p4VTw17UOoKXxsci4',
            tail: "WHERE asuntoId = '" + file.id + "'"
        }

        ftClient.query(fileQuery, function(rows) {
            var vote = rows.map(function(row) {
                return {
                    asunto: row[2],
                    presidente: row[9],
                    resultado: row[8],
                    base: row[6],
                    mayoria: row[7],
                    presentes: row[10],
                    presentes_p: (parseInt(row[10]) / (parseInt(row[10]) + parseInt(row[11])) * 100).toFixed(1),
                    ausentes: row[11],
                    ausentes_p: (parseInt(row[11]) / (parseInt(row[10]) + parseInt(row[11])) * 100).toFixed(1),
                    abstenciones: row[12],
                    abstenciones_p: (parseInt(row[12]) / (parseInt(row[12]) + parseInt(row[13]) + parseInt(row[14])) * 100).toFixed(1),
                    afirmativos: row[13],
                    afirmativos_p: (parseInt(row[13]) / (parseInt(row[12]) + parseInt(row[13]) + parseInt(row[14])) * 100).toFixed(1),
                    negativos: row[14],
                    negativos_p: (parseInt(row[14]) / (parseInt(row[12]) + parseInt(row[13]) + parseInt(row[14])) * 100).toFixed(1),
    				votopresidente: row[15]
                }
            })[0];
            $scope.vizShown = true;
            $scope.viz.showVote(file.id);

            $scope.vote = vote;
            $scope.$apply();

        });

        // Blocks
        ftClient.query({
            fields: ['bloqueId', 'COUNT()'],
            table: '1GNJAVHF_7xPZFhTc_w4RLxcyiD_lAiYTgVlA0D8',
            tail: "WHERE asuntoId = '" + file.id + "' GROUP BY bloqueId ORDER BY COUNT() DESC"
        }, function(rows) {
            var blockOrder = rows.map(function(row) { return row[0] });
            ftClient.query({
                fields: ['*'],
                table: '1gUTqf8A-nuvBGygRnVDcSftngYZ-z9OvxBs59M0'
            }, function(rows) {
                $scope.blocks = rows
                    .map(function(row) {
                        return {
                            id: row[0],
                            name: row[1],
                            color: row[2] ? row[2] : $scope.viz.color(row[0]),
                            order: blockOrder.indexOf(row[0])
                        }
                    })
                    .filter(function(block) {
                        return block.order >= 0;
                    })
                    .sort(function(a,b) {
                        return a.order - b.order;
                    })

                $scope.$apply();
            })
        })

    }
}])
