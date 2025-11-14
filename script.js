// Elementos do DOM
const mensagemDiv = document.getElementById('mensagem');

// Páginas
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const page3 = document.getElementById('page3');

// Botões
const btnPage1 = document.getElementById('btnPage1');
const btnPage2 = document.getElementById('btnPage2');

// Campos da página 1
const termosCheckbox = document.getElementById('termosCheckbox');

// Campos da página 2
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const matriculaInput = document.getElementById('matricula');
const whatsappInput = document.getElementById('whatsapp');

// Dados do formulário
let formData = {
    termos: false,
    nome: '',
    email: '',
    matricula: '',
    whatsapp: ''
};

// ============ PÁGINA 1: TERMOS ============

// Habilitar/desabilitar botão baseado no checkbox
termosCheckbox.addEventListener('change', function() {
    btnPage1.disabled = !this.checked;
    formData.termos = this.checked;
});

// Avançar para página 2
btnPage1.addEventListener('click', function() {
    if (termosCheckbox.checked) {
        page1.style.display = 'none';
        page2.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ============ PÁGINA 2: DADOS PESSOAIS ============

// Validação da matrícula (aceita números)
function validarMatricula(matricula) {
    const regex = /^\d{8,12}$/;
    return regex.test(matricula);
}

// Validação do WhatsApp (formato brasileiro)
function validarWhatsapp(whatsapp) {
    // Remove caracteres não numéricos
    const numeros = whatsapp.replace(/\D/g, '');
    // Deve ter 10 ou 11 dígitos (com ou sem 9 na frente)
    return numeros.length >= 10 && numeros.length <= 11;
}

// Validação de email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Verificar se todos os campos da página 2 estão preenchidos corretamente
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

// Adicionar listeners para validação em tempo real
nomeInput.addEventListener('input', verificarCamposPage2);
emailInput.addEventListener('input', verificarCamposPage2);
matriculaInput.addEventListener('input', verificarCamposPage2);
whatsappInput.addEventListener('input', function() {
    // Formatar WhatsApp enquanto digita
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

// Avançar para página 3
btnPage2.addEventListener('click', function() {
    formData.nome = nomeInput.value.trim();
    formData.email = emailInput.value.trim();
    formData.matricula = matriculaInput.value.trim();
    formData.whatsapp = whatsappInput.value.trim();

    console.log('Dados salvos:', formData);
    
    page2.style.display = 'none';
    page3.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Mostrar mensagem
function mostrarMensagem(texto, tipo) {
    mensagemDiv.textContent = texto;
    mensagemDiv.className = `mensagem ${tipo}`;
    mensagemDiv.style.display = 'block';
    
    setTimeout(() => {
        mensagemDiv.style.display = 'none';
    }, 5000);
}

// Adicionar animação de shake no CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Feedback visual para campos preenchidos
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

// Função para copiar a chave PIX
function copyToClipboard() {
    const pixKey = document.getElementById('pixKey');
    const textToCopy = pixKey.value;
    
    // Copiar para a área de transferência
    navigator.clipboard.writeText(textToCopy).then(function() {
        // Mostrar mensagem de sucesso
        mostrarMensagem('✅ Chave PIX copiada com sucesso!', 'sucesso');
        
        // Mudar temporariamente o botão
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
