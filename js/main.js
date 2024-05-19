// main.js

function toggleDarkMode() {
    const body = document.querySelector('body');
    const darkModeBtn = document.querySelector('.dark-mode-btn');
    const moonIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>`;
    const sunIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>`;

    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        darkModeBtn.innerHTML = moonIcon + ' Escuro';
    } else {
        body.classList.add('dark-mode');
        darkModeBtn.innerHTML = sunIcon + ' Claro';
    }
}




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



// Função para limpar o formato de moeda e converter para número
function clearCurrencyFormat(value) {
    return parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.'));
}


// Função para exportar todos os dados da página para um arquivo .xlsx
function exportToExcel() {
    const wb = XLSX.utils.book_new();

    // Capturar dados dos inputs
    const inputHeaders = ['Campo', 'Valor'];
    const inputData = [];
    document.querySelectorAll('.inputs .itens').forEach(item => {
        const label = item.querySelector('label');
        const input = item.querySelector('input');
        
        if (label && input) {
            inputData.push([label.textContent, input.value]);
        }
    });

    // Incluir Custo Bruto da Compra
    const custoBruto = document.getElementById('custo_bruto');
    if (custoBruto) {
        inputData.push(['Custo Bruto da Compra (R$)', custoBruto.value]);
    }

    // Incluir custo_peca
    const custoPeca = document.getElementById('custo_peca');
    if (custoPeca) {
        inputData.push(['Custo Peça (R$)', custoPeca.value]);
    }

    // Criar uma planilha para os inputs
    const wsInputs = XLSX.utils.aoa_to_sheet([inputHeaders, ...inputData]);

    // Adicionar estilo para as células desejadas
    wsInputs['A3'].s = { font: { color: { rgb: '0000FF' } } }; // "Custo Peça (R$)"
    wsInputs['A4'].s = { font: { color: { rgb: '0000FF' } } }; // "Custo Bruto da Compra (R$)"

    XLSX.utils.book_append_sheet(wb, wsInputs, 'Inputs');

    // Capturar dados da tabela
    const table = document.querySelector('#editableTable');
    const tableHeaders = [];
    const tableData = [];

    // Capturar cabeçalhos da tabela
    table.querySelectorAll('thead th').forEach(th => {
        tableHeaders.push(th.innerText);
    });

    // Capturar dados das linhas da tabela
    table.querySelectorAll('tbody tr').forEach(tr => {
        const rowData = [];
        tr.querySelectorAll('td').forEach(td => {
            const input = td.querySelector('input');
            rowData.push(input ? input.value : td.innerText);
        });
        tableData.push(rowData);
    });

    // Criar uma planilha para a tabela
    const wsTable = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);
    XLSX.utils.book_append_sheet(wb, wsTable, 'Tabela');

    // Escrever o arquivo
    XLSX.writeFile(wb, 'relatorio_completo.xlsx');
}




// Função para exportar todos os dados da página para um arquivo .json
function exportToJson() {
    const data = {
        inputs: {},
        table: []
    };

    // Capturar dados dos inputs
    document.querySelectorAll('.inputs .itens').forEach(item => {
        const label = item.querySelector('label');
        const input = item.querySelector('input');
        
        if (label && input) {
            data.inputs[label.textContent] = input.value;
        }
    });

    // Incluir custo_peca
    const custoPeca = document.getElementById('custo_peca');
    if (custoPeca) {
        data.inputs['Custo Peça'] = custoPeca.value;
    }

    // Capturar dados da tabela
    const table = document.querySelector('#editableTable');
    table.querySelectorAll('tbody tr').forEach(tr => {
        const rowData = {};
        tr.querySelectorAll('td').forEach((td, index) => {
            const input = td.querySelector('input');
            const cellValue = input ? input.value : td.innerText;
            rowData[table.querySelector('thead').children[0].children[index].innerText] = cellValue;
        });
        data.table.push(rowData);
    });

    // Criar arquivo JSON e forçar download
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'relatorio_completo.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// Função para exportar todos os dados da página para um arquivo .json
function exportToJson() {
    const data = {
        inputs: {},
        table: []
    };

    // Capturar dados dos inputs
    document.querySelectorAll('.inputs .itens').forEach(item => {
        const label = item.querySelector('label');
        const input = item.querySelector('input');
        
        if (label && input) {
            data.inputs[label.textContent] = input.value;
        }
    });

    // Incluir custo_peca
    const custoPeca = document.getElementById('custo_peca');
    if (custoPeca) {
        data.inputs['Custo Peça'] = custoPeca.value;
    }

    // Capturar dados da tabela
    const table = document.querySelector('#editableTable');
    table.querySelectorAll('tbody tr').forEach(tr => {
        const rowData = {};
        tr.querySelectorAll('td').forEach((td, index) => {
            const input = td.querySelector('input');
            const cellValue = input ? input.value : td.innerText;
            rowData[table.querySelector('thead').children[0].children[index].innerText] = cellValue;
        });
        data.table.push(rowData);
    });

    // Criar arquivo JSON e forçar download
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'relatorio_completo.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// Exemplo de uso: adicionando eventos aos botões de download
document.getElementById('downloadExcelButton').addEventListener('click', exportToExcel);
document.getElementById('downloadJsonButton').addEventListener('click', exportToJson);
