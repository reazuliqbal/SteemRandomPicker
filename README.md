# Steem Random Comment Picker

SteemRandomPicker is a simple random comment picker which utilizes the Fisher-Yates shuffle algorithm to pick a random Steem comment. Its intended use could be in the selection of contest winner. User can filter based on `follow`, `resteem`, and `reputation` of participants.


### How to Use

 - Enter steem post's URL in the textbox. URL from any steem interface would work as long as it is in `author/permalink` format.
 - Select appropriate filters for the contest. Follow and resteem is not required by default. If required select `required to participate`, if follow and resteem should count as another entry select `count as +1 entry`. If you want to filter based on reputation, enter your minimum required reputation score.
 - Click `get a random winner` button.
 - A randomly selected winner will appear below along with comment body and permalink to the comment.
 - If there is any problem with the steem or hivemind node, a user can change nodes using the Settings modal.
 
 <center>
  
 ![](https://steemitimages.com/p/TZjG7hXReeVoAvXt2X6pMxYAb3q65xMju8wryWxKrsghkL1aNvoQaGDdVbSSa9DLYwEHT969wSUq6nE2Y1aHR9BZf3bDxqPYDqPeNkoFWqaayFowL2uPBWByRZJTHc8K6c4wJ5hdNHZJq3)

</center>
  
### Technology
- jQuery
- dSteem
- Hivemind RPC by @emrebeyler

### Contributing

Feel free to fork the repository and make changes. If you find any issues please create a GitHub issue or let me know in the comments below.
