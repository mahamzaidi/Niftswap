pragma solidity =0.5.16;

import "./interfaces/INiftFactory.sol";
import "./NiftPair.sol";

contract NiftFactory is INiftFactory {
    bytes32 public constant INIT_CODE_PAIR_HASH =
        keccak256(abi.encodePacked(type(NiftPair).creationCode));

    address public feeTo;
    address public feeToSetter;

    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    /**Emitted each time a pair is created via createPair.
    token0 is guaranteed to be strictly less than token1 by sort order.
    The final uint log value will be 1 for the first pair created, 2 for the second, etc.
    */
    event PairCreated(
        address indexed token0,
        address indexed token1,
        address pair,
        uint256
    );

    //address that receives payment for the trading fees
    constructor(address _feeToSetter) public {
        feeToSetter = _feeToSetter;
    }

    function allPairsLength() external view returns (uint256) {
        return allPairs.length;
    }

    //creates a pair of tokens if they do not already exist, emits pair created event.
    function createPair(address tokenA, address tokenB)
        external
        returns (address pair)
    {
        require(tokenA != tokenB, "Nift: IDENTICAL_ADDRESSES");
        (address token0, address token1) =
            tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), "Nift: ZERO_ADDRESS");
        require(getPair[token0][token1] == address(0), "Nift: PAIR_EXISTS"); // single check is sufficient
        bytes memory bytecode = type(NiftPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        INiftPair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, "Nift: FORBIDDEN");
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, "Nift: FORBIDDEN");
        feeToSetter = _feeToSetter;
    }

    function getHash() public pure returns (bytes32){
        return(INIT_CODE_PAIR_HASH);
    }
}
