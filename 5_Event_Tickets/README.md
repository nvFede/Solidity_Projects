

<h1>Event Management Contract</h1>
This smart contract allows for the creation, management, and purchase of event tickets on the Ethereum blockchain. The contract is made up of two main parts: the `EventFactory` and the <code>Event</code> contract.
<h2>EventFactory</h2>
The `EventFactory` contract is responsible for creating new <code>Event</code> contracts and keeping track of all the events that have been deployed on the blockchain. It has two main functions:
<ul><li>
`createNewEvent`: This function allows the contract owner to create a new event by providing the event name, the number of tickets available, and the ticket price. It creates a new <code>Event</code> contract and adds its address to the <code>deployedEvents</code> array.
</li><li><p><code>getDeployedEvents</code>: This function returns an array of all the addresses of the <code>Event</code> contracts that have been deployed.</p></li></ul><h2>Event</h2>
The `Event` contract represents an individual event and is responsible for managing the sale and purchase of tickets for that event. It has several properties and functions:
<ul><li>
Properties:
<ul><li>`eventOwner`: The address of the contract owner.</li><li><code>status</code>: The status of the event. Can be one of <code>PRESALE</code>, <code>FORSALE</code>, <code>SOLDOUT</code>, or <code>CLOSE</code>.</li><li><code>customers</code>: A mapping of addresses to customer data, including their email and the number of tickets they have purchased.</li><li><code>numberOfTicketsForTheEvent</code>: The total number of tickets available for the event.</li><li><code>maxTicketsPerClient</code>: The maximum number of tickets a customer can purchase.</li><li><code>ticketPrice</code>: The price of a single ticket.</li><li><code>presalePrice</code>: The price of a ticket during the presale period.</li><li><code>eventName</code>: The name of the event.</li><li><code>firstFive</code>: The number of tickets available during the presale period.</li><li><code>locked</code>: Whether the event is locked and no longer accepting purchases.</li></ul></li><li><p>Events:</p><ul><li><code>TicketPurchased</code>: Emitted when a customer successfully purchases tickets.</li><li><code>BalanceWithdrawn</code>: Emitted when the contract owner withdraws the contract balance.</li><li><code>EventCreated</code>: Emitted when a new event is created.</li><li><code>EventClosed</code>: Emitted when the event is closed and no longer accepting purchases.</li><li><code>OwnerChanged</code>: Emitted when the contract owner is changed.</li></ul></li><li><p>Functions:</p><ul><li><code>buyTickets</code>: Allows customers to purchase tickets for the event. They must provide their email, the number of tickets they want to purchase, and send the correct amount of ether to the contract. The function will check that the customer is not the owner, that they have not already purchased the maximum allowed number of tickets, and that there are enough tickets available before completing the purchase.</li><li><code>withdrawBalance</code>: Allows the contract owner to withdraw the balance of the contract.</li><li><code>lock</code>: Allows the contract owner to lock the event and prevent any further purchases.</li><li><code>changeOwner</code>: Allows the contract owner to transfer ownership of the contract to another address.</li></ul></li></ul>

<h1>How to use</h1><ol><li>
To create a new event, use the `createNewEvent` function in the <code>EventFactory</code> contract by providing the event name, number of tickets, and ticket price.



## Test Cases

EventFactory

    ✔ should create new event

Event

    ✔ should allow to see ticket price (pre-sale)
    ✔ should buy tickets and emit the correct event
    ✔ should not allow the owner to buy tickets
    ✔ should not allow buying more than the maximum allowed tickets per customer
    ✔ should revert if the customer doesn't paid enough for the tickets
    ✔ should close the pre-sale after the first five tickets bought
