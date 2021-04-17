const { assert } = require("chai");

const NiftToken = artifacts.require('NiftToken');

contract('NiftToken', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.nift = await NiftToken.new({ from: minter });
    });


    it('mint', async () => {
        await this.nift.mint(alice, 1000, { from: minter });
        assert.equal((await this.nift.balanceOf(alice)).toString(), '1000');
    })
});
