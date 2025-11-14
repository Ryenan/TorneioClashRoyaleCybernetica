const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const page3 = document.getElementById('page3');

const btnPage1 = document.getElementById('btnPage1');
const btnPage2 = document.getElementById('btnPage2');

const termosCheckbox = document.getElementById('termosCheckbox');

const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const matriculaInput = document.getElementById('matricula');
const whatsappInput = document.getElementById('whatsapp');

let formData = {
    termos: false,
    nome: '',
    email: '',
    matricula: '',
    whatsapp: ''
};

termosCheckbox.addEventListener('change', function() {
    btnPage1.disabled = !this.checked;
    formData.termos = this.checked;
});

btnPage1.addEventListener('click', function() {
    if (termosCheckbox.checked) {
        page1.style.display = 'none';
        page2.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

function validarMatricula(matricula) {
    const regex = /^\d{6,12}$/;
    return regex.test(matricula);
}

function validarWhatsapp(whatsapp) {
    const numeros = whatsapp.replace(/\D/g, '');
    return numeros.length >= 10 && numeros.length <= 11;
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function verificarCamposPage2() {
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const matricula = matriculaInput.value.trim();
    const whatsapp = whatsappInput.value.trim();

    const nomeValido = nome.length >= 3;
    const emailValido = validarEmail(email);
    const matriculaValido = validarMatricula(matricula);
    const whatsappValido = validarWhatsapp(whatsapp);

    btnPage2.disabled = !(nomeValido && emailValido && matriculaValido && whatsappValido);
}

nomeInput.addEventListener('input', verificarCamposPage2);
emailInput.addEventListener('input', verificarCamposPage2);
matriculaInput.addEventListener('input', verificarCamposPage2);
whatsappInput.addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');

    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length >= 11) {
        this.value = `(${value.slice(0,2)}) ${value.slice(2,7)}-${value.slice(7,11)}`;
    } else if (value.length >= 7) {
        this.value = `(${value.slice(0,2)}) ${value.slice(2,6)}-${value.slice(6)}`;
    } else if (value.length >= 2) {
        this.value = `(${value.slice(0,2)}) ${value.slice(2)}`;
    } else {
        this.value = value;
    }
    
    verificarCamposPage2();
});

btnPage2.addEventListener('click', function() {
    formData.nome = nomeInput.value.trim();
    formData.email = emailInput.value.trim();
    formData.matricula = matriculaInput.value.trim();
    formData.whatsapp = whatsappInput.value.trim();
    
    const marretadaThor = document.getElementById('marretadaThor').checked;
    const peitinGalego = document.getElementById('peitinGalego').checked;
    
    console.log('Marretada do Thor:', marretadaThor);
    console.log('Peitin do Galego:', peitinGalego);
    
    let opcoesExtras = [];
    if (marretadaThor) opcoesExtras.push('Marretada do Thor');
    if (peitinGalego) opcoesExtras.push('Peitin do Galego');
    
    const opcoesTexto = opcoesExtras.length > 0 ? opcoesExtras.join(', ') : 'Nenhuma';
    
    console.log('Opções selecionadas:', opcoesTexto);
    
    document.getElementById('form_nome').value = formData.nome;
    document.getElementById('form_email').value = formData.email;
    document.getElementById('form_matricula').value = formData.matricula;
    document.getElementById('form_whatsapp').value = formData.whatsapp;
    document.getElementById('form_termos').value = 'Aceito';
    document.getElementById('form_opcoes').value = opcoesTexto;
    
    const formsubmit = document.getElementById('formsubmit');
    const formDataToSend = new FormData(formsubmit);
    
    for (let [key, value] of formDataToSend.entries()) {
        console.log(key + ':', value);
    }
    
    fetch(formsubmit.action, {
        method: 'POST',
        body: formDataToSend,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        console.log('Resposta do servidor:', response.status);
        if (response.ok) {
            mostrarMensagem('Formulário enviado com sucesso!', 'sucesso');
        }
    }).catch(error => {
        mostrarMensagem('Erro ao enviar o formulário. Tente novamente.', 'erro');
    });
    
    page2.style.display = 'none';
    page3.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

function mostrarMensagem(texto, tipo) {
    const mensagemDiv = document.getElementById('mensagem');
    if (mensagemDiv) {
        mensagemDiv.textContent = texto;
        mensagemDiv.className = `mensagem ${tipo}`;
        mensagemDiv.style.display = 'block';
        
        setTimeout(() => {
            mensagemDiv.style.display = 'none';
        }, 5000);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
inputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value.trim() !== '') {
            this.style.borderColor = 'var(--accent-color)';
        } else {
            this.style.borderColor = '#384C73';
        }
    });
});

function copyToClipboard() {
    const pixKey = document.getElementById('pixKey');
    const textToCopy = pixKey.value;
    
    navigator.clipboard.writeText(textToCopy).then(function() {
        mostrarMensagem('✅ Chave PIX copiada com sucesso!', 'sucesso');
        
        const copyBtn = document.querySelector('.copy-btn');
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span class="copy-icon">✅</span>Copiado!';
        copyBtn.style.background = '#25D366';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = '';
        }, 2000);
    }).catch(function(err) {
        mostrarMensagem('❌ Erro ao copiar. Tente novamente.', 'erro');
    });
}
