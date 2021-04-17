const Factory = artifacts.require('Factory.sol');
const Router = artifacts.require('Router.sol');
const Pair = artifacts.require('Pair.sol');
const Token1 = artifacts.require('token1.sol');
const Token2 = artifacts.require('token2.sol');

module.exports = async done => {
  try {
    //const [admin, _] = await web3.eth.getAccounts();
    const factory = await Factory.at('0x78A47245BC7BDaa0DB7c19b7B6116E1E11e9fE20');
    const router = await Router.at('0xb51613D3634683CE09b54A34155Eecbc173eB384');
    const token1 = await Token1.new();
    const token2 = await Token2.new();
    const pairAddress = await factory.createPair.call(token1.address, token2.address);
    const tx = await factory.createPair(token1.address, token2.address);
    await token1.approve(router.address, 10000);
    await token2.approve(router.address, 10000);
    await router.addLiquidity(
      token1.address,
      token2.address,
      9000,
      9000,
      9000,
      9000,
      '0xe95745a8F4E3cDb1cF5bfFD4A94F0B249e99f489',
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