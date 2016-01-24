var grid = {
    lines: 34,
    columns: 34
};


var snake = {
    body : [[17,17],[16,17],[15,17]] ,
    direction : [1,0],

};

var changeDirection = function(event) {
    switch (event.which) {
        case 39: // ->
            snake.direction = [1,0];
            break;
        case 38: // ^
            snake.direction = [0,-1];
            break;
        case 37: // <-
            snake.direction = [-1,0];
            break;
        case 40: // V
            snake.direction = [0,1];
            break;
    }
};

var render = function() {
                for (i = 0; i < grid.lines; i++) {
                    $('#grid').append('<div class="line"></div');
                }
                for (i = 0; i < grid.columns; i++) {
                    $('.line').append('<div class="square"></div');
                }
        };

var positionSnake = function() {

    for (var i in snake.body) {
       $('.line').eq(snake.body[i][1] - 1).find('.square').eq(snake.body[i][0] - 1).toggleClass('snake-body');
    }

    $('.line').eq(snake.body[0][1] - 1).find('.square').eq(snake.body[0][0] - 1).toggleClass('snake-head');
};

var newPositions = function() {
    var new_head_x_position = snake.body[0][0] + snake.direction[0];
    var new_head_y_position = snake.body[0][1] + snake.direction[1];

    snake.body.unshift([new_head_x_position, new_head_y_position]);
    snake.body.pop();

};


var move = function() {
        positionSnake();
        newPositions();
        positionSnake();
};



$( document ).ready(function() {
    render();
    positionSnake();
    $(document).on('keydown', changeDirection);
    setInterval(move, 200);
});