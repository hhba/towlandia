'use strict'

// The app
var app = angular.module('votaciones', ['votaciones.services', 'votaciones.controllers', 'votaciones.filters']);

// The services
var services = angular.module('votaciones.services', []);

services.factory('Selection', function() {
    return {
        year: null,
        date: null,
        file : null
    }
})

// The filters
var filters = angular.module('votaciones.filters', []);

filters.filter('truncate', [function() {
    return function(text, n) {
        if (!text) return;
        var useWordBoundary = false;
        var toLong = text.length>n,
            s_ = toLong ? text.substr(0,n-1) : text;
        s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
        return  toLong ? s_ + '...' : s_;
    }
}])

// The controllers
var controllers = angular.module('votaciones.controllers', ['votaciones.services']);

controllers.controller('SelectionController', ['$scope', '$filter', 'Selection', function($scope, $filter, Selection) {
    $scope.selection = Selection;
    var ftClient = new FTClient('AIzaSyDICo1qGOtGnd0DD3QEY_rQ2_xcFGLNYto');

    $scope.viz = new Votaciones();
    $scope.vizShown = false;

    var yearsQuery = {
        fields:['ano'],
        table: '1M046BCqwBNjxe9CXbcvUUi0JT6HohC8Gq4S7gRM',
        tail: 'GROUP BY ano ORDER BY ano'
    };

    ftClient.query(yearsQuery, function(rows) {
        $scope.years = rows.map(function(row) { return row[0] });
        $scope.$apply();
        selectNextYear();
    })

    $scope.selectYear = function(year, success) {
        $scope.selection.year = year;
        $scope.selection.date = null;
        $scope.dates = null;
        $scope.selection.file = null;
        $scope.files = null;

        var datesQuery = {
            fields:['fecha'],
            table: '1M046BCqwBNjxe9CXbcvUUi0JT6HohC8Gq4S7gRM',
            tail: 'WHERE ano="' + year + '" GROUP BY fecha ORDER BY fecha'
        }
        ftClient.query(datesQuery, function(rows) {
            $scope.dates = rows.map(function(row) { return Date.parse(row[0])});
            if (success) {
                success.apply(null);
            }
            $scope.$apply();
        })
    }

    $scope.selectDate = function(date, success) {
        $scope.selection.date = date;
        $scope.selection.file = null;
        $scope.files = null;

        var $date = $filter('date');

        var filesQuery = {
            fields:['asunto', 'asuntoId', 'titulo'],
            table: '1M046BCqwBNjxe9CXbcvUUi0JT6HohC8Gq4S7gRM',
            tail: "WHERE fecha = '" + $date(date, 'MM/dd/yyyy') + "' ORDER BY hora"
        }
        ftClient.query(filesQuery, function(rows) {
            $scope.files = rows.map(function(row) {
                return {
                    name: row[0],
                    id: row[1],
                    titulo: row[2]
                }
            });
            if (success) {
                success.apply(null);
            }
            $scope.$apply();
        })
    }

    $scope.selectFile = function(file, success) {
        getCheckedBlocks();
        getCheckedCongressmen();
        $scope.selection.file = file;
        var fileQuery = {
            fields:['*'],
            table: '1M046BCqwBNjxe9CXbcvUUi0JT6HohC8Gq4S7gRM',
            tail: "WHERE asuntoId = '" + file.id + "'"
        }

        var lastFile = false;
        if ($scope.years.indexOf($scope.selection.year) == ($scope.years.length - 1) &&
            $scope.dates.indexOf($scope.selection.date) == ($scope.dates.length - 1) &&
            $scope.files.indexOf($scope.selection.file) == ($scope.files.length - 1)) {
            lastFile = true;
        }
        $scope.lastFile = lastFile;

        ftClient.query(fileQuery, function(rows) {
            var vote = rows.map(function(row) {
                return {
                    sesion: row[1],
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
                    votopresidente: row[15],
					auditoria: row[17]
                }
            })[0];
            $scope.vizShown = true;
            $scope.viz.showVote(file.id, success);
            $scope.vote = vote;

            $scope.$apply();

        });

        // Blocks
        ftClient.query({
            fields: ['bloqueId', 'COUNT()'],
            table: '1ihmsVlVwX1sTp4JQ8HK4k07vS8e8_orVY_NvJ9E',
            tail: "WHERE asuntoId = '" + file.id + "' GROUP BY bloqueId ORDER BY COUNT() DESC"
        }, function(rows) {
            var blockOrder = rows.map(function(row) { return row[0] });
            ftClient.query({
                fields: ['*'],
                table: '1vKsuSvTBS_pwgJl7dcbtiMWrOrilaroritbDOOI'
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
                setCheckedBlocks();
            })
        })
        // congressmen
        ftClient.query({
            fields: ['diputadoId'],
            table: '1ihmsVlVwX1sTp4JQ8HK4k07vS8e8_orVY_NvJ9E',
            tail: "WHERE asuntoId = '" + file.id + "'"
        }, function(rows) {
            var congressmenOrder = rows.map(function(row) { return row[0] });
            ftClient.query({
                fields: ['*'],
                table: '1rhy-SIM34RqWGLRnRoA7UeBavBc9GUf6EvnlXZg',
                tail: "ORDER BY nombre ASC"
            }, function(rows) {
                $scope.cmen = rows
                    .map(function(row) {
                        return {
                            id: row[0],
                            name: row[1],
                            order: congressmenOrder.indexOf(row[0])
                        }
                    })
                    .filter(function(cmen) {
                        return cmen.order >= 0;
                    })

                $scope.$apply();
                setCheckedCongressmen();
            })
        })
    }

    $scope.play = function() {
        if (!$scope.lastFile) {
            $scope.playing = true;
            selectNextFile();
        }
    }

    $scope.pause = function() {
        $scope.playing = false;
    }

    function selectNextFile() {
        if ($scope.playing) {
            var currentFileIndex = $scope.files.indexOf($scope.selection.file);
            var nextFileIndex = currentFileIndex+1;
            if (nextFileIndex == $scope.files.length) {
                selectNextDate();
            } else {
                $scope.selectFile($scope.files[nextFileIndex], function() {
                    setTimeout(selectNextFile, 5000);
                });
            }
        }
    }

    function selectNextDate() {
        var currentDateIndex = $scope.dates.indexOf($scope.selection.date);
        var nextDateIndex = currentDateIndex+1;
        if (nextDateIndex == $scope.dates.length) {
            selectNextYear();
        } else {
            $scope.selectDate($scope.dates[nextDateIndex], function() {
                $scope.selectFile($scope.files[0], function() {
                    setTimeout(selectNextFile, 5000);
                });
            });
        }
    }

    function selectNextYear() {
        var currentYearIndex = $scope.years.indexOf($scope.selection.year);
        var nextYearIndex = currentYearIndex+1;
        if (nextYearIndex == $scope.years.length) {
            $scope.playing = false;
            $scope.$apply();
            return;
        } else {
            $scope.selectYear($scope.years[nextYearIndex], function() {
                $scope.selectDate($scope.dates[0], function() {
                    $scope.selectFile($scope.files[0], function() {
                        setTimeout(selectNextFile, 3000);
                    });
                });
            });
        }
    }
}])
