(function(scope) {
    function random(n) {
        return Math.floor(Math.random() * n);
    }
    
    function fillRect(rect, cell) {
        var className = cell ? 'live' : 'dead';
        rect.removeClass('live dead').addClass(className);
    }
    
    function generateBoard(dimensions, liveCells) {
        var w = dimensions.width,
            h = dimensions.height,
            board = [],
            i, j, x, y;
        
        for (i = 0; i < h; i++) {
            board.push([]);
            
            for (j = 0; j < w; j++) {
                board[i].push(false);
            }
        }
        
        for (i = 0; i < liveCells; i++) {
            x = random(w);
            y = random(h);
            
            // retry if we hit a cell we've already made live
            if (board[y][x]) { i--; }
            
            board[y][x] = true;
        }
        
        return board;
    }
    
    function initUI(game) {
        var board = game.board,
            dims = game.dimensions,
            size = 600 / dims.width,
            rects = [],
            rect,
            row, cell,
            x, y;
        
        for (y = 0; y < board.length; y++) {
            row = board[y];
            rects.push([]);

            for (x = 0; x < row.length; x++) {
                cell = row[x];

                rect = $('<div></div>').css({
                    top: size*x,
                    left: size*y,
                    height: size,
                    width: size
                }).addClass('cell dead');

                game.$el.append(rect);

                fillRect(rect, board[y][x]);
                rects[y].push(rect);
            }
        }

        game.rects = rects;
    }
    
    scope.GameOfLife = function(options) {
        options = options || {};
        
         this.dimensions = $.extend({
            width: 20,
            height: 20
        }, options);

        this.$el = options.el;
        
        var liveCells = options.liveCells || 0;
        
        this.board = generateBoard(this.dimensions, liveCells);
        
        initUI(this);

        this.takeStep = function() {
            var self = this,
                board = self.board,
                nextBoard = [],
                row, cell, rect, x ,y;

            // starting in the top-left corner iterate over
            // each row, persisting the evolved state of each
            // cell into a new board, updating the UI as we go
            for (y = 0; y < board.length; y++) {
                row = board[y];

                nextBoard.push([]);

                for (x = 0; x < row.length; x++) {
                    rect = self.rects[y][x];

                    cell = Darwin.evolveCell(board, x, y);
                    nextBoard[y].push(cell);
                    fillRect(rect, cell);
                }
            }

            self.board = nextBoard;
        };
    };
    
    $.extend(GameOfLife.prototype, {

    });

    scope.Darwin = {
        getLiveCellCount: function(board, row, col) {
            var count = 0,
                minx = Math.max(0, row - 1),
                maxx = Math.min(board[0].length - 1, row + 1),
                miny = Math.max(0, col - 1),
                maxy = Math.min(board.length - 1, col + 1),
                x, y;

            for (y = miny; y <= maxy; y++) {
                for (x = minx; x <= maxx; x++) {
                    if (x === row && y === col) { continue; }

                    if (board[y][x]) {
                        count++;
                    }
                }
            }

            return count;
        },

        evolveCell: function(board, x, y) {
            var liveCellCount = Darwin.getLiveCellCount(board, x, y),
                alive = board[y][x];
            
            if (alive) {
                return (liveCellCount === 2 || liveCellCount === 3);
            }
            
            return liveCellCount === 3;
        }
    };
}(window));