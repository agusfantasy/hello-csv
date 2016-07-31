'use strict'

const fs = require('fs');
const parse = require('csv-parse');
const helper = require('./helper');
const async = require('async');

function readCsv(cb) {
    let dataCsv;
    async.series([
        function (fn) {
            fs.readFile(__dirname + '/sample.csv', function (err, loadedCsv) {
                if (err) return fn(err);

                dataCsv = loadedCsv;
                fn(null, loadedCsv);
            });
        },

        function (fn) {
            parse(dataCsv, function (err, parsed) {
                fn(err, parsed);
            });
        },
        ], function (err, results) {
            if (err) return cb(err);

            let data = results[1];
            data.shift();
            let result = [];

            async.forEachOf(data, function (col, k, callback) {
                let fullName = col[0] + ' ' + col[1];

                let obj = {
                    full_name: fullName,
                    company_name: col[2],
                    address: col[3],
                    city: col[3],
                    county: col[4],
                    state: col[5],
                    zip: col[6],
                    phone1: col[7] != undefined ? col[7] : '',
                    phone2: col[8] != undefined ? col[8] : '',
                    email: col[9]  != undefined ? col[9] : '',
                    web: col[10]  != undefined ? col[10] : '',
                };
                result.push(obj);
            });

            cb(null, result);
        });
}

function sendLog() {
    readCsv(function (err, data) {
        if (err) return console.error(err);

        async.forEachOf(data, function (value, key, calback) {
            let lineToLog;
            async.series([
                function (fn) {
                    helper.sendSms(value, function (err, sendingStatus) {
                        if (err) return fn(err);
                        lineToLog = sendingStatus;
                        fn(null, sendingStatus);
                    });
                },

                function (fn) {
                    if (lineToLog) {
                        helper.logToS3(lineToLog, function (err, loggingStatus) {
                            if (err) return fn(err);
                            return fn(null, loggingStatus);
                        });

                        return;
                    }

                    return fn('send SMS error');

                },
            ], function (err, results) {
                if (err) return console.error(err);
                console.log(value, results);
            });
        });
    });
}

sendLog();
