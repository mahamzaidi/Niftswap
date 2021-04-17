//SPDX-License-Identifier: MIT

const { loadFixture } = require("@ethereum-waffle/provider");
const { BigNumber } = require("@ethersproject/bignumber");

var BnbStaking = artifacts.require("./BnbStaking.sol");
var _masternift = artifacts.require("./MasterNift.sol");
var NiftToken = artifacts.require("./NiftToken.sol");
var SousNift = artifacts.require("./SousNift.sol");
var NiftBar = artifacts.require("./SpecialNiftBar.sol");
var Timelock = artifacts.require("./Timelock.sol");


const INITIAL_MINT = '25000';
const BLOCKS_PER_HOUR = (3600 / 3) // 3sec Block Time
const TOKENS_PER_BLOCK = '10';
const BLOCKS_PER_DAY = 24 * BLOCKS_PER_HOUR
const TIMELOCK_DELAY_SECS = (3600 * 6);
const STARTING_BLOCK = 4853714;
const REWARDS_START = String(STARTING_BLOCK + (BLOCKS_PER_HOUR * 6))
const FARM_FEE_ACCOUNT = '0xe95745a8F4E3cDb1cF5bfFD4A94F0B249e99f489'

const logTx = (tx) => {
    console.dir(tx, { depth: 3 });
}

module.exports = async function (deployer, network) {

    let niftTokenInstance;
    let specialNiftBarInstance;
    let masterNiftInstance;
    let feeAccount = FARM_FEE_ACCOUNT;
    let currentAccount = "0xe95745a8F4E3cDb1cF5bfFD4A94F0B249e99f489";
    let wrapped_bnb = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
    let lpaddress = "0x1Ba4d47F3Bd171bC293513E5804E9f6981E89A5B";

    /**Deploy nift token */
    deployer.deploy(NiftToken).then((result) => {
        niftTokenInstance = result;

        /**Mint initial tokens for liquidity */
        return niftTokenInstance.mint('0xe95745a8F4E3cDb1cF5bfFD4A94F0B249e99f489', BigNumber.from(INITIAL_MINT).mul(BigNumber.from(String(10 ** 18))));
    }).then((tx) => {
        logTx(tx);
        /**
         * Deploy SpecialNiftBar
         */
        return deployer.deploy(NiftBar, NiftToken.address)
    }).then((instance) => {
        specialNiftBarInstance = instance;
        /**
        * Deploy MasterNift
        */
        if (network == "mainnet") {
            console.log(`Deploying MasterNift with BSC MAINNET settings.`)
            return deployer.deploy(_masternift,
                NiftToken.address,
                NiftBar.address,
                feeAccount,    //dev address                                             
                BigNumber.from(TOKENS_PER_BLOCK).mul(BigNumber.from(String(10 ** 18))), REWARDS_START
            )
        }
        console.log(`Deploying _masternift on Testnet`)
        return deployer.deploy(_masternift,
            NiftToken.address,
            NiftBar.address,
            feeAccount,
            BigNumber.from(TOKENS_PER_BLOCK).mul(BigNumber.from(String(10 ** 18))),
            0,

        )

    }).then((instance) => {
        masterNiftInstance = instance;
        /**
         * TransferOwnership of Nift to _masternift
         */
        return niftTokenInstance.transferOwnership(_masternift.address);
    }).then((tx) => {
        logTx(tx);
        /**
         * TransferOwnership of SpecialNiftBar to _masternift
         */
        return specialNiftBarInstance.transferOwnership(_masternift.address);
    }).then((tx) => {
        logTx(tx);
        /**
         * Deploy SousNift
         */
        if (network == "mainnet") {
            console.log(`Deploying SousNift with BSC MAINNET settings.`)
            return deployer.deploy(SousNift,
                NiftBar.address,
                BigNumber.from(TOKENS_PER_BLOCK).mul(BigNumber.from(String(10 ** 18))),
                REWARDS_START,   //startblock                         
                STARTING_BLOCK + (BLOCKS_PER_DAY * 365),  //endblock
            )
        }
        console.log(`Deploying SousNift with DEV/TEST settings`)
        return deployer.deploy(SousNift,
            NiftBar.address,
            BigNumber.from(TOKENS_PER_BLOCK).mul(BigNumber.from(String(10 ** 18))),                                      // _rewardPerBlock
            STARTING_BLOCK + (BLOCKS_PER_HOUR * 6),   // _startBlock
            '99999999999999999',                      // _endBlock
        )
    })
        .then((tx) => {
            logTx(tx);
            /**
            * Deploy BnbStaking
            */
            if (network == "mainnet") {
                console.log(`Deploying BnbStaking with BSC MAINNET settings.`)
                return deployer.deploy(BnbStaking,
                    lpaddress,
                    NiftToken.address,   //_reward token              
                    BigNumber.from(TOKENS_PER_BLOCK).mul(BigNumber.from(String(10 ** 18))),  //_reward per block                                   
                    REWARDS_START,      //start block                      
                    STARTING_BLOCK + (BLOCKS_PER_DAY * 365),  //bonusendblock
                    feeAccount, //admin address
                    wrapped_bnb //address _wbnb
                )
            } console.log(`Deploying BnbStaking with DEV/TEST settings`)

            return deployer.deploy(BnbStaking,
                lpaddress,
                NiftToken.address,   //_reward token              
                BigNumber.from(TOKENS_PER_BLOCK).mul(BigNumber.from(String(10 ** 18))),  //_reward per block                                   
                REWARDS_START,      //start block                      
                STARTING_BLOCK + (BLOCKS_PER_DAY * 365),  //bonusendblock
                feeAccount, //admin address
                wrapped_bnb
            )
        }).then(() => {
            /**
             * Deploy Timelock
             */
            return deployer.deploy(Timelock, currentAccount, TIMELOCK_DELAY_SECS);
        }).then(() => {
            console.log('Rewards Start at block: ', REWARDS_START)
            console.table({
                MasterNift: _masternift.address,
                SousNift: SousNift.address,
                NiftToken: NiftToken.address,
                NiftBar: NiftBar.address,
                Timelock: Timelock.address,
                BnbStaking: BnbStaking.address,
            })
        });
};


