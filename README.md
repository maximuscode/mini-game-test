# test mini-game plugin
<img width="200" src="https://raw.githubusercontent.com/wowvendor/wowvendor-junior-test/97bf30dc6a091261bd6fc6409e9c8e2791c3d745/images/donut.svg">

### initialize plugin using shortcode:
```js
[mini_game]
[mini_game_statistics]
```

## given:
mini-game application. the goal of the game is to reach the finish line without colliding with an obstacle.\the application implements the basic methods of character control: ```run, stop, jump```;
## tasks:
1. create a wordpress plugin based on the application;
2. in the plugin, add the ability to display a mini-game on a specific page (page) or post page using a switch;
3. when you open the page, a pop-up window appears on top of the mini-game asking you to start the game;
4. donut goes through the game automatically after pressing the start button. after the end of the game, a window pops up with the result of the race and an offer to try again. the donut must complete the game successfully (that is, jump over the stone and reach the finish line);
5. write a php script that receives the race results and writes them to the wordpress database. data is recorded for the game as a whole, not for an individual page;
6. send race results every time the character reaches the finish line or trips over an obstacle;
7. under the block with the game, game statistics are displayed, sorted by time.


### race results:
1. position of the obstacle;
2. race time;
3. the distance at which the character made the jump;
4. size of the obstacle;
5. result of the race (success or failure).

