iniciarSite()
let nickentrada;
function entrarChat(){
    nickentrada={
        name:document.querySelector(".telainicial input").value
        }
    let element=document.querySelector(".telainicial")
    element.innerHTML=`<img/ src="images/logo.png">
    <div class="loading">
    <img/ src="images/loading.png">
    Entrando...
    </div>`
    apiEntrada()
}
function iniciarSite(){
    let element=document.querySelector(".telainicial")
    element.innerHTML=`<img/ src="/images/logo.png">
    <input placeholder="Digite seu nome"/>
    <button onclick="entrarChat()">Entrar</button>`
}

function apiEntrada(){
    const promise=axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",nickentrada)
    promise.then(carregarSite)
    promise.catch(erroEntrada)
    }

function erroEntrada(erro){
    iniciarSite()
    let codigoErro=erro.response.status
    if (codigoErro===400){
        alert("Nome já em uso, digite outro nome")
    }
    else{
        alert(`Erro ${codigoErro}`)
    }
}

function carregarSite(){
document.querySelector(".telainicial").classList.add("hidden")
document.querySelector("header").innerHTML=`
<img/ src="images/logo.png">
<div onclick="getParticipantes()"><ion-icon name="people"></ion-icon></div>`
receberMensagem()
document.querySelector(".barrafinal").innerHTML=`
<input type="text" placeholder="Escreva aqui..."/>
<div onclick="enviarmensagem()"><ion-icon name="paper-plane-outline"></ion-icon></div>`
document.querySelector(".barrafinal input").addEventListener("keypress", function(envio){
    if(envio.key === "Enter"){
        enviarmensagem();
    }
})

setInterval(manterServidor,4500)
setInterval(receberMensagem,2000)
}

function manterServidor(){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status",nickentrada)
}

function enviarmensagem(){
    alert("aaa")
    const dados={
        from: nickentrada.name,
        to: "Todos",
        text: document.querySelector(".barrafinal input").value,
        type: "message"
    }
    const promise=axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",dados)
    document.querySelector(".barrafinal input").value=""
    promise.then(receberMensagem)
    promise.catch(function () {
        window.location.reload()
    })
}
function receberMensagem(){
    const promise=axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promise.then(renderizarMensagem)
}

function renderizarMensagem(resposta){
    document.querySelector(".conteudo").innerHTML=""
    for(let i=0;i<resposta.data.length;i++){
    document.querySelector(".conteudo").innerHTML+=`
    <div class="mensagens ${resposta.data[i].type}"><h1><span>(${resposta.data[i].time})</span> 
    <strong>${resposta.data[i].from}</strong> 
    para <strong>${resposta.data[i].to}</strong>: ${resposta.data[i].text}</h1></div>`
    document.querySelector('.mensagens:last-child').scrollIntoView()
}
}
function getParticipantes(){
    const promise=axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    document.querySelector("body").innerHTML+=`
    <div class="filtroPreto" onclick="retornar()"></div>
    <div class="listaUsuarios"></div>`
    promise.then(listaParticipantes)
}
function listaParticipantes(resposta){
    let elemento=document.querySelector(".listaUsuarios")
    elemento.innerHTML=`        
    <strong>Escolha um contato para enviar mensagem:</strong>
    <div class="pessoas"><ion-icon name="people""></ion-icon> <p>Todos</p></div>`
    
    for(i=0;i<resposta.data.length;i++){
        elemento.innerHTML+=`
        <div class="pessoas" onclick="check()"><ion-icon name="person-circle"></ion-icon>
        <p>${resposta.data[i].name}</p></div>`
    }
    elemento.innerHTML+=`
    <strong>Escolha a visibilidade:</strong>
    <div class="pessoas" onclick="check()"><ion-icon name="lock-open"></ion-icon> <p>Público</p></div>
    <div class="pessoas" onclick="check()"><ion-icon name="lock-closed"></ion-icon> <p>Reservadamente</p></div>`
    //<ion-icon name="checkmark"></ion-icon>
}
function retornar(){
    const el1=document.querySelector(".filtroPreto")
    const el2=document.querySelector(".listaUsuarios")
    el1.remove()
    el2.remove()
}