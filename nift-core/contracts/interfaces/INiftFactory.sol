pragma solidity >=0.5.0;

interface INiftFactory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    //protocol-wide charge per charge will be in effect if feeTo is not address(0) (0x0000000000000000000000000000000000000000)
    function feeTo() external view returns (address);

    //returns the address allowed to change feeTo
    function feeToSetter() external view returns (address);
    
    /**Returns the address of the pair for tokenA and tokenB, if it has been created, else address(0) (0x0000000000000000000000000000000000000000).*/
    function getPair(address tokenA, address tokenB) external view returns (address pair);
    
    //Returns addresses of the created pairs. Pass 0 for 1st pair and so on.
    function allPairs(uint) external view returns (address pair);

    //Returns total number of pairs created by the factory so far.
    function allPairsLength() external view returns (uint);

    //create a token pair if it doesnt exist already.
    function createPair(address tokenA, address tokenB) external returns (address pair);

    //set the address of the recepient who will be recepient of the charge.
    function setFeeTo(address) external;

    //set the address which is allowed to change feeTo
    function setFeeToSetter(address) external;
}
