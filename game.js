(function() {
    function random(n) {
        return Math.floor(Math.random() * n);
    }
    
    function fillRect(rect, cell) {
        var hexColor = cell ? '#000' : '#fff';
        rect.attr('fill', hexColor);
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
    
    function initUI(game) {
        var board = game.board,
            dims = game.dimensions,
            size = 600 / dims.width,
            rects = [],
            rect, rowLen, y, x
        
        game.paper = Raphael('game-board', 600, 600);
        
        for (y = 0; y < board.length; y++) {
            rowLen = board[y].length;
            rects.push([]);
            
            for (x = 0; x < rowLen; x++) {
                var rect = game.paper.rect(size*x, size*y, size, size);
                rect.attr('stroke', '#ccc');
                rect.attr('fill', '#fff');
                
                rects[y].push(rect);
                fillRect(rect, board[y][x]);
            }
        }
        
        game.rects = rects;
    }
    
    GameOfLife = function(options) {
        options = options || {};
        
         this.dimensions = _.extend({
            width: 20,
            height: 20
        }, options);
        
        var liveCells = options.liveCells || 0;
        
        this.board = generateBoard(this.dimensions, liveCells);
        
        initUI(this);
    };
    
    _.extend(GameOfLife.prototype, {
        takeStep: function() {
            var self = this,
                board = self.board,
                nextBoard = [], rect;
            
            // starting in the top-left corner iterate over
            // each row, persisting the evolved state of each
            // cell into a new board, updating the UI as we go
            _.each(board, function(row, y) {
                nextBoard.push([]);
                
                _.each(row, function(cell, x) {
                    rect = self.rects[y][x];
                    cell = Darwin.evolveCell(board, x, y);
                    
                    nextBoard[y].push(cell);
                    fillRect(rect, cell);
                });
            });
            
            self.board = nextBoard;
        }
    });
    
    // gets the live cell count of the adjacent cells
    // surrounding the target cell, given by the row/column coord.
    function getLiveCellCount(board, row, col) {
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