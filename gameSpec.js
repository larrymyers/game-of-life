describe('GameOfLife', function() {
    
    beforeEach(function() {
        $('body').append('<div id="game-board"></div>');
        
        this.addMatchers({
            toMatchBoard: function(expected) {
                var actual = this.actual,
                    i, j;
                
                for (i = 0; i < actual.length; i++) {
                    for (j = 0; j < actual[i].length; j++) {
                        if (actual[i][j] !== expected[i][j]) {
                            return false;
                        }
                    }
                }
                
                return true;
            }
        });
    });
    
    afterEach(function() {
        $('#game-board').remove();
    });
    
    it('Should default to a 20x20 board.', function() {
        var game = new GameOfLife();
        
        expect(game.board.length).toBe(20);
        expect(game.board[0].length).toBe(20);
    });
    
    it('Should generate a board with all dead cells of the specified dimensions.', function() {
        var game = new GameOfLife({
            width: 10,
            height: 10
        });
        
        expect(game.board.length).toBe(10);
        expect(game.board[0].length).toBe(10);
        
        var foundLiveCell;
        
        _.each(game.board, function(row) {
            if (foundLiveCell) { return; }
            
            foundLiveCell = _.find(row, function(cell) {
                return cell;
            });
        });
        
        expect(foundLiveCell).toBe(undefined);
    });
    
    it('Can be initialized with the number of random live cells to place on the board.', function() {
        var game = new GameOfLife({
            width: 10,
            height: 10,
            liveCells: 10
        });
        
        var liveCellCount = 0;
        
        _.each(game.board, function(row) {
            _.each(row, function(cell) {
                if (cell) { liveCellCount++; }
            });
        });
        
        expect(liveCellCount).toBe(10);
    });
    
    it('Should produce the next generation of the board when a step is taken.', function() {
        var game = new GameOfLife();
        
        game.board = [
            [false, true,  false],
            [true,  true,  false],
            [false, false, false]
        ];
        
        game.takeStep();
        
        var expectedBoard = [
            [true,  true,  false],
            [true,  true,  false],
            [false, false, false]
        ];
        
        expect(game.board).toMatchBoard(expectedBoard);
    });
    
});

describe('Darwin', function() {
    
    var board;
    
    beforeEach(function() {
        board = [
            [false, false, false],
            [false, true,  false],
            [false, false, false]
        ];
    });
    
    it('Should kill a live cell that has less than two live neighbors.', function() {
        board[0][0] = true;
        
        expect(Darwin.evolveCell(board, 1, 1)).toBe(false);
    });
    
    it('Should kill a live cell that has more than three live neighbors.', function() {
        board[0][0] = true;
        board[0][1] = true;
        board[0][2] = true;
        board[1][0] = true;
        
        expect(Darwin.evolveCell(board, 1, 1)).toBe(false);
    });
    
    it('Should allow a live cell with two live neighbors to continue living.', function() {
        board[0][0] = true;
        board[0][1] = true;
        
        expect(Darwin.evolveCell(board, 1, 1)).toBe(true);
    });
    
    it('Should allow a live cell with three live neighbors to continue living.', function() {
        board[0][0] = true;
        board[0][1] = true;
        board[0][2] = true;
        
        expect(Darwin.evolveCell(board, 1, 1)).toBe(true);
    });
    
    it('Should birth a live cell when a dead cell has three live neighbors.', function() {
        board[1][1] = false;
        board[0][0] = true;
        board[0][1] = true;
        board[0][2] = true;
        
        expect(Darwin.evolveCell(board, 1, 1)).toBe(true);
    });
    
    it('Should keep a dead cell lifeless when it has less than three live neighbors.', function() {
        board[1][1] = false;
        board[0][0] = true;
        board[0][1] = true;
        board[0][2] = true;
        board[1][0] = true;
        
        expect(Darwin.evolveCell(board, 1, 1)).toBe(false);
    });
    
    it('Should keep a dead cell lifeless when it has less than three live neighbors.', function() {
        board[1][1] = false;
        board[0][0] = true;
        board[0][1] = true;
        
        expect(Darwin.evolveCell(board, 1, 1)).toBe(false);
    });
});