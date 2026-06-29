'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class ReadBalanceWorkload extends WorkloadModuleBase {

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
        this.totalUsers = roundArguments.totalUsers || 100;
    }

    async submitTransaction() {
        const userId = `user_${Math.floor(Math.random() * this.totalUsers)}`;
        
        await this.sutAdapter.sendRequests({
            contractId: 'timebank',
            contractFunction: 'getBalance',
            invokerIdentity: 'User1',
            contractArguments: [userId],
            readOnly: true
        });
    }
}

function createWorkloadModule() {
    return new ReadBalanceWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;