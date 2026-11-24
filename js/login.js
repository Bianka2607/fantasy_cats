document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;

    const mensagem = document.getElementById("mensagem");

    // Login de demonstração
    const emailCorreto = "cliente@fantasycats.com";
    const senhaCorreta = "1234";

    if (usuario === emailCorreto && senha === senhaCorreta) {

        mensagem.textContent = "Login realizado com sucesso!";

        // Guarda que o cliente entrou no site
        sessionStorage.setItem("clienteLogado", "true");

        // Vai para o cardápio
        window.location.href = "index.html";

    } else {

        mensagem.textContent = "E-mail ou senha incorretos.";

    }
});