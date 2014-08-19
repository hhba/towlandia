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
        table: '1ELTXADIfpiUWfQfL9D8ia8p4VTw17UOoKXxsci4',
        tail: 'GROUP BY ano ORDER BY ano'
    };

    ftClient.query(yearsQuery, function(rows) {
        $scope.years = rows.map(function(row) { return row[0] });
        $scope.$apply();
        selectDefaultVotacion();
    })

    $scope.selectYear = function(year, success) {
        $scope.selection.year = year;
        $scope.selection.date = null;
        $scope.dates = null;
        $scope.selection.file = null;
        $scope.files = null;
        $scope.permalink = null;
        $('.btn-permalink').popover('hide');

        var datesQuery = {
            fields:['fecha'],
            table: '1ELTXADIfpiUWfQfL9D8ia8p4VTw17UOoKXxsci4',
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
        $scope.permalink = null;
        $('.btn-permalink').popover('hide');

        var $date = $filter('date');

        var filesQuery = {
            fields:['asunto', 'asuntoId', 'titulo'],
            table: '1ELTXADIfpiUWfQfL9D8ia8p4VTw17UOoKXxsci4',
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
        $('.btn-permalink').popover('hide');
        $scope.selection.file = file;
        var fileQuery = {
            fields:['*'],
            table: '1ELTXADIfpiUWfQfL9D8ia8p4VTw17UOoKXxsci4',
            tail: "WHERE asuntoId = '" + file.id + "'"
        }

        var lastFile = false,
            firstFile = false;
        if ($scope.years.indexOf($scope.selection.year) == ($scope.years.length - 1) &&
            $scope.dates.indexOf($scope.selection.date) == ($scope.dates.length - 1) &&
            $scope.files.indexOf($scope.selection.file) == ($scope.files.length - 1)) {
            lastFile = true;
        }
        $scope.lastFile = lastFile;

        if ($scope.years.indexOf($scope.selection.year) == 0 &&
            $scope.dates.indexOf($scope.selection.date) == 0 &&
            $scope.files.indexOf($scope.selection.file) == 0) {
            firstFile = true;
        }
        $scope.firstFile = firstFile;

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
                    votopresidente: row[15]
                }
            })[0];
            $scope.vizShown = true;
            $scope.viz.showVote(file.id, success);
            $scope.vote = vote;

            var permalink = makePermalink();
            $scope.permalink = '<small><a href="' + permalink + '">' + permalink + '</a></small>';

            $scope.$apply();

        });

        // Blocks
        ftClient.query({
            fields: ['bloqueId', 'COUNT()'],
            table: '1GNJAVHF_7xPZFhTc_w4RLxcyiD_lAiYTgVlA0D8',
            tail: "WHERE asuntoId = '" + file.id + "' GROUP BY bloqueId ORDER BY COUNT() DESC"
        }, function(rows) {
            var blockOrder = rows.map(function(row) { return row[0] });
            var blockMembers = rows.map(function(row) { return row[1] });
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
                            order: blockOrder.indexOf(row[0]),
                            members: blockMembers[blockOrder.indexOf(row[0])]
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
            fields: ['diputadoId', 'voto'],
            table: '1GNJAVHF_7xPZFhTc_w4RLxcyiD_lAiYTgVlA0D8',
            tail: "WHERE asuntoId = '" + file.id + "'"
        }, function(rows) {
            var congressmenOrder = rows.map(function(row) { return row[0] });
			var congressmenVote = rows.map(function(row) { return row[1] });
            ftClient.query({
                fields: ['*'],
                table: '1OAvsKOSuQE3NzXNKGLwQpBDj9iK3mLweHb8Lcfg',
                tail: "ORDER BY nombre ASC"
            }, function(rows) {
                $scope.cmen = rows
                    .map(function(row) {
                        return {
                            id: row[0],
                            name: row[1],
							distrito: row[2],
                            order: congressmenOrder.indexOf(row[0]),
							vote: congressmenVote[congressmenOrder.indexOf(row[0])]
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

    $scope.prev = function() {
        if (!$scope.firstFile) {
            selectPrevFile();
        }
    }

    $scope.next = function() {
        if (!$scope.lastFile) {
            selectNextFile();
        }
    }

/*
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
*/

    function selectNextFile() {
        var currentFileIndex = $scope.files.indexOf($scope.selection.file);
        var nextFileIndex = currentFileIndex+1;
        if (nextFileIndex == $scope.files.length) {
            selectNextDate();
        } else {
            $scope.selectFile($scope.files[nextFileIndex]);
        }
    }

    function selectNextDate() {
        var currentDateIndex = $scope.dates.indexOf($scope.selection.date);
        var nextDateIndex = currentDateIndex+1;
        if (nextDateIndex == $scope.dates.length) {
            selectNextYear();
        } else {
            $scope.selectDate($scope.dates[nextDateIndex], function() {
                $scope.selectFile($scope.files[0]);
            });
        }
    }

    function selectNextYear() {
        var currentYearIndex = $scope.years.indexOf($scope.selection.year);
        var nextYearIndex = currentYearIndex+1;
        if (nextYearIndex == $scope.years.length) {
            $scope.lastFile = true;
            $scope.$apply();
            return;
        } else {
            $scope.selectYear($scope.years[nextYearIndex], function() {
                $scope.selectDate($scope.dates[0], function() {
                    $scope.selectFile($scope.files[0]);
                });
            });
        }
    }

    function selectPrevFile() {
        var currentFileIndex = $scope.files.indexOf($scope.selection.file);
        var prevFileIndex = currentFileIndex-1;
        if (prevFileIndex < 0) {
            selectPrevDate();
        } else {
            $scope.selectFile($scope.files[prevFileIndex]);
        }
    }

    function selectPrevDate() {
        var currentDateIndex = $scope.dates.indexOf($scope.selection.date);
        var prevDateIndex = currentDateIndex-1;
        if (prevDateIndex < 0) {
            selectPrevYear();
        } else {
            $scope.selectDate($scope.dates[prevDateIndex], function() {
                $scope.selectFile($scope.files[$scope.files.length-1]);
            });
        }
    }

    function selectPrevYear() {
        var currentYearIndex = $scope.years.indexOf($scope.selection.year);
        var prevYearIndex = currentYearIndex-1;
        if (prevYearIndex < 0) {
            $scope.firsfFile = true;
            $scope.$apply();
            return;
        } else {
            $scope.selectYear($scope.years[prevYearIndex], function() {
                $scope.selectDate($scope.dates[$scope.dates.length-1], function() {
                    $scope.selectFile($scope.files[$scope.files.length-1]);
                });
            });
        }
    }

    function selectLastFile() {
        $scope.selectYear($scope.years[$scope.years.length-1], function() {
            $scope.selectDate($scope.dates[$scope.dates.length-1], function() {
                $scope.selectFile($scope.files[$scope.files.length-1]);
            });
        });
    }

    function selectDefaultVotacion() {
        var indexHash = window.location.href.indexOf('?');
        if(indexHash === -1) {
            selectLastFile();
        }
        else {
            var hash = window.location.href.substring(indexHash+1).split('.');
            hash.map(function(d) { return parseInt(d) });
            // valido hash: 3 parametros y years (dates y files no estan definidos, valido despues)
            if(hash.length != 3 || hash[0] < 0 || hash[1] < 0 || hash[2] < 0 || hash[0] >= $scope.years.length) {
                selectLastFile();
                return;
            }
            $scope.selectYear($scope.years[hash[0]], function() {
                if(hash[1] < $scope.dates.length) {
                    $scope.selectDate($scope.dates[hash[1]], function() {
                        if(hash[2] < $scope.files.length) {
                            $scope.selectFile($scope.files[hash[2]]);
                        }
                    });
                }
            });
        }
    }

    function makePermalink() {
        var url = window.location.href.replace('#', ''),
            indexHash = url.indexOf('?');
        if(indexHash !== -1) {
            url = url.substring(0, indexHash);
        }
        return url + '?' + $scope.years.indexOf($scope.selection.year) + '.' + $scope.dates.indexOf($scope.selection.date) + '.' + $scope.files.indexOf($scope.selection.file)
    }

}])
