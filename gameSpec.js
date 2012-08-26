describe('GameOfLife', function() {
    
    beforeEach(function() {
        $('body').append('<div id="game-board" style="height: 600px; width: 600px"></div>');
        
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
    
    it('Should default to a 25x25 board.', function() {
        var game = new GameOfLife({
            el: $('#game-board')
        });
        
        expect(game.board.length).toBe(25);
        expect(game.board[0].length).toBe(25);
    });
    
    it('Should generate a board with all dead cells of the specified dimensions.', function() {
        var game = new GameOfLife({
            el: $('#game-board'),
            cells: 10
        });
        
        expect(game.board.length).toBe(10);
        expect(game.board[0].length).toBe(10);
        expect($('div.live').length).toEqual(0);
    });
    
    it('Can be initialized with the number of random live cells to place on the board.', function() {
        var game = new GameOfLife({
            el: $('#game-board'),
            cells: 10,
            liveCells: 10
        });
        
        expect($('div.live').length).toEqual(10);
    });
    
    it('Should produce the next generation of the board when a step is taken.', function() {
        var game = new GameOfLife({
            el: $('#game-board')
        });
        
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