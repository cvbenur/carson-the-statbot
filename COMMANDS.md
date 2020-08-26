# Commands

## I. Info

### 1. Help

**Usage :** `help`

**Description :** Displays a list of commands for Carson.

**Admin only :** No.

<br>

### 2. Ping

**Usage :** `ping`

**Description :** Pings Carson and displays latency.

**Admin only :** No.

<br>

### 3. Start

**Usage :** `start`

**Description :** A simple command to get started with Carson.

**Admin only :** No.

<br>

## II. Settings

### 1. Prefix

**Usage :** `prefix <new_prefix>`

**Description :** Sets or resets Carson's prefix. Use `prefix <new_prefix><whitespace_identifier>` in order to add a whitespace at the end of your prefix. Use `prefix default` to reset.

**Admin only by default :** Yes.

<br>

### 2. Setspace

**Usage :** `setspace <new_identifier>`

**Description :** Sets or resets Carson's whitespace identifier. Use `setspace <new_identifier><whitespace_identifier>` in order to add a whitespace at the end of your prefix. Use `setspace default` to reset.

**Admin only by default :** Yes.

<br>

### TODO: 3. Perms

**Usage :** `perms <allow/deny/clear> <role/user> <permission>`

**Description :** Changes a member's or a role's permissions set when using Carson.

**Admin only by default :** Yes.

<br>

### 4. Reset

**Usage :** `reset`

**Description :** Resets Carson's settings to default.

**Admin only by default :** Yes.

<br>

## III. Stats

### 1. Stats

**Usage :** `stats <member?> <channel?> <number of weeks?> [phrase_to_find?]`

**Description :** Compiles stats on the given parameters. Parameters marked here with `?` are optionnal and will default to "all". Phrases must be given between brackets (`[` at the beginning and `]` at the end), and with `_` between each word.

> The phrase `how are you` can be found by typing `[how_are_you]`.

**Admin only by default :** No.

<br>

### TODO: 2. Graph

**Usage :** `graph <member?> <channel?> <number of weeks?> [phrase?]`

**Description :** Compiles stats on the given parameters and outputs a graph on the compiled data. Parameters marked here with `?` are optionnal and will default to "all". Phrases must be given between brackets (`[` at the beginning and `]` at the end), and with `_` between each word.

> The phrase `how are you` can be found by typing `[how_are_you]`.

**Admin only by default :** No.

<br>
