# NS Storing Bot


Finds and sends all active disruptions and strikes from the NS into discord channels.


## Config
```json
{
    "token": "your bot's discord token goes here",
    "nsapi": "NS api key goes here (you need the Disruptions API)",
    "stakingId": "Discord channel ID to post strikes",
    "storingId": "Discord channel ID to post disruptions",
    "roles": {
      "keyword (optional)": "<@&roleid>"
    }
}
```
