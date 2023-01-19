// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CrowdFunding {
    uint256 public immutable deadline;

    address public owner;

    enum CampaignStatus {
        Open,
        Close,
        Successful,
        Unsuccessful
    }

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address payable[] donators;
        uint256[] donations;
        CampaignStatus status;
    }

    function isCampaignOpen(CampaignStatus _status)
        private
        pure
        returns (bool)
    {
        return _status == CampaignStatus.Open;
    }

    function isCampaignClose(CampaignStatus _status)
        private
        pure
        returns (bool)
    {
        return _status == CampaignStatus.Close;
    }

    function isCampaignSuccessful(CampaignStatus _status)
        private
        pure
        returns (bool)
    {
        return _status == CampaignStatus.Successful;
    }

    function isCampaignUnsuccessful(CampaignStatus _status)
        private
        pure
        returns (bool)
    {
        return _status == CampaignStatus.Unsuccessful;
    }

    mapping(uint256 => Campaign) public campaigns;

    bool internal locked;

    uint256 public numberOfCampaigns = 0;

    /**
     * constructor - Initializes the contract and sets the msg.sender as the owner of the contract.
     */
    constructor() {
        // set the owner of the contract
        owner = msg.sender;
        // all campaigns will have the same deadline
        deadline = 30 days;
    }

    // modifier to restrict access to the function
    modifier onlyOwner() {
        require(owner == msg.sender, "Only the owner can perform this action.");
        _;
    }

    // modifier to protected access for re-entrancy attacks
    modifier noReentrancy() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    // event emmited when a new campaign reaches the target
    event CampaginSuccessfullyFunded(Campaign campaign);

    //event CampaignFunded(Campaign   campaign, uint256 amount);

    /**
     * createCampaign - Allows the owner of the contract to create a new campaign.
     *
     * @param _owner the address of the owner of the campaign.
     * @param _title the title of the campaign.
     * @param _description a brief description of the campaign.
     * @param _target the funding target for the campaign.
     * @param _image the image url for the campaign.
     * @return the ID of the newly created campaign.
     */
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        string memory _image
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(
            campaign.status == CampaignStatus.Open,
            "This campaign is not open to fund."
        );

        require(
            campaign.deadline < block.timestamp,
            "The deadline should be a date in the future."
        );

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = block.timestamp + deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        campaign.status = CampaignStatus.Open;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    /**
     * donateToCampaign - Allows a user to donate to a specific campaign.
     *
     * @param _id the ID of the campaign to donate to.
     */
    function donateToCampaign(uint256 _id) public payable noReentrancy {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        require(campaign.status != CampaignStatus.Close, "This campaign is not open to fund.");

        require(
            campaign.deadline > block.timestamp &&
                isCampaignOpen(campaign.status),
            "The campaign is not open or has reached its goal."
        );

        require(
            campaign.amountCollected + amount <= campaign.target,
            "Donation exceeds campaign target."
        );

        campaign.donators.push(payable(msg.sender));
        campaign.donations.push(amount);

        (bool sent, ) = payable(campaign.owner).call{value: amount}("");

        if (sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }

        if (campaign.amountCollected == campaign.target) {
            campaign.status = CampaignStatus.Successful;
            emit CampaginSuccessfullyFunded(campaign);
        }
    }

    /**
     * closeCampaign - Allows the owner of the campaign to close the campaign.
     * @param _id the ID of the campaign to close.
     */
    function closeCampaign(uint256 _id) public onlyOwner {
        Campaign storage campaign = campaigns[_id];
        require(
            isCampaignOpen(campaign.status),
            " The campaign is already closed."
        );
        campaign.status = CampaignStatus.Close;
    }

    /**
     * openCampaign - Allows the owner of the campaign to open the campaign.
     * @param _id the ID of the campaign to open.
     */
    function reOpenCampaign(uint256 _id) public onlyOwner {
        Campaign storage campaign = campaigns[_id];
        require(
            isCampaignClose(campaign.status),
            " The campaign is already open."
        );
        campaign.status = CampaignStatus.Open;
    }

    // function to check the status of all campaigns in the contract
    // this function will iterate through all campaigns and check if the deadline has passed
    // if the deadline has passed and the amount collected is less than the target
    // the campaign status will be set to Unsuccessful
    function checkCampaignStatus() public {
        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage campaign = campaigns[i];
            if (
                block.timestamp > campaign.deadline &&
                campaign.amountCollected < campaign.target
            ) {
                campaign.status = CampaignStatus.Unsuccessful;
            }
        }
    }

    /**
     * getDonators - Retrieves the list of donators and their respective donations
     * for a specific campaign.
     *
     * @param _id the ID of the campaign to retrieve donators and donations for.
     * @return an array of addresses of the donators, and an array of the respective donations.
     */
    function getDonators(uint256 _id)
        public
        view
        returns (address payable[] memory, uint256[] memory)
    {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    /**
     * getCampaigns - Retrieves all the campaigns that have been created in the contract.
     *
     * @return an array of all the campaigns that have been created in the contract.
     */
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }

    /**
     * withdrawFunds - Allows the owner of a campaign to withdraw the funds that have been collected for that campaign.
     *
     * @param _id the ID of the campaign to withdraw funds for.
     */
    function withdrawFunds(uint256 _id) public noReentrancy {
        require(
            msg.sender == campaigns[_id].owner,
            "Only the owner of the Campaign can withdraw the funds."
        );

        Campaign storage campaign = campaigns[_id];

        require(
            isCampaignSuccessful(campaign.status),
            "The campaign has not reached the target, you can't withdraw the funds"
        );
 
        require(campaign.owner != address(0), "Owner not set");

        payable(campaign.owner).transfer(campaign.amountCollected);
    }

    function refund(uint256 _id) private noReentrancy onlyOwner {
        Campaign storage campaign = campaigns[_id];
        require(
            isCampaignUnsuccessful(campaign.status),
            "The campaign has not reached the target"
        );
        for (uint256 i = 0; i < campaign.donators.length; i++) {
            campaign.donators[i].transfer(campaign.donations[i]);
        }
    }
}
