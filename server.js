/* HEAD */
const nodemailer = require("nodemailer");
const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path');

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/enviar-email', upload.single('arquivo'), (req, res) => {
  const dadosFront = req.body;
  const arquivo = req.file;
  console.log(dadosFront.descriçao);

  /* ENVIAR EMAIL AO CADASTRAR UM PROJETO EXECUTIVO */
  async function enviarEmail(dadosFront, arquivo) {
    const nome = dadosFront.nome;
    const status = dadosFront.status;
    const id = dadosFront.id;
    const cidade = dadosFront.cidade;
    const tipo = dadosFront.tipo;
    const usina = dadosFront.usina;
    const codigo = dadosFront.codigo;
    const revisao = dadosFront.revisao;
    const descricao = dadosFront.descricao;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: "drexlervc@gmail.com", pass: "bmnddxmnfdvhschy" },
      tls: { rejectUnauthorized: false },
    });

    const corpoEmail =
      '<html> <b>* Mensagem automática. Não responda esse e-mail. *</b> <p>________________________________________________________________________</p> <p>Um novo projeto executivo foi cadastrado. Segue os dados abaixo:</p> <b style= "text-decoration: underline;">'
      + nome + '</b> <li>ID: ' + id + ';</li> <li>Cidade: ' + cidade + ';</li> <li>Tipo: ' + tipo +
      ';</li> <li>Usina: ' + usina + ';</li> <li>Código: ' + codigo + ';</li> <li>Revisão: ' + revisao +
      ';</li> <li>Descrição: ' + descricao +
      '.</li> <p>________________________________________________________________________</p>  <b>* DOCUMENTO EM ANEXO *</b> </html>';

    let info = await transporter.sendMail({
      from: "drexlervc@gmail.com",
      to: "drexler.correa@h2energy.com.br",
      /* cc: "", */
      subject: 'Novo Projeto Executivo | ' + nome + ' | Status: ' + status,
      html: corpoEmail,      
      attachments: [{
        filename: arquivo.originalname,
        path: path.resolve(__dirname, 'uploads', arquivo.filename)
      }]      
    });

    console.log("Message sent: %s", info.messageId);

  }   
  enviarEmail(dadosFront, arquivo)
  .then(() => {console.log('E-mail enviado com sucesso!');})
  .catch(console.error);

  res.json("Requisição ao servidor de e-mail feita com sucesso!");
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000!');
});