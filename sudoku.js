var emptyGrid;

var currentlySelectedCell = {
    x: 10,
    y: 10
}

var status;
var time;

var c = document.getElementById('sudoku');
var ctx = c.getContext('2d');
c.addEventListener('mousedown', getMouseLocation, false);
c.addEventListener('mousemove', onHover, false);
document.addEventListener('keydown', editTextOnScreen, false);

var grid;
var editedGrid;
var solvedGrid;

startGame();
timer();

function startGame () {
    emptyGrid = [[0,0,0, 0,0,0, 0,0,0],
    [0,0,0, 0,0,0, 0,0,0],
    [0,0,0, 0,0,0, 0,0,0],
    [0,0,0, 0,0,0, 0,0,0],
    [0,0,0, 0,0,0, 0,0,0],
    [0,0,0, 0,0,0, 0,0,0],
    [0,0,0, 0,0,0, 0,0,0],
    [0,0,0, 0,0,0, 0,0,0],
    [0,0,0, 0,0,0, 0,0,0]]
    grid = generateGrid();
    editedGrid = JSON.parse(JSON.stringify(grid));
    solvedGrid = JSON.parse(JSON.stringify(grid));
    solvedGrid = solveForValidate(solvedGrid);
    status = 1;
    time = 0;
    drawGrid();
    drawNumbers();
    drawButtons(false, false, false, false);
}

function generateGrid () {

    let numbers = [1,2,3,4,5,6,7,8,9];
    const newGrid = solveEmptyGrid(numbers);

    for (y = 0; y < 9; y++) {
        let randNum = Math.floor(Math.random() * (10 - 7) + 7);
        for (i = 0; i < randNum; i++) {
            let randX = Math.floor(Math.random() * 9);
            newGrid[y][randX] = 0;
        }
    }
    return newGrid;
}

function solveEmptyGrid (ns) {
    ns = shuffleArray(ns);
    let counter = 0;

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (emptyGrid[y][x] === 0) {
            } else {
                counter++;
            }
        }
    }

    if (counter === 81) {
        return true;
    }

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (emptyGrid[y][x] === 0) {
                for (let i = 0; i < 9; i++) {
                    if (isPossible(y, x, ns[i], emptyGrid)) {
                        emptyGrid[y][x] = ns[i];
                        if (solveEmptyGrid(ns)) {
                            return emptyGrid;
                        }
                        emptyGrid[y][x] = 0;
                    }
                }
                return false;
            }
        }
    }
}

function shuffleArray (arr) {

    let newPos, temp;
    for (let i = arr.length - 1; i > 0; i--) {
        newPos = Math.floor(Math.random() * (i+1));
        temp = arr[i];
        arr[i] = arr[newPos];
        arr[newPos] = temp;
    }
    return arr;

}

function isPossible (y, x, n, arr) {

    for (i = 0; i < 9; i++) {
        if (arr[i][x] === n) {
            return false;
        }
    }
    for (i = 0; i < 9; i++) {
        if (arr[y][i] === n) {
            return false;
        }
    }

    let x0 = Math.floor(x/3)*3;
    let y0 = Math.floor(y/3)*3;

    for (y = 0; y < 3; y++) {
        for (x = 0; x < 3; x++) {
            if (arr[y0+y][x0+x] === n) {
                return false;
            }
        }
    }

    return true;

}

function drawGrid () {

    ctx.clearRect(0,0,500,500);
    ctx.moveTo(25,25);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.lineTo(25,475);
    ctx.lineTo(475,475);
    ctx.lineTo(475,25);
    ctx.lineTo(25,25);
    ctx.moveTo(175,25);
    ctx.lineTo(175,475);
    ctx.moveTo(325,475);
    ctx.lineTo(325,25);
    ctx.moveTo(25,175);
    ctx.lineTo(475,175);
    ctx.moveTo(475,325);
    ctx.lineTo(25,325);
    ctx.stroke();

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            ctx.lineWidth = .2;
            ctx.strokeRect(x*50+25, y*50+25, 50, 50);
        }
    }
}

function drawNumbers () {

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            drawNumber(editedGrid[y][x], y, x);
        }
    }

}

function drawNumber (n, y, x) {
    
    if (grid[y][x] === editedGrid[y][x]) {
        if (n === 0) {
            ctx.fillStyle = "black";
            ctx.clearRect(x*50+28, y*50+28, 45, 45)
            ctx.font = "bold 20px Arial";
            ctx.fillText("", x*50+44, y*50+58);
        } else {
            ctx.fillStyle = "black";
            ctx.font = "bold 20px Arial";
            ctx.fillText(n, x*50+44, y*50+58);
        }
    } else {
        if (n === 0) {
            ctx.fillStyle = "grey";
            ctx.clearRect(x*50+28, y*50+28, 45, 45)
            ctx.font = "bold 20px Arial";
            ctx.fillText("", x*50+44, y*50+58);
        } else {
            ctx.fillStyle = "grey";
            ctx.font = "bold 20px Arial";
            ctx.fillText(n, x*50+44, y*50+58);
        }
    }
}

function drawButtons (generate, validate, solveinst, solveslow) {

    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";

    ctx.strokeRect(525, 125, 153, 53);
    ctx.strokeRect(525, 225, 153, 53);
    ctx.strokeRect(525, 325, 153, 53);
    ctx.strokeRect(525, 425, 153, 53);

    if (!generate && !validate && !solveinst && !solveslow) {
        ctx.fillStyle = "#D3D3D3"
        ctx.fillRect(526, 126, 150, 50);
        ctx.fillRect(526, 226, 150, 50);
        ctx.fillRect(526, 326, 150, 50);
        ctx.fillRect(526, 426, 150, 50);
    } else if (generate) {
        ctx.fillStyle = "#98FB98"
        ctx.fillRect(526, 126, 150, 50);
        ctx.fillStyle = "#D3D3D3"
        ctx.fillRect(526, 226, 150, 50);
        ctx.fillRect(526, 326, 150, 50);
        ctx.fillRect(526, 426, 150, 50);
    } else if (validate) {
        ctx.fillStyle = "#98FB98"
        ctx.fillRect(526, 226, 150, 50);
        ctx.fillStyle = "#D3D3D3"
        ctx.fillRect(526, 126, 150, 50);
        ctx.fillRect(526, 326, 150, 50);
        ctx.fillRect(526, 426, 150, 50);
    } else if (solveinst) {
        ctx.fillStyle = "#98FB98"
        ctx.fillRect(526, 326, 150, 50);
        ctx.fillStyle = "#D3D3D3"
        ctx.fillRect(526, 126, 150, 50);
        ctx.fillRect(526, 226, 150, 50);
        ctx.fillRect(526, 426, 150, 50);
    } else if (solveslow) {
        ctx.fillStyle = "#98FB98"
        ctx.fillRect(526, 426, 150, 50);
        ctx.fillStyle = "#D3D3D3"
        ctx.fillRect(526, 226, 150, 50);
        ctx.fillRect(526, 326, 150, 50);
        ctx.fillRect(526, 126, 150, 50);
    }

    ctx.fillStyle = "black";
    ctx.font = "bold 15px Arial"
    ctx.fillText("Generate new Grid", 532, 156);
    ctx.fillText("Validate guesses", 539, 256);
    ctx.fillText("Solve quickly", 550, 356);
    ctx.fillText("Solve slowly", 554, 456);

}

function timer () {
    if (status == 1) {
        setTimeout(function () {
            time++;
            var min = Math.floor(time/100/60);
            var sec = Math.floor(time/100);

            if (min < 10) {
                min = "0" + min;
            }
            if (sec >= 60) {
                sec = sec % 60;
            }
            if (sec < 10) {
                sec = "0" + sec;
            }
            var timeText = min + ":" + sec;
            ctx.clearRect(500, 25, 200, 90);
            ctx.fillStyle ="black";
            ctx.font = "bold 60px Arial"
            ctx.fillText(timeText, 525,85);

            timer();

        }, 10);
    }
}

function solveGridSlowly () {

    let counter = 0;

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (grid[y][x] === 0) {
            } else {
                counter++;
            }
        }
    }

    if (counter === 81) {
        return true;
    }

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (grid[y][x] === 0) {
                for (let i = 0; i < 10; i++) {
                    if (isPossible(y, x, i, grid)) {
                        grid[y][x] = i;
                        setTimeout(function () {
                            drawNumber(i, y, x);
                        },10);
                        if (solveGridSlowly()) {
                            return grid;
                        }
                        grid[y][x] = 0;
                        setTimeout(function () {
                            drawNumber(0, y, x);
                        },10);
                    }
                }
                return false;
            }
        }
    }
}

function solveGridInstantly () {

    let counter = 0;

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (grid[y][x] === 0) {
            } else {
                counter++;
            }
        }
    }

    if (counter === 81) {
        return true;
    }

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (grid[y][x] === 0) {
                for (let i = 0; i < 10; i++) {
                    if (isPossible(y, x, i, grid)) {
                        grid[y][x] = i;
                        drawNumber(i, y, x);
                        if (solveGridInstantly()) {
                            return grid;
                        }
                        grid[y][x] = 0;
                        drawNumber(0, y, x);
                    }
                }
                return false;
            }
        }
    }
}

function validateGuesses () {
    
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (editedGrid[y][x] != 0) {
                if (editedGrid[y][x] != grid[y][x]) {
                    if (editedGrid[y][x] === solvedGrid[y][x]) {
                        ctx.strokStyle = "#32CD32"
                        ctx.strokeRect(x*50+25, y*50+25, 50, 50);
                    } else {
                        ctx.strokeStyle = "#8B0000"
                        ctx.strokeRect(x*50+25, y*50+25, 50, 50);
                    }
                }
            }
        }
    }

}

function solveForValidate (grid) {

    let counter = 0;

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (grid[y][x] === 0) {
            } else {
                counter++;
            }
        }
    }

    if (counter === 81) {
        return true;
    }

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (grid[y][x] === 0) {
                for (let i = 0; i < 10; i++) {
                    if (isPossible(y, x, i, grid)) {
                        grid[y][x] = i;
                        if (solveForValidate(grid)) {
                            return grid;
                        }
                        grid[y][x] = 0;
                    }
                }
                return false;
            }
        }
    }

}

function getMouseLocation (event) {
    const mouseX = event.pageX;
    const mouseY = event.pageY;

    const clickedCellX = Math.floor((mouseX + 25) / 50) - 1;
    const clickedCellY = Math.floor((mouseY + 25) / 50) - 1;

    if (clickedCellX < 9 && clickedCellX > -1 && clickedCellY < 9 && clickedCellY > -1) {
        currentlySelectedCell.x = clickedCellX;
        currentlySelectedCell.y = clickedCellY;
    }

    drawGrid();
    drawNumbers();

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#32CD32"
    if (currentlySelectedCell.x != 10 && currentlySelectedCell.y != 10) {
        if (grid[currentlySelectedCell.y][currentlySelectedCell.x] === 0) {
            ctx.strokeRect(currentlySelectedCell.x*50+25, currentlySelectedCell.y*50+25, 50, 50);
        }
    }

    if (mouseX > 530 && mouseX < 690) {
        if (mouseY > 130 && mouseY < 185) {
            startGame();
        } else if (mouseY > 230 && mouseY < 285) {
            validateGuesses();
        } else if (mouseY > 330 && mouseY < 385) {
            drawGrid();
            drawNumbers();
            solveGridInstantly();
        } else if (mouseY > 430 && mouseY < 485) {
            drawGrid();
            drawNumbers();
            solveGridSlowly();
        }
    }

}

function editTextOnScreen (event) {
    const keyPressed = String.fromCharCode(event.keyCode);
    if (parseInt(keyPressed), 10) {
        if (currentlySelectedCell.x < 10, currentlySelectedCell.y < 10) {
            editedGrid[currentlySelectedCell.y][currentlySelectedCell.x] = parseInt(keyPressed, 10);
            drawGrid();
            drawNumbers();
        }
    }

}

function onHover (event) {

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (mouseX > 530 && mouseX < 690) {
        if (mouseY > 130 && mouseY < 185) {
            drawButtons(true, false, false, false);
        } else if (mouseY > 230 && mouseY < 285) {
            drawButtons(false, true, false, false);
        } else if (mouseY > 330 && mouseY < 385) {
            drawButtons(false, false, true, false);
        } else if (mouseY > 430 && mouseY < 485) {
            drawButtons(false, false, false, true);
        } else {
            drawButtons(false, false, false, false);
        }
    } else {
        drawButtons(false, false, false, false);
    }

}