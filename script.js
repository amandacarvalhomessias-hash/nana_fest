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

document.getElementById("comprovante").addEventListener("change", function(){

    const fileName = document.getElementById("file-name")

    if(this.files.length > 0){
        fileName.textContent = this.files[0].name
    }else{
        fileName.textContent = "Nenhum selecionado"
    }

})

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

const form = document.getElementById("formConfirmacao");
form.addEventListener("submit", function(e){

    let pediuAbada = false;

    document.querySelectorAll(".select-abada").forEach(select => {

        if(select.value === "sim"){
            pediuAbada = true;
        }

    });

    const arquivo = document.getElementById("comprovante");

    if(pediuAbada && arquivo.files.length === 0){

        e.preventDefault();

        alert("Para confirmar é necessário anexar o comprovante de pagamento.");

    }

});


document.getElementById("formConfirmacao").addEventListener("submit", async function(e){

    e.preventDefault()
    
    let pessoas = []
    
    document.querySelectorAll("#pessoasContainer > div").forEach(pessoa=>{
    
    const nome = pessoa.querySelector("input").value
    const abada = pessoa.querySelector(".select-abada").value
    const tamanho = pessoa.querySelector(".tamanho-abada select")?.value || ""
    
    pessoas.push({
        nome,
        abada,
        tamanho
    })
    
    })
    
    const fileInput = document.getElementById("comprovante")
    
    let comprovante = null
    
    if(fileInput.files.length){
    
        const file = fileInput.files[0]
    
    const base64 = await new Promise(resolve=>{
        const reader = new FileReader()
        reader.onload = ()=> resolve(reader.result.split(",")[1])
        reader.readAsDataURL(file)
    })
    
    comprovante = {
        name:file.name,
        type:file.type,
        data:base64
    }
    
    }
    
    fetch("https://script.google.com/macros/s/AKfycbxE31aoeDKVk4v2U1IjSgB57s1ScDBmGxd6V_AnK5N0_wTCdHFjX_3ra53i3prsGoM/exec",{
    
        method:"POST",

        body:JSON.stringify({
        valor:document.getElementById("valorTotal").innerText,
        pessoas:pessoas,
        comprovante:comprovante
        })

        })
        .then(r=>r.json())
        .then(()=>{

        alert("Presença confirmada!")

        })

    })