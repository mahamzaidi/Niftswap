var Factory = artifacts.require("./NiftFactory.sol");
var Pair = artifacts.require("./NiftPair.sol");
var migration = artifacts.require("./Migrations.sol");
var nifterc20 = artifacts.require("./NiftERC20.sol");
var ptoken1 = artifacts.require("./token1.sol");
var ptoken2 = artifacts.require("./token2.sol");

module.exports = async function (deployer, network, addresses) {

  console.log("You are using network ", network);
  //The factory function's constructor sets the address which will receive trading fee
  await deployer.deploy(Factory, addresses[0]); //deployer sends the transaction for deployment

  const factory = await Factory.deployed(); // waits for the above transaction to be mined

  let token1Address, token2Address;
  if (network === 'mainnet') {
    token1Address = '';
    token2Address = '';
  } else {
    await deployer.deploy(ptoken1);
    await deployer.deploy(ptoken2);
    const _Token1 = await ptoken1.deployed();
    const _Token2 = await ptoken2.deployed();
    token1Address = _Token1.address;
    token2Address = _Token2.address;
  }

  await factory.createPair(token1Address, token2Address);
  await deployer.deploy(nifterc20);
  await deployer.deploy(Pair);
  await deployer.deploy(migration);


  console.table({
    NiftFactory: Factory.address,
    NiftPair: Pair.address,
    Migration: migration.address,
    NiftERC20: nifterc20.address,
    token1: token1Address,
    token2: token2Address
  })
};