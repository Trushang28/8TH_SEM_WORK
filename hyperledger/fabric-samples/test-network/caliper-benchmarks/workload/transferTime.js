'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class TransferTimeWorkload extends WorkloadModuleBase {

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
        this.totalUsers = roundArguments.totalUsers || 100;
    }

    async submitTransaction() {
        let from = `user_${Math.floor(Math.random() * this.totalUsers)}`;
        let to = `user_${Math.floor(Math.random() * this.totalUsers)}`;

        while (from === to) {
            to = `user_${Math.floor(Math.random() * this.totalUsers)}`;
        }

        const amount = '5';

        await this.sutAdapter.sendRequests({
            contractId: 'timebank',
            contractFunction: 'transferTime',
            invokerIdentity: 'User1',
            contractArguments: [from, to, amount],
            readOnly: false
        });
    }
}

function createWorkloadModule() {
    return new TransferTimeWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;