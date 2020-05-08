"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
var enviarButton = document.getElementById("enviarButton");
var usuarioInput = document.getElementById("usuarioInput");
var mensagemInput = document.getElementById("mensagemInput");

enviarButton.disabled = true;

connection.on("ReceberMensagem", function (usuario, mensagem) {
    var msg = mensagem.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = usuario + " disse " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("mensagemLista").appendChild(li);
});

connection.on("NewUserAdd", function (name) {
    var li = document.createElement("li");
    li.textContent = name;
    document.getElementById("usuarioLista").appendChild(li);
});

connection.start().then(function () {
    enviarButton.disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

enviarButton.addEventListener('click', function (event) {
    var usuario = usuarioInput.value;
    var mensagem = mensagemInput.value;
    connection.invoke("EnviarMensagem", usuario, mensagem).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});