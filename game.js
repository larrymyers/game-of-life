(function() {
    function random(n) {
        return Math.floor(Math.random() * n);
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
            var x = random(w),
                y = random(h);
            
            // retry if we hit a cell we've already made live
            if (board[y][x]) { i--; }
            
            board[y][x] = true;
        }
        
        return board;
    }
    
    GameOfLife = function(options) {
        options = options || {};
        
        var dimensions = _.extend({
            width: 20,
            height: 20
        }, options);
        
        var liveCells = options.liveCells || 0;
        
        this.board = generateBoard(dimensions, liveCells);
    };
    
    _.extend(GameOfLife.prototype, {
        takeStep: function() {
            var board = this.board,
                nextBoard = [], 
                rowLen, x, y;
            
            for (y = 0; y < board.length; y++) {
                rowLen = board[y].length;
                nextBoard.push([]);
                
                for (x = 0; x < rowLen; x++) {
                    nextBoard[y].push(Darwin.evolveCell(board, x, y));
                }
            }
            
            this.board = nextBoard;
        },
        
        render: function() {
            
        }
    });
    
    function getLiveCellCount(board, _x, _y) {
        var count = 0,
            minx = Math.max(0, _x-1),
            maxx = Math.min(board[0].length-1, _x+1),
            miny = Math.max(0, _y-1),
            maxy = Math.min(board.length-1, _y+1),
            x, y;
        
        for (y = miny; y <= maxy; y++) {
            for (x = minx; x <= maxx; x++) {
                if (x === _x && y === _y) { continue; }
                
                if (board[y][x]) {
                    count++;
                }
            }
        }
        
        return count;
    }
    
    Darwin = {
        evolveCell: function(board, x, y) {
            var liveCellCount = getLiveCellCount(board, x, y),
                alive = board[y][x];
            
            if (alive) {
                return (liveCellCount === 2 || liveCellCount === 3);
            }
            
            return liveCellCount === 3;
        }
    }
}());