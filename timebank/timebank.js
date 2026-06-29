'use strict';

const { Contract } = require('fabric-contract-api');

class TimeBankContract extends Contract {

    // =========================
    // USER MANAGEMENT
    // =========================
    async CreateUser(ctx, userId) {
        const exists = await this.UserExists(ctx, userId);
        if (exists) {
            throw new Error(`User ${userId} already exists`);
        }

        const user = {
            userId,
            balance: 10, // initial credits
            rating: 0,
            totalRatings: 0
        };

        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user)));
        return JSON.stringify(user);
    }

    async UserExists(ctx, userId) {
        const data = await ctx.stub.getState(userId);
        return data && data.length > 0;
    }

    async GetUser(ctx, userId) {
        const data = await ctx.stub.getState(userId);
        if (!data || data.length === 0) {
            throw new Error(`User ${userId} not found`);
        }
        return data.toString();
    }

    // =========================
    // SERVICE POSTING
    // =========================
    async PostService(ctx, serviceId, userId, type, hours) {
        const exists = await ctx.stub.getState(serviceId);
        if (exists && exists.length > 0) {
            throw new Error(`Service ${serviceId} already exists`);
        }

        const service = {
            serviceId,
            userId,
            type, // "offer" or "request"
            hours: parseFloat(hours),
            status: "open",
            matchedWith: null
        };

        await ctx.stub.putState(serviceId, Buffer.from(JSON.stringify(service)));
        return JSON.stringify(service);
    }

    async GetService(ctx, serviceId) {
        const data = await ctx.stub.getState(serviceId);
        if (!data || data.length === 0) {
            throw new Error(`Service ${serviceId} not found`);
        }
        return data.toString();
    }

    // =========================
    // MATCH SERVICES
    // =========================
    async MatchService(ctx, serviceId1, serviceId2) {

        const s1Bytes = await ctx.stub.getState(serviceId1);
        const s2Bytes = await ctx.stub.getState(serviceId2);

        if (!s1Bytes || !s2Bytes) {
            throw new Error("One of the services not found");
        }

        const s1 = JSON.parse(s1Bytes.toString());
        const s2 = JSON.parse(s2Bytes.toString());

        if (s1.status !== "open" || s2.status !== "open") {
            throw new Error("Service already matched");
        }

        // Ensure one is offer and other is request
        if (s1.type === s2.type) {
            throw new Error("Invalid match: both services same type");
        }

        // Match them
        s1.status = "matched";
        s2.status = "matched";
        s1.matchedWith = serviceId2;
        s2.matchedWith = serviceId1;

        await ctx.stub.putState(serviceId1, Buffer.from(JSON.stringify(s1)));
        await ctx.stub.putState(serviceId2, Buffer.from(JSON.stringify(s2)));

        return JSON.stringify({ message: "Services matched" });
    }

    // =========================
    // COMPLETE SERVICE + TRANSFER
    // =========================
    async CompleteService(ctx, serviceId) {

        const serviceBytes = await ctx.stub.getState(serviceId);
        if (!serviceBytes) {
            throw new Error("Service not found");
        }

        const service = JSON.parse(serviceBytes.toString());

        if (service.status !== "matched") {
            throw new Error("Service not matched yet");
        }

        const matchedServiceBytes = await ctx.stub.getState(service.matchedWith);
        const matchedService = JSON.parse(matchedServiceBytes.toString());

        let provider, receiver;

        if (service.type === "offer") {
            provider = service.userId;
            receiver = matchedService.userId;
        } else {
            provider = matchedService.userId;
            receiver = service.userId;
        }

        const providerBytes = await ctx.stub.getState(provider);
        const receiverBytes = await ctx.stub.getState(receiver);

        const pUser = JSON.parse(providerBytes.toString());
        const rUser = JSON.parse(receiverBytes.toString());

        if (rUser.balance < service.hours) {
            throw new Error("Receiver has insufficient balance");
        }

        // Transfer credits
        rUser.balance -= service.hours;
        pUser.balance += service.hours;

        // Update states
        await ctx.stub.putState(provider, Buffer.from(JSON.stringify(pUser)));
        await ctx.stub.putState(receiver, Buffer.from(JSON.stringify(rUser)));

        service.status = "completed";
        matchedService.status = "completed";

        await ctx.stub.putState(serviceId, Buffer.from(JSON.stringify(service)));
        await ctx.stub.putState(service.matchedWith, Buffer.from(JSON.stringify(matchedService)));

        return JSON.stringify({
            message: "Service completed and credits transferred",
            provider,
            receiver
        });
    }

    // =========================
    // RATING SYSTEM
    // =========================
    async RateUser(ctx, userId, rating) {
        const data = await ctx.stub.getState(userId);

        if (!data) {
            throw new Error("User not found");
        }

        const user = JSON.parse(data.toString());

        rating = parseFloat(rating);

        user.rating =
            ((user.rating * user.totalRatings) + rating) /
            (user.totalRatings + 1);

        user.totalRatings += 1;

        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user)));

        return JSON.stringify(user);
    }

    // =========================
    // QUERY ALL
    // =========================
    async GetAll(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const results = [];

        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                results.push(JSON.parse(res.value.value.toString()));
            }

            if (res.done) {
                await iterator.close();
                break;
            }
        }

        return JSON.stringify(results);
    }
}

module.exports = TimeBankContract;