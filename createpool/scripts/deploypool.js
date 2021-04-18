const Factory = artifacts.require('Factory.sol');
const Router = artifacts.require('Router.sol');
const Pair = artifacts.require('Pair.sol');
const Token1 = artifacts.require('token1.sol');
const Token2 = artifacts.require('token2.sol');

module.exports = async done => {
  try {
    // const [admin, _] = await web3.eth.getAccounts();
    const factory = await Factory.at('0xcd19B5Ad58FbFfC6E5fbecEfa376014b9A6bE249');
    const router = await Router.at('0xcF58D60705A07136648c79991d4A769b25dc4ef1');
    const token1 = await Token1.new();
    const token2 = await Token2.new();
    const pairAddress = await factory.createPair.call(token1.address, token2.address);
    const tx = await factory.createPair(token1.address, token2.address);
    await token1.approve(router.address, 10000);
    await token2.approve(router.address, 10000);
    await router.addLiquidity(
      token1.address,
      token2.address,
      90000,
      90000,
      10000,
      10000,
      "0xe95745a8F4E3cDb1cF5bfFD4A94F0B249e99f489",
      Math.floor(Date.now() / 1000) + 60 * 10
    );
    const pair = await Pair.at(pairAddress);
    const balance = await pair.balanceOf("0xe95745a8F4E3cDb1cF5bfFD4A94F0B249e99f489");
    console.log(`balance LP: ${balance.toString()}`);
  } catch (e) {
    console.log(e);
  }
  done();
};