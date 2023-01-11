//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


contract Coffee {
    // Event to emit when a Memo is created.
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );
    
    // Memo struct.
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }
    
    // Address of contract deployer. Marked payable so that
    // we can withdraw to this address later.
    address payable owner;
    bool isBuyingCoffee = false;

    // List of all memos received from coffee purchases.
    Memo[] memos;

    constructor() {
        // Store the address of the deployer as a payable address.
        // When we withdraw funds, we'll withdraw here.
        owner = payable(msg.sender);
    }

    /**
     * @dev fetches all stored memos
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    /**
     * @dev buy a coffee for owner (sends an ETH tip and leaves a memo)
     * @param _name name of the coffee purchaser
     * @param _message a nice message from the purchaser
     */
    function buyCoffee(string memory _name, string memory _message) public payable {

        // prevent re-entrancy attack
        require(isBuyingCoffee == false, "Another transaction is currently buying coffee, please wait for it to complete.");
        isBuyingCoffee = true;



        // Must accept more than 0 ETH for a coffee.
        require(msg.value > 0, "can't buy coffee for free!");

        require(bytes(_name).length <= 25,"Name provided is too long");
        require(bytes(_message).length <= 256,"message provided is too long");
   
        
        // Add the memo to storage!
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        // Emit a NewMemo event with details about the memo.
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }


    // Modifier to restrict access to the function
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }


    function isOwner() public view returns(bool){
        return owner == msg.sender;
    }


	event NewWithdrawl(uint256 amount);

    /**
     * @dev send the entire balance stored in this contract to the owner
     */
   
    function withdraw() public onlyOwner{
          
           (bool success, ) = owner.call{value:address(this).balance}("");
           // success should be true
           require(success,"Withdraw failed");
           emit NewWithdrawl(address(this).balance);
        }

    function viewBalance() public view onlyOwner returns(uint256) {
        return address(this).balance;
    }
}