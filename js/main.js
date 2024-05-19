// main.js

function calculateCustoPeca() {
    const peso = parseFloat(document.getElementById('peso').value) || 0;
    const custoExtra = parseFloat(document.getElementById('custo_extra').value) || 0;
    const custoPeca = peso * custoExtra;
    document.getElementById('custo_peca').value = custoPeca.toFixed(2);
    updateTable();
}

function updateTable() {
    const table = document.getElementById('editableTable').getElementsByTagName('tbody')[0];
    const totalInput = document.getElementById('total');
    let total = 0;
    let totalPeso = 0;
    let totalPercent = 0;

    for (let i = 0, row; row = table.rows[i]; i++) {
        const pesoInput = row.cells[1].getElementsByTagName('input')[0];
        const margemBrutaInput = row.cells[3].getElementsByTagName('input')[0];

        const peso = parseFloat(pesoInput.value) || 0;
        const margemBruta = parseFloat(margemBrutaInput.value) || 0;
        const custoExtra = parseFloat(document.getElementById('custo_extra').value) || 0;
        const pesoTotal = parseFloat(document.getElementById('peso').value) || 1;

        const percentualPeso = (peso / pesoTotal) * 100;
        const precoVenda = custoExtra * (1 + margemBruta / 100);
        const totalRow = precoVenda * peso;

        totalPeso += peso;
        totalPercent += percentualPeso;
        
        row.cells[2].innerText = percentualPeso.toFixed(2);
        row.cells[4].innerText = precoVenda.toFixed(2);
        row.cells[5].innerText = totalRow.toFixed(2);

        total += totalRow;
    }

    totalInput.value = total.toFixed(2);
    document.getElementById('totalPeso').innerText = totalPeso.toFixed(2);
    document.getElementById('totalPercent').innerText = totalPercent.toFixed(2);
    updateFinalCalculations();
}

function updateFinalCalculations() {
    const total = parseFloat(document.getElementById('total').value) || 0;
    const custoPeca = parseFloat(document.getElementById('custo_peca').value) || 0;
    const diferenca = total - custoPeca;
    const lucroBruto = (diferenca / custoPeca) * 100;

    document.getElementById('diferenca').value = diferenca.toFixed(2);
    document.getElementById('lucro_bruto').value = lucroBruto.toFixed(2);

    updatePercentageValue();
}

function updatePercentageValue() {
    const totalInput = parseFloat(document.getElementById('total').value) || 0;
    const table = document.getElementById('editableTable').getElementsByTagName('tbody')[0];

    for (let i = 0, row; row = table.rows[i]; i++) {
        const totalRow = parseFloat(row.cells[5].innerText) || 0;
        const percentage = totalRow / totalInput * 100 || 0;
        row.cells[6].innerText = percentage.toFixed(2);
    }
}

function addRow() {
    const table = document.getElementById('editableTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    for (let i = 0; i < 7; i++) {
        const newCell = newRow.insertCell(i);
        const input = document.createElement('input');
        input.type = i === 0 ? 'text' : 'number';
        input.step = '0.01';
        input.oninput = updateTable;
        newCell.appendChild(input);
        if (i > 0) {
            newCell.setAttribute('data-label', table.rows[0].cells[i].innerText);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Verifica se o usuário está logado ao carregar a página principal
    if (window.location.pathname.endsWith('index.html') && !localStorage.getItem('loggedIn')) {
        window.location.href = 'index.html';
    }

    // Define o ano atual no footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === '54321') {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'controle.html';
    } else {
        document.getElementById('error-message').textContent = 'Usuário ou senha incorretos';
    }
});

// Função de logout
function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = '/';
}


