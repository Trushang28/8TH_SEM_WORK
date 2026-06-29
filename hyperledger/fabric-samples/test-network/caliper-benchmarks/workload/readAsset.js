// 'use strict';

// const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

// class TransferTimeWorkload extends WorkloadModuleBase {

//     async submitTransaction() {

//         const fromUser = `user_${this.workerIndex}_0`;
//         const toUser = `user_${this.workerIndex}_1`;

//         await this.sutAdapter.sendRequests({
//             contractId: 'timebank',
//             contractFunction: 'transferTime',
//             invokerIdentity: 'User1',
//             contractArguments: [fromUser, toUser, "1"],
//             readOnly: false
//         });
//     }
// }

// function createWorkloadModule() {
//     return new TransferTimeWorkload();
// }

// module.exports.createWorkloadModule = createWorkloadModule;
