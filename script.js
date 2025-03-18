  // Função para obter parâmetros UTM da URL
  function getUTMParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParameters = {};
    utmParameters["str_utm_source"] = urlParams.get("utm_source") || "";
    utmParameters["str_utm_medium"] = urlParams.get("utm_medium") || "";
    utmParameters["str_utm_campaign"] = urlParams.get("utm_campaign") || "";
    utmParameters["str_utm_term"] = urlParams.get("utm_term") || "";
    return utmParameters;
}

document.addEventListener("DOMContentLoaded", function () {

    let measurement_id__c = 'G-3RPJSREWE0'

    let client_id__c = function get_ga_clientid() {
        var cookie = {};
        document.cookie.split(';').forEach(function (el) {
            var splitCookie = el.split('=');
            var key = splitCookie[0].trim();
            var value = splitCookie[1];
            cookie[key] = value;
        });
        return cookie["_ga"].substring(6);
    }

    var cookie = {};
    document.cookie.split(';').forEach(function (el) {
        var splitCookie = el.split('=');
        var key = splitCookie[0].trim();
        var value = splitCookie[1];
        cookie[key] = value;
    });
    cookie["_ga"].substring(6)
    function get_ga_clientid() {
        var cookie = {};
        document.cookie.split(';').forEach(function (el) {
            var splitCookie = el.split('=');
            var key = splitCookie[0].trim();
            var value = splitCookie[1];
            cookie[key] = value;
        });
        return cookie["_ga"].substring(6);
    }

    let botaoEnviar = document.getElementById("submitButton");
    botaoEnviar.addEventListener("click", function (e) {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const cargo = document.getElementById('cargo').value;
        const telefone = document.getElementById('telefone').value;
        const empresa = document.getElementById('empresa').value;
        const colaboradores = document.getElementById('colaboradores').value;
        const option_cliente = document.querySelector('input[name="option_cliente"]:checked')


      
        // Formatar a data e hora no padrão brasileiro
        let dataHoraFormatada = new Date().toLocaleString("pt-BR");
        if (
            !telefone ||
            telefone.length < 10
        ) {
            alert("Por favor, verifique o número de telefone!");
            return;
        }
        if (
            !nome ||
            !email ||
            !cargo ||
            !empresa ||
            !option_cliente ||
            !colaboradores
            

            ) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }
        if (/0{11}|1{11}|2{11}|3{11}|4{11}|5{11}|6{11}|7{11}|8{11}|9{11}/.test(telefone.replace(/\D/g, '').substring(0, 11))) {
            alert('O número de telefone está inválido!')
            return
        }
        if (!(/^\S+@\S+\.\S+$/.test(email))) {
            alert('O e-mail está inválido!')
            return
        }
        const utmParameters = getUTMParameters()
        const data = JSON.stringify({
            str_lp_name: 'Manual do PAT - 2025',
            str_user_name: nome,
            str_email: email,
            str_cargo: cargo,
            nr_phone: telefone.replace(/\D/g, ''),
            str_company_name: empresa,
            str_employees_number: colaboradores,
            fl_Client: option_cliente.value,
            dt_created_date: dataHoraFormatada,
            measurement_id__c: measurement_id__c,
            client_id__c: client_id__c(),
            ...utmParameters// Inclui os parâmetros UTM mapeados corretamente
        });

        fetch("https://conteudo.caju.com.br/integracao-pat-2025", {
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
            .then(resposta => resposta.text())
            .then((resposta) => {
                const json = JSON.parse(resposta.replace("System.Collections.ArrayList", ""))
                if (json.statusCode === 200) {
                    if (typeof dataLayer !== 'undefined') {
                        dataLayer.push({
                            event: "e_003_001_001_059_018_001",
                            parameters: {
                                email_domain: domainEmail(email)
                            }
                        });
                    }
                    window.location.href = "https://conteudo.caju.com.br/ebook-pat-2025-a-caminho";
                } else {
                    alert("Erro ao inserir dados.");
                }
            }).catch(err => console.log(err));
    });
});

//split email domain

function domainEmail(email) {
    const dominios = [
        'gmail.com',
        'hotmail.com',
        'outlook.com',
        'yahoo.com',
        'icloud.com',
        'aol.com',
        'live.com',
        'protonmail.com',
        'mail.com',
        'gmx.com',
        'zoho.com',
        'me.com',
        'yandex.com',
        'msn.com',
        'fastmail.com'
    ]
    let emailDomain = email.split('@')[1]
    if (dominios.includes(emailDomain)) {
        return 'personal'
    } else {
        return 'corp'
    }

}
//input colaboradores, para não permitir letras/caracteres especiais e delimitar a quantidade de números inseridos
function onlyNumber(input) {
    input.value = input.value.replace(/[a-zA-Z]/g, "").replace(/\D/g, '');
    if (input.value < 1) {
        input.value = ''
        return
    }

}

document.getElementById('nome').addEventListener('input', (event) => {
    // Remove todos os caracteres que não são letras
    const regex = /[0-9]/g;
    event.target.value = event.target.value.replace(regex, '').replace(/[!@#$%^&\(\)\_\=\+\-\¨\<\,\>\.\:\;\~\}\]\[\´\{\**]/g, "");

});

// Função para validar e formatar o campo de TELEFONE
function formatarTelefone(input) {
    let telefone = input.value;
    // Remover todos os caracteres não numéricos
    telefone = telefone.replace(/\D/g, '');
    // Limitar para no máximo 11 dígitos (DDD + número)
    telefone = telefone.substring(0, 11);
    // Não permitir números sequencias
    if (/0{11}|1{11}|2{11}|3{11}|4{11}|5{11}|6{11}|7{11}|8{11}|9{11}/.test(telefone)) {
        alert('O número de telefone está inválido!')
        return
    }
    let formattedTelefone;
    if (telefone.length >= 11) {
        formattedTelefone = telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else {
        formattedTelefone = telefone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");//não permitir o caracteres especiais
    }
    // Atualizar o valor do campo de telefone
    input.value = formattedTelefone;
};



function validacaoEmail(email) {

    usuario = email.value.substring(0, email.value.indexOf("@"));
    dominio = email.value.substring(email.value.indexOf("@") + 1, email.value.length);

    if (!(/^\S+@\S+\.\S+$/.test(email.value))) {
        alert('O e-mail está inválido!')
        return
    }
}



/* Scripts do counter */
const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24;

//I'm adding this section so I don't have to keep updating this pen every year :-)
//remove this if you don't need it
let today = new Date(),
    dd = String(today.getDate()).padStart(2, "0"),
    mm = String(today.getMonth() + 1).padStart(2, "0"),
    yyyy = today.getFullYear(),
    nextYear = yyyy + 1,
    dayMonth = "09/30/", // Mês / dia
    birthday = dayMonth + yyyy;

today = mm + "/" + dd + "/" + yyyy;
if (today > birthday) {
  birthday = dayMonth + nextYear;
}
//end

const countDown = new Date(birthday).getTime(),
  x = setInterval(function() {    
    const now = new Date().getTime(),
          distance = countDown - now;

    document.getElementById("days").innerText = Math.floor(distance / (day)),
    document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour)),
    document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute)),
    document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);

    //do something later when date is reached
    if (distance < 0) {
      document.getElementById("headline").innerText = "It's my birthday!";
      document.getElementById("countdown").style.display = "none";
      document.getElementById("content").style.display = "block";
      clearInterval(x);
    }
    //seconds
  }, 0)
