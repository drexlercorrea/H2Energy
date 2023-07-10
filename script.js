/* HEAD */
const Airtable = require("airtable");
const base = new Airtable({ apiKey: "keyggOsGLubPoGKDd" }).base("projetosh2");

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
function abrirFormularioPrancha() {
  var afp = document.getElementById("cadastroPrancha");
  var sp = document.getElementById("setaPrancha");
  if (afp.style.display == "grid") {
    afp.style.cssText = "display: none";
    sp.style.cssText = "transform: rotate(0deg)";
  } else {
    afp.style.cssText = "display: grid";
    sp.style.cssText = "transform: rotate(180deg)";
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
function campoVazioProjeto() {
  if (
    document.getElementById("listaNome").value == "" ||
    document.getElementById("listaTipo").value == "" ||
    document.getElementById("descricao").value == "" ||
    document.getElementById("listaFolha").value == "" ||
    document.getElementById("revisao").value == ""
  ) {
    var cvp = 1;
  } else {
    var cvp = 2;
  }
  return cvp;
}

/* CADASTRO DE NOVO PROJETO */
function enviarFormulario() {
  var fc = document.getElementById("formCadastro");
  fc.addEventListener("submit", (event) => {
    event.preventDefault();

    var fcv = campoVazio();
    if (fcv !== 2) {
      alert("Preencha todos os campos!");
    } else {
      try {
        var fNome = document.getElementById("nome").value;
        var fPotencia = document.getElementById("potencia").value;
        var fCidade = document.getElementById("cidade").value;
        var fUsinas = document.getElementById("usinas").value;
        var fStatus = document.getElementById("status").value;
        var dadosEnvio = {
          fields: {
            nomedaufv: fNome,
            potencia: fPotencia,
            cidadeuf: fCidade,
            ndeusinas: fUsinas,
            status: fStatus,
          },
        };

        var response = fetch(
          "https://api.airtable.com/v0/app9EDXVbU7QhtUiF/gestaodeprojetos",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer keyggOsGLubPoGKDd",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosEnvio),
          }
        ).then((response) => {
          if (response.ok) {
            console.log(
              "Dados enviados com sucesso para o Airtable:",
              response.data
            );
            document.getElementById("nome").value = "";
            document.getElementById("potencia").value = "";
            document.getElementById("cidade").value = "";
            document.getElementById("usinas").value = "";
            document.getElementById("status").value = "";
            abrirFormulario();
            receberDados();
          }
        });
      } catch (error) {
        console.error("Erro ao enviar dados para o Airtable:", error);
      }
    }
  });
}

/* OBTER DADOS DAS UFV's CADASTRADAS */
function receberDados() {
  fetch("https://api.airtable.com/v0/app9EDXVbU7QhtUiF/gestaodeprojetos?sortField=idprojeto",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer keyggOsGLubPoGKDd",
        "Content-Type": "application/json",
      },
    }
  )
    .then((rd) => {
      if (!rd.ok) {
        throw new Error("Erro ao obter os dados");
      }
      return rd.json();
    })
    .then((data) => {
      var p1 = document.getElementById("projeto1");
      var dadosAirtable = data.records;

      function preencherTabela() {
        var idpAirtable = fieldsAirtable.idprojeto - 91;
        var nomeAirtable = fieldsAirtable.nomedaufv;
        var potenciaAirtable = fieldsAirtable.potencia;
        var cidadeAirtable = fieldsAirtable.cidadeuf;
        var statusAirtable = fieldsAirtable.status;
        var dataAirtable = fieldsAirtable.data;
        var nUsinasAirtable = fieldsAirtable.ndeusinas;

        var idp = document.createElement("h5");
        var idFormatado =
          (idpAirtable < 10 ? "00" : idpAirtable < 100 ? "0" : "") +
          idpAirtable;
        idp.innerText = idFormatado;
        p1.appendChild(idp);

        var nome = document.createElement("a");
        nome.innerText = nomeAirtable;
        nome.setAttribute("class", "ufv");
        nome.setAttribute("href", "#");
        nome.setAttribute("id", nomeAirtable);
        nome.addEventListener("click", function (event) {
          var nameTagUfv = event.target.id;
          abrirProjeto(nameTagUfv);
          listaUfvs(nomeAirtable, nUsinasAirtable);
        });
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
        var dataAtual = new Date(dataAirtable);
        var dia = dataAtual.getUTCDate();
        var mes = dataAtual.getUTCMonth() + 1;
        var ano = dataAtual.getUTCFullYear();
        var dataFormatada =
          (dia < 10 ? "0" : "") +
          dia +
          "/" +
          (mes < 10 ? "0" : "") +
          mes +
          "/" +
          ano;
        data.innerText = dataFormatada;
        p1.appendChild(data);
      }

      if (formularioEnviado !== 2) {
        for (let i = 0; i < dadosAirtable.length; i++) {
          var fieldsAirtable = dadosAirtable[i].fields;
          preencherTabela();
        }
      } else {
        var ultimoEnviado = dadosAirtable.length - 1;
        var fieldsAirtable = dadosAirtable[ultimoEnviado].fields;
        preencherTabela();
      }
      return (formularioEnviado = 2);
    })
    .catch((error) => {
      console.error(error);
    });
}

/* ENTRAR NA UFV */
function abrirProjeto(nameTagUfv) {
  var bnp = document.getElementById("botãoNovoprojeto");
  var cad = document.getElementById("cadastro");
  var tp = document.getElementById("tabelaProjetos");
  var pc = document.getElementById("projetoCadastrado");
  var bnpa = document.getElementById("botãoNovaprancha");
  var tpa = document.getElementById("tabelaPranchas");
  var dp = document.getElementById("descriçãoProjeto");

  bnp.style.cssText = "display: none";
  cad.style.cssText = "display: none";
  tp.style.cssText = "display: none";
  pc.style.cssText = "display: grid";
  bnpa.style.cssText = "display: grid";
  tpa.style.cssText = "display: grid";

  fetch("https://api.airtable.com/v0/app9EDXVbU7QhtUiF/gestaodeprojetos", {
    method: "GET",
    headers: {
      Authorization: "Bearer keyggOsGLubPoGKDd",
      "Content-Type": "application/json",
    },
  })
    .then((rd) => {
      if (!rd.ok) {
        throw new Error("Erro ao obter os dados");
      }
      return rd.json();
    })
    .then((data) => {
      var dadosAirtable = data.records;

      for (let i = 0; i < dadosAirtable.length; i++) {
        var fieldsAirtable = dadosAirtable[i].fields;
        var nomeAirtable = fieldsAirtable.nomedaufv;

        if (nomeAirtable == nameTagUfv) {
          var idpAirtable = fieldsAirtable.idprojeto - 91;
          var idOriginalAirtable = fieldsAirtable.idprojeto;
          var potenciaAirtable = fieldsAirtable.potencia;
          var cidadeAirtable = fieldsAirtable.cidadeuf;
          var nUsinasAirtable = fieldsAirtable.ndeusinas;
          var statusAirtable = fieldsAirtable.status;
          var dataAirtable = fieldsAirtable.data;

          var nomeUfv = document.createElement("h1");
          nomeUfv.innerText = nomeAirtable;
          var divReferencia = pc.children[0];
          pc.insertBefore(nomeUfv, divReferencia);

          var idTexto = document.createElement("h4");
          idTexto.innerText = "ID:";
          dp.appendChild(idTexto);

          var idUfv = document.createElement("h5");
          var idFormatado =
            (idpAirtable < 10 ? "00" : idpAirtable < 100 ? "0" : "") +
            idpAirtable;
          idUfv.innerText = idFormatado;
          dp.appendChild(idUfv);

          var potenciaTexto = document.createElement("h4");
          potenciaTexto.innerText = "Potência:";
          dp.appendChild(potenciaTexto);

          var potenciaUfv = document.createElement("h5");
          potenciaUfv.innerText = potenciaAirtable;
          dp.appendChild(potenciaUfv);

          var cidadeTexto = document.createElement("h4");
          cidadeTexto.innerText = "Cidade/ES:";
          dp.appendChild(cidadeTexto);

          var cidadeUfv = document.createElement("h5");
          cidadeUfv.innerText = cidadeAirtable;
          dp.appendChild(cidadeUfv);

          var nUsinasTexto = document.createElement("h4");
          nUsinasTexto.innerText = "Nº de Usinas:";
          dp.appendChild(nUsinasTexto);

          var nUsinasUfv = document.createElement("h5");
          nUsinasUfv.innerText = nUsinasAirtable;
          dp.appendChild(nUsinasUfv);

          var statusTexto = document.createElement("h4");
          statusTexto.innerText = "Status:";
          dp.appendChild(statusTexto);

          var statusUfv = document.createElement("h5");
          statusUfv.innerText = statusAirtable;
          dp.appendChild(statusUfv);

          var dataTexto = document.createElement("h4");
          dataTexto.innerText = "Atualização:";
          dp.appendChild(dataTexto);

          var dataUfv = document.createElement("h5");
          var dataAtual = new Date(dataAirtable);
          var dia = dataAtual.getUTCDate();
          var mes = dataAtual.getUTCMonth() + 1;
          var ano = dataAtual.getUTCFullYear();
          var dataFormatada =
            (dia < 10 ? "0" : "") +
            dia +
            "/" +
            (mes < 10 ? "0" : "") +
            mes +
            "/" +
            ano;
          dataUfv.innerText = dataFormatada;
          dp.appendChild(dataUfv);

          enviarProjeto(idOriginalAirtable);
          receberProjetos(idOriginalAirtable, nomeAirtable, statusAirtable, cidadeAirtable);
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

/* LISTAR UFVs PARA CADASTRAR PROJETO EXECUTIVO */
function listaUfvs(nomeAirtable, nUsinasAirtable) {
  var opcoesUsina = [
    nomeAirtable,
    nomeAirtable + " A",
    nomeAirtable + " B",
    nomeAirtable + " C",
    nomeAirtable + " D",
    nomeAirtable + " E",
  ];

  var selecionarLista = document.getElementById("lista-nome");

  var selecionarOption = selecionarLista.getElementsByTagName("option");

  for (var i = 0; i <= nUsinasAirtable; i++) {
    selecionarOption[i].value = opcoesUsina[i];
  }
}

/* CADASTRO DE PROJETO EXECUTIVO */
function enviarProjeto(idOriginalAirtable, nomeAirtable, statusAirtable, cidadeAirtable) {
  var fp = document.getElementById("formProjeto");
  fp.addEventListener("submit", (event) => {
    event.preventDefault();

    var fcvp = campoVazioProjeto();
    if (fcvp !== 2) {
      alert("Preencha todos os campos!");
    } else {
      try {
        var lNome = document.getElementById("listaNome").value;
        var lTipo = document.getElementById("listaTipo").value;
        var descricao = document.getElementById("descricao").value;
        var lFolha = document.getElementById("listaFolha").value;
        var revisao = document.getElementById("revisao").value;
        var lid = idOriginalAirtable - 91

        var siglaNomeCodigo = lNome.normalize("NFD").replace(/[\u0300-\u036f\s]/g, "").toUpperCase();
        var siglaTipoCodigo = lTipo.normalize("NFD").replace(/[\u0300-\u036f\s]/g, "").slice(0, 3).toUpperCase();
        var codigoAtual = "H2-" + siglaNomeCodigo + "-" + siglaTipoCodigo;

        var codigosArquivos = document.getElementsByClassName("codigosArquivos");
        var arraycodigosArquivos = Array.from(codigosArquivos);
        var contadorCodigo = 0;
        arraycodigosArquivos.forEach(() => {
          if (arraycodigosArquivos === codigoAtual) {contadorCodigo++;}          
        });

        var codigoFinal = codigoAtual + contadorCodigo;

        function subtraiStrings(lNome, nomeAirtable) {
          var resultadoNome = '';        
          for (var i = 0; i < lNome.length; i++) {
            if (nomeAirtable.indexOf(lNome[i]) === -1) {
              resultadoNome += lNome[i];
            }
          } 
          if (resultadoNome == "") {resultadoNome = "Geral";}     
          return resultadoNome;
        } subtraiStrings(lNome, nomeAirtable);
      
        var dadosEnvio = {
          fields: {
            id: idOriginalAirtable,
            nomedausina: lNome,
            tipodeprojeto: lTipo,
            descricao: descricao,
            tamanhodafolha: lFolha,
            revisao: revisao,
          },
        };

        var dadosEmail = {          
          nome: nomeAirtable,
          status: statusAirtable,
          id: lid,
          cidade: cidadeAirtable,
          tipo: lTipo,
          usina: resultadoNome,
          código: codigoFinal,
          revisao: revisao,
          descriçao: descricao,

        };

        var response = fetch("https://api.airtable.com/v0/appJFXS6s2GGwHKyw/projetosexecutivos",{
          method: "POST",
          headers: {Authorization: "Bearer keyggOsGLubPoGKDd", "Content-Type": "application/json",},
          body: JSON.stringify(dadosEnvio),})

        .then((response) => {
          if (response.ok) {
            console.log("Dados enviados com sucesso para o Airtable:",response.data);
            document.getElementById("listaNome").value = "";
            document.getElementById("listaTipo").value = "";
            document.getElementById("descricao").value = "";
            document.getElementById("listaFolha").value = "";
            document.getElementById("revisao").value = "";
            abrirFormularioPrancha();
            receberProjetos(idOriginalAirtable); 

            fetch('http://localhost:3000/enviar-email', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'}, 
              body: JSON.stringify(dadosEmail),})
            .then(resposta => {
              if (resposta.ok) {
                return resposta.json();
              } else {
                throw new Error('Erro ao enviar o e-mail.');
              }
            })
            .then(data => {
              console.log('E-mail enviado com sucesso!', data);
            })
            .catch(error => {
              console.error('Erro na requisição:', error);
            });

          }
        });
      } catch (error) {
        console.error("Erro ao enviar dados para o Airtable:", error);
      }
    }
  });
}

/* OBTER DADOS DOS PROJETOS EXECUTIVOS CADASTRADOS */
function receberProjetos(idOriginalAirtable) {
  fetch("https://api.airtable.com/v0/appJFXS6s2GGwHKyw/projetosexecutivos?filterByFormula=id%3D" +
    idOriginalAirtable + "&sortField=data",{method: "GET",
      headers: {Authorization: "Bearer keyggOsGLubPoGKDd", "Content-Type": "application/json",},
    }
  )
  .then((rd) => {
    if (!rd.ok) {
      throw new Error("Erro ao obter os dados");
    }
    return rd.json();
  })
  .then((data) => {
    var pe = document.getElementById("projetosExecutivos");
    var dadosAirtable = data.records;

    function preencherProjetos() {
      var usinaAirtable = fieldsAirtable.nomedausina;
      var tipoAirtable = fieldsAirtable.tipodeprojeto;
      var descricaoAirtable = fieldsAirtable.descricao;
      var folhaAirtable = fieldsAirtable.tamanhodafolha;
      var revisaoAirtable = fieldsAirtable.revisao;
      var dataUsinaAirtable = fieldsAirtable.data;

      var siglaNome = usinaAirtable
        .normalize("NFD")
        .replace(/[\u0300-\u036f\s]/g, "")
        .toUpperCase();
      var siglaTipo = tipoAirtable
        .normalize("NFD")
        .replace(/[\u0300-\u036f\s]/g, "")
        .slice(0, 3)
        .toUpperCase();
      var mesmoProjeto = "H2-" + siglaNome + "-" + siglaTipo;
      projetosIguais.push(mesmoProjeto);
      var contadorProjeto = 0;
      for (var i = 0; i < projetosIguais.length; i++) {
        if (projetosIguais[i] === mesmoProjeto) {
          contadorProjeto++;
        }
      }
      var codigoArquivo = "H2-" + siglaNome + "-" + siglaTipo + "-" + (contadorProjeto < 10 ? "0" : "") + contadorProjeto;

      var folhaMaisRevisao = folhaAirtable + " | " + revisaoAirtable;

      var nomeUsina = document.createElement("h5");
      nomeUsina.innerText = usinaAirtable;
      pe.appendChild(nomeUsina);

      var codigoProjeto = document.createElement("h5");
      codigoProjeto.innerText = codigoArquivo;
      codigoProjeto.setAttribute("class", "codigosArquivos");
      pe.appendChild(codigoProjeto);

      var tipoProjeto = document.createElement("h5");
      tipoProjeto.innerText = tipoAirtable;
      pe.appendChild(tipoProjeto);

      var descricaoProjeto = document.createElement("h5");
      descricaoProjeto.innerText = descricaoAirtable;
      pe.appendChild(descricaoProjeto);

      var folhaerevisaoProjeto = document.createElement("h5");
      folhaerevisaoProjeto.innerText = folhaMaisRevisao;
      pe.appendChild(folhaerevisaoProjeto);

      var dataProjeto = document.createElement("h5");
      var dataAtual = new Date(dataUsinaAirtable);
      var dia = dataAtual.getUTCDate();
      var mes = dataAtual.getUTCMonth() + 1;
      var ano = dataAtual.getUTCFullYear();
      var dataFormatada =
        (dia < 10 ? "0" : "") +
        dia +
        "/" +
        (mes < 10 ? "0" : "") +
        mes +
        "/" +
        ano;
      dataProjeto.innerText = dataFormatada;
      pe.appendChild(dataProjeto);

      var linkProjeto = document.createElement("a");
      linkProjeto.innerText = codigoArquivo + "_rv" + revisaoAirtable;
      linkProjeto.setAttribute("class", "ufv");
      linkProjeto.setAttribute("href", "#");
      pe.appendChild(linkProjeto);
    }

    if (projetoEnviado !== 2) {
      for (let i = 0; i < dadosAirtable.length; i++) {
        var fieldsAirtable = dadosAirtable[i].fields;
        preencherProjetos();
      }
    } else {
      var ultimoEnviado = dadosAirtable.length - 1;
      var fieldsAirtable = dadosAirtable[ultimoEnviado].fields;
      preencherProjetos();
    }
    return (projetoEnviado = 2);
  })
  .catch((error) => {
    console.error(error);
  });
}