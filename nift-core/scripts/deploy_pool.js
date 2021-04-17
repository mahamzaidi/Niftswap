const Factory = artifacts.require('../contracts/NiftFactory.sol');
const Router = artifacts.require('../../niftswap-periphery/contracts/NiftRouter01.sol');
//import '../../niftswap-periphery/contracts/Routers/NiftRouter01.sol';
const Pair = artifacts.require('../contracts/NiftPair.sol');
const _Token1 = artifacts.require('../contracts/token1.sol');
const _Token2 = artifacts.require('../contracts/token2.sol');

module.exports = async done => {
    try {
        const [admin, _] = await web3.eth.getAccounts();
        const factory = await Factory.at('0x54A35A97F3BAA726E1D6d2D8C693F709a7636C8F');
        const router = await Router.at('0x824840E3690f99Fc6044Eb9ddAEE3baf5c0Eb812');
        const _token1 = await _Token1.new();
        const _token2 = await _Token2.new();
        const pairAddress = await factory.createPair.call(token1.address, token2.address);
        const tx = await factory.createPair(token1.address, token2.address);
        await _token1.approve(router.address, 10000);
        await _token2.approve(router.address, 10000);
        await router.addLiquidity(
            _token1.address,
            _token2.address,
            9000,
            9000,
            10000,
            10000,
            admin,
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