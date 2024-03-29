function BoardUtil() {

    this.make2Darray = function (cols, rows) {
        var arr = new Array(cols);
        for (var i = 0; i < cols; i++) {
            arr[i] = new Array(rows);
        }
        return arr;
    }

    this.isBlank = function (x, y) {
        return board[x][y].image.height == blankSize;
    }

    this.replaceAt = function (str, index, replacement) {
        return str.substr(0, index) + replacement + str.substr(index + replacement.length);
    }

    this.move = function (s, d) {
        if (!s)
            return;
        sourceX = s[0];
        sourceY = s[1];
        destinationX = d[0];
        destinationY = d[1];

        if (this.isBlank(destinationX, destinationY)) {
            move_sound.play();
        } else {
            eat_sound.play();
            eaten_opponent_pieces.push({ "image": board[destinationX][destinationY].image, "color": board[destinationX][destinationY].color })
        }
        let temp = board[sourceX][sourceY];
        let flag = (sourceX + sourceY) % 2 == 0;
        board[sourceX][sourceY] = { "image": flag ? b_img : w_img, "type": pieces.EMPTY, "color": flag ? colors.BLACK : colors.WHITE }
        board[destinationX][destinationY] = temp;
        boardNotation = this.replaceAt(boardNotation, sourceX * 8 + sourceY, "_");
        boardNotation = this.replaceAt(boardNotation, destinationX * 8 + destinationY, temp.type);
        source = null;
        destination = null;
    }

    this.checkMove = function (s, d) {
        let sourceX = s[0];
        let sourceY = s[1];
        let destinationX = d[0];
        let destinationY = d[1];
        let destinationType = board[destinationX][destinationY].type;
        let destinationColor = board[destinationX][destinationY].color;
        let sourceType = board[sourceX][sourceY].type;
        let sourceColor = board[sourceX][sourceY].color;
        let step;
        let crossStep;
        switch (sourceType.toLowerCase()) {
            case pieces.PAWN:
                let stepValue = sourceColor == colors.WHITE ? 1 : -1;
                if ((sourceY == destinationY && (destinationX - sourceX == stepValue || pawnUtil.checkFirstStepForPawn(s, d, stepValue)) && destinationType == pieces.EMPTY) ||
                    (this.checkCrossMove(s, d) > 0 && destinationType != pieces.EMPTY)) {
                    kingLocation = kingUtil.check(sourceColor, pawnUtil.getTargetCells(s, d));
                    return true;
                }

                if (this.checkCrossMove(s, d) == 1 && destinationType == pieces.EMPTY && pawnUtil.checkEnPassant(s, d)) {
                    board[sourceX][sourceY].moveInfo = null;
                    return true;
                }
                break;

            case pieces.BISHOP:
                crossStep = Math.abs(this.checkCrossMove(s, d));
                if (crossStep > 0 && this.checkPiecesOnCrossDiagonal(s, d, crossStep) && this.checkTypeAndColor(destinationType, destinationColor, sourceColor)) {
                    kingLocation = kingUtil.check(sourceColor, bishopUtil.getTargetCells(s, d, sourceColor));
                    return true;
                }
                break;

            case pieces.ROOK:
                step = this.checkVerticalAndHorizantalMove(s, d);
                if (step > 0 && this.checkPiecesOnVerticalAndHorizantalDiagonal(s, d, step) && this.checkTypeAndColor(destinationType, destinationColor, sourceColor)) {
                    kingLocation = kingUtil.check(sourceColor, rookUtil.getTargetCells(s, d, sourceColor));
                    return true;
                }
                break;

            case pieces.QUEEN:
                step = this.checkVerticalAndHorizantalMove(s, d);
                crossStep = this.checkCrossMove(s, d);
                if (((crossStep > 0 && this.checkPiecesOnCrossDiagonal(s, d, crossStep)) || (step > 0 && this.checkPiecesOnVerticalAndHorizantalDiagonal(s, d, step))) && this.checkTypeAndColor(destinationType, destinationColor, sourceColor))
                    kingLocation = kingUtil.check(sourceColor, queenUtil.getTargetCells(s, d, sourceColor));
                return true;
                break;

            case pieces.KNIGHT:
                let x = Math.abs(sourceX - destinationX);
                let y = Math.abs(sourceY - destinationY);
                if (((x == 1 && y == 2) || (x == 2 && y == 1)) && this.checkTypeAndColor(destinationType, destinationColor, sourceColor)) {
                    kingLocation = kingUtil.check(sourceColor, knightUtil.getTargetCells(s, d, sourceColor));
                    return true;
                }
                break;

            case pieces.KING:
                step = this.checkVerticalAndHorizantalMove(s, d);
                crossStep = this.checkCrossMove(s, d);
                if (((crossStep == 1 && this.checkPiecesOnCrossDiagonal(s, d, crossStep)) || (step == 1 && this.checkPiecesOnVerticalAndHorizantalDiagonal(s, d, step))) && this.checkTypeAndColor(destinationType, destinationColor, sourceColor) && kingUtil.checkOtherKingOnAround(s, d)) {
                    let hasVerticalDanger = kingUtil.checkDanger(d, sourceColor, [[0, 1], [0, -1], [-1, 0], [1, 0]], [pieces.QUEEN, pieces.ROOK]);//vertical
                    let hasHorizontalDanger = kingUtil.checkDanger(d, sourceColor, [[1, 1], [1, -1], [-1, 1], [-1, -1]], [pieces.QUEEN, pieces.BISHOP]);//horizontal

                    if (!hasVerticalDanger && !hasHorizontalDanger) {
                        kingLocation = null
                        board[sourceX][sourceY].moveInfo = "moved!";
                        return true;
                    }
                }
                let firstXColumn = sourceColor == colors.WHITE ? 0 : 7;
                if (step == 2 && sourceX == firstXColumn && sourceX == destinationX && !board[sourceX][sourceY].moveInfo && kingUtil.checkCastling(destinationY, sourceColor)) {
                    let y = destinationY == 2 ? 0 : 7
                    let rookStepYFromKing = y == 0 ? 1 : -1;
                    let x = sourceColor == colors.WHITE ? 0 : 7;
                    this.move(new Array(x, y), new Array(destinationX, destinationY + rookStepYFromKing))
                    source = s;
                    destination = d;
                    return true;
                }
                break;
            default:
                destination = null;
                return false;
        }
        destination = null;
        return false;
    }

    this.checkCrossMove = function (s, d) {
        let sourceX = s[0];
        let sourceY = s[1];
        let destinationX = d[0];
        let destinationY = d[1];
        let color = board[sourceX][sourceY].color;
        if (destinationX == sourceX || destinationY == sourceY)
            return 0;
        if (Math.abs(destinationX - sourceX) != Math.abs(destinationY - sourceY) || Math.abs(sourceX - destinationX) != Math.abs(sourceY - destinationY))
            return 0;
        else
            return parseInt(color == colors.WHITE ? Math.abs(destinationX - sourceX) : Math.abs(sourceX - destinationX));
    }

    this.checkPiecesOnCrossDiagonal = function (s, d, step) {
        let sourceX = s[0];
        let sourceY = s[1];
        let stepX = d[0] - sourceX > 0 ? 1 : -1;
        let stepY = d[1] - sourceY > 0 ? 1 : -1;
        for (var i = 0; i < step - 1; i++) {
            if (board[sourceX += stepX][sourceY += stepY].type != pieces.EMPTY)
                return false;
        }
        return true;
    }

    this.checkVerticalAndHorizantalMove = function (s, d) {
        let sourceX = s[0];
        let sourceY = s[1];
        let destinationX = d[0];
        let destinationY = d[1];
        if (sourceX != destinationX && sourceY != destinationY)
            return 0;
        return parseInt(sourceX == destinationX ? Math.abs(destinationY - sourceY) : Math.abs(destinationX - sourceX));
    }

    this.checkPiecesOnVerticalAndHorizantalDiagonal = function (s, d, step) {
        let sourceX = s[0];
        let sourceY = s[1];
        let stepX = this.getStepValue(sourceX, d[0]);
        let stepY = this.getStepValue(sourceY, d[1]);
        for (var i = 0; i < step - 1; i++) {
            if (board[sourceX += stepX][sourceY += stepY].type != pieces.EMPTY)
                return false;
        }
        return true;
    }

    this.getStepValue = function (s, d) {
        if (d - s > 0)
            return 1;
        else if (d - s < 0)
            return -1;
        else
            return 0;
    }

    this.checkTypeAndColor = function (destinationType, destinationColor, sourceColor) {
        return destinationType == pieces.EMPTY || destinationColor != sourceColor;
    }

    this.getTargetCells = function (s, d, steps, color) {
        let targets = [];
        let sourceX = s[0];
        let sourceY = s[1];
        let destinationX = d[0];
        let destinationY = d[1];
        for (var i = 0; i < steps.length; i++) {
            for (var j = 1; j < 8; j++) {
                let x = destinationX + steps[i][0] * j;
                let y = destinationY + steps[i][1] * j;
                if (x < 0 || x > 7 || y < 0 || y > 7)
                    continue;
                if (board[x][y].type != pieces.EMPTY && !(x == sourceX && y == sourceY)) {
                    if (board[x][y].color != color)
                        targets.push([x, y]);
                    break;
                }
                targets.push([x, y]);
            }
        }
        return targets;
    }
}