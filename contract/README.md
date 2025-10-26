# Foundry

### Deploy

```shell
$ forge script script/Deploy.s.sol:DeployScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast --verify --etherscan-api-key $ETHERSCAN_KEY
```


```shell
== Logs ==
Base Sepolia
  StakingToken deployed at: 0x1573Cbbe7fcdeFe94Bbda4854Cac622C02b983EF
  StakingContract deployed at: 0x250C8478F8d292b6C1323054CEFA3bbF5845e439
  Deployment Parameters:
  Initial APR: 20
  Minimum Lock Duration: 604800
  APR Reduction Per Thousand: 1
  Emergency Withdraw Penalty: 10
  Operation successful

Celo Sepolia
  StakingToken deployed at: 0xa20A783bB0f2A9A8Cf0fB8776ff83757d965391d
  StakingContract deployed at: 0xd52C356EBD736A7d54fA0dF75b3a2794522C6d93
  Deployment Parameters:
  Initial APR: 20
  Minimum Lock Duration: 604800
  APR Reduction Per Thousand: 1
  Emergency Withdraw Penalty: 10
  Operation successful

```



