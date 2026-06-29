'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class CreateUserWorkload extends WorkloadModuleBase {
    constructor() {
        super();
        this.txIndex = 0;
    }

    async submitTransaction() {
        this.txIndex++;
        const userId = `user_${this.workerIndex}_${this.txIndex}_${Date.now()}`;

        const request = {
            contractId: 'timebank',
            contractFunction: 'CreateUser',
            contractArguments: [userId],
            timeout: 30
        };

        await this.sutAdapter.sendRequests(request);
    }
}

function createWorkloadModule() {
    return new CreateUserWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;