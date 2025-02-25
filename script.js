// Variáveis globais para armazenar dados
const planejamentos = [];
const despesas = [];

// Função para mudar de aba
function mudarAba(aba) {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));
    document.getElementById(aba).classList.add("active");
    document.querySelector(`.tab[onclick="mudarAba('${aba}')"]`).classList.add("active");
    if (aba === "resumo") {
        atualizarGrafico();
    }
}

// Função para atualizar a tabela de planejamento
function atualizarTabelaPlanejamento() {
    const tbody = document.querySelector("#planejamento-table tbody");
    tbody.innerHTML = ""; // Limpa a tabela antes de atualizar
    planejamentos.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.categoria}</td>
            <td>${item.valorPlanejado.toFixed(2)}</td>
            <td>
                <span class="edit-btn" onclick="editarPlanejamento(${index})">Editar</span> |
                <span class="delete-btn" onclick="excluirPlanejamento(${index})">Excluir</span>
            </td>
        `;
        tbody.appendChild(row);
    });
    atualizarOpcoesCategorias();
}

// Função para atualizar a tabela de despesas
function atualizarTabelaDespesas() {
    const tbody = document.querySelector("#despesas-table tbody");
    tbody.innerHTML = ""; // Limpa a tabela antes de atualizar
    despesas.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.data}</td>
            <td>${item.descricao}</td>
            <td>${item.valorGasto.toFixed(2)}</td>
            <td>${item.categoria}</td>
            <td>
                <span class="edit-btn" onclick="editarDespesa(${index})">Editar</span> |
                <span class="delete-btn" onclick="excluirDespesa(${index})">Excluir</span>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Função para atualizar as opções de categorias no formulário de despesas
function atualizarOpcoesCategorias() {
    const select = document.getElementById("categoria-despesa");
    select.innerHTML = ""; // Limpa as opções antes de atualizar
    planejamentos.forEach(item => {
        const option = document.createElement("option");
        option.value = item.categoria;
        option.textContent = item.categoria;
        select.appendChild(option);
    });
}

// Evento para adicionar planejamento
document.getElementById("planning-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const categoria = document.getElementById("categoria").value;
    const valorPlanejado = parseFloat(document.getElementById("valor-planejado").value);
    planejamentos.push({ categoria, valorPlanejado });
    atualizarTabelaPlanejamento();
    this.reset();
});

// Evento para adicionar despesa
document.getElementById("despesas-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const data = document.getElementById("data").value;
    const descricao = document.getElementById("descricao").value;
    const valorGasto = parseFloat(document.getElementById("valor-gasto").value);
    const categoria = document.getElementById("categoria-despesa").value;
    despesas.push({ data, descricao, valorGasto, categoria });
    atualizarTabelaDespesas();
    this.reset();
});

// Função para editar planejamento
function editarPlanejamento(index) {
    const novoValor = prompt("Digite o novo valor planejado:");
    if (novoValor !== null) {
        planejamentos[index].valorPlanejado = parseFloat(novoValor);
        atualizarTabelaPlanejamento();
    }
}

// Função para excluir planejamento
function excluirPlanejamento(index) {
    if (confirm("Tem certeza que deseja excluir este planejamento?")) {
        planejamentos.splice(index, 1);
        atualizarTabelaPlanejamento();
    }
}

// Função para editar despesa
function editarDespesa(index) {
    const novaDescricao = prompt("Digite a nova descrição:");
    const novoValor = prompt("Digite o novo valor gasto:");
    if (novaDescricao !== null && novoValor !== null) {
        despesas[index].descricao = novaDescricao;
        despesas[index].valorGasto = parseFloat(novoValor);
        atualizarTabelaDespesas();
    }
}

// Função para excluir despesa
function excluirDespesa(index) {
    if (confirm("Tem certeza que deseja excluir esta despesa?")) {
        despesas.splice(index, 1);
        atualizarTabelaDespesas();
    }
}

// Função para atualizar o gráfico
function atualizarGrafico() {
    const ctx = document.getElementById("grafico-orcamento").getContext("2d");
    const categorias = planejamentos.map(item => item.categoria);
    const valoresPlanejados = planejamentos.map(item => item.valorPlanejado);
    const valoresExecutados = categorias.map(categoria => {
        return despesas
            .filter(despesa => despesa.categoria === categoria)
            .reduce((total, despesa) => total + despesa.valorGasto, 0);
    });

    if (window.grafico) {
        window.grafico.destroy();
    }

    window.grafico = new Chart(ctx, {
        type: "bar",
        data: {
            labels: categorias,
            datasets: [
                {
                    label: "Planejado (R$)",
                    data: valoresPlanejados,
                    backgroundColor: "rgba(75, 192, 192, 0.6)"
                },
                {
                    label: "Executado (R$)",
                    data: valoresExecutados,
                    backgroundColor: "rgba(255, 99, 132, 0.6)"
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top"
                },
                title: {
                    display: true,
                    text: "Comparativo de Valores Planejados e Executados"
                }
            }
        }
    });
}