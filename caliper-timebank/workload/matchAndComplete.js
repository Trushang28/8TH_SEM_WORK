// 'use strict';

// const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

// class MatchCompleteWorkload extends WorkloadModuleBase {
//     constructor() {
//         super();
//         this.txIndex = 0;
//     }

//     async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
//         await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
//         // No pre-created users needed anymore
//     }

//     async submitTransaction() {
//         this.txIndex++;
//         const tag = `${this.workerIndex}_${this.txIndex}_${Date.now()}`;

//         // Each transaction gets its OWN unique provider and receiver
//         const provider = `provider_${tag}`;
//         const receiver = `receiver_${tag}`;
//         const offerId  = `offer_${tag}`;
//         const requestId = `req_${tag}`;

//         // Create fresh users for this transaction
//         await this.sutAdapter.sendRequests({
//             contractId: 'timebank',
//             contractFunction: 'CreateUser',
//             contractArguments: [provider],
//             timeout: 30
//         });

//         await this.sutAdapter.sendRequests({
//             contractId: 'timebank',
//             contractFunction: 'CreateUser',
//             contractArguments: [receiver],
//             timeout: 30
//         });

//         // Post offer
//         await this.sutAdapter.sendRequests({
//             contractId: 'timebank',
//             contractFunction: 'PostService',
//             contractArguments: [offerId, provider, 'offer', '1'],
//             timeout: 30
//         });

//         // Post request
//         await this.sutAdapter.sendRequests({
//             contractId: 'timebank',
//             contractFunction: 'PostService',
//             contractArguments: [requestId, receiver, 'request', '1'],
//             timeout: 30
//         });

//         // Match
//         await this.sutAdapter.sendRequests({
//             contractId: 'timebank',
//             contractFunction: 'MatchService',
//             contractArguments: [offerId, requestId],
//             timeout: 30
//         });

//         // Complete
//         await this.sutAdapter.sendRequests({
//             contractId: 'timebank',
//             contractFunction: 'CompleteService',
//             contractArguments: [offerId],
//             timeout: 30
//         });
//     }
// }

// function createWorkloadModule() {
//     return new MatchCompleteWorkload();
// }

// module.exports.createWorkloadModule = createWorkloadModule;

'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class MatchCompleteWorkload extends WorkloadModuleBase {
    constructor() {
        super();
        this.txIndex = 0;
    }

    async submitTransaction() {
        this.txIndex++;
        const tag = `${this.workerIndex}_${this.txIndex}_${Date.now()}`;
        const provider  = `provider_${tag}`;
        const receiver  = `receiver_${tag}`;
        const offerId   = `offer_${tag}`;
        const requestId = `req_${tag}`;

        await this.sutAdapter.sendRequests({ contractId: 'timebank', contractFunction: 'CreateUser', contractArguments: [provider], timeout: 30 });
        await this.sutAdapter.sendRequests({ contractId: 'timebank', contractFunction: 'CreateUser', contractArguments: [receiver], timeout: 30 });
        await this.sutAdapter.sendRequests({ contractId: 'timebank', contractFunction: 'PostService', contractArguments: [offerId, provider, 'offer', '1'], timeout: 30 });
        await this.sutAdapter.sendRequests({ contractId: 'timebank', contractFunction: 'PostService', contractArguments: [requestId, receiver, 'request', '1'], timeout: 30 });
        await this.sutAdapter.sendRequests({ contractId: 'timebank', contractFunction: 'MatchService', contractArguments: [offerId, requestId], timeout: 30 });
        await this.sutAdapter.sendRequests({ contractId: 'timebank', contractFunction: 'CompleteService', contractArguments: [offerId], timeout: 30 });
    }
}

function createWorkloadModule() { return new MatchCompleteWorkload(); }
module.exports.createWorkloadModule = createWorkloadModule;