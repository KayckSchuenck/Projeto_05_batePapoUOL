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
<ion-icon name="people" onclick"listaParticipantes()"></ion-icon>`
document.querySelector(".barrafinal").innerHTML=`
<input type="text" placeholder="Escreva aqui..."/>
<ion-icon name="paper-plane-outline" onclick"enviarMensagem()"></ion-icon>`
document.querySelector(".barrafinal input").addEventListener("keypress", function(envio){
    if(envio.key === "Enter"){
        enviarMensagem();
    }
})
document.querySelector(".conteudo").innerHTML=`
<div class="mensagens status">Testando testando som</div>
<div class="mensagens message">Testando testando som</div>
<div class="mensagens private_message">Testando testando som</div>`
setInterval(manterServidor,4500)
}

function manterServidor(){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status",nickentrada)
}

function enviarMensagem(){
    const dados={
        from: nickentrada.name,
        to: "Todos",
        text: document.querySelector(".barrafinal input").value,
        type: "message"
    }
    const promise=axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",dados)
    promise.then(receberMensagem)
    promise.catch(function () {
        window.location.reload()
    })
}
function receberMensagem(){
alert("aaa")
}