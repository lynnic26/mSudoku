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
                if(_game.validatePuzzle()) {
                    _game.solveGame(0, 0);
                }
            }
        }
    }
    function Game(config) {

        // Game initialization
        this.config = config;
        this.$cellMatrix = {};
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
                this.$cellMatrix[i] = {};
                for(var j = 0; j < 9; j ++) {
                    var $td = $('<td>');
                    this.$cellMatrix[i][j] = $('<input>')
                        .attr( 'maxlength', 1 )
                        .data('row', i)
                        .data('col', j);
                    var x = Math.floor(j / 3)
                        , y = Math.floor(i / 3);
                    if((x + y) % 2 == 0) {
                        $td.addClass('section-even');
                    } else {
                        $td.addClass('section-odd');
                    }
                    $td.append(this.$cellMatrix[i][j]);
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
            console.log(this.$cellMatrix)
            var $cellMatrix = this.$cellMatrix,
                val,
                isInvalid,
                isDuplicated,

                // single number between 1 to 9
                regex = /^([1-9]{1})$/;
            for(var row = 0; row < 9;row ++) {
                for(var col = 0; col < 9; col ++) {
                    val = $cellMatrix[row][col].val();
                    $cellMatrix[row][col].removeClass('invalid').removeClass('duplicated');

                    // not empty and not in 1-9,illegal input
                    if(val !== '' && !regex.test(val)) {
                       $cellMatrix[row][col].addClass('invalid');
                       isInvalid = true;
                    }
                    if(val !=='' && regex.test(val)) {
                        this.validNumber(val, row, col);
                    }
                }
            }
            return true;
        },
        validNumber: function(val, row, col) {
            var $cellMatrix = this.$cellMatrix,
                $cur = $cellMatrix[row][col],
                secLeft, secRight, secTop, secBottom,
                rowArr = [], colArr = [], secArr = [];
            for(var i = 0; i < 9; i ++) {
                if($cellMatrix[row][i].val() !== '') {
                    rowArr.push(Number($cellMatrix[row][i].val()));
                }
                if($cellMatrix[i][col].val() !== '') {
                    colArr.push(Number($cellMatrix[i][col].val()));
                }
            }
            secLeft = Math.floor(col / 3) * 3;
            secRight = secLeft + 2;
            secTop = Math.floor(row / 3) * 3;
            secBottom = secTop + 2;
            for(var i = secTop; i <= secBottom; i ++) {
                for(var j = secLeft; j <= secRight; j ++) {
                    if($cellMatrix[i][j].val() !== '') {
                        secArr.push(Number($cellMatrix[i][j].val()));
                    }
                }
            } 
        }, 
        findClosestEmptySquare: function(row, col) {
            var curLinearIndex = row * 9 + col
                , walkingRow
                , walkingCol
                , $walkingSquare
                , walkingVal;
            for(var i = curLinearIndex; i < 81; i ++) {
                walkingRow = Math.floor(i / 9); 
                walkingCol = i % 9;
                $walkingSquare = this.$cellMatrix[walkingRow][walkingCol];
                walkingVal = $walkingSquare.val();
                if(walkingVal == '') {
                    return $walkingSquare;
                }
            }
            return false;
        },
        findLegalValuesForSquare: function(row, col) {
            var legalNums, val, secLeft, secRight, 
                setTop, secBottom;
            legalNums = [ 1, 2, 3, 4, 5, 6, 7, 8, 9];

            for(var i = 0; i < 9; i ++) {
                val = Number(this.$cellMatrix[row][i].val());
                if(val !== 0) {
                    if(legalNums.indexOf(val) > -1) {
                        legalNums.splice(legalNums.indexOf(val), 1);
                    }
                }
            }

            for(var i = 0; i < 9; i ++ ) {
                val = Number(this.$cellMatrix[i][col].val());
                if(val !== 0) {
                    if(legalNums.indexOf(val) > -1) {
                        legalNums.splice(legalNums.indexOf(val), 1);
                    }
                }
            }

            secLeft = Math.floor(col / 3) * 3;
            secRight = secLeft + 2;
            secTop = Math.floor(row / 3) * 3;
            secBottom = secTop + 2;
            for(var i = secTop; i <= secBottom; i ++) {
                for(var j = secLeft; j <= secRight; j ++) {
                    val = Number(this.$cellMatrix[i][j].val());
                    if(val !== 0) {
                        if(legalNums.indexOf(val) > -1) {
                            legalNums.splice(legalNums.indexOf(val), 1);
                        }
                    }
                }
            } 
            return legalNums;
        },
        solveGame: function(row, col) {
            var squareRow, squareCol, legalValues;
            var $nextSquare = this.findClosestEmptySquare(row, col);
            if(!$nextSquare) {
                this.$board.addClass('solved');
                return true;
            } else {
                squareRow = $nextSquare.data('row');
                squareCol = $nextSquare.data('col');
                legalValues = this.findLegalValuesForSquare(squareRow, squareCol);
                for(var i = 0; i < legalValues.length; i ++) {
                    $nextSquare.val(legalValues[i]).addClass('filled');
                    if(this.solveGame(squareRow, squareCol)) {
                        return true;
                    } else {
                        $nextSquare.val('').removeClass('filled');
                    }
                }
                return false;
            }
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