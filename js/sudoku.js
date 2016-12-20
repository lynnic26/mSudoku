var Sudoku = (function($) {
    var _instance
      , _game
      , defaultConfig = {};
    function init(config) {
        conf = $.extend({}, defaultConfig, config);
        _game = new Game(conf);

        // 初始化ui
        _game.getGameBoard();
        // public method
        return {
            reset: function() {
                _game.resetGame();
            },
            solve: function() {
                _game.solveGame();
            }
        }
    }
    function Game(config) {
        // Game initialization
        this.config = config;
    }
    Game.prototype = {
        getGameBoard: function() {
            this.bindUI();
            this.bindEvent();
        },

        // Game logic
        bindUI: function() {
            var $table = $('<table>').addClass('sudoku-container');
            this.$board = $table;
            for(var i = 0; i < 9; i ++) {
                var $tr = $('<tr>');
                for(var j = 0; j < 9; j ++) {
                    var $td = $('<td>');
                    var $input = $('<input>');
                    var x = Math.floor(j / 3)
                        , y = Math.floor(i / 3);
                    if((x + y) % 2 == 0) {
                        $td.addClass('section-even');
                    } else {
                        $td.addClass('section-odd');
                    }
                    $td.append($input);
                    $tr.append($td);
                }
                $table.append($tr);
            }
            $(this.config.el).append($table);
        },
        bindEvent: function() {
            $('.sudoku-container input').on('keyup', $.proxy(this.keyUpHandler, this));
        },
        resetGame: function() {
            var $board = this.$board;
            $board.find('input').val('');
            $board.removeClass('solved');
        },
        validatePuzzle: function() {
            return true;
        },
        solveGame: function() {
            if(!this.validatePuzzle) return;
            this.$board.addClass('solved');
        },
        keyUpHandler: function(e) {
            // if(e.keyCode < 48 || e.keyCode > 57) {
            //     alert('Please enter a numeric num between 0 and 9');
            //     $(e.target).val('');
            // }
        }
    }
    return {

        // Get the Singleton instance
        getInstance: function(config) {
            if(!_instance) {
                _instance = init(config);
            }
            return _instance;
        }
    }
})(jQuery);