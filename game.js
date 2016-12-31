'use strict';

const colorX = '#EE9082';
const colorO = '#93C7EE';
const itemSize = 100;
const marginItem = 1;
const containerBoarder = 1;
const delay = 100;
const board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

const gamingRegis = ['One player', 'Two players'];

let singelPlayerLS = parseInt(localStorage.getItem('singelPlayer'));

let singelPlayer = singelPlayerLS ? singelPlayerLS : 0;


let body = document.querySelector('body');

let gamingRegisContainer = document.createElement('ul');
gamingRegisContainer.className = 'gaming-regis-container';

gamingRegis.forEach(function (elem, i){
    let gamingRegisItem = document.createElement('li');
    gamingRegisItem.innerText = elem;
    gamingRegisItem.setAttribute('value', i);
    if (i === singelPlayer) gamingRegisItem.className = 'active';
    gamingRegisContainer.appendChild(gamingRegisItem);
});

body.appendChild(gamingRegisContainer);

let gamingRegisItems = document.querySelectorAll('.gaming-regis-container li');

gamingRegisItems.forEach(function (item) {
    item.addEventListener('click', (event) => {
        let target = event.target;

        if (/active/.test(event.target.className)) return;

        for(let i = 0; i < gamingRegisItems.length; i++) {
            gamingRegisItems[i].classList.remove('active');
        }

        target.classList.add('active');

        if (target.value === 0) {
            localStorage.setItem('singelPlayer', 0);
        } else {
            localStorage.setItem('singelPlayer', 1);
        }

        singelPlayer = parseInt(localStorage.getItem('singelPlayer'));
        window.location.reload(true);
    });
});

let container = document.createElement('div');
container.className = 'container';

body.appendChild(container);

container.style.width = container.style.height =
    board.length * itemSize + board.length * marginItem * 2 + 2 * containerBoarder + 'px';

container.style.marginTop = container.style.marginRight = -(container.offsetWidth / 2) + 'px';
container.style.border = `${ containerBoarder }px solid #00BC6A`;


let count = -1;

board.forEach(function (row, rowIndex) {
    let item;

    row.forEach(function(item, itemIndex) {
        count++;

        item = document.createElement('div');
        item.className = 'item';
        item.setAttribute('datarow', rowIndex);
        item.setAttribute('dataindex', itemIndex);
        item.style.width = item.style.height = itemSize + 'px';
        item.style.lineHeight = itemSize + 'px';
        item.style.margin = marginItem + 'px';
        item.innerText = count;

        container.appendChild(item);
    });
});

let items = document.getElementsByClassName('item');

let checked = false;

for (let i = 0; i < items.length; i++) items[i].addEventListener('click', function(event) {
    if (_handler(event) === 'reload') return;
    if (!singelPlayer && !_defineDraw(board)) _robot();
});

function _robot() {
    if (checked) {
        let maxNumberItem = Math.pow(board.length, 2) - 1;
        let randomIndex = _random(0, maxNumberItem);

        let lastClickResult = _lastClick(board);

        if ( lastClickResult ) {
            setTimeout(() => lastClickResult.click(), delay);
            return;
        }

        while (true) {
            let valueItem = _getArrValue(board, randomIndex);

            if (valueItem === null) {
                setTimeout(() => items[randomIndex].click(), delay);
                break;
            }

            randomIndex++;

            if (randomIndex > maxNumberItem) randomIndex = 0;
        }
    }
}

function _lastClick(arr) {
    let lastClick = [];

    // По горизонтали
    for (let i = 0; i < arr.length; i++) {
        let filterResultO = arr[i].filter(item => item === false);
        let filterResultX = arr[i].filter(item => item === true);

        if (filterResultO.length === arr.length - 1) {
            let resultIndex = arr[i].findIndex(item => item === null);

            if (resultIndex !== -1) {
                return document.querySelectorAll(`.item[datarow='${ i }'][dataindex='${ resultIndex }']`)[0];
            }
        } else if (filterResultX.length === arr.length - 1) {
            let resultIndex = arr[i].findIndex(item => item === null);

            if (resultIndex !== -1) {
                lastClick.push(document.querySelectorAll(`.item[datarow='${ i }'][dataindex='${ resultIndex }']`)[0]);
            }
        }
    }

    // По вертикали
    for(let i = 0; i < arr.length; i++) {
        let resultArr = [];

        for (let j = 0; j < arr.length; j++) {
            resultArr.push(arr[j][i]);
        }

        let filterResultO = resultArr.filter(item => item === false);
        let filterResultX = resultArr.filter(item => item === true);

        if (filterResultO.length === arr.length - 1) {
            let resultIndex = resultArr.findIndex(item => item === null);

            if (resultIndex !== -1) {
                return document.querySelectorAll(`.item[datarow='${ resultIndex }'][dataindex='${ i }']`)[0];
            }
        } else if (filterResultX.length === arr.length - 1) {
            let resultIndex = resultArr.findIndex(item => item === null);

            if (resultIndex !== -1) {
                lastClick.push(document.querySelectorAll(`.item[datarow='${ resultIndex }'][dataindex='${ i }']`)[0]);
            }
        }
    }

    // Диагональ вверх-лево -> низ-право
    let resultArr = [];

    for (let i = 0; i < board.length; i++) resultArr.push(board[i][i]);

    let filterResultO = resultArr.filter(item => item === false);
    let filterResultX = resultArr.filter(item => item === true);

    if (filterResultO.length === arr.length - 1) {
        let resultIndex = resultArr.findIndex(item => item === null);

        if (resultIndex !== -1) {
            return document.querySelectorAll(`.item[datarow='${ resultIndex }'][dataindex='${ resultIndex }']`)[0];
        }
    } else if (filterResultX.length === arr.length - 1) {
        let resultIndex = resultArr.findIndex(item => item === null);

        if (resultIndex !== -1) {
            lastClick.push(document.querySelectorAll(`.item[datarow='${ resultIndex }'][dataindex='${ resultIndex }']`)[0]);
        }
    }

    // Диагональ низ-лево -> вверх-право
    resultArr = [];

    let boardReverse = board.slice(0).reverse();

    for (let i = 0; i < board.length; i++) resultArr.push(boardReverse[i][i]);

    let countdown = arr.length - 1;

    filterResultO = resultArr.filter(item => item === false);
    filterResultX = resultArr.filter(item => item === true);

    if (filterResultO.length === arr.length - 1) {
        let resultIndex = resultArr.findIndex(item => item === null);

        if (resultIndex !== -1){
            return document.querySelectorAll(`.item[datarow='${ Math.abs(resultIndex - countdown) }'][dataindex='${ resultIndex }']`)[0];
        }
    } else if (filterResultX.length === arr.length - 1) {
        let resultIndex = resultArr.findIndex(item => item === null);

        if (resultIndex !== -1) {
            lastClick.push(document.querySelectorAll(`.item[datarow='${ Math.abs(resultIndex - countdown) }'][dataindex='${ resultIndex }']`)[0]);
        }
    }

    return lastClick.length ? lastClick[0] : null;
}

function _handler(event) {
    let element = event.target;

    if (element.innerText !== 'O' && element.innerText !== 'X') {
        checked = !checked;

        element.innerText = checked ? 'X' : 'O';

        if (element.innerText !== 'O') {
            element.style.color = '#CC6054';
            board[element.getAttribute('datarow')][element.getAttribute('dataindex')] = true;
        } else {
            element.style.color = '#6689e1';
            board[element.getAttribute('datarow')][element.getAttribute('dataindex')] = false;
        }

        let winner = _checkArr(board);

        if (winner || _defineDraw(board)) {
            let wrapper = document.createElement('div');
            wrapper.className = 'wrapper';

            let p = document.createElement('p');

            if (winner) {
                p.innerText = `The winner of the player "${ winner }":)`;
            } else {
                p.innerText = 'Draw :|';
            }

            let button = document.createElement('button');
            button.setAttribute('type', 'button');
            button.innerText = 'New game...';

            wrapper.appendChild(p);
            wrapper.appendChild(button);

            document.querySelector('.container').appendChild(wrapper);
            document.querySelector('button').addEventListener('click', () => window.location.reload(true));

            return 'reload';
        }
    }
}

function _checkArr(board) {
    let winner = null;
    let currentRow;

    // По горизонтали
    board.forEach(function (row, index) {
        if ( row.every((elem) => elem === true) ) {
            currentRow = document.querySelectorAll(`.item[datarow='${ index }']`);
            for (let i = 0; i < currentRow.length; i++) currentRow[i].style.backgroundColor = colorX;
            winner = 'X';

        } else if ( row.every((elem) => elem === false) ) {
            currentRow = document.querySelectorAll(`.item[datarow='${ index }']`);
            for (let i = 0; i < currentRow.length; i++) currentRow[i].style.backgroundColor = colorO;
            winner = 'O';
        }
    });

    // По вертикали
    board.forEach(function(row, index) {
        let arr = [];

        for (let i = 0; i < board.length; i++) {
            arr.push(board[i][index]);
        }

        if ( arr.every(elem => elem === true) ) {
            for (let i = 0; i < arr.length; i++) {
                document
                    .querySelectorAll(`.item[datarow='${ i }'][dataindex='${ index }']`)[0]
                    .style.backgroundColor = colorX;
            }
            winner = 'X';
        } else if ( arr.every(elem => elem === false) ) {
            for (let i = 0; i < arr.length; i++) {
                document
                    .querySelectorAll(`.item[datarow='${ i }'][dataindex='${ index }']`)[0]
                    .style.backgroundColor = colorO;
            }
            winner = 'O';
        }
    });

    // Диагональ вверх-лево -> низ-право
    let arr = [];

    for (let i = 0; i < board.length; i++) arr.push(board[i][i]);

    if ( arr.every(elem => elem === true) ) {
        for (let i = 0; i < arr.length; i++) {
            document
                .querySelectorAll(`.item[datarow='${ i }'][dataindex='${ i }']`)[0]
                .style.backgroundColor = colorX;
        }
        winner = 'X';
    } else if ( arr.every(elem => elem === false) ) {
        for (let i = 0; i < arr.length; i++) {
            document
                .querySelectorAll(`.item[datarow='${ i }'][dataindex='${ i }']`)[0]
                .style.backgroundColor = colorO;
        }
        winner = 'O';
    }

    // Диагональ низ-лево -> вверх-право
    arr = [];

    let boardReverse = board.slice(0).reverse();

    for (let i = 0; i < board.length; i++) arr.push(boardReverse[i][i]);

    if ( arr.every(elem => elem === true) ) {
        let countdown = arr.length - 1;

        for (let i = 0; i < arr.length; i++) {
            document
                .querySelectorAll(`.item[datarow='${ i }'][dataindex='${ countdown-- }']`)[0]
                .style.backgroundColor = colorX;
        }
        winner = 'X';
    } else if ( arr.every(elem => elem === false) ) {
        let countdown = arr.length - 1;

        for (let i = 0; i < arr.length; i++) {
            document
                .querySelectorAll(`.item[datarow='${ i }'][dataindex='${ countdown-- }']`)[0]
                .style.backgroundColor = colorO;
        }
        winner = 'O';
    }

    return winner;
}

function _defineDraw(arr) {
    let resultArr = [];

    arr.forEach(function (row) {
        if ( row.every(elem => elem !== null) ) resultArr.push(true);
        else resultArr.push(false);
    });

    return resultArr.every(elem => !!elem);
}

function _random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function _getArrValue(arr, domIndex) {
    return arr[ items[domIndex].getAttribute('datarow') ][ items[domIndex].getAttribute('dataindex') ];
}