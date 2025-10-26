# Foundry

### Deploy

```shell
$ forge script script/Deploy.s.sol:DeployScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast --verify --etherscan-api-key $ETHERSCAN_KEY
```


```shell
== Logs ==
  StakingToken deployed at: 0x6815e76CE475451D42363f4b55533720f19Ebada
  StakingContract deployed at: 0xF708183DA2f773c213F93A3220eC5922fd73C720
  Deployment Parameters:
  Initial APR: 20
  Minimum Lock Duration: 604800
  APR Reduction Per Thousand: 1
  Emergency Withdraw Penalty: 10
```



