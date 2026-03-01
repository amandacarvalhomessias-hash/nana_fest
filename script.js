const precoAbada = 30;
const chavePix = "31991453960";

const qtdInput = document.getElementById("qtdPessoas");
const container = document.getElementById("pessoasContainer");

qtdInput.addEventListener("change", function () {

    container.innerHTML = "";
    const qtd = this.value;

    for (let i = 1; i <= qtd; i++) {

        const div = document.createElement("div");

        div.innerHTML = `
        <hr><br>
        <h4>Pessoa ${i}</h4>

        <label>Nome completo</label>
        <input type="text" required>

        <label>Quer Abadá? (R$ 30)</label>
        <select class="select-abada" onchange="mostrarTamanho(this)">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
        </select>

        <div class="tamanho-abada" style="display:none;">
            <label>Tamanho do Abadá</label>
            <select>
                <option value="">Selecione</option>
                <option>P</option>
                <option>M</option>
                <option>G</option>
                <option>GG</option>
                <option>XG</option>
            </select>
        </div>
        `;

        container.appendChild(div);
    }

    ativarEventos();

});

function mostrarTamanho(select){

    const tamanho = select.parentElement.querySelector(".tamanho-abada");

    if(select.value === "sim"){
        tamanho.style.display = "block";
    }else{
        tamanho.style.display = "none";
    }

}

function ativarEventos(){

    document.querySelectorAll(".select-abada").forEach(select => {

        select.addEventListener("change", calcularTotal);

    });

}

function calcularTotal(){

    let qtd = 0;

    document.querySelectorAll(".select-abada").forEach(select => {

        if(select.value === "sim"){
            qtd++;
        }

    });

    const total = qtd * precoAbada;

    document.getElementById("valorTotal").innerText = total.toFixed(2);

}
