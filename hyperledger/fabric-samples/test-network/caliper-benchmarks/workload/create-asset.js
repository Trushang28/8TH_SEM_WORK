// 'use strict';

// const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

// class RegisterUserWorkload extends WorkloadModuleBase {

//     async submitTransaction() {

//         const userId = `user_${this.workerIndex}_${Date.now()}`;
//         const name = `User${this.workerIndex}`;

//         await this.sutAdapter.sendRequests({
//             contractId: 'timebank',   // IMPORTANT: your chaincode name
//             contractFunction: 'registerUser',
//             invokerIdentity: 'User1',
//             contractArguments: [userId, name],
//             readOnly: false
//         });
//     }
// }

// function createWorkloadModule() {
//     return new RegisterUserWorkload();
// }

// module.exports.createWorkloadModule = createWorkloadModule;
