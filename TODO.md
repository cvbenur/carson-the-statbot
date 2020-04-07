# TODO

## **List of commands left to implement :**

### **The `help` command**
Sending back a link to the command manual

- **`help`**            :    Sends back a link to a command manual

#### **Answer to `stats` command would be in the form :**
>
> #### **Carson says**
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

- **`stats global <player> <time?>`** : DoB, Nbr of invt, Nbr of kick, Nbr of ban, Nbr of msg (%)
(No value for `time` -> since DoB)

- **`stats global <time?>`** : DoB, Nbr of chann, Nbr of player, Nbr of msg, Nbr of msg/pers (%)
(No value for `time` -> since creation of server)

- **`stats <global | channel> <player?> <word`**(a string between 2 '_')**`> <time?>`** : Nbr of occurncs of `word` over `time`, Nbr of occurncs of `word`/channel (%) over `time`, Nbr of occurncs of `word`/pers & /channel (%) over `time`
(No value for `time` -> since creation of server (for `global`) or channel (for `channel`))

### **Keywords for the `stats` command**
Forms recognized by the bot.

- **`<channel>`** arguments must be preceeded by **`c:`**.
> **E.g.** **`c:chan`** will refer to channel 'chan'.

- **`<player>`** arguments must be preceeded by a **`p:`**.
> **E.g.** **`p:dude`** will refer to player 'dude'.

- **`<time>`** arguments must be preceeded by a **`t:`**.
> **E.g.** **`t:3`** will refer to '3 weeks'.

#### **Answers to `stats` command would be in the form :**
>
> #### **Carson says**
>
> Stats compiled ! They're patiently waiting for you right over there :
>
> www.link-to-stats.xyz
>
> There ya go !

<br>

### **The `prefix` command**
Setting the bot's name on the server

- **`prefix <prefix>`** : Sets the bot's prefix to `prefix` on the server
(Value `default` for `prefix` resets the prefix to default value ('**`-c`**'))

#### **Answers to `prefix` command would be in the form :**

When giving a value for `prefix` :
>
> #### **Carson says**
>
> Gotcha ! I will now only answer when you tell me `prefix`.<br>
> Forget eeeeverything else...<br>
> **\*Stares into the distance\***


When giving the current value for `prefix` :
>
> #### **Carson says**
>
> Uhm... That's already my prefix.<br>
> Did you not realise this as you were typing this very command ?


When giving resetting the default value of `prefix` :
>
> #### **Carson says**
>
> '`prefix`', you say ? I haven't heard that prefix in a while...<br>
> **\*Suddenly looks at you suspiciously\***<br>
> Where did you get that from ?
> 
> Alright. I guess I'll accept this.

<br>

### **The `perms` command**
Setting the bot's name on the server

- **`perms <role> <list>,<of>,<commands>`** : Allows the `role` role to use the commands from the `list of commands`

#### **Answers to `perms` command would be in the form :**

>
> #### **Carson says**
>
> Heard, and applied.<br>
> Members of the `role` role will now be able to use the commands :
> - `list`
> - `of`
> - `commands`
>
> Use them wisely, guys.
