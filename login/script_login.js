const firebaseConfig = {
  apiKey: "AIzaSyAjkIX1MxO1vktDrtxsSDEu6I5sWuNUWj8",
  authDomain: "h2energy-f88b9.firebaseapp.com",
  projectId: "h2energy-f88b9",
  storageBucket: "h2energy-f88b9.appspot.com",
  messagingSenderId: "813618184142",
  appId: "1:813618184142:web:b27bc024a9d1c86ab5759f",
  measurementId: "G-F6FGKDEPLQ"
};

document.addEventListener("DOMContentLoaded", function() {

  firebase.initializeApp(firebaseConfig);

  const loginForm = document.getElementById("loginForm");
  const message = document.getElementById("message");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("Login bem-sucedido!");
      window.location.href = "../index.html";
    })
    .catch((error) => {
      message.textContent = "Erro ao fazer login. Verifique suas credenciais.";
    });
  });
})