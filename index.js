/* HEAD */
const Airtable = require("airtable");
const base = new Airtable({ apiKey: "keyggOsGLubPoGKDd" }).base("projetosh2");

/* OBTER DADOS CADASTRADOS NO AIRTABLE */
function receberDados() {
  var rd = "";     
  fetch("https://api.airtable.com/v0/app9EDXVbU7QhtUiF/projetosh2",
  {             
    method: "GET",              
    headers: {               
      Authorization: "Bearer keyggOsGLubPoGKDd",                
      "Content-Type": "application/json",              
    },                      
  }) 
  .then(rd => {
    if (!rd.ok) {
      throw new Error('Erro ao obter os dados');
    } return rd.json();
    })
    .then(data => {
      var p1 = document.getElementById("projeto1");
      var dadosAirtable = data.records;
      for (let i = 0; i < dadosAirtable.length; i++) {
        var fieldsAirtable = dadosAirtable[i].fields;
        var idpAirtable = fieldsAirtable.idprojeto;
        var nomeAirtable = fieldsAirtable.nomedaufv;
        var potenciaAirtable = fieldsAirtable.potencia;
        var cidadeAirtable = fieldsAirtable.cidadeuf;
        var statusAirtable = fieldsAirtable.status;
        var dataAirtable = fieldsAirtable.data;

        var idp = document.createElement("h5");
        idp.innerText = idpAirtable;
        p1.appendChild(idp);
    
        var nome = document.createElement("a");
        nome.innerText = nomeAirtable;
        nome.setAttribute("class", "ufv"); nome.setAttribute("href", "#");
        p1.appendChild(nome);
      
        var potencia = document.createElement("h5");
        potencia.innerText = potenciaAirtable;
        p1.appendChild(potencia);
      
        var cidade = document.createElement("h5");
        cidade.innerText = cidadeAirtable;
        p1.appendChild(cidade);
      
        var status = document.createElement("h5");
        status.innerText = statusAirtable;
        p1.appendChild(status);
      
        var data = document.createElement("h5");
        data.innerText = dataAirtable;
        p1.appendChild(data); 
      }
    })
    .catch(error => {
      console.error(error);
  });         
}

/* ABRIR E FECHAR FORMULÁRIO */
function abrirFormulario() {
  var af = document.getElementById("cadastro");
  var seta = document.getElementById("seta");
  if (af.style.display == "grid") {
    af.style.cssText = "display: none";
    seta.style.cssText = "transform: rotate(0deg)";
  } else {
    af.style.cssText = "display: grid";
    seta.style.cssText = "transform: rotate(180deg)";
  }
}

/* DETECTAR CAMPO VAZIO NO ENVIO DO FORMULÁRIO */
function campoVazio() {
  if (
    document.getElementById("nome").value == "" ||
    document.getElementById("potencia").value == "" ||
    document.getElementById("cidade").value == "" ||
    document.getElementById("usinas").value == "" ||
    document.getElementById("status").value == ""
  ) {
    var cv = 1;
  } else {
    var cv = 2;
  }
  return cv;
}

/* ENVIO DO FORMULÁRIO PARA AIRTABLE */
function enviarFormulario() {
  var fcv = campoVazio();
  if (fcv !== 2) {
    alert("Preencha todos os campos!");
  } else {
    var dataAtual = new Date();
    var dia = dataAtual.getDate(); var mes = dataAtual.getMonth() + 1; var ano = dataAtual.getFullYear();
    var dataFormatada = (dia < 10 ? "0" : "") + dia + "/" + (mes < 10 ? "0" : "") + mes + "/" + ano;
    var ep1 = document.getElementById("projeto1").childElementCount; var nid = (ep1 -1) / 6 + 1;
    var fId = (mes < 10 ? "0" : "") + mes + (dia < 10 ? "0" : "") + dia + (nid < 10 ? "0" : "") + nid + (ano - 2000);
    var fNome = document.getElementById("nome").value;
    var fPotencia = document.getElementById("potencia").value;
    var fCidade = document.getElementById("cidade").value;
    var fUsinas = document.getElementById("usinas").value;
    var fStatus = document.getElementById("status").value;
    var fData = dataFormatada;

    var fc = document.getElementById("formCadastro");
    fc.addEventListener("submit", async (event) => {
      event.preventDefault();
      var dadosEnvio = {
        fields: {
          "idprojeto": fId, "nomedaufv": fNome, "potencia": fPotencia, "cidadeuf": fCidade, "ndeusinas": fUsinas, "status": fStatus, "data": fData,
        },
      };
        
      try {
        const response = await fetch("https://api.airtable.com/v0/app9EDXVbU7QhtUiF/projetosh2",
        {             
          method: "POST",              
          headers: {               
            Authorization: "Bearer keyggOsGLubPoGKDd",                
            "Content-Type": "application/json",              
          },              
          body: JSON.stringify(dadosEnvio),            
        });          
        console.log("Dados enviados com sucesso para o Airtable:", response.data);
        receberDados();   
      } catch (error) {        
        console.error("Erro ao enviar dados para o Airtable:", error);        
      }  
    });

    document.getElementById("nome").value = "";
    document.getElementById("potencia").value = "";
    document.getElementById("cidade").value = "";
    document.getElementById("usinas").value = "";
    document.getElementById("status").value = "";

    abrirFormulario();
  }
}