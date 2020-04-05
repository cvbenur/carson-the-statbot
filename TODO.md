# TODO

## **List of commands left to implement :**

### **The `help` command**
Sending back a link to the command manual

- **`help`**            :    Sends back a link to a command manual

#### **Answer to `stats` command would be in the form :**
>
> #### **StatBot says**
>
> Don't panic ! The counsel you seek is right here :
>
> www.link-to-help.xyz
>
> You're very welcome. Don't mention it. Just don't. Stop mentioning it.

<br>

### **The `stats` command**
Computing stats and sending back links to the generated stats.

- **`stats help`**      :    Sends back a link to the `stats` command manual

- **`stats <channel> <time?>`**  :   DoB, Nbr of msg, Nbr (list) of pers, Nbr of msg/Pers (%)
(No value for `time` -> since creation of channel)

- **`stats <channel> <player> <time?>`** :  Time span, Nbr of msg, % of msg
(No value for `time` -> since creation of channel)

- **`stats <player> <time?>`** : DoB, Nbr of invt, Nbr of kick, Nbr of ban, Nbr of msg (%)
(No value for `time` -> since DoB)

- **`stats global <time?>`** : DoB, Nbr of chann, Nbr of player, Nbr of msg, Nbr of msg/pers (%)
(No value for `time` -> since creation of server)

- **`stats <global | channel> <player?> <word`**(a string between 2 '_')**`> <time?>`** : Nbr of occurncs of `word` over `time`, Nbr of occurncs of `word`/channel (%) over `time`, Nbr of occurncs of `word`/pers & /channel (%) over `time`
(No value for `time` -> since creation of server (for `global`) or channel (for `channel`))

#### **Answers to `stats` command would be in the form :**
>
> #### **StatBot says**
>
> Stats compiled ! They're patiently waiting for you right over there :
>
> www.link-to-stats.xyz
>
> There ya go !

<br>

### **The `setname` command**
Setting the bot's name on the server

- **`setname <name?>`** : Sets the bot's name to `name` on the server
(No value for `name` resets the name to default value ('**Carson**'))

#### **Answers to `setname` command would be in the form :**

For a new value of `name` :
> #### **StatBot says**
>
> What do you mean, you changed my name ?
> Wait... You mean I'm `name` now ?
> Aaaalright ! I dig it !

When reseting `name` to default value :
> #### **StatBot says**
>
> Wait... I think I'm remembering something...
> Yes ! My name ! It was always **Carson** !

When seting `name` to `Carson` :
> #### **StatBot says**
>
> Is '**Carson**' my new name ?
> Sounds strangely familiar... I like it, though.