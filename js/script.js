const divTexto = document.querySelector('#divtexto');
const h2Elements = divTexto.querySelectorAll('h2');

// Armazena os conteúdos originais de cada h2
const originalTexts = Array.from(h2Elements).map(el => el.innerHTML);

// Limpa os h2 antes do efeito
h2Elements.forEach(el => el.innerHTML = '');

// Função do efeito typewriter
function typeWriterWithHTML(element, html, speed = 30, callback = null) {
    let i = 0;
    let tempHTML = '';
    let inTag = false;

    function writeChar() {
        if (i < html.length) {
            if (html[i] === '<') inTag = true;
            if (html[i] === '>') inTag = false;

            tempHTML += html[i];
            element.innerHTML = tempHTML + (inTag ? '' : '<span class="cursor">|</span>');
            i++;
            setTimeout(writeChar, inTag ? speed / 3 : speed);
        } else {
            element.innerHTML = tempHTML;
            if (callback) callback();
        }
    }

    writeChar();
}

// Executa os dois typewriters em sequência
window.addEventListener('load', () => {
    typeWriterWithHTML(h2Elements[0], originalTexts[0], 50, () => {
        typeWriterWithHTML(h2Elements[1], originalTexts[1], 50);
    });
});

// Menu toggle
const toggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

if (toggle && nav) {
    toggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}