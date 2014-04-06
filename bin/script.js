/// <reference path="main.ts"/>
var Flappy = (function () {
    function Flappy(top, left, direction, factory) {
        this.top = top;
        this.left = left;
        this.direction = direction;
        this.factory = factory;
        this.div = $('<div class="flappy flappy1">');
        this.factory.tileContainer.append($('<div class="tile">').addClass('tile-position-' + this.left + '-' + this.top).append(this.div));
    }
    Flappy.prototype.moveInDirection = function (direction) {
        this.div.removeClass('flappy-up flappy-down flappy-right flappy-left').addClass('flappy-' + Direction[direction].toLowerCase());
        this._flap();

        if (direction === 0 /* UP */)
            this.top -= 1;
        else if (direction === 1 /* DOWN */)
            this.top += 1;
        else if (direction === 2 /* LEFT */)
            this.left -= 1;
        else
            this.left += 1;

        if (this._isOutOfBounds()) {
            throw "out of bounds";
        }
        this.direction = direction;
        this.drawPosition();
    };
    Flappy.prototype.drawPosition = function () {
        var _this = this;
        this.div.closest('.tile').attr('class').split(/\s+/).forEach(function (_className) {
            if (_className.indexOf('tile-position') === 0) {
                _this.div.closest('.tile').removeClass(_className);
            }
        });
        this.div.closest('.tile').addClass('tile-position-' + this.left + '-' + this.top);
    };
    Flappy.prototype._isOutOfBounds = function () {
        return (this.left < 0 || this.top < 0 || this.left >= this.factory.board[0].length || this.top >= this.factory.board.length);
    };
    Flappy.prototype._flap = function () {
        var _this = this;
        this.div.attr('class').split(/\s+/).forEach(function (_className) {
            if (_className === 'flappy1') {
                _this.div.addClass('flappy2').removeClass('flappy1');
            } else if (_className === 'flappy2') {
                _this.div.addClass('flappy1').removeClass('flappy2');
            }
        });
    };
    Flappy.prototype.die = function () {
        this.div.addClass('dead');
    };
    Flappy.prototype.destroy = function () {
        this.div.closest('.tile').remove();
        this.factory.flappy = null;
    };
    return Flappy;
})();
/// <reference path="main.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Action = (function () {
    function Action(div) {
        this.div = $('<div class="tile-inner">');
        this.div.appendTo($('<div class="tile">').appendTo(div));
    }
    Action.prototype.execute = function (stack) {
        return 0 /* UP */;
    };
    return Action;
})();

var RandomAction = (function (_super) {
    __extends(RandomAction, _super);
    function RandomAction(div) {
        _super.call(this, div);
        this.div.text('?');
    }
    RandomAction.prototype.execute = function (stack) {
        var r = Math.random();
        if (r < 0.25)
            return 0 /* UP */;
        else if (r < 0.5)
            return 1 /* DOWN */;
        else if (r < 0.75)
            return 2 /* LEFT */;
        else
            return 3 /* RIGHT */;
    };
    return RandomAction;
})(Action);

var UpAction = (function (_super) {
    __extends(UpAction, _super);
    function UpAction(div) {
        _super.call(this, div);
        this.div.html('&#8593;');
    }
    UpAction.prototype.execute = function (stack) {
        return 0 /* UP */;
    };
    return UpAction;
})(Action);
var DownAction = (function (_super) {
    __extends(DownAction, _super);
    function DownAction(div) {
        _super.call(this, div);
        this.div.html('&#8595;');
    }
    DownAction.prototype.execute = function (stack) {
        return 1 /* DOWN */;
    };
    return DownAction;
})(Action);
var LeftAction = (function (_super) {
    __extends(LeftAction, _super);
    function LeftAction(div) {
        _super.call(this, div);
        this.div.html('&#8592;');
    }
    LeftAction.prototype.execute = function (stack) {
        return 2 /* LEFT */;
    };
    return LeftAction;
})(Action);
var RightAction = (function (_super) {
    __extends(RightAction, _super);
    function RightAction(div) {
        _super.call(this, div);
        this.div.html('&#8594;');
    }
    RightAction.prototype.execute = function (stack) {
        return 3 /* RIGHT */;
    };
    return RightAction;
})(Action);
var DupAction = (function (_super) {
    __extends(DupAction, _super);
    function DupAction(div) {
        _super.call(this, div);
        this.div.html('DUP');
    }
    DupAction.prototype.execute = function (stack) {
        var val = stack.pop();
        stack.push(val);
        stack.push(val);
        return null;
    };
    return DupAction;
})(Action);
var SwapAction = (function (_super) {
    __extends(SwapAction, _super);
    function SwapAction(div) {
        _super.call(this, div);
        this.div.html('SWP');
    }
    SwapAction.prototype.execute = function (stack) {
        var val1 = stack.pop();
        var val2 = stack.pop();
        stack.push(val1);
        stack.push(val2);
        return null;
    };
    return SwapAction;
})(Action);
var AddAction = (function (_super) {
    __extends(AddAction, _super);
    function AddAction(div) {
        _super.call(this, div);
        this.div.html('+');
    }
    AddAction.prototype.execute = function (stack) {
        var val1 = stack.pop();
        var val2 = stack.pop();
        stack.push(val1 + val2);
        return null;
    };
    return AddAction;
})(Action);
var SubtractAction = (function (_super) {
    __extends(SubtractAction, _super);
    function SubtractAction(div) {
        _super.call(this, div);
        this.div.html('-');
    }
    SubtractAction.prototype.execute = function (stack) {
        var val1 = stack.pop();
        var val2 = stack.pop();
        stack.push(val1 - val2);
        return null;
    };
    return SubtractAction;
})(Action);
var ReturnAction = (function (_super) {
    __extends(ReturnAction, _super);
    function ReturnAction(div, callback) {
        _super.call(this, div);
        this.div.html('RET');
        this.callback = callback;
    }
    ReturnAction.prototype.execute = function (stack) {
        var val1 = stack.pop();
        this.callback(val1);
        return null;
    };
    return ReturnAction;
})(Action);
/// <reference path="def/jquery.d.ts"/>
/// <reference path="flappy.ts"/>
/// <reference path="actions.ts"/>
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["DOWN"] = 1] = "DOWN";
    Direction[Direction["LEFT"] = 2] = "LEFT";
    Direction[Direction["RIGHT"] = 3] = "RIGHT";
})(Direction || (Direction = {}));
var Stack = (function () {
    function Stack(factory) {
        this.factory = factory;
        this.div = $('<ul class="stack">');
        this.factory.div.append(this.div);
    }
    Stack.prototype.pop = function () {
        if (this.div.children().length === 0) {
            throw "Stack is empty!";
        }
        var last = this.div.children(':last');
        var value = last.data('value');
        last.remove();
        return parseInt(value, 10);
    };

    Stack.prototype.push = function (item) {
        var li = $('<li>');
        li.data('value', item + '');
        li.text(item + '');
        this.div.append(li);
    };
    return Stack;
})();
var Field = (function () {
    function Field(top, left) {
        this.top = top;
        this.left = left;
    }
    Field.prototype.setAction = function (action) {
        this.action = action;
        this.action.div.closest('.tile').addClass('tile-position-' + this.left + '-' + this.top);
    };
    return Field;
})();
var Factory = (function () {
    function Factory(width, height, startX, startY, startDirection, div) {
        this.currentInterval = null;
        if (width <= 0 || width <= 0) {
            throw "Sizing of Factory should be larger than 1";
        }
        this.width = Math.floor(width);
        this.height = Math.floor(height);
        this.startX = Math.floor(startX);
        this.startY = Math.floor(startY);
        this.startDirection = startDirection;
        this.board = [];
        this.div = $(div);
        this.tileContainer = $('<div class="tile-container">').appendTo(this.div);
        ;
        var gameContainer = $('<div class="grid-container">').appendTo(this.div);
        ;
        gameContainer.appendTo(this.div);
        this.stack = new Stack(this);
        for (var i = 0; i < this.height; i++) {
            this.board[i] = [];
            var gridRow = $('<div class="grid-row">');
            gridRow.appendTo(gameContainer);
            for (var j = 0; j < this.width; j++) {
                var gridCell = $('<div class="grid-cell">').appendTo(gridRow).data('x', j).data('y', i);
                this.board[i][j] = new Field(i, j);
            }
        }
        this.addTile(this.startX, this.startY, 'START');
        this.flappy = null;
    }
    Factory.prototype.addTile = function (x, y, text) {
        var outerDiv = $('<div>').addClass('tile-position-' + x + '-' + y).addClass('tile');
        var innerDiv = $('<div>').addClass('tile-inner').appendTo(outerDiv);
        innerDiv.text(text);
        outerDiv.addClass('text-length-' + (text.length));
        this.tileContainer.append(outerDiv);
    };
    Factory.prototype.step = function () {
        var currentField = this.board[this.flappy.top][this.flappy.left];
        var direction = this.flappy.direction;
        if (currentField.action) {
            var newDirection = currentField.action.execute(this.stack);
            if (newDirection !== null)
                direction = newDirection;
        }
        this.flappy.moveInDirection(direction);
    };
    Factory.prototype.run = function (speed) {
        var _this = this;
        if (typeof speed === "undefined") { speed = 100; }
        if (this.flappy && this.flappy.div.is('.dead')) {
            this.stop();
        }
        if (this.flappy === null) {
            this.flappy = new Flappy(this.startX, this.startY, this.startDirection, this);
        }
        this.currentInterval = setInterval(function () {
            try  {
                _this.step();
            } catch (err) {
                _this.pause();
                _this.flappy.die();
                throw err;
            }
        }, speed);
    };
    Factory.prototype.pause = function () {
        if (this.currentInterval) {
            clearInterval(this.currentInterval);
            this.currentInterval = null;
        }
    };
    Factory.prototype.stop = function () {
        this.pause();
        if (this.flappy) {
            this.flappy.destroy();
        }
    };
    return Factory;
})();

var Level = (function () {
    function Level(levelObject) {
        this.name = levelObject.name;
        this.factory = new Factory(levelObject.width, levelObject.height, levelObject.startX, levelObject.startY, levelObject.startDirection, '.factory1');
        this.description = levelObject.description;
    }
    Level.prototype.run = function (speed) {
        if (typeof speed === "undefined") { speed = 100; }
        this.factory.run(speed);
    };
    return Level;
})();
var level;
$(function () {
    level = new Level({
        name: 'MultiMeter',
        order: 1,
        width: 4,
        height: 4,
        startX: 0,
        startY: 0,
        startDirection: 3 /* RIGHT */,
        blocksAvailable: {
            'Add': 1,
            'Return': 1,
            'Down': 1,
            'Left': 1,
            'Up': 1
        },
        testCases: [],
        description: 'Multiply two numbers that will be put on the stack'
    });
});
