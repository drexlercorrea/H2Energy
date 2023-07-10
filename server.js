/* HEAD */
const nodemailer = require("nodemailer");
const express = require('express');
const app = express();

app.post('/enviar-email', (req, res) => {
 
  /* ENVIAR EMAIL AO CADASTRAR UM PROJETO EXECUTIVO */
  async function enviarEmail() {
    var nomeEmail = 1 /* document.getElementById("listaNome").value; */
    var tipoEmail = 2 /* document.getElementById("listaTipo").value; */
    var descricaoEmail = 3 /* document.getElementById("descricao").value; */
    var revisaoEmail = 4 /* document.getElementById("revisao").value; */

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: "drexlervc@gmail.com", pass: "bmnddxmnfdvhschy" },
      tls: { rejectUnauthorized: false },
    });

    const corpoEmail =
      '<html> <b>* Mensagem automática. Não responda esse e-mail. *</b> <p>________________________________________________________________________</p> <p>Um novo projeto executivo foi cadastrado. Segue os dados abaixo:</p> <b style= "text-decoration: underline;">TAB200</b> <li>ID: 001;</li> <li>Cidade: Tabatinga/SP;</li> <li>Tipo: ' +
      tipoEmail +
      ";</li> <li>Usina: Geral;</li> <li>Código: H2-UFVTAB200-ELE-01;</li> <li>Revisão: " +
      revisaoEmail +
      ";</li> <li>Descrição: " +
      descricaoEmail +
      ".</li> <p>________________________________________________________________________</p>  <b>* DOCUMENTO EM ANEXO *</b> </html>";

    let info = await transporter.sendMail({
      from: "drexlervc@gmail.com",
      to: "drexlercorrea@hotmail.com",
      /* cc: "", */
      subject: "Novo Projeto Executivo | TAB200 | Status: Obra em execução",
      html: corpoEmail,
    });

    console.log("Message sent: %s", info.messageId);
  } enviarEmail().catch(console.error);

});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
