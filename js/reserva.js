document.getElementById("reservaForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nomeReserva").value;
    const data = document.getElementById("data").value;
    const horario = document.getElementById("horario").value;
    const pessoas = document.getElementById("pessoas").value;

    if (nome !== "" && data !== "" && horario !== "" && pessoas !== "") {
        document.getElementById("mensagem").innerHTML = "Reserva solicitada! Obrigado, " + nome + ".";

        document.getElementById("reservaForm").reset();
    } else {
        document.getElementById("mensagem").innerHTML = "Preencha todos os campos.";
    }
});
