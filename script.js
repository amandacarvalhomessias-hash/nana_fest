const precoAbada = 30;

const qtdInput = document.getElementById("qtdPessoas");
const container = document.getElementById("pessoasContainer");
const comprovante = document.getElementById("comprovante");
const btnEnviar = document.getElementById("btnEnviar");

let envioBloqueado = false;

/* GERAR CAMPOS DE PESSOAS */

qtdInput.addEventListener("change", gerarCampos);

function gerarCampos(){

    container.innerHTML = "";
    const qtd = Number(qtdInput.value);

    for(let i = 1; i <= qtd; i++){

        const div = document.createElement("div");

        div.innerHTML = `
        <hr><br>

        <h4>Pessoa ${i}</h4>

        <label>Nome completo</label>
        <input type="text" required>

        <label>Quer Abadá? (R$ ${precoAbada})</label>

        <select class="select-abada">
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
}

/* EVENTOS DOS SELECTS */

function ativarEventos(){

    document.querySelectorAll(".select-abada").forEach(select=>{

        select.addEventListener("change", function(){

            const tamanho = this.parentElement.querySelector(".tamanho-abada");

            if(this.value === "sim"){
                tamanho.style.display = "block";
            }else{
                tamanho.style.display = "none";
            }

            calcularTotal();
            validarEnvio();

        });

    });

}

/* CALCULAR TOTAL */

function calcularTotal(){

    let qtd = 0;

    document.querySelectorAll(".select-abada").forEach(select=>{

        if(select.value === "sim"){
            qtd++;
        }

    });

    const total = qtd * precoAbada;

    document.getElementById("valorTotal").innerText = total.toFixed(2);
}

/* VALIDAR ENVIO */

function validarEnvio(){

    let pediuAbada = false;

    document.querySelectorAll(".select-abada").forEach(select=>{

        if(select.value === "sim"){
            pediuAbada = true;
        }

    });

    if(pediuAbada && comprovante.files.length === 0){

        envioBloqueado = true;
        btnEnviar.classList.add("travado");

    }else{

        envioBloqueado = false;
        btnEnviar.classList.remove("travado");

    }

}

/* MOSTRAR NOME DO ARQUIVO */

comprovante.addEventListener("change", function(){

    const fileName = document.getElementById("file-name");

    if(this.files.length){
        fileName.textContent = this.files[0].name;
    }else{
        fileName.textContent = "Nenhum selecionado";
    }

    validarEnvio();

});

/* ALERTA SE BOTÃO TRAVADO */

btnEnviar.addEventListener("click", function(e){

    if(envioBloqueado){

        e.preventDefault();

        alert("⚠️ Você selecionou abadá. É necessário anexar o comprovante para continuar.");

    }

});

/* ENVIO DO FORMULÁRIO */

document.getElementById("formConfirmacao").addEventListener("submit", async function(e){

    if(envioBloqueado){
        e.preventDefault();
        return;
    }

    e.preventDefault();

    let pessoas = [];

    document.querySelectorAll("#pessoasContainer > div").forEach(pessoa=>{

        const nome = pessoa.querySelector("input").value;
        const abada = pessoa.querySelector(".select-abada").value;
        const tamanho = pessoa.querySelector(".tamanho-abada select").value || "";

        pessoas.push({
            nome,
            abada,
            tamanho
        });

    });

    let comprovanteData = null;

    if(comprovante.files.length){

        const file = comprovante.files[0];

        const base64 = await new Promise(resolve=>{

            const reader = new FileReader();

            reader.onload = ()=> resolve(reader.result.split(",")[1]);

            reader.readAsDataURL(file);

        });

        comprovanteData = {
            name: file.name,
            type: file.type,
            data: base64
        };

    }

    document.getElementById("loading").style.display = "flex";

    fetch("https://script.google.com/macros/s/AKfycbxE31aoeDKVk4v2U1IjSgB57s1ScDBmGxd6V_AnK5N0_wTCdHFjX_3ra53i3prsGoM/exec", {

        method: "POST",
        mode: "no-cors",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({

            valor: document.getElementById("valorTotal").innerText,
            pessoas: pessoas,
            comprovante: comprovanteData

        })

    })

    .then(()=>{

        document.getElementById("loading").style.display = "none";

        alert("✅ Presença confirmada!");

        location.reload();

    })

    .catch(error=>{

        document.getElementById("loading").style.display = "none";

        console.error("Erro:", error);

    });

});