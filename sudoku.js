function eliminate(O, y, x, n) {
    let remains = 0
    O.forEach((r, y_) => {
        r.forEach((o, x_) => {
            if ((y === y_ || x === x_ || (y_ >= y - (y % 3) & y_ <= y - (y % 3) + 2 & x_ >= x - (x % 3) & x_ <= x - (x % 3) + 2)) & (!(y_ === y & x_ === x))) {
                let ind = o.indexOf(n);
                if (ind > -1) {
                    o.splice(ind, 1);
                }

            }
            remains = remains + o.length
        })

    })
    return remains

}


function generate_eliminate(B) {
    options = new Array(9)
    let D = 0;
    let R = 0;

    for (let i = 0; i < 9; i++) {
        options[i] = new Array(9)
        for (let j = 0; j < 9; j++) {
            options[i][j] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
    }

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (B[y][x] != 0) {
                options[y][x] = [B[y][x]];
                let r = eliminate(options, y, x, B[y][x])
                //console.log('R: ', r)
            }
        }
    }

    R = option_search(B, options, 0)

    if (R === 0) { return 0 }
    else {
        if (R === 1) {
            return B
        }
        else {
            Y = [0, 1, 2, 3, 4, 5, 6, 7, 8]

            shuffle(Y)

            for (let i = 0; i < 9; i++) {
                y = Y[i]
                X = [0, 1, 2, 3, 4, 5, 6, 7, 8]
                shuffle(X)
                for (let j = 0; j < 9; j++) {
                    x = X[j]
                    if (B[y][x] === 0) {
                        if (options[y][x].length > 1) {
                            for (let i = 0; i < options[y][x].length; i++) {
                                BNew = JSON.parse(JSON.stringify(B))
                                BNew[y][x] = options[y][x][i]
                                fill_grid(BNew)
                                let BRes = generate_eliminate(BNew)
                                if (BRes != 0) {
                                    return BRes
                                }
                            }

                        }
                    }
                }
            }

        }
    }

}

function solve_eliminate(B) {
    options = new Array(9)
    let D = 0;
    for (let i = 0; i < 9; i++) {
        options[i] = new Array(9)
        for (let j = 0; j < 9; j++) {
            options[i][j] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
    }

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (B[y][x] != 0) {
                options[y][x] = [B[y][x]];
                let r = eliminate(options, y, x, B[y][x])
                //console.log('R: ', r)
            }
        }
    }
    return option_search(B, options, 0)

}

function option_search(B, O, D) {
    let d = D + 1
    let num_many = 0;
    let num_one = 0;
    let search_mult = new Array()
    let search_ones = new Array()
    let zero_flag = false
    let num_sol = 0
    let rem = 0

    O.forEach((r, y) => {
        r.forEach((o, x) => {
            if (o.length === 0) {
                zero_flag = true
            }

            if (B[y][x] != 0) {
                num_one++
            }
            else {
                if (o.length === 1) {
                    num_one++
                    search_ones.push([x, y, o[0]])
                }
                else {
                    num_many++

                    search_mult.push([x, y, o])

                }

            }
        })
    })

    if (zero_flag) {
        //console.log('BT: ', d, 'F:', num_one)
        return 0
    }

    if (num_one === 81) {
        return 1
    }
    else {

        if (search_ones.length > 0) {
            BNew = JSON.parse(JSON.stringify(B))

            //fill_grid(BNew)

            ONew = JSON.parse(JSON.stringify(O))

            for (let i = 0; i < search_ones.length; i++) {
                s_o = search_ones[i]

                BNew[s_o[1]][s_o[0]] = s_o[2]
                ONew[s_o[1]][s_o[0]] = [s_o[2]]
                rem = eliminate(ONew, s_o[1], s_o[0], s_o[2])

            }
            //fill_grid(BNew)
            num_sol = num_sol + option_search(BNew, ONew, d)
            return num_sol

        }
        else {
            if (search_mult.length === 0) {
                return 0
            }
            else {

                for (let i = 0; i < search_mult.length; i++) {
                    s_m = search_mult[i]
                    for (let j = 0; j < s_m[2].length; j++) {
                        v = s_m[2][j]

                        BNew = JSON.parse(JSON.stringify(B))
                        BNew[s_m[1]][s_m[0]] = v
                        //fill_grid(BNew)

                        ONew = JSON.parse(JSON.stringify(O))
                        ONew[s_m[1]][s_m[0]] = [v]
                        rem = eliminate(ONew, s_m[1], s_m[0], v)
                        //console.log('R: ', r)
                        num_sol = num_sol + option_search(BNew, ONew, d)
                        if (num_sol > 1) {
                            return num_sol
                        }
                    }
                    if (num_sol === 0) {
                        return 0
                    }
                }
                return num_sol
            }
        }


    }
    throw 'Unhandled scenario!'
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/* historical

function delete_random_number(b) {

    let positions = new Array()

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (b[y][x] != 0) {
                positions.push([x, y])
            }
        }
    }
    shuffle(positions)

    let x = positions[0][0]
    let y = positions[0][1]

    b[y][x] = 0
    return b
}



function solve_board(b) {
    let numSolutions = 0;
    let numFilled = 0;

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (b[y][x] != 0) {
                numFilled++;
                continue
            }
            let cell_options = 0

            for (let n = 1; n <= 9; n++) {
                if (check_row(b, y, n) === 'OK' & check_col(b, x, n) === 'OK' & check_square(b, x, y, n) === 'OK') {
                    cell_options++
                    bNext = JSON.parse(JSON.stringify(b))
                    //console.log(bNext)
                    bNext[y][x] = n;
                    numNext = solve_board(bNext)


                    numSolutions = numSolutions + numNext

                    if (numSolutions > 1) { return 2 }
                }

            }
            if (numSolutions === 0) {
                //console.log('TB ', numFilled)
                return 0
            }

        }

    }
    if (numFilled === 81) { numSolutions = 1 }
    return numSolutions
}


function grid_check_row(y) {
    let result = 'OK';

    for (let x = 0; x < 9; x++) {
        cellFirst = document.getElementById(String(x) + '-' + String(y))
        if (cellFirst.innerText === '') { continue; }

        numberFirst = Number(cellFirst.innerText)
        if ((numberFirst < 1) || (numberFirst > 9)) {
            set_format(x, y, 'wrong');
            result = 'ERROR';
            continue;
        }

        for (let x_ = x + 1; x_ < 9; x_++) {
            cellSecond = document.getElementById(String(x_) + '-' + String(y))
            if (cellSecond.innerText === '') { continue; }

            numberSecond = Number(cellSecond.innerText)
            if ((numberFirst < 1) || (numberFirst > 9)) {
                set_format(x_, y, 'wrong');
                result = 'ERROR';
                continue;
            }

            if (numberFirst === numberSecond) {
                set_format(x, y, 'wrong');
                set_format(x_, y, 'wrong');
                result = 'DUPE';

            }


        }
    }
    return result;
}

function grid_check_column(x) {

    for (let y = 0; y < 9; y++) {
        cellFirst = document.getElementById(String(x) + '-' + String(y))
        if (cellFirst.innerText === '') { continue; }

        numberFirst = Number(cellFirst.innerText)
        if ((numberFirst < 1) || (numberFirst > 9)) {
            set_format(x, y, 'wrong');
            continue;
        }

        for (let y_ = y + 1; y_ < 9; y_++) {
            cellSecond = document.getElementById(String(x) + '-' + String(y_))
            if (cellSecond.innerText === '') { continue; }

            numberSecond = Number(cellSecond.innerText)
            if ((numberFirst < 1) || (numberFirst > 9)) {
                set_format(x, y_, 'wrong');
                continue;
            }

            if (numberFirst === numberSecond) {
                set_format(x, y, 'wrong');
                set_format(x_, y, 'wrong');

            }


        }
    }
}*/


function check_row(b, y, n) {
    let row = b[y];
    let result = 'OK';

    row.forEach(num => {
        if (num === n) {
            result = 'DUPE'
            return result;
        }

    });
    return result;
}

function check_col(b, x, n) {
    let col = new Array();

    b.forEach(row => {
        col.push(row[x])
    });

    let result = 'OK';
    col.forEach(num => {
        if (num === n) {
            result = 'DUPE'
            return result;
        }

    });
    return result;
}

function check_square(b, x, y, n) {
    let xMin = x - x % 3;
    let xMax = xMin + 2;
    let yMin = y - y % 3;
    let yMax = yMin + 2;

    let grid = new Array();
    let result = 'OK';

    for (let i = yMin; i <= yMax; i++) {
        let row = b[i]
        for (let j = xMin; j <= xMax; j++) {
            if (row[j] === n) {
                result = 'DUPE'
                return result
            }
        }

    }
    return result;
}

function add_random_number(b) {
    let numberAdded = false
    let positions = new Array()

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (b[y][x] === 0) {
                positions.push([x, y])
            }
        }
    }


    if (positions.length < 1) {
        console.log('No space!')
        return -1
    }

    shuffle(positions)

    while (positions.length > 0) {

        let x = positions[0][0]
        let y = positions[0][1]

        if (b[y][x] === 0) {
            let tryNumbers = Array.from(new Array(9), (x, i) => i + 1)
            tryNumbers = tryNumbers.sort(() => Math.random() - 0.5)
            while (tryNumbers.length > 0) {
                let n = tryNumbers[0]
                if (check_row(b, y, n) === 'OK' & check_col(b, x, n) === 'OK' & check_square(b, x, y, n) === 'OK') {
                    b[y][x] = n;
                    numberAdded = true
                    return b
                }
                else { tryNumbers.shift() }
            }
        }
        if (!numberAdded) { positions.shift() }



    }

    console.log('No good places to add!')
    return -1
}

function starting_board(n) {
    let c = 0;
    let board = new Array();
    for (i = 0; i < 9; i++) {
        let row = new Array(9).fill(0);
        board.push(row)
    }

    while (c <= n) {
        b_ = add_random_number(board);
        if (b_ != -1) {

            board = b_
            c++

        }
    }
    return board
}
function num_empty(board) {
    let numEmpty = 0

    for (let r = 0; r < 9; r++) {

        for (let c = 0; c < 9; c++) {

            if (board[r][c] === 0) { numEmpty++ }
        }
    }

    return numEmpty

}
function generate_board() {
    let numSolutions = 0;
    let board = 0


    while (board === 0) {
        let board_start = starting_board(17);
        board = generate_eliminate(board_start)
    }

    /* numSolutions = solve_eliminate(board);
     let iter = 0
     let l = 18
     while (numSolutions != 1) {
         iter++
         filled = fill_grid(board)
         console.log(iter, '-', l, ' SOL: ', numSolutions)
         //console.log(board)
         if (numSolutions > 1) {
             boardNew = add_random_number(board);
             if (boardNew === -1) {
 
                 board = starting_board(17);
 
             }
             else {
                 l++
                 board = boardNew
                 numSolutions = solve_eliminate(board)
             }
         }
         if (numSolutions === 0) {
             l--
             if (l < 17) {
                 board = starting_board(17);
 
 
                 numSolutions = solve_eliminate(board);
             }
             else {
                 board = delete_random_number(board)
                 numSolutions = solve_eliminate(board)
             } 
             board = starting_board(17);
             numSolutions = solve_eliminate(board)
 
             l = 17
 
         }
 
     } */


    return board

}

function fill_grid(B) {
    let num_filled = 0

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            cell = document.getElementById(String(x) + '-' + String(y))
            if (B[y][x] === 0) { cell.innerText = '' }
            else {
                num_filled++
                cell.innerText = B[y][x]
                set_format(x, y, 'puzzle')
            }
        }
    }
    return num_filled
}

function add_score(hs_ref, new_user, new_score) {
    let newHSRef = hs_ref.push()
    newHSRef.set({
        user: new_user,
        highscore: new_score
    })
    console.log(newHSRef.key)
}

function show_score() {
    let score = Math.round(100 * (60 * 1000 / (finishTime - startTime)) * Math.max(numEmpty - wrongClicks, 0))
    scoreSubmit = confirm(`Your score is ${score}. Do you want to submit it?`)
    if (scoreSubmit) {
        let userName = prompt('Please enter your name:')
        if (userName) {
            add_score(refHighscores, userName, score)

        }
    }
}

function parse_scores() {
    let top5 = refHighscores.orderByChild('highscore').limitToLast(5)
    top5.on('value', (snapshot) => {

        display_sorted_scores(snapshot);
    });
}

function display_sorted_scores(hs_values) {
    let hs_cell = document.getElementById('highscores')
    let hs_table = document.createElement('table')

    hs_values.forEach(s => {
        v = s.val()
        let row = document.createElement('tr')
        let col_user = document.createElement('td')
        let col_score = document.createElement('td')
        col_user.innerText = v['user']
        col_score.innerText = v['highscore']

        row.appendChild(col_user)
        row.appendChild(col_score)
        hs_table.prepend(row)
    })
    hs_cell.innerHTML = '<p> Current Highscores </p>'
    hs_cell.appendChild(hs_table)
}

function grid_check() {
    let num_right = 0

    for (let r = 0; r < 9; r++) {

        for (let c = 0; c < 9; c++) {

            num_right = num_right + grid_check_cell(c, r)
        }
    }

    if (num_right === 81) {
        for (let r = 0; r < 9; r++) {

            for (let c = 0; c < 9; c++) {

                set_format(c, r, 'done')
            }
        }
        board_active = false
        finishTime = Date.now()
        show_score()
    }


}

function grid_check_cell(x, y) {
    cell = document.getElementById(String(x) + '-' + String(y))
    if (cell.innerText != '') {
        let n = cell.innerText
        let wrong_flag = false
        for (let r = 0; r < 9; r++) {

            for (let c = 0; c < 9; c++) {

                if (r === y || c === x || (r >= y - y % 3 & r <= y - y % 3 + 2 & c >= x - x % 3 & c <= x - x % 3 + 2)) {
                    cell_ = document.getElementById(String(c) + '-' + String(r))
                    n_ = cell_.innerText

                    if (n_ === n & !(r === y & c === x)) {
                        wrong_flag = true
                        set_format(x, y, 'wrong')
                        wrongClicks++
                        return 0
                    }

                }

            }
        }
        if (!wrong_flag) {
            if (board[y][x] != 0) {
                set_format(x, y, 'puzzle')
            }
            else {
                set_format(x, y, 'ok')
            }

            return 1
        }
    }
}




function click_picker(p) {
    if (p == -1) {
        board_active = false
        score = 0
        wrongClicks = 0

        fill_grid(board)
        board_active = true
        startTime = Date.now()
        finishTime = NaN
    }
    else if (p == -2) {
        board_active = false
        score = 0
        wrongClicks = 0
        board = generate_board()
        numEmpty = num_empty(board)

        console.log(board);
        fill_grid(board)
        board_active = true
        startTime = Date.now()
        finishTime = NaN
    }

    else if ((selected_x != -1) & (selected_y != -1)) {
        if (board_active & board[selected_y][selected_x] === 0) {
            cell = document.getElementById(String(selected_x) + '-' + String(selected_y))
            if ((p >= 1) & (p <= 9)) {
                cell.innerText = p;
            }
            else {
                cell.innerText = '';
            }

            grid_check()
        }

    }

}

function click_cell(x, y) {
    console.log(selected_x, selected_y);

    if ((selected_x != -1) & (selected_y != -1)) {
        set_format(selected_x, selected_y, 'unselected');
    }
    selected_x = x;
    selected_y = y;
    set_format(x, y, 'selected');
}

function set_format(x, y, format) {
    cell = document.getElementById(String(x) + '-' + String(y))
    switch (format) {
        case 'done':
            cell.style.color = 'green'
            break;
        case 'wrong':
            cell.style.color = 'red'
            break;
        case 'ok':
            cell.style.color = 'black'
            break;
        case 'selected':
            cell.style.border = '2px solid black'
            break;
        case 'unselected':
            cell.style.border = '1px solid black'
            break;
        case 'puzzle':
            cell.style.color = 'gray'

    }
}

function reset_field() {

    let W = field.style.width
    let H = field.style.height

    let cell_size = 4;

    console.log(W, H)
    D = Math.min(W, H)



    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            let cell = document.createElement('div')

            cell.style.width = String(cell_size) + 'vmin';
            cell.style.height = String(cell_size) + 'vmin';
            cell.style.left = String((x + 3) * cell_size) + 'vmin'
            cell.style.top = String((y + 3) * cell_size) + 'vmin'
            cell.style.border = '1px solid black'
            cell.style.position = 'absolute'
            cell.style.textAlign = 'center'
            cell.style.justifyContent = 'center'
            cell.style.alignItems = 'center'
            cell.style.display = 'flex'
            if ((x - x % 3) % 2 === (y - y % 3) % 2) {
                cell.style.backgroundColor = '#ffffff'
            }
            else { cell.style.backgroundColor = '#ffffaa' }
            cell.setAttribute('id', String(x) + '-' + String(y))
            cell.setAttribute('cellX', x)
            cell.setAttribute('cellY', y)
            cell.innerText = String(x * y);
            cell.addEventListener('click', function () { click_cell(x, y) });
            document.getElementById('field').appendChild(cell)



        }
    }

    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            let cell = document.createElement('div')

            cell.style.width = String(cell_size) + 'vmin';
            cell.style.height = String(cell_size) + 'vmin';
            cell.style.left = String(x * cell_size) + 'vmin'
            cell.style.top = String(y * cell_size) + 'vmin'
            cell.style.border = '1px solid black'
            cell.style.position = 'absolute'
            cell.style.textAlign = 'center'
            cell.style.justifyContent = 'center'
            cell.style.alignItems = 'center'
            cell.style.display = 'flex'
            cell.style.fontSize = String(cell_size / 2) + 'vmin'
            cell.setAttribute('id', 'pick_' + String((y) * 3 + (x + 1)))
            cell.setAttribute('pickN', (y) * 3 + (x + 1))
            cell.innerText = String((y) * 3 + (x + 1));

            cell.addEventListener('click', function () { click_picker((y) * 3 + (x + 1)) });

            document.getElementById('picker').appendChild(cell)



        }
    }

    bottom_cells = [['RST', 'pick_reset', -1], ['CLR', 'pick_clear', 0], ['NEW', 'pick_new', -2]]

    bottom_cells.forEach((param, index) => {
        let cell = document.createElement('div')

        cell.style.width = String(cell_size) + 'vmin';
        cell.style.height = String(cell_size) + 'vmin';
        cell.style.left = String(index * cell_size) + 'vmin'
        cell.style.top = String(cell_size * 3) + 'vmin'
        cell.style.border = '1px solid black'
        cell.style.position = 'absolute'
        cell.style.textAlign = 'center'
        cell.style.justifyContent = 'center'
        cell.style.alignItems = 'center'
        cell.style.display = 'flex'
        cell.style.fontSize = String(cell_size / 3) + 'vmin'

        cell.setAttribute('id', param[1])
        cell.setAttribute('pickN', param[2])
        cell.innerText = param[0];

        cell.addEventListener('click', function () { click_picker(param[2]) });

        document.getElementById('picker').appendChild(cell)
    })

    board_active = true
}