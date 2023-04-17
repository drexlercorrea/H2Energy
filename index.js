const Airtable = require("airtable");
const base = new Airtable({apiKey: "pat7sOvlibq6Ui1sG"}).base("Gestão de projetos H2");
src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"

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

function enviarFormulario() {
  var fcv = campoVazio();
  
  if (fcv == 2) {
    var dataAtual = new Date();
    var dia = dataAtual.getDate(); var mes = dataAtual.getMonth() + 1; var ano = dataAtual.getFullYear();

    var fc = document.getElementById("formCadastro");
    fc.addEventListener('submit', async (event) => {
      event.preventDefault();
      var fid = (mes < 10 ? "0" : "") + mes + (dia < 10 ? "0" : "") + dia + (nid < 10 ? "0" : "") + nid + (ano - 2000);
      var fNome = document.getElementById('nome').value;
      var fPotencia = document.getElementById('potencia').value;
      var fCidade = document.getElementById('cidade').value;
      var fUsinas = document.getElementById('usinas').value;
      var fStatus = document.getElementById('status').value;
      var fData = dataAtual;
      var dadosEnvio = {
        "fields": {
          "ID": fid,
          "Nome da UFV": fNome,
          "Potência": fPotencia,
          "Cidade/UF": fCidade,
          "Nº de usinas": fUsinas,
          "Status": fStatus,
          "Data": fData
        }
      };

      try {
        const response = await axios.post('https://api.airtable.com/v0/H2Energy/Gestão de projetos H2', dados, {
          headers: {
            'Authorization': 'Bearer pat7sOvlibq6Ui1sG',
            'Content-Type': 'application/json'
          }
        });
  
        console.log('Dados enviados com sucesso para o Airtable:', response.data);
      } catch (error) {
        console.error('Erro ao enviar dados para o Airtable:', error);
      }
    });


/*     var p1 = document.getElementById("projeto1");
    var ep1 = document.getElementById("projeto1").childElementCount;


    var id = document.createElement("h5");
    nid = ep1 / 6 + 1;
    id.innerText = (mes < 10 ? "0" : "") + mes + (dia < 10 ? "0" : "") + dia + (nid < 10 ? "0" : "") + nid + (ano - 2000);
    p1.appendChild(id);

    var nome = document.createElement("a");
    nome.innerText = document.getElementById("nome").value;
    nome.setAttribute("class", "ufv"); nome.setAttribute("href", "#");
    p1.appendChild(nome);

    var potencia = document.createElement("h5");
    potencia.innerText = document.getElementById("potencia").value + "MW";
    p1.appendChild(potencia);

    var cidade = document.createElement("h5");
    cidade.innerText = document.getElementById("cidade").value;
    p1.appendChild(cidade);

    var status = document.createElement("h5");
    status.innerText = document.getElementById("status").value;
    p1.appendChild(status);

    var data = document.createElement("h5");
    var dataFormatada = (dia < 10 ? "0" : "") + dia + "/" + (mes < 10 ? "0" : "") + mes + "/" + ano;
    data.innerText = dataFormatada;
    p1.appendChild(data); */

    document.getElementById("nome").value = "";
    document.getElementById("potencia").value = "";
    document.getElementById("cidade").value = "";
    document.getElementById("usinas").value = "";
    document.getElementById("status").value = "";

    abrirFormulario();
  } else {
    alert("Preencha todos os campos!");
  }
}
