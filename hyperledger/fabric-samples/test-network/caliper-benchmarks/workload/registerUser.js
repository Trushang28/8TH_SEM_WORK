'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class RegisterUserWorkload extends WorkloadModuleBase {

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
        this.workerIndex = workerIndex;
        this.txIndex = 0;
    }

    async submitTransaction() {
        // Highly unique ID
        const userId = `reg_${this.workerIndex}_${this.txIndex}_${Date.now()}`;

        await this.sutAdapter.sendRequests({
            contractId: 'timebank',
            contractFunction: 'registerUser',
            invokerIdentity: 'User1',
            contractArguments: [userId],
            readOnly: false,
            timeout: 40
        });

        this.txIndex++;

        // Small delay to reduce contention
        await new Promise(resolve => setTimeout(resolve, 10));
    }
}

function createWorkloadModule() {
    return new RegisterUserWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;