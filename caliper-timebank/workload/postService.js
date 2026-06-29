'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class PostServiceWorkload extends WorkloadModuleBase {
    constructor() {
        super();
        this.txIndex = 0;
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        // Create a user for this worker to post services under
        const userId = `svcuser_${workerIndex}`;
        const request = {
            contractId: 'timebank',
            contractFunction: 'CreateUser',
            contractArguments: [userId],
            timeout: 30
        };
        try {
            await this.sutAdapter.sendRequests(request);
        } catch (err) {
            // user may already exist from a previous run
        }
    }

    async submitTransaction() {
        this.txIndex++;
        const serviceId = `svc_${this.workerIndex}_${this.txIndex}_${Date.now()}`;
        const userId = `svcuser_${this.workerIndex}`;
        const type = this.txIndex % 2 === 0 ? 'offer' : 'request';

        const request = {
            contractId: 'timebank',
            contractFunction: 'PostService',
            contractArguments: [serviceId, userId, type, '1'],
            timeout: 30
        };

        await this.sutAdapter.sendRequests(request);
    }
}

function createWorkloadModule() {
    return new PostServiceWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;