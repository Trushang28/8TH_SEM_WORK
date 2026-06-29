'use strict';

const { Contract } = require('fabric-contract-api');

class TimeBank extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize TimeBank Ledger ===========');

        const numUsers = 100;
        const users = [];

        for (let i = 0; i < numUsers; i++) {
            users.push({
                docType: 'user',
                userId: `user_${i}`,
                name: `Test User ${i}`,
                balance: 1000,
                version: 0,
                createdAt: new Date().toISOString()
            });
        }

        for (const user of users) {
            await ctx.stub.putState(user.userId, Buffer.from(JSON.stringify(user)));
        }

        console.info(`============= END : Initialized ${numUsers} users ===========`);
        return JSON.stringify({ status: 'initialized', userCount: numUsers });
    }

    async userExists(ctx, userId) {
        const buffer = await ctx.stub.getState(userId);
        return (!!buffer && buffer.length > 0);
    }

    // Fixed: Accepts exactly 2 parameters (userId, initialBalanceStr)
       // registerUser - Accepts ONLY 1 parameter (userId). Balance is fixed to 100.
    // This avoids Fabric's parameter counting issues.
    async registerUser(ctx, userId) {
        if (!userId) {
            throw new Error("UserId is required");
        }

        const name = `Test User ${userId}`;
        const initialBalance = 100;   // Fixed value - simple and safe

        if (await this.userExists(ctx, userId)) {
            throw new Error(`User ${userId} already exists`);
        }

        const user = {
            docType: 'user',
            userId,
            name,
            balance: initialBalance,
            version: 0,
            createdAt: new Date().toISOString()
        };

        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user)));

        console.info(`User registered: ${userId} with balance ${initialBalance}`);
        return JSON.stringify({ status: "success", userId, balance: initialBalance });
    }

    async transferTime(ctx, fromUser, toUser, minutesStr) {
        const minutes = parseInt(minutesStr);

        if (!fromUser || !toUser) throw new Error("Both fromUser and toUser are required");
        if (fromUser === toUser) throw new Error("Cannot transfer to the same user");
        if (isNaN(minutes) || minutes <= 0) throw new Error("Invalid transfer amount");

        const fromBuffer = await ctx.stub.getState(fromUser);
        const toBuffer = await ctx.stub.getState(toUser);

        if (!fromBuffer || fromBuffer.length === 0) throw new Error(`Source user ${fromUser} not found`);
        if (!toBuffer || toBuffer.length === 0) throw new Error(`Target user ${toUser} not found`);

        const from = JSON.parse(fromBuffer.toString());
        const to = JSON.parse(toBuffer.toString());

        if (from.balance < minutes) {
            throw new Error(`Insufficient Time Units in ${fromUser}`);
        }

        from.balance -= minutes;
        from.version = (from.version || 0) + 1;
        from.lastModified = new Date().toISOString();

        to.balance += minutes;
        to.version = (to.version || 0) + 1;
        to.lastModified = new Date().toISOString();

        await ctx.stub.putState(fromUser, Buffer.from(JSON.stringify(from)));
        await ctx.stub.putState(toUser, Buffer.from(JSON.stringify(to)));

        const txId = ctx.stub.getTxID();
        const txRecord = {
            docType: 'transfer',
            txId,
            fromUser,
            toUser,
            amount: minutes,
            timestamp: new Date().toISOString()
        };
        await ctx.stub.putState(`tx_${txId}`, Buffer.from(JSON.stringify(txRecord)));

        return JSON.stringify({
            status: 'success',
            txId,
            fromUser,
            toUser,
            amount: minutes
        });
    }

    async getBalance(ctx, userId) {
        if (!userId) throw new Error("UserId is required");

        const buffer = await ctx.stub.getState(userId);
        if (!buffer || buffer.length === 0) throw new Error(`User ${userId} not found`);

        const user = JSON.parse(buffer.toString());
        return JSON.stringify({
            userId,
            balance: user.balance,
            version: user.version || 0
        });
    }
}

module.exports = TimeBank;