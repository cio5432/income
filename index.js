var state = {
    total: 45000,
    masuk: 50000,
    keluar: 5000,
    transactions: [
        
    ]
}

var totalEl = document.querySelector('#total');
var masukEl = document.querySelector('#masuk');
var keluarEl = document.querySelector('#keluar');
var transactionsEl = document.querySelector('#transaction');
var masukBtnEl = document.querySelector('#masukBtn');
var keluarBtnEl = document.querySelector('#keluarBtn');
var teksInputEl = document.querySelector('#teks');
var jumlahInputEl = document.querySelector('#jumlah');

function init() {
    var localState = JSON.parse(localStorage.getItem('INCOMEANDEXPENSEState'));

    if (localState !== null) {
        state = localState;
    }
    
    updateState();
    initListeners();
}

function uniqueId() {
    return Math.round(Math.random() * 1000000);
}

function initListeners() {
    masukBtnEl.addEventListener('click', onPemasukanClick);
    keluarBtnEl.addEventListener('click', onPengeluaranClick);
}

function onPemasukanClick() {
    addTransaction(teksInputEl.value, jumlahInputEl.value, 'masuk');
}

function addTransaction(teks, jumlah, type) {
    var teks = teksInputEl.value;
    var jumlah = jumlahInputEl.value;
    if (teks !== '' && jumlah !== '') {
        var transaction = {
            id: uniqueId(),
            teks: teks,
            jumlah: parseInt(jumlah), 
            type: type
       };

       state.transactions.push(transaction);

       updateState();
    }else {
        alert('please enter valid data');
    }

    teksInputEl.value = '';
    jumlahInputEl.value = '';
}

function onPengeluaranClick() {
   addTransaction(teksInputEl.value, jumlahInputEl.value, 'keluar');
}

function onDeleteClick(event) {
    var id = parseInt(event.target.getAttribute('data-id'));
    var deleteIndex;
    for (var i = 0; i < state.transactions.length; i++) {
        if (state.transactions[i].id === id) {
            deleteIndex = i;
            break;
        }
    }

    state.transactions.splice(deleteIndex, 1);

    updateState();
}

function updateState() {
    var total = 0,
        masuk = 0,
        keluar = 0,
        item;

    for (var i = 0; i < state.transactions.length; i++) {
        item = state.transactions[i];

        if (item.type === 'masuk') {
            masuk += item.jumlah;
        }else if (item.type === 'keluar') {
            keluar += item.jumlah;
        }
    }

    total = masuk - keluar;

    state.total = total;
    state.masuk = masuk;
    state.keluar = keluar; 

    localStorage.setItem('INCOMEANDEXPENSEState', JSON.stringify(state))

    render();
}

function render() {
    totalEl.innerHTML = `Rp.${state.total}`;
   masukEl.innerHTML = `Rp.${state.masuk}`;
   keluarEl.innerHTML = `Rp.${state.keluar}`;

   var transactionEl, containerEl, jumlahEl, item, btnEl;

   transactionsEl.innerHTML = '';

   for (var i = 0; i < state.transactions.length; i++) {
    item = state.transactions[i];
    transactionEl  = document.createElement('li');
    transactionEl.append(item.teks)

    transactionsEl.appendChild(transactionEl);

    containerEl = document.createElement('div');
    jumlahEl = document.createElement('span');
    if (item.type === 'masuk') {
        jumlahEl.classList.add('masuk-amt');
    }else if (item.type === 'keluar') {
        jumlahEl.classList.add('keluar-amt');
    }
    jumlahEl.innerHTML = `Rp.${item.jumlah}`;

    containerEl.appendChild(jumlahEl);

    btnEl = document.createElement('button');
    btnEl.setAttribute('data-id', item.id);
    btnEl.innerHTML = 'x';

    btnEl.addEventListener('click', onDeleteClick);

    containerEl.appendChild(btnEl);
    

    transactionEl.appendChild(containerEl);
   }
}

init();