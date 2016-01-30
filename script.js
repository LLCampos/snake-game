var grid = {
    lines: 40,
    columns: 40,
    // coordinates of center of grid
    x_middle : function() {return this.columns / 2;},
    y_middle : function() {return this.lines / 2;}
};

var highscores = {
    scores : [],

    sortScores : function() {
        highscores.scores.sort(function(a,b) {return a-b;});
        highscores.scores.reverse();
    },

    updateHighscoresScreen : function() {
        for (var i in highscores.scores) {
            $("#highscores").find('li').eq(i).text(highscores.scores[i]);
        }
    }
};


var snake = {
    // initial body of the snake, 4 squares long
    body : [[grid.x_middle(), grid.y_middle()], [grid.x_middle() - 1, grid.y_middle()], [grid.x_middle() - 2, grid.y_middle()]] ,
    // initial direction of the snake
    direction : [1,0],

    // returns JQuery object corresponding to the tail of the snake
    tail : function() {
        var position_tail = this.body.slice(-1)[0];
        return $('.line').eq(position_tail[1] - 1).find('.square').eq(position_tail[0] - 1);
    },

    // returns JQuery object corresponding to the head of the snake
    head : function() {
        return $('.line').eq(this.body[0][1] - 1).find('.square').eq(this.body[0][0] - 1);
    },

    // updates snake positions
    newPositions : function() {
        var new_head_x_position = this.body[0][0] + this.direction[0];
        var new_head_y_position = this.body[0][1] + this.direction[1];

        this.body.unshift([new_head_x_position, new_head_y_position]);
        this.body.pop();
    }
};


var user = {
    points : 0
};

var pause = false;

// duration of time unit
var snake_speed = 70;

var resetGame = function() {
    // does everything it is needed to start a new game
    snake.body = [[grid.x_middle(), grid.y_middle()], [grid.x_middle() - 1, grid.y_middle()], [grid.x_middle() - 2, grid.y_middle()]];
    snake.direction = [1,0];
    user.points = 0;
    updatePoints();

    if (typeof ticks !== 'undefined') {
        clearInterval(ticks);
    }

    render();
    positionSnake();
    appearFood();


    $(document).off('keydown');
    $(document).off('keypress');
};

var changeDirection = function(event) {
    // change snake direction
    switch (event.which) {
        case 39: // ->
            if (!(snake.direction[0] == -1 && snake.direction[1] === 0)) {
                snake.direction = [1,0];
            }
            break;
        case 38: // ^
            if (!(snake.direction[0] === 0 && snake.direction[1] === 1)) {
                snake.direction = [0,-1];
            }
            break;
        case 37: // <-
            if (!(snake.direction[0] === 1 && snake.direction[1] === 0)) {
                snake.direction = [-1,0];
            }
            break;
        case 40: // V
            if (!(snake.direction[0] === 0 && snake.direction[1] === -1)) {
                snake.direction = [0,1];
            }
            break;
    }
};

var pressPause = function() {
    // pause/dispause the game
    if (pause) {
        ticks = setInterval(tick, snake_speed);
        pause = false;
        $(document).on('keydown', changeDirection);
    } else {
        clearInterval(ticks);
        pause = true;
        $(document).off('keydown', changeDirection);
    }
};


var keyPressDuringGameAction = function(event) {
    // call functions depending on the key pressed
    switch (event.which) {
        case 112:
            pressPause();
    }
};

var render = function() {
    // creates game grid on the html
    $('#grid').empty();
    for (i = 0; i < grid.lines; i++) {
        $('#grid').append('<div class="line"></div');
    }
    for (i = 0; i < grid.columns; i++) {
        $('.line').append('<div class="square"></div');
    }
};

var despositionSnake = function() {
    // takes snake of the view
    for (var i in snake.body) {
       $('.line').eq(snake.body[i][1] - 1).find('.square').eq(snake.body[i][0] - 1).removeClass('snake-body snake-head');
    }
};

var positionSnake = function() {
    // puts snake on the view
    for (i = 1; i < snake.body.length; i++) {
       $('.line').eq(snake.body[i][1] - 1).find('.square').eq(snake.body[i][0] - 1).addClass('snake-body');
    }

    $('.line').eq(snake.body[0][1] - 1).find('.square').eq(snake.body[0][0] - 1).addClass('snake-head');
};


var move = function() {
    // moves snake
    despositionSnake();
    snake.newPositions();
    positionSnake();
};

var appearFood = function() {
    // makes a piece of food appear in a random location in the game grid
    food_x_position = Math.floor((Math.random() * grid.columns));
    food_y_position = Math.floor((Math.random() * grid.lines));
    $('.line').eq(food_y_position).find('.square').eq(food_x_position).addClass('food');
};

var updatePoints = function() {
    // updates, on the html, the number of user points
    $(".n-points").text(user.points);
};


var eat = function() {
    // increases the number of user points and makes appear another piece of food
    user.points += 1;
    updatePoints();
    appearFood();
};

var lookForFood = function() {
    // verifies if snake ate some piece of food
    if (snake.head().hasClass('food')) {
        eat();
    }
};


var grow = function() {
    // makes snake grow 1 square
    if (snake.tail().hasClass('food')) {
        snake.body.push(snake.body.slice(-1)[0]);
        snake.tail().removeClass('food');
    }
};

var checkForColisionsWithBody = function() {
    if (snake.head().hasClass('snake-body') && snake.head().hasClass('snake-head')) {
        return true;
    }
};

var checkForColisionsWithWall = function() {
    if (snake.body[0][0] > grid.columns || snake.body[0][0] < 1 || snake.body[0][1] > grid.lines || snake.body[0][1] < 1) {
        return true;
    }
};

var checkForColisions = function() {
    if (checkForColisionsWithBody() || checkForColisionsWithWall()) {
        updateHighscores(user.points);
        newGame();
    }
};

var tick = function() {
    // makes one time unit pass
    grow();
    move();
    lookForFood();
    checkForColisions();
};

var updateHighscores  = function(new_score) {
    highscores.scores.push(new_score);
    highscores.sortScores();
    highscores.scores = highscores.scores.slice(0,10);
    localStorage.setItem('scores', JSON.stringify(highscores.scores));
    highscores.updateHighscoresScreen();
};

var getScores = function() {
    // gets highscores from user localstorage
    var scoresInLocalStorage = localStorage.getItem('scores');

    if (scoresInLocalStorage) {
        highscores.scores = JSON.parse(scoresInLocalStorage);
        highscores.updateHighscoresScreen();
    }
};

var newGame = function() {
    getScores();
    resetGame();
    $(document).on('keydown', changeDirection);
    $(document).on('keypress', keyPressDuringGameAction);
    ticks = setInterval(tick, snake_speed);
};


$( document ).ready(newGame);
