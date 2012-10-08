(function(scope) {
    function random(n) {
        return Math.floor(Math.random() * n);
    }
    
    function generateBoard(cells, liveCells) {
        var board = [],
            i, j, x, y;
        
        for (i = 0; i < cells; i++) {
            board.push([]);
            
            for (j = 0; j < cells; j++) {
                board[i].push(false);
            }
        }
        
        for (i = 0; i < liveCells; i++) {
            x = random(cells);
            y = random(cells);
            
            // retry if we hit a cell we've already made live
            if (board[y][x]) { i--; }
            
            board[y][x] = true;
        }
        
        return board;
    }

    scope.GameOfLife = function(options) {
        var self = this,
            ui = options.ui,
            cells = options.cells || 25,
            liveCells = options.liveCells || 0;

        var board = self.board = generateBoard(cells, liveCells);

        self.takeStep = function() {
            var board = self.board,
                nextBoard = [],
                row, cell, x ,y;

            // starting in the top-left corner iterate over
            // each row, persisting the evolved state of each
            // cell into a new board, updating the UI as we go
            for (y = 0; y < board.length; y++) {
                row = board[y];

                nextBoard.push([]);

                for (x = 0; x < row.length; x++) {
                    cell = Darwin.evolveCell(board, x, y);
                    nextBoard[y].push(cell);
                }
            }

            ui.draw(nextBoard);
            self.board = nextBoard;
        };

        self.start = function() {
            self.timerId = setInterval(self.takeStep, 100);
        };

        self.stop = function() {
            clearInterval(self.timerId);
        };

        ui.init(board);
        ui.draw(board);
    };

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

    scope.CanvasUI = function(rootEl) {
        var self = this,
            boardSize = rootEl.clientWidth,
            canvas = document.createElement('canvas');

        canvas.setAttribute('width', rootEl.clientWidth + 'px');
        canvas.setAttribute('height', rootEl.clientWidth + 'px');

        rootEl.appendChild(canvas);

        self.draw = function(board) {
            var ctx = canvas.getContext('2d'),
                cells = board.length,
                cellSize = boardSize / cells,
                x, y;

            ctx.clearRect(0, 0, boardSize, boardSize);
            ctx.fillStyle = '#000';

            for (y = 0; y < cells; y++) {
                for (x = 0; x < cells; x++) {
                    if (board[y][x]) {
                        ctx.fillRect(cellSize*x, cellSize*y, cellSize, cellSize);
                    }
                }
            }

            ctx.fill();
        };

        self.init = self.draw;
    };

    scope.DomUI = function(rootEl) {
        var self = this;

        self.el = rootEl;

        self.init = function(board) {
            var cells = board.length,
                boardSize = self.el.clientWidth,
                cellSize = boardSize / cells,
                rects = [],
                rect,
                x, y;

            for (y = 0; y < cells; y++) {
                rects.push([]);

                for (x = 0; x < cells; x++) {
                    rect = document.createElement('div');
                    rect.className = 'dead cell';
                    rect.style.top = cellSize * x + 'px';
                    rect.style.left = cellSize * y + 'px';
                    rect.style.height = cellSize + 'px';
                    rect.style.width = cellSize + 'px';

                    self.el.appendChild(rect);
                    rects[y].push(rect);
                }
            }

            self.rects = rects;
        };

        self.draw = function(board) {
            var rect, cell, x, y;

            for (y = 0; y < board.length; y++) {
                for (x = 0; x < board[y].length; x++) {
                    cell = board[y][x];
                    rect = self.rects[y][x];
                    rect.className = cell ? 'live cell' : 'dead cell';
                }
            }
        };
    };
}(window));