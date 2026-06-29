# Time Unit Asset (TU) Bind

A Hyperledger Fabric blockchain application implementing **Time Unit Asset (TU) Bind** architecture for managing transaction workflows, including **Transition**, **Open Query Transfer**, and performance benchmarking using **Hyperledger Caliper**.

---

## Features

- Time Unit (TU) Asset Management
- Transition Workflow
- Open Query Transfer
- Ledger Initialization
- User Balance Management
- Hyperledger Caliper Benchmarking
- Transaction Throughput Analysis
- Resource Consumption Monitoring
- Custom Endorsement Policy Support

---

## Project Architecture

```text
                 +----------------+
                 |     Client     |
                 +--------+-------+
                          |
                          |
                 +--------v--------+
                 | Hyperledger     |
                 | Fabric Network  |
                 +--------+--------+
                          |
        -----------------------------------------
        |                  |                   |
+---------------+  +---------------+  +---------------+
|   Org1 Peer   |  |   Org2 Peer   |  |   Orderer     |
+---------------+  +---------------+  +---------------+
                          |
                    +-----v------+
                    | Chaincode  |
                    |  TimeBank  |
                    +-----+------+
                          |
        -----------------------------------------
        |           |            |              |
   TU Asset     Transition   Query Transfer   Ledger
````

---

## Prerequisites

Before running the project, install the following:

* Ubuntu/Linux
* Docker
* Docker Compose
* Node.js (v16 or later)
* npm
* Hyperledger Fabric Samples
* Hyperledger Fabric CA
* Hyperledger Caliper

---

# Start the Fabric Network

Create the Fabric network and channel.

```bash
./network.sh up createChannel -c mychannel -ca
```

---

# Deploy the Chaincode

Deploy the JavaScript chaincode.

```bash
./network.sh deployCC \
    -ccn timebank \
    -ccp ../chaincode/timebank/javascript \
    -ccl javascript
```

---

# Initialize the Ledger

Initialize the blockchain ledger with sample assets.

```bash
peer chaincode invoke \
  -o localhost:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --tls \
  --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" \
  -C mychannel \
  -n timebank \
  --peerAddresses localhost:7051 \
  --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" \
  -c '{"function":"initLedger","Args":[]}'
```

---

# Query User Balance

Check the balance of a registered user.

```bash
peer chaincode query \
    -C mychannel \
    -n timebank \
    -c '{"function":"getBalance","Args":["user_0"]}'
```

Example output:

```json
{
  "userId": "user_0",
  "balance": 1000,
  "version": 0
}
```

---

# Approve Chaincode Definition

```bash
peer lifecycle chaincode approveformyorg \
  -o localhost:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --channelID mychannel \
  --name timebank \
  --version 1.0 \
  --package-id timebank_2:42679165975a2c3972c57af64a590dcf66fcc8c4fa6f3b3bcbbb8115ccdfef63 \
  --sequence 2 \
  --tls \
  --cafile $ORDERER_CA
```

---

# Restart the Network

Stop the network:

```bash
./network.sh down
```

Start it again:

```bash
./network.sh up createChannel -c mychannel -ca
```

---

# Deploy Local Chaincode

```bash
./network.sh deployCC \
  -ccn timebank \
  -ccp ../timebank \
  -ccl javascript \
  -c mychannel
```

---

# Run Hyperledger Caliper Benchmark

Execute the benchmark using Caliper.

```bash
npx caliper launch manager \
  --caliper-workspace ./ \
  --caliper-networkconfig networks/fabric-network.yaml \
  --caliper-benchconfig benchmarks/benchmark.yaml \
  --caliper-flow-only-test \
  --caliper-fabric-gateway-enabled
```

---

# Deploy with Custom Endorsement Policy

```bash
./network.sh down

./network.sh up createChannel -c mychannel -ca

./network.sh deployCC \
  -ccn timebank \
  -ccp ../timebank \
  -ccl javascript \
  -c mychannel \
  -ccep "OutOf(1,'Org1MSP.peer','Org2MSP.peer')"
```

---

# Performance Evaluation

The blockchain performance is evaluated using Hyperledger Caliper.

### Performance Metrics

* Transactions Per Second (TPS)
* Average Latency
* Maximum Concurrent Transactions
* Success Rate
* Failure Rate
* Block Commit Time
* CPU Utilization
* Memory Consumption
* Network Bandwidth
* Maximum Worker Nodes

---

# Resource Monitoring

Monitor Docker resource utilization during benchmarking.

```bash
docker stats
```

Recommended metrics:

| Resource | Description                      |
| -------- | -------------------------------- |
| CPU      | Peer and Orderer CPU utilization |
| Memory   | Docker container memory usage    |
| Network  | Incoming and outgoing traffic    |
| Disk     | Ledger storage growth            |

---

# Benchmark Workflow

```text
Start Network
      │
      ▼
Deploy Chaincode
      │
      ▼
Initialize Ledger
      │
      ▼
Execute Benchmark
      │
      ▼
Collect Performance Metrics
      │
      ▼
Analyze
 ├── TPS
 ├── Latency
 ├── CPU Usage
 ├── Memory Usage
 ├── Network Usage
 └── Maximum Worker Nodes
```

---

# Project Structure

```text
project/
│
├── benchmarks/
│   └── benchmark.yaml
│
├── networks/
│   └── fabric-network.yaml
│
├── chaincode/
│   └── timebank/
│
├── config/
│   ├── benchmark.yaml
│   └── networkConfig.yaml
│
├── test-network/
│
└── README.md
```

---

# Expected Results

After executing the benchmark, the following metrics should be available:

* Maximum Transactions Per Second (TPS)
* Average Transaction Latency
* CPU Utilization
* Memory Consumption
* Network Throughput
* Success Rate
* Failure Rate
* Scalability with Increasing Worker Nodes

---

# Clean Up

Stop and remove the Hyperledger Fabric network.

```bash
./network.sh down
```

---

# Notes

* Ensure Docker is running before starting the Fabric network.
* Initialize the ledger before executing benchmark tests.
* Verify the Caliper network and benchmark configuration files before running tests.
* Monitor Docker resource usage during benchmarking using `docker stats` or similar monitoring tools.

```
```

