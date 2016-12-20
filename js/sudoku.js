var Sudoku = (function($) {
    var _instance
      , _game
      , defaultConfig = {};
    function init(config) {
        conf = $.extend({}, defaultConfig, config);
        _game = new Game(conf);

        // public method
        return {
            getGameBoard: function() {
                return _game.bindUI();
            }
        }
    }
    function Game(config) {
        // Game initialization
    }
    Game.prototype = {

        // Game logic
        bindUI: function() {
            var $table = $('<table>').addClass('sudoku-container');
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
            return $table;
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