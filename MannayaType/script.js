
const t = document.getElementById('text');
const timeEl = document.getElementById('time');
const wpmEl = document.getElementById('wpm');
const accEl = document.getElementById('acc');
const end = document.getElementById('end');

let chars = [];
let idx = 0;
let started = false;

let time = 30;
let intv;

let correct = 0;
let wrong = 0;

let state = [];


function gen() {
    let arr = [];

    for (let i = 0; i < 200; i++) {
        arr.push(
            WORDS[Math.floor(Math.random() * WORDS.length)]
        );
    }

    chars = arr.join(' ').split('');

    render();
}


function render() {
    t.innerHTML = '';

    chars.forEach((ch, i) => {
        let s = document.createElement('span');

        s.textContent = ch;

        if (i < idx) {
            s.className = s._w ? 'w' : 'c';
        }
        else if (i === idx) {
            s.className = 'cur';
        }
        else {
            s.className = 'p';
        }

        t.appendChild(s);
    });
}


function rerender() {
    t.innerHTML = '';

    chars.forEach((ch, i) => {
        let s = document.createElement('span');

        s.textContent = ch;

        if (i < idx) {
            s.className = state[i];
        }
        else if (i === idx) {
            s.className = 'cur';
        }
        else {
            s.className = 'p';
        }

        t.appendChild(s);
    });
}


function start() {
    intv = setInterval(() => {
        time--;

        timeEl.textContent = time;

        if (time <= 0) {
            clearInterval(intv);
            finish();
        }

    }, 1000);
}


function finish() {
    document.removeEventListener('keydown', key);

    end.className = '';

    end.innerHTML = `
        <h2>Finished</h2>
        <p>WPM ${wpmEl.textContent}</p>
        <p>Accuracy ${accEl.textContent}%</p>
        <button onclick="location.reload()">Restart</button>
    `;
}


function update() {
    let typed = correct + wrong;

    accEl.textContent = typed
        ? Math.round(correct / typed * 100)
        : 100;

    wpmEl.textContent = Math.round(
        (correct / 5) / ((30 - time || 1) / 60)
    );
}


function key(e) {

    if (time <= 0) {
        return;
    }


    if (!started) {
        started = true;
        start();
    }


    if (e.key === "Backspace") {

        if (idx > 0) {

            idx--;

            if (state[idx] === 'c') {
                correct--;
            }
            else if (state[idx] === 'w') {
                wrong--;
            }

            state[idx] = 'p';

            update();
            rerender();
        }

        e.preventDefault();

        return;
    }


    if (e.key.length !== 1) {
        return;
    }


    state[idx] = e.key === chars[idx]
        ? 'c'
        : 'w';


    if (state[idx] === 'c') {
        correct++;
    }
    else {
        wrong++;
    }


    idx++;

    update();
    rerender();
}


gen();

state = new Array(chars.length).fill('p');

rerender();

document.addEventListener('keydown', key);
