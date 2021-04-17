const Factory = artifacts.require('Factory.sol');
const Router = artifacts.require('Router.sol');
const Pair = artifacts.require('Pair.sol');
const Token1 = artifacts.require('token1.sol');
const Token2 = artifacts.require('token2.sol');

module.exports = async done => {
  try {
    //const [admin, _] = await web3.eth.getAccounts();
    const factory = await Factory.at('0x89ABFef8EBc5538ee45E48e8e072f8FfF295cDEd');
    const router = await Router.at('0x95272CA5778Bd74547A564c5B5905668a25C76B9');
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
      10000,
      10000,
      "0x3CD88a0a843aBBAb812f822C0d5a1f252caDDe95",
      Math.floor(Date.now() / 1000) + 60 * 10
    );
    const pair = await Pair.at(pairAddress);
    const balance = await pair.balanceOf(admin);
    console.log(`balance LP: ${balance.toString()}`);
  } catch (e) {
    console.log(e);
  }
  done();
};