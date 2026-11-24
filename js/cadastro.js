document.getElementById("cadastroForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const senha = document.getElementById("senhaCadastro").value;
    const mensagem = document.getElementById("mensagem");

    mensagem.textContent = "Realizando cadastro...";

    try {
        const resposta = await fetch("/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                telefone: telefone,
                senha: senha
            })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            mensagem.textContent = "Cadastro realizado! Redirecionando...";

            sessionStorage.setItem("clienteLogado", "true");
            sessionStorage.setItem("idCliente", dados.id_cliente);
            sessionStorage.setItem("nomeCliente", nome);

            setTimeout(function() {
                window.location.href = "index.html";
            }, 1000);
        } else {
            mensagem.textContent = dados.mensagem;
        }

    } catch (erro) {
        console.log(erro);
        mensagem.textContent = "Não foi possível conectar ao servidor.";
    }
});
