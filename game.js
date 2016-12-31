'use strict';

const colorX = '#EE9082';
const colorO = '#93C7EE';
const itemSize = 100;
const marginItem = 1;
const containerBoarder = 3;
const board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];


let container = document.createElement('div');
container.className = 'container';

document.getElementsByTagName('body')[0].appendChild(container);

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

for (let i = 0; i < items.length; i++) items[i].addEventListener('click', _handler);

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

        if ( winner || _defineDraw(board) ) {
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
        }
    }
}

function _checkArr(board) {
    let winner = null;
    let currentRow;

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