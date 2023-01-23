
<h1>CrowdFunding Contract</h1>
This contract is a basic implementation of a crowdfunding platform on the Ethereum blockchain. It allows for the creation and funding of campaigns by multiple users.
<h2>Features</h2><ul><li>Campaigns have a set deadline and target amount</li><li>Users can donate to campaigns as long as they are open and have not reached their target</li><li>Campaigns can be in one of four states: Open, Close, Successful, Unsuccessful</li><li>Only the owner of the contract can create new campaigns</li></ul><h2>Usage</h2><h3>Creating a campaign</h3>
To create a new campaign, call the `createCampaign` function with the following parameters:
<ul><li>`_title` (string): Title of the campaign</li><li><code>_description</code> (string): Description of the campaign</li><li><code>_target</code> (uint256): Target amount to be raised</li><li><code>_image</code> (string): Image to be associated with the campaign</li></ul><h3>Donating to a campaign</h3>
To donate to a campaign, call the `donateToCampaign` function with the following parameter:
<ul><li>`_id` (uint256): ID of the campaign to donate to</li></ul><h3>Campaign Status</h3>
The status of a campaign can be checked using the following functions:
<ul><li>`isCampaignOpen`</li><li><code>isCampaignClose</code></li><li><code>isCampaignSuccessful</code></li><li><code>isCampaignUnsuccessful</code></li></ul><h2>Limitations</h2><ul><li>All campaigns have the same deadline</li><li>The contract owner cannot create a campaign</li><li>The contract is not optimized for scale and may not perform well with a large number of campaigns</li></ul>

<h2>Test cases done</h2>


#### Crowdfunding contract test cases
    
    ✔ should deploy the contract
    ✔ should create a new campaign
    ✔ should allow the owner of the contract to close a campaign
    ✔ should not allow a user to close a campaign
    ✔ should allow the owner to re-open a campaign
    ✔ should not allow a user to re-open a campaign
    ✔ should allow a user to donate to a campaign
    ✔ should not allow a user to donate to a closed campaign
    ✔ should not allow a user to donate more than the campaign target
    ✔ should allow the owner of the campaign to withdraw funds if the campaign is successful


  10 passing (1s)
</code>

<h2>SPDX-License-Identifier</h2>
MIT
<h2>Pragma</h2>
This contract is compatible with Solidity version 0.8.9 and above.
