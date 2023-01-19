// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract EventFactory {
    address[] public deployedEvents;

    function createNewEvent(
        string memory _eventName,
        uint256 _numberOfTicketsForTheEvent,
        uint256 _ticketPrice
    ) public {
        address newEvent = address(
            new Event(
                _eventName,
                _numberOfTicketsForTheEvent,
                _ticketPrice,
                msg.sender
            )
        );
        deployedEvents.push(newEvent);
    }

    function getDeployedEvents() public view returns (address[] memory) {
        return deployedEvents;
    }
}

contract Event {
    address payable eventOwner;

    enum EventStatus {
        PRESALE,
        FORSALE,
        SOLDOUT,
        CLOSE
    }

    EventStatus status;

    struct Customer {
        string email;
        uint256 quantity;
    }

    mapping(address => Customer) public customers;

    uint256 public numberOfTicketsForTheEvent;
    uint256 public maxTicketsPerClient;
    uint256 public ticketPrice;
    uint256 public presalePrice;
    string public eventName;

    uint256 public firstFive;

    bool public locked = false;

    constructor(
        string memory _eventName,
        uint256 _numberOfTicketsForTheEvent,
        uint256 _ticketPrice,
        address _eventOwner
    ) {
        eventOwner = payable(_eventOwner);
        eventName = _eventName;
        numberOfTicketsForTheEvent = _numberOfTicketsForTheEvent;
        ticketPrice = _ticketPrice;
        presalePrice = ticketPrice / 2;
        status = EventStatus.PRESALE;
        firstFive = 5;
        maxTicketsPerClient = 3;
        emit EventCreated(
            _eventName,
            _numberOfTicketsForTheEvent,
            _ticketPrice
        );
    }

    event TicketPurchased(address indexed purchaser, uint256 quantity);
    event BalanceWithdrawn(address indexed owner, uint256 amount);
    event EventCreated(
        string eventName,
        uint256 numberOfTicketsForTheEvent,
        uint256 ticketPrice
    );
    event EventClosed(address indexed eventAddress);
    event OwnerChanged(address indexed previousOwner, address indexed newOwner);

    // first 5 tickets will be sale at 50% discount
    function buyTickets(string memory _email, uint256 _quantity)
        public
        payable
        paidEnough(_quantity)
        isNotOwner
        lock
    {
        require(
            _quantity <= maxTicketsPerClient,
            "You can buy a maximum of 3 tickets"
        );

        require(
            numberOfTicketsForTheEvent - _quantity >= 0,
            "not enough tickets available"
        );
        require(
            firstFive - _quantity >= 0,
            "not enough presale tickets available"
        );

        if (status == EventStatus.PRESALE) {
            firstFive = firstFive - (1 * _quantity);
            numberOfTicketsForTheEvent =
                numberOfTicketsForTheEvent -
                (1 * _quantity);
            if (firstFive == 0) {
                status = EventStatus.FORSALE;
            }
        } else if (status == EventStatus.FORSALE) {
            numberOfTicketsForTheEvent =
                numberOfTicketsForTheEvent -
                (1 * _quantity);
            if (numberOfTicketsForTheEvent == 0) {
                status = EventStatus.CLOSE;
                emit EventClosed(address(this));
            }
        }

        // check if the customer already bought tickets
        if (customers[msg.sender].quantity > 0) {
            require(
                _quantity + customers[msg.sender].quantity <=
                    maxTicketsPerClient,
                "You can buy a maximum of 3 tickets"
            );
            customers[msg.sender].email = _email;
            customers[msg.sender].quantity =
                customers[msg.sender].quantity +
                _quantity;
        } else {
            Customer storage newCus = customers[msg.sender];
            newCus.email = _email;
            newCus.quantity = _quantity;
        }

        emit TicketPurchased(msg.sender, _quantity);
    }

    function getEventBalance() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function viewTicketPrice() public view returns (uint256) {
    
        if( Event.status == EventStatus.PRESALE) {
            return ticketPrice / 2;
        }

        return ticketPrice;
    
    }

    function viewEventStatus() public view returns (EventStatus) {
        return Event.status;
    }


    function withdrawEventBalance() public onlyOwner lock {
        require(address(this).balance > 0, "contract has no balance");

        require(
            msg.sender == eventOwner,
            "Only the event owner can withdraw the balance"
        );

        require(
            status == EventStatus.CLOSE,
            "you can't withdraw yet, wait until the event is closed."
        );

        payable(msg.sender).transfer(address(this).balance);
        emit BalanceWithdrawn(msg.sender, address(this).balance);
    }

    function changeOwner(address newOwner) public onlyOwner {
        require(
            newOwner != address(0),
            "Invalid address provided as new owner"
        );
        eventOwner = payable(newOwner);
        emit OwnerChanged(eventOwner, newOwner);
    }

    function setMaxTicketsPerClient(uint256 newMax) public onlyOwner {
        maxTicketsPerClient = newMax;
    }

    modifier lock() {
        require(!locked, "contract is locked");
        locked = true;
        _;
        locked = false;
    }

    modifier onlyOwner() {
        require(
            eventOwner == msg.sender,
            "only the admin can perform this action."
        );
        _;
    }

    modifier paidEnough(uint256 _qty) {
        if (status == EventStatus.PRESALE) {
            require(
                presalePrice * _qty == msg.value,
                "you didn't paid enough."
            );
        } else {
            require(ticketPrice * _qty == msg.value, "you didn't paid enough.");
        }
        _;
    }

    modifier isPreSaleOpen() {
        require(firstFive > 0, "The event is not open");
        _;
    }

    modifier maxNumberOfTickets(uint256 _qty) {
        require(_qty <= 5, "you can't buy more than 5 tickets");
        _;
    }
    modifier isNotOwner() {
        require(eventOwner != msg.sender, "you can't buy tickets");
        _;
    }
}
