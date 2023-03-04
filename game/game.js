const X = 1;
const Y = 0;
let currentElement;
let randomElementQueue = [];
let timer;
let sounds = { // hangeffektet
    clear: new Audio('soundeffects/clear.wav'),
    gameover: new Audio('soundeffects/gameover.wav'),
    success: new Audio('soundeffects/success.wav'),
    theme: new Audio('soundeffects/theme.mp3')
};
let controlDown = document.getElementById('down');

const game = { // maga a játék objektum, alapvető informáciok a játéktér kapcsán
    row: 20,
    col: 10,
    player: '',
};

function initBoard() { //a board divet griddé alakítja a "row" és "col" változó méretében
    let board = document.getElementById('board');
    board.style.display = 'grid';
    board.style.gridTemplateColumns = `repeat(${game.col}, 30px)`; //manuális col-row meghatározás helyett a repeat a megadott mennyiségben létrehoz elemeket a griden belül
    board.style.gridTemplateRows = `repeat(${game.row}, 30px)`;
    board.style.gridGap = '1px';
    board.style.padding = '1px';
    board.style.border = '8px outset #303030';
    board.style.borderRadius = '5px';
}

function initCells() { //létrehozza a megfelelö mennyiségü sort
    for (let y = 0; y < game.row; y++) {
        initNewRow();
    }

}

function initNewRow() { // létrehoz egy sornyi divet (tábla)
    let cell;
    let board = document.getElementById('board');
    for (let x = 0; x < game.col; x++) {
        cell = document.createElement('div');
        cell.style.backgroundColor = 'black';
        cell.setAttribute('data-occupied', false); // html objektumoknak létre lehet hozni nem beépitett attributumokat
        board.insertBefore(cell, board.firstChild);
    }
}

function initCellCoordinates() {
    let counter = 0;
    let board = document.getElementById('board');
    let cells = board.childNodes;
    for (let cell of cells) {
        cell.setAttribute('data-col', counter % (game.col));
        cell.setAttribute('data-row', Math.floor(counter / (game.col)));
        counter++;
    }
}

// FORMÁK LÉTREHOZÁSA - KEZDŐDIK
function createLine() {
    return {
        startY: -2,
        startX: 3,
        positions: [
            [null, null, true, null],
            [null, null, true, null],
            [null, null, true, null],
            [null, null, true, null]
        ],
        color: 'blue'
    }
}

function createCube() {
    return {
        startY: -2,
        startX: 3,
        positions: [
            [true, true],
            [true, true]
        ],
        color: 'yellow'
    }
}

function createRightZ() {
    return {
        startY: -2,
        startX: 3,
        positions: [
            [null, true, true],
            [true, true, null],
            [null, null, null]
        ],
        color: 'red'
    }
}

function createLeftZ() {
    return {
        startY: -2,
        startX: 3,
        positions: [
            [true, true, null],
            [null, true, true],
            [null, null, null]
        ],
        color: 'green'
    }
}

function createRightL() {
    return {
        startY: -2,
        startX: 3,
        positions: [
            [null, true, null],
            [null, true, null],
            [null, true, true]
        ],
        color: 'orange'
    }
}

function createLeftL() {
    return {
        startY: -2,
        startX: 3,
        positions: [
            [null, true, null],
            [null, true, null],
            [true, true, null]
        ],
        color: 'cyan'
    }
}

function createShortT() {
    return {
        startY: -2,
        startX: 3,
        positions: [
            [null, null, null],
            [true, true, true],
            [null, true, null]
        ],
        color: 'purple'
    }
}
// FORMÁK LÉTREHOZÁSA - BEFEJEZŐDIK

function getCoordinates(positions) { // végigmegy a játéktéren és megnézi, melyik koordinátákon vannak alakzatok
    let coordinates = [];
    for (let y = 0; y < positions.length; y++) {
        for (let x = 0; x < positions[y].length; x++) {
            if (positions[y][x] === true) {
                coordinates.push([currentElement.startY + y, currentElement.startX + x]);
            }
        }
    }
    return coordinates;
}

function drawElement(clear = false) {
    let color = clear ? 'black' : currentElement.color;
    let borderColor = clear ? '#303030' : currentElement.color;
    let field;
    let coordinates = getCoordinates(currentElement.positions);
    for (let coordinate of coordinates) {
        if (coordinate[X] >= 0 && coordinate[Y] >= 0) {
            field = document.querySelector(`[data-row="${coordinate[Y]}"][data-col="${coordinate[X]}"]`);
            field.style.backgroundColor = color;
            field.style.borderColor = borderColor;
        }
    }
}

function correctElementStartPosition(positions) {
    let initialX = currentElement.startX;
    while (true) {
        let moved = false;
        let coordinates = getCoordinates(positions);
        for (let coordinate of coordinates) {
            if (coordinate[X] < 0) {
                currentElement.startX++;
                if (!isCollision(positions) && !isBelowBorderY(positions)) {
                    moved = true;
                    break;
                } else {
                    currentElement.startX = initialX;
                    return false;
                }
            } else if (coordinate[X] >= game.col) {
                currentElement.startX--;
                if (!isCollision(positions) && !isBelowBorderY(positions)) {
                    moved = true;
                    break;
                } else {
                    currentElement.startX = initialX;
                    return false;
                }
            }
        }
        if (!moved) break;
    }
    return true;
}

function isBelowBorderY(positions) {
    let coordinates = getCoordinates(positions);
    for (let coordinate of coordinates) {
        if (coordinate[Y] >= game.row) {
            return true;
        }
    }
    return false;
}

function rotateElement() {
    drawElement(true);
    let rotatedElement = [];
    for (let i = 0; i < currentElement.positions.length; i++) {
        let row = currentElement.positions.map(e => e[i]).reverse();
        rotatedElement.push(row);
    }
    if (!isInBoardX(rotatedElement)) {
        let canDo = correctElementStartPosition(rotatedElement);
        if (canDo === true) {
            currentElement.positions = rotatedElement;
        }
    } else if (!isCollision(rotatedElement) && !(isBelowBorderY(rotatedElement))) {
        currentElement.positions = rotatedElement;
    }
    drawElement();
}

function canFallDown() {
    let field;
    let coordinates = getCoordinates(currentElement.positions);
    for (let coordinate of coordinates) {
        field = document.querySelector(`[data-row="${coordinate[Y]}"][data-col="${coordinate[X]}"]`);
        if (coordinate[Y] >= 0) {
            if (coordinate[Y] >= game.row) {
                return false;
            }
            if (field.getAttribute('data-occupied') === 'true') {
                return false;
            }
        }
    }
    return true;
}

function rowCollapse() {
    let board = document.getElementById('board');
    let coordinates = getCoordinates(currentElement.positions);
    let rows = [];
    let divs;
    let counter;
    for (let coordinate of coordinates) {
        if (!(coordinate[Y] in rows)) {
            rows.push(coordinate[Y]);
        }
    }
    for (let row of rows) {
        counter = 0;
        divs = document.querySelectorAll(`[data-row="${row}"]`);
        for (let div of divs) {
            if (div.getAttribute('data-occupied') === 'true') {
                counter++;
            }
        }
        if (counter === game.col) {
            for (let div of divs) {
                board.removeChild(div)
            }
            sounds.clear.play();
            sounds.clear.volume = 0.2;
            initNewRow();
            initCellCoordinates();
            scoreIncrement(100);
        }
    }
}

function clearBoard() { // kitöröl egy sort a palyarol
    let board = document.getElementById('board');
    let count = board.childElementCount;
    for (let i = 0; i < count; i++) {
        board.removeChild(board.firstChild);
    }
}

function passVal(){
    var data = {
        score: document.getElementById("player-score").innerText
    };
    $.post("game.php", data);
}  

function alertBox() { // uj jatek alert box
    sounds.theme.pause();
    sounds.theme.currentTime = 0;
    sounds.gameover.play();
    sounds.gameover.volume = 0.2;
    let gameOverPopup = document.createElement("div");
    gameOverPopup.setAttribute('class', 'popup');
    let gameOverText = document.createElement("h1");
    gameOverText.innerText = 'Game Over!';
    gameOverPopup.appendChild(gameOverText);
    document.body.appendChild(gameOverPopup);
    let newGameButton = document.createElement('button');
    newGameButton.setAttribute('id', 'newGame');
    newGameButton.innerText = 'New Game';
    gameOverPopup.appendChild(newGameButton);

    passVal();

    newGameButton.addEventListener('click', function (event) {
        document.body.removeChild(gameOverPopup);
        initGame();
    });

}

function fixElement() {
    let field;
    let coordinates = getCoordinates(currentElement.positions);
    if (!isInBoardY()) {
        clearInterval(timer);
        document.onkeydown = null;
        removeClickControls();
        alertBox();
    }
    for (let coordinate of coordinates) {
        field = document.querySelector(`[data-row="${coordinate[Y]}"][data-col="${coordinate[X]}"]`);
        field.setAttribute('data-occupied', true);
    }
    rowCollapse();
    fillQueue();
}

function fallElement() {
    drawElement(true);
    currentElement.startY++;
    if (!canFallDown()) {
        currentElement.startY--;
        drawElement();
        fixElement();
    } else
        drawElement();
}

function isInBoardX(positions) {
    let coordinates = getCoordinates(positions);
    for (let coordinate of coordinates) {
        if (coordinate[X] < 0) {
            return false;
        } else if (coordinate[X] >= game.col) {
            return false;
        }
    }
    return true;
}

function isInBoardY() {
    let coordinates = getCoordinates(currentElement.positions);
    for (let coordinate of coordinates) {
        if (coordinate[Y] <= 0) {
            return false;
        }
    }
    return true;
}

function isInBoard(coordinate) {
    return !(coordinate[X] < 0 || coordinate[X] >= game.col || coordinate[Y] < 0 || coordinate[Y] >= game.row);
}

function isCollision(positions) {
    let field;
    let coordinates = getCoordinates(positions);
    for (let coordinate of coordinates) {
        if (isInBoard(coordinate)) {
            field = document.querySelector(`[data-row="${coordinate[Y]}"][data-col="${coordinate[X]}"]`);
            if (field.getAttribute("data-occupied") === "true") {
                return true;
            }
        }
    }
    return false;
}

// Mozgás iránytol függöen - KEZDODIK
function moveElementHorizontally(direction) {
    drawElement(true);
    (direction === 'right') ? currentElement.startX++ : currentElement.startX--;
    if (!isInBoardX(currentElement.positions) || isCollision(currentElement.positions)) {
        (direction === 'right') ? currentElement.startX-- : currentElement.startX++;
    }
    drawElement();
}

function scoreIncrement(increment) {
    let score = parseInt(document.getElementById("player-score").innerText);
    document.getElementById("player-score").innerText = score + increment;
}

function moveElement(e) { // irányitás billentyuzettel
    e.preventDefault();
    if (e.keyCode === 38) {
        rotateElement();
    } else if (e.keyCode === 40) {
        fallElement();
        scoreIncrement(1)
    } else if (e.keyCode === 37) {
        moveElementHorizontally('left');
    } else if (e.keyCode === 39) {
        moveElementHorizontally('right');
    }
}

// iranyitasok a kepernyon elhelyezkedo nyilakkal
function clickDown(event) {
    fallElement();
    scoreIncrement(1)
}

function clickLeft(event) {
    moveElementHorizontally('left');
}

function clickRight(event) {
    moveElementHorizontally('right');
}

function clickRotate(event) {
    rotateElement();
}
// Mozgás iránytol függöen - BEFEJEZODIK

function addClickControls() {
    document.getElementById('left').addEventListener('click', clickLeft);
    document.getElementById('right').addEventListener('click', clickRight);
    document.getElementById('rotate').addEventListener('click', clickRotate);
    document.getElementById('down').addEventListener('click', clickDown)
}

function removeClickControls() {
    document.getElementById('left').removeEventListener('click', clickLeft);
    document.getElementById('right').removeEventListener('click', clickRight);
    document.getElementById('rotate').removeEventListener('click', clickRotate);
    document.getElementById('down').removeEventListener('click', clickDown)
}

function drawQueue() {
    let elementCounter = 0;
    for (let element of randomElementQueue) {
        let nextElement = document.createElement("div");
        nextElement.setAttribute('class', 'next-element');
        nextElement.style.gridTemplateRows = `repeat(${element.positions.length}, 30px)`;
        nextElement.style.gridTemplateColumns = `repeat(${element.positions[0].length}, 30px)`;
        
        for (let y = 0; y < element.positions.length; y++) {
            for (let x = 0; x < element.positions[y].length; x++) {
                let cell = document.createElement("div");
                if (element.positions[y][x]) {
                    cell.style.backgroundColor = element.color;
                    cell.style.borderColor = element.color;
                    cell.style.borderWidth = '4px';
                    cell.style.borderStyle = 'outset';
                    cell.style.borderRadius = '5px';
                }
                nextElement.appendChild(cell);
            }
        }

        let nextBlock = document.getElementById(`next${elementCounter}`);

        if (nextBlock.hasChildNodes()) {
            nextBlock.removeChild(nextBlock.firstChild)
        }
        
        nextBlock.appendChild(nextElement);
        elementCounter++;
    }
}

function fillQueue() {
    let elementTypes = [createCube, createLeftL, createLeftZ, createLine, createRightL, createRightZ, createShortT];
    while (randomElementQueue.length <= 3) {
        randomElementQueue.push(elementTypes[Math.floor(Math.random() * elementTypes.length)]());
    }
    currentElement = randomElementQueue.shift();
    drawQueue();
}

function startGame() {
    fillQueue();
    drawElement();
    document.onkeydown = moveElement;
    addClickControls();
    timer = setInterval(fallElement, 1500)
}

function showPanels() {
    let player = document.getElementById('player-container');
    let nextPanel = document.getElementById('next-container');
    let control = document.getElementById('control-container');
    player.style.opacity = '1';
    nextPanel.style.opacity = '1';
    control.style.opacity = '1';
}

function initCounters() {
    document.getElementById("player-score").innerText = 0;
}

function initGame() { //összefogja a függvényeket, ez felelős a játék logikájának helyes müködéséért
    clearBoard();
    initBoard();
    initCells();
    initCellCoordinates();
    initCounters();
    showPanels();
    startGame();
    sounds.theme.play();
    sounds.theme.volume = 0.06;
    sounds.theme.loop = true;
}

initGame();
