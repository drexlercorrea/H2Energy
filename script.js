/* HEAD */
const Airtable = require("airtable");
const base = new Airtable({
  apiKey:
    "pat7sOvlibq6Ui1sG.de9fc95445823fe266092367695775f1288fe1748cbbfa08287a93cf394cd4fc",
}).base("projetosh2");

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
    document.getElementById("listaFolha").value == ""
  ) {
    var cvp = 1;
  } else {
    var cvp = 2;
  }
  return cvp;
}
function campoVazioModal() {
  if (
    document.getElementById("modalUFV").value == "" ||
    document.getElementById("modalPotencia").value == "" ||
    document.getElementById("modalCidade").value == "" ||
    document.getElementById("modalUsinas").value == "" ||
    document.getElementById("modalStatus").value == ""
  ) {
    var cvm = 1;
  } else {
    var cvm = 2;
  }
  return cvm;
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
        fetch(
          "https://api.airtable.com/v0/app9EDXVbU7QhtUiF/gestaodeprojetos?sortField=idprojeto&fields[]=idufv",
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
            var dadosAirtable = data.records;
            var valoresUnicos = {};

            for (let i = 0; i < dadosAirtable.length; i++) {
              var valoridu = dadosAirtable[i].fields.idufv;
              if (!valoresUnicos[valoridu]) {
                valoresUnicos[valoridu] = valoridu;
              }
            }
            var tamanhovu = Object.keys(valoresUnicos).length;

            if (tamanhovu == 0) {
              var idNovo = 1;
            } else {
              var ultimoId = valoresUnicos[tamanhovu];
              var idNovo = ultimoId + 1;
            }

            var fNome = document.getElementById("nome").value;
            var fPotencia = document.getElementById("potencia").value;
            var fCidade = document.getElementById("cidade").value;
            var fUsinas = document.getElementById("usinas").value;
            var fStatus = document.getElementById("status").value;
            var dadosEnvio = {
              fields: {
                idufv: idNovo,
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
                var formularioEnviado = 2;
                receberDados(formularioEnviado);
              }
            });
          })

          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error("Erro ao enviar dados para o Airtable:", error);
      }
    }
  });
}

/* OBTER DADOS DAS UFV's CADASTRADAS */
function receberDados(formularioEnviado) {
  fetch(
    "https://api.airtable.com/v0/app9EDXVbU7QhtUiF/gestaodeprojetos?sortField=idprojeto&sortDirection=desc",
    {
      method: "GET",
      headers: {
        Authorization:
          "Bearer pat7sOvlibq6Ui1sG.de9fc95445823fe266092367695775f1288fe1748cbbfa08287a93cf394cd4fc",
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

      var valoresUnicos = {};
      var valoresChaves = {};

      for (let i = 0; i < dadosAirtable.length; i++) {
        var valoridp = dadosAirtable[i].fields.idprojeto;
        var valoridu = dadosAirtable[i].fields.idufv;
        var maioridp = dadosAirtable[0].fields.idprojeto;

        if (!valoresUnicos[valoridu]) {
          valoresUnicos[valoridu] = valoridp;
          valoresChaves[valoridu] = i;
        }
      }
      var tamanhovc = Object.keys(valoresChaves).length;

      function preencherTabela() {
        var idoAirtable = fieldsAirtable.idprojeto;
        var idpAirtable = fieldsAirtable.idufv;
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
          abrirProjeto(maioridp, idoAirtable);
          listaUfvs(nomeAirtable, nUsinasAirtable);
        });
        p1.appendChild(nome);

        var potencia = document.createElement("h5");
        potencia.innerText = potenciaAirtable + " MW";
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
        for (let i = 1; i <= tamanhovc; i++) {
          var v = valoresChaves[i];
          var valoridp = dadosAirtable[v].fields.idprojeto;
          var valoridu = dadosAirtable[v].fields.idufv;
          var valordel = dadosAirtable[v].fields.delete;

          if (valordel !== "X") {
            if (valoresUnicos[valoridu] == valoridp) {
              var fieldsAirtable = dadosAirtable[v].fields;
              preencherTabela();
            }
          }
        }
      } else {
        var fieldsAirtable = dadosAirtable[0].fields;
        preencherTabela();
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

/* ENTRAR NA UFV */
function abrirProjeto(maioridp, idoAirtable) {
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
      Authorization:
        "Bearer pat7sOvlibq6Ui1sG.de9fc95445823fe266092367695775f1288fe1748cbbfa08287a93cf394cd4fc",
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
        var idaAirtable = fieldsAirtable.idprojeto;

        if (idaAirtable == idoAirtable) {
          var idpAirtable = fieldsAirtable.idufv;
          var nomeAirtable = fieldsAirtable.nomedaufv;
          var potenciaAirtable = fieldsAirtable.potencia;
          var cidadeAirtable = fieldsAirtable.cidadeuf;
          var nUsinasAirtable = fieldsAirtable.ndeusinas;
          var statusAirtable = fieldsAirtable.status;
          var dataAirtable = fieldsAirtable.data;

          var nomeUfv = document.createElement("h1");
          nomeUfv.setAttribute("id", "nomeUfv");
          nomeUfv.innerText = nomeAirtable;
          var divReferencia = pc.children[0];
          pc.insertBefore(nomeUfv, divReferencia);

          var atualizarUFV = document.createElement("i");
          atualizarUFV.setAttribute("id", "atualizarUFV");
          atualizarUFV.setAttribute("class", "fa-solid fa-marker");
          atualizarUFV.setAttribute("title", "Atualizar UFV");
          atualizarUFV.addEventListener("click", function (event) {
            editarUFV(
              maioridp,
              nomeAirtable,
              idpAirtable,
              potenciaAirtable,
              cidadeAirtable,
              nUsinasAirtable,
              statusAirtable
            );
          });
          pc.insertBefore(atualizarUFV, divReferencia);

          var delUFV = document.createElement("i");
          delUFV.setAttribute("id", "delUFV");
          delUFV.setAttribute("class", "fa-solid fa-trash");
          delUFV.setAttribute("title", "Deletar UFV");
          delUFV.addEventListener("click", function (event) {
            deletarUFV(idpAirtable);
          });
          pc.insertBefore(delUFV, divReferencia);

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
          potenciaUfv.innerText = potenciaAirtable + " MW";
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

          enviarProjeto(
            idpAirtable,
            nomeAirtable,
            statusAirtable,
            cidadeAirtable
          );

          var projetoEnviado = 0;
          receberProjetos(idpAirtable);

          botaoUpload();
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

function botaoUpload() {
  var inputArquivo = document.getElementById("arquivo");

  inputArquivo.addEventListener("change", function () {
    var arquivoSelecionado = inputArquivo.files[0];

    if (arquivoSelecionado) {
      var bu = document.getElementById("botaoUpload");
      bu.style.cssText = "background-color: gray; border-color: gray";
    }
  });
}

/* CADASTRO DE PROJETO EXECUTIVO */
function enviarProjeto(
  idpAirtable,
  nomeAirtable,
  statusAirtable,
  cidadeAirtable
) {
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
        var lDescriçao = document.getElementById("descricao").value;
        var lFolha = document.getElementById("listaFolha").value;
        var lRevisao = "00";
        var arquivoForm = document.getElementById("arquivo").files[0];
        const lExtensao = document
          .getElementById("arquivo")
          .value.split(".")
          .pop();

        var lid =
          (idpAirtable < 10 ? "00" : idpAirtable < 100 ? "0" : "") +
          idpAirtable;

        var siglaNomeEmail = lNome
          .normalize("NFD")
          .replace(/[\u0300-\u036f\s]/g, "")
          .toUpperCase();
        var siglaTipoEmail = lTipo
          .normalize("NFD")
          .replace(/[\u0300-\u036f\s]/g, "")
          .slice(0, 3)
          .toUpperCase();
        var mesmoProjetoEmail = "H2-" + siglaNomeEmail + "-" + siglaTipoEmail;

        fetch(
          "https://api.airtable.com/v0/appJFXS6s2GGwHKyw/projetosexecutivos?filterByFormula=id%3D" +
            idpAirtable +
            "&sortField=data",
          {
            method: "GET",
            headers: {
              Authorization:
                "Bearer pat7sOvlibq6Ui1sG.de9fc95445823fe266092367695775f1288fe1748cbbfa08287a93cf394cd4fc",
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
            var dadosAirtable = data.records;

            for (let i = 0; i < dadosAirtable.length; i++) {
              var fieldsAirtable = dadosAirtable[i].fields;
              var usinaAirtable = fieldsAirtable.nomedausina;
              var tipoAirtable = fieldsAirtable.tipodeprojeto;

              var siglaNomeContador = usinaAirtable
                .normalize("NFD")
                .replace(/[\u0300-\u036f\s]/g, "")
                .toUpperCase();
              var siglaTipoContador = tipoAirtable
                .normalize("NFD")
                .replace(/[\u0300-\u036f\s]/g, "")
                .slice(0, 3)
                .toUpperCase();
              var mesmoProjetoContador =
                "H2-" + siglaNomeContador + "-" + siglaTipoContador;

              projetosIguaisContador.push(mesmoProjetoContador);
            }

            var contadorProjetoEmail = 0;
            for (var i = 0; i < projetosIguaisContador.length; i++) {
              if (projetosIguaisContador[i] === mesmoProjetoEmail) {
                contadorProjetoEmail++;
              }
            }

            var contadorUltimo = contadorProjetoEmail + 1;
            var codigoFinalEmail =
              mesmoProjetoEmail +
              "-" +
              (contadorUltimo < 10 ? "0" : "") +
              contadorUltimo;

            if (nomeAirtable === lNome) {
              var resultadoNome = "Geral";
            } else {
              var resultadoNome = lNome.charAt(lNome.length - 1);
            }

            var lNomedoArquivo =
              codigoFinalEmail + "_rv" + lRevisao + "." + lExtensao;

            var dadosEnvio = {
              fields: {
                id: idpAirtable,
                nomedausina: lNome,
                tipodeprojeto: lTipo,
                descricao: lDescriçao,
                tamanhodafolha: lFolha,
                revisao: lRevisao,
                codigo: codigoFinalEmail,
                nomedoarquivo: lNomedoArquivo,
              },
            };

            const dadosEmail = new FormData();
            dadosEmail.append("nome", nomeAirtable);
            dadosEmail.append("status", statusAirtable);
            dadosEmail.append("id", lid);
            dadosEmail.append("cidade", cidadeAirtable);
            dadosEmail.append("tipo", lTipo);
            dadosEmail.append("usina", resultadoNome);
            dadosEmail.append("codigo", codigoFinalEmail);
            dadosEmail.append("revisao", lRevisao);
            dadosEmail.append("descricao", lDescriçao);
            dadosEmail.append("arquivo", arquivoForm);

            var response = fetch(
              "https://api.airtable.com/v0/appJFXS6s2GGwHKyw/projetosexecutivos",
              {
                method: "POST",
                headers: {
                  Authorization:
                    "Bearer pat7sOvlibq6Ui1sG.de9fc95445823fe266092367695775f1288fe1748cbbfa08287a93cf394cd4fc",
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
                document.getElementById("listaNome").value = "";
                document.getElementById("listaTipo").value = "";
                document.getElementById("descricao").value = "";
                document.getElementById("listaFolha").value = "";
                document.getElementById("arquivo").files[0] = "";
                abrirFormularioPrancha();
                var projetoEnviado = 2;
                receberProjetos(idpAirtable, projetoEnviado);

                fetch("http://localhost:3000/enviar-email", {
                  method: "POST",
                  body: dadosEmail,
                })
                  .then((resposta) => {
                    if (resposta.ok) {
                      return resposta.json();
                    } else {
                      throw new Error(
                        "Erro na requisição ao servidor de e-mail!"
                      );
                    }
                  })
                  .then((data) => {
                    console.log(data);
                    alert("Projeto cadastrado com sucesso!");
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              }
            });
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error("Erro ao enviar dados para o Airtable:", error);
      }
    }
  });
}

/* OBTER DADOS DOS PROJETOS EXECUTIVOS CADASTRADOS */
function receberProjetos(idpAirtable, projetoEnviado) {
  fetch(
    "https://api.airtable.com/v0/appJFXS6s2GGwHKyw/projetosexecutivos?filterByFormula=id%3D" +
      idpAirtable +
      "&sortField=data",
    {
      method: "GET",
      headers: {
        Authorization:
          "Bearer pat7sOvlibq6Ui1sG.de9fc95445823fe266092367695775f1288fe1748cbbfa08287a93cf394cd4fc",
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
      var pe = document.getElementById("projetosExecutivos");
      var dadosAirtable = data.records;

      function preencherProjetos() {
        var usinaAirtable = fieldsAirtable.nomedausina;
        var tipoAirtable = fieldsAirtable.tipodeprojeto;
        var descricaoAirtable = fieldsAirtable.descricao;
        var folhaAirtable = fieldsAirtable.tamanhodafolha;
        var revisaoAirtable = fieldsAirtable.revisao;
        var dataUsinaAirtable = fieldsAirtable.data;
        var codigoArquivo = fieldsAirtable.codigo;
        var nomeArquivo = fieldsAirtable.nomedoarquivo;

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

        const currentURL = window.location.href;
        const caminhodoArquivo =
          currentURL.substring(0, currentURL.lastIndexOf("/") + 1) +
          "uploads/" +
          nomeArquivo;

        var botaoProjeto = document.createElement("a");
        botaoProjeto.setAttribute("id", "botaoProjeto");
        botaoProjeto.setAttribute("class", "botaoProjeto");
        botaoProjeto.setAttribute("href", caminhodoArquivo);
        botaoProjeto.setAttribute("download", nomeArquivo);
        pe.appendChild(botaoProjeto);

        var linkProjeto = document.createElement("i");
        linkProjeto.setAttribute("class", "fa-solid fa-file-arrow-down");
        linkProjeto.setAttribute("id", "linkProjeto");
        linkProjeto.setAttribute("title", "Baixar Arquivo");
        botaoProjeto.appendChild(linkProjeto);
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
    })
    .catch((error) => {
      console.error(error);
    });
}

/* EDITAR OS DADOS DA UFV */
function editarUFV(
  maioridp,
  nomeAirtable,
  idpAirtable,
  potenciaAirtable,
  cidadeAirtable,
  nUsinasAirtable,
  statusAirtable
) {
  var modal = document.createElement("div");
  modal.setAttribute("class", "modal");
  modal.setAttribute("id", "modal");
  document.body.appendChild(modal);

  var modalBox = document.createElement("div");
  modalBox.setAttribute("class", "modalBox");
  modalBox.setAttribute("id", "modalBox");
  modal.appendChild(modalBox);

  var modalFechar = document.createElement("span");
  modalFechar.setAttribute("class", "modalFechar");
  modalFechar.setAttribute("id", "modalFechar");
  modalFechar.innerText = "X";
  modalFechar.setAttribute("title", "Fechar");
  modalFechar.addEventListener("click", fecharModal);
  modalBox.appendChild(modalFechar);

  function fecharModal() {
    var modal = document.querySelector(".modal");
    if (modal) {
      modal.remove();
    }
  }

  var modalForm = document.createElement("form");
  modalForm.setAttribute("class", "modalForm");
  modalForm.setAttribute("id", "modalForm");
  modalBox.appendChild(modalForm);

  div1 = document.createElement("div");
  div1.setAttribute("class", "modalDiv");
  modalForm.appendChild(div1);

  label1 = document.createElement("label");
  label1.setAttribute("for", "modalUFV");
  label1.setAttribute("class", "modalLabel");
  label1.innerText = "Nome da UFV: ";
  div1.appendChild(label1);

  modalUFV = document.createElement("input");
  modalUFV.setAttribute("class", "modalInput");
  modalUFV.setAttribute("id", "modalUFV");
  modalUFV.setAttribute("name", "modalUFV");
  modalUFV.setAttribute("type", "text");
  modalUFV.setAttribute("value", nomeAirtable);
  modalUFV.setAttribute("autocomplete", "off");
  div1.appendChild(modalUFV);

  div2 = document.createElement("div");
  div2.setAttribute("class", "modalDiv");
  modalForm.appendChild(div2);

  label2 = document.createElement("label");
  label2.setAttribute("for", "modalPotencia");
  label2.setAttribute("class", "modalLabel");
  label2.innerText = "Potência (MW): ";
  div2.appendChild(label2);

  modalPotencia = document.createElement("input");
  modalPotencia.setAttribute("class", "modalInput");
  modalPotencia.setAttribute("id", "modalPotencia");
  modalPotencia.setAttribute("name", "modalPotencia");
  modalPotencia.setAttribute("type", "number");
  modalPotencia.setAttribute("value", potenciaAirtable);
  modalPotencia.setAttribute("autocomplete", "off");
  modalPotencia.setAttribute("step", "0.1");
  div2.appendChild(modalPotencia);

  div3 = document.createElement("div");
  div3.setAttribute("class", "modalDiv");
  modalForm.appendChild(div3);

  label3 = document.createElement("label");
  label3.setAttribute("for", "modalCidade");
  label3.setAttribute("class", "modalLabel");
  label3.innerText = "Cidade/ES: ";
  div3.appendChild(label3);

  modalCidade = document.createElement("input");
  modalCidade.setAttribute("class", "modalInput");
  modalCidade.setAttribute("id", "modalCidade");
  modalCidade.setAttribute("name", "modalCidade");
  modalCidade.setAttribute("type", "text");
  modalCidade.setAttribute("value", cidadeAirtable);
  modalCidade.setAttribute("autocomplete", "off");
  div3.appendChild(modalCidade);

  div4 = document.createElement("div");
  div4.setAttribute("class", "modalDiv");
  modalForm.appendChild(div4);

  label4 = document.createElement("label");
  label4.setAttribute("for", "modalUsinas");
  label4.setAttribute("class", "modalLabel");
  label4.innerText = "Nº de Usinas: ";
  div4.appendChild(label4);

  modalUsinas = document.createElement("input");
  modalUsinas.setAttribute("class", "modalInput");
  modalUsinas.setAttribute("id", "modalUsinas");
  modalUsinas.setAttribute("name", "modalUsinas");
  modalUsinas.setAttribute("type", "number");
  modalUsinas.setAttribute("value", nUsinasAirtable);
  modalUsinas.setAttribute("autocomplete", "off");
  div4.appendChild(modalUsinas);

  div5 = document.createElement("div");
  div5.setAttribute("class", "modalDiv");
  modalForm.appendChild(div5);

  label5 = document.createElement("label");
  label5.setAttribute("for", "modalStatus");
  label5.setAttribute("class", "modalLabel");
  label5.innerText = "Status: ";
  div5.appendChild(label5);

  modalStatus = document.createElement("input");
  modalStatus.setAttribute("class", "modalInput");
  modalStatus.setAttribute("id", "modalStatus");
  modalStatus.setAttribute("name", "modalStatus");
  modalStatus.setAttribute("list", "modal-status");
  modalStatus.setAttribute("value", statusAirtable);
  modalStatus.setAttribute("autocomplete", "off");
  div5.appendChild(modalStatus);

  modalDatalist = document.createElement("datalist");
  modalDatalist.setAttribute("id", "modal-status");
  div5.appendChild(modalDatalist);

  lista1 = document.createElement("option");
  lista1.setAttribute("value", "Liberado para projeto");
  modalDatalist.appendChild(lista1);

  lista2 = document.createElement("option");
  lista2.setAttribute("value", "Obra em execução");
  modalDatalist.appendChild(lista2);

  lista3 = document.createElement("option");
  lista3.setAttribute("value", "As built");
  modalDatalist.appendChild(lista3);

  lista4 = document.createElement("option");
  lista4.setAttribute("value", "Concluído");
  modalDatalist.appendChild(lista4);

  div6 = document.createElement("div");
  div6.setAttribute("class", "modalDiv");
  modalForm.appendChild(div6);

  modalEnviar = document.createElement("button");
  modalEnviar.setAttribute("class", "modalEnviar");
  modalEnviar.setAttribute("id", "modalEnviar");
  modalEnviar.setAttribute("type", "submit");
  modalEnviar.setAttribute("title", "Enviar atualização");
  modalEnviar.innerText = "Atualizar";
  div6.appendChild(modalEnviar);

  var idoAirtable = maioridp + 1;
  var maioridp = idoAirtable;

  modalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    var fcvm = campoVazioModal();
    if (fcvm !== 2) {
      alert("Preencha todos os campos!");
    } else {
      try {
        var fNomeModal = document.getElementById("modalUFV").value;
        var fPotenciaModal = document.getElementById("modalPotencia").value;
        var fCidadeModal = document.getElementById("modalCidade").value;
        var fUsinasModal = document.getElementById("modalUsinas").value;
        var fStatusModal = document.getElementById("modalStatus").value;
        var dadosModal = {
          fields: {
            idufv: idpAirtable,
            nomedaufv: fNomeModal,
            potencia: fPotenciaModal,
            cidadeuf: fCidadeModal,
            ndeusinas: fUsinasModal,
            status: fStatusModal,
          },
        };

        var response = fetch(
          "https://api.airtable.com/v0/app9EDXVbU7QhtUiF/gestaodeprojetos",
          {
            method: "POST",
            headers: {
              Authorization:
                "Bearer pat7sOvlibq6Ui1sG.de9fc95445823fe266092367695775f1288fe1748cbbfa08287a93cf394cd4fc",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosModal),
          }
        ).then((response) => {
          if (response.ok) {
            console.log(
              "Dados enviados com sucesso para o Airtable:",
              response.data
            );

            fecharModal();

            var deletedp = document.getElementById("descriçãoProjeto");
            deletedp.innerHTML = "";

            var deletenufv = document.getElementById("nomeUfv");
            var deleteaufv = document.getElementById("atualizarUFV");
            var deletedufv = document.getElementById("delUFV");

            if (deletenufv) {
              deletenufv.remove();
            }
            if (deleteaufv) {
              deleteaufv.remove();
            }
            if (deletedufv) {
              deletedufv.remove();
            }

            abrirProjeto(maioridp, idoAirtable);
          }
        });
      } catch (error) {
        console.error("Erro ao enviar dados para o Airtable:", error);
      }
    }
  });
}

/* DELETAR UFV */
function deletarUFV(idpAirtable) {
  var modal = document.createElement("div");
  modal.setAttribute("class", "modal");
  modal.setAttribute("id", "modal");
  document.body.appendChild(modal);

  var modalBox = document.createElement("div");
  modalBox.setAttribute("class", "modalDel");
  modalBox.setAttribute("id", "modalBox");
  modal.appendChild(modalBox);

  div1 = document.createElement("div");
  div1.setAttribute("class", "divMensagem");
  modalBox.appendChild(div1);

  modalMensagem = document.createElement("p");
  modalMensagem.setAttribute("class", "modalMensagem");
  modalMensagem.innerText = "Deseja deletar a UFV?";
  div1.appendChild(modalMensagem);

  div2 = document.createElement("div");
  div2.setAttribute("class", "divButton");
  modalBox.appendChild(div2);

  modalConfirmar = document.createElement("button");
  modalConfirmar.setAttribute("class", "modalButton");
  modalConfirmar.setAttribute("id", "modalConfirmar");
  modalConfirmar.addEventListener("click", apagarUFV);
  modalConfirmar.innerText = "Sim";
  div2.appendChild(modalConfirmar);

  modalCancelar = document.createElement("button");
  modalCancelar.setAttribute("class", "modalButton");
  modalCancelar.setAttribute("id", "modalCancelar");
  modalCancelar.addEventListener("click", fecharModal);
  modalCancelar.innerText = "Não";
  div2.appendChild(modalCancelar);

  function fecharModal() {
    var modal = document.querySelector(".modal");
    if (modal) {
      modal.remove();
    }
  }

  function apagarUFV() {
    try {
      var dadosModal = {
        fields: {
          idufv: idpAirtable,
          delete: "X",
        },
      };

      var response = fetch(
        "https://api.airtable.com/v0/app9EDXVbU7QhtUiF/gestaodeprojetos",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer pat7sOvlibq6Ui1sG.de9fc95445823fe266092367695775f1288fe1748cbbfa08287a93cf394cd4fc",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosModal),
        }
      ).then((response) => {
        if (response.ok) {
          console.log(
            "Dados enviados com sucesso para o Airtable:",
            response.data
          );

          window.location.href = "";
        }
      });
    } catch (error) {
      console.error("Erro ao enviar dados para o Airtable:", error);
    }
  }
}
