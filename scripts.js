iniciarSite()
let nickentrada;
let destinatario="Todos";
let tipoMensagem="message";
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
<div onclick="getParticipantes();montarLista();"><ion-icon name="people"></ion-icon></div>`
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
    const dados={
        from: nickentrada.name,
        to: destinatario,
        text: document.querySelector(".barrafinal input").value,
        type: tipoMensagem
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
        if(resposta.data[i].type==="private_message"&&resposta.data[i].to!==nickentrada.name&&resposta.data[i].from!==nickentrada.name){
            i++
        }
    document.querySelector(".conteudo").innerHTML+=`
    <div class='mensagens ${resposta.data[i].type}'><h1><span>(${resposta.data[i].time})</span> 
    <strong>${resposta.data[i].from}</strong> 
    para <strong>${resposta.data[i].to}</strong>: ${resposta.data[i].text}</h1></div>`
    document.querySelector('.mensagens:last-child').scrollIntoView()
    }
}
function montarLista(){
    document.querySelector(".filtroPreto").classList.remove("hidden")
    document.querySelector(".listaUsuarios").classList.remove("hidden")
    let elemento=document.querySelector(".listaUsuarios")
    elemento.innerHTML=`        
    <strong>Escolha um contato para enviar mensagem:</strong>
    <div class="feedParticipantes">
    </div>
    <strong>Escolha a visibilidade:</strong>
    <div class="pessoas publico visibilidadeselecionada" onclick="tornarPublico()">
        <ion-icon name="lock-open"></ion-icon> <p>Público</p>
        <div class="icone2"><ion-icon name="checkmark"></ion-icon></div>
    </div>
    <div class="pessoas reservado" onclick="tornarReservado(this)"><ion-icon name="lock-closed"></ion-icon> <p>Reservadamente</p></div>`
    setInterval(getParticipantes,10000)
}

function getParticipantes(){
    const promise=axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    promise.then(renderizarParticipantes)
}
function renderizarParticipantes(resposta){
    let elemento=document.querySelector(".feedParticipantes")
    elemento.innerHTML=`
    <div class="pessoas participanteselecionado" onclick="check(this);tornarPublico();">
    <ion-icon name="people"></ion-icon> <p>Todos</p>
    </div>`
    for(i=0;i<resposta.data.length;i++){
        if(resposta.data[i].name===destinatario){
            elemento.innerHTML+=`
            <div class="pessoas" onclick="check(this)"><ion-icon name="person-circle"></ion-icon>
                <p>${resposta.data[i].name}</p>
                <div class="icone"><ion-icon name="checkmark"></ion-icon></div>
            </div>`
        }
        else{
            elemento.innerHTML+=`
            <div class="pessoas" onclick="check(this)"><ion-icon name="person-circle"></ion-icon>
            <p>${resposta.data[i].name}</p></div>`
        }
    }
    if(document.querySelector(".icone")===null){
        document.querySelector(".participanteselecionado").innerHTML+=`
        <div class="icone"><ion-icon name="checkmark"></ion-icon></div>`
    }
}
function retornar(){
    document.querySelector(".filtroPreto").classList.add("hidden")
    document.querySelector(".listaUsuarios").classList.add("hidden")
}

function check(elemento){
    if(document.querySelector(".participanteselecionado")===null){
        elemento.classList.add("participanteselecionado")
    }
    if(document.querySelector(".icone")===null){
        elemento.innerHTML+=`<div class="icone"><ion-icon name="checkmark"></ion-icon></div>`
    }
    document.querySelector(".participanteselecionado").classList.remove("participanteselecionado")
    document.querySelector(".icone").remove()
    elemento.classList.add("participanteselecionado")
    elemento.innerHTML+=`<div class="icone"><ion-icon name="checkmark"></ion-icon></div>`
    destinatario=elemento.innerText
    if(document.querySelector(".visibilidadeselecionada").innerText==="Reservadamente"){
        tipoMensagem="private_message"
        document.querySelector(".barrafinal").innerHTML=`<div>
        <input type="text" placeholder="Escreva aqui..."/> <br>
        <span>Enviando para ${destinatario} (reservadamente)</span> </div>
        <div onclick="enviarmensagem()"><ion-icon name="paper-plane-outline"></ion-icon></div>`
        document.querySelector(".barrafinal input").addEventListener("keypress", function(envio){
            if(envio.key === "Enter"){
                enviarmensagem();
            }
        })
    }
}
function tornarReservado(){
        let elemento=document.querySelector(".reservado")
        tipoMensagem="private_message"
        document.querySelector(".visibilidadeselecionada").classList.remove("visibilidadeselecionada")
        document.querySelector(".icone2").remove()
        elemento.classList.add("visibilidadeselecionada")
        elemento.innerHTML+=`<div class="icone2"><ion-icon name="checkmark"></ion-icon></div>`
        document.querySelector(".barrafinal").innerHTML=`<div>
        <input type="text" placeholder="Escreva aqui..."/> <br>
        <span>Enviando para ${destinatario} (reservadamente)</span> </div>
        <div onclick="enviarmensagem()"><ion-icon name="paper-plane-outline"></ion-icon></div>`
        document.querySelector(".barrafinal input").addEventListener("keypress", function(envio){
            if(envio.key === "Enter"){
                enviarmensagem();
            }
        })
}
function tornarPublico(){
    let elemento=document.querySelector(".publico")
    tipoMensagem="message";
    document.querySelector(".visibilidadeselecionada").classList.remove("visibilidadeselecionada")
    document.querySelector(".icone2").remove()
    elemento.classList.add("visibilidadeselecionada")
    elemento.innerHTML+=`<div class="icone2"><ion-icon name="checkmark"></ion-icon></div>`
    document.querySelector(".barrafinal").innerHTML=`
    <input type="text" placeholder="Escreva aqui..."/>
    <div onclick="enviarmensagem()"><ion-icon name="paper-plane-outline"></ion-icon></div>`
    document.querySelector(".barrafinal input").addEventListener("keypress", function(envio){
        if(envio.key === "Enter"){
            enviarmensagem();
        }
    })
}