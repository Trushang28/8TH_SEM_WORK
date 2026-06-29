'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class InitLedgerWorkload extends WorkloadModuleBase {

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
        this.sutAdapter = sutAdapter;
        console.log(`Worker ${workerIndex}: Preparing to initialize TimeBank ledger...`);
    }

    async submitTransaction() {
        // initLedger takes no arguments
        await this.sutAdapter.sendRequests({
            contractId: 'timebank',
            contractFunction: 'initLedger',
            invokerIdentity: 'User1',
            contractArguments: [],           // empty array - no args needed
            readOnly: false,
            timeout: 30                      // give it more time as it creates 50 users
        });

        console.log('initLedger transaction submitted successfully');
    }
}

function createWorkloadModule() {
    return new InitLedgerWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;