var grid = {
    lines: 34,
    columns: 34
};


var snake = {
    body : [[17,17],[16,17],[15,17]] ,
    direction : [1,0],
    tail : function() {
        return this.body.slice(-1)[0];
    }
};


var user = {
    points : 0
};


var changeDirection = function(event) {
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

var render = function() {
                for (i = 0; i < grid.lines; i++) {
                    $('#grid').append('<div class="line"></div');
                }
                for (i = 0; i < grid.columns; i++) {
                    $('.line').append('<div class="square"></div');
                }
        };

var despositionSnake = function() {
// actualiza a view tendo em conta as novas posições
    for (var i in snake.body) {
       $('.line').eq(snake.body[i][1] - 1).find('.square').eq(snake.body[i][0] - 1).removeClass('snake-body snake-head');
    }
};

var positionSnake = function() {
// actualiza a view tendo em conta as novas posições
    for (var i in snake.body) {
       $('.line').eq(snake.body[i][1] - 1).find('.square').eq(snake.body[i][0] - 1).addClass('snake-body');
    }

    $('.line').eq(snake.body[0][1] - 1).find('.square').eq(snake.body[0][0] - 1).addClass('snake-head');
};

var newPositions = function() {
// actualiza as posições da cobra
    var new_head_x_position = snake.body[0][0] + snake.direction[0];
    var new_head_y_position = snake.body[0][1] + snake.direction[1];

    snake.body.unshift([new_head_x_position, new_head_y_position]);
    snake.body.pop();

};

var move = function() {
// move a cobra
    despositionSnake();
    newPositions();
    positionSnake();
};

var appearFood = function() {
    food_x_position = Math.floor((Math.random() * grid.columns) + 1);
    food_y_position = Math.floor((Math.random() * grid.lines) + 1);
    $('.line').eq(food_y_position).find('.square').eq(food_x_position).addClass('food');
};

var updatePoints = function() {
    $(".n-points").text(user.points);
};


var eat = function() {
    user.points += 1;
    updatePoints();
    appearFood();
};

var lookForFood = function() {
    var head = $('.line').eq(snake.body[0][1] - 1).find('.square').eq(snake.body[0][0] - 1);
    if (head.hasClass('food')) {
        eat();
    }
};


var tick = function() {
    grow();
    move();
    lookForFood();
};

var grow = function() {
    var tail = $('.line').eq(snake.tail()[1] - 1).find('.square').eq(snake.tail()[0] - 1);
    if (tail.hasClass('food')) {
        snake.body.push(snake.tail());
        tail.removeClass('food');
    }
};



$( document ).ready(function() {
    render();
    positionSnake();
    appearFood();
    $(document).on('keydown', changeDirection);
    setInterval(tick, 100);
});
