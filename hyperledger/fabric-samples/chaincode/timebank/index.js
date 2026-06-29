'use strict';

const { Contract } = require('fabric-contract-api');
const TimeBankContract = require('./lib/timebank');

module.exports.contracts = [TimeBankContract];