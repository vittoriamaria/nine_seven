// ==================== BASE DE DADOS DOS PRODUTOS ====================
const produtos = [
    { id: 1, nome: "Anel Curve", preco: 189.90, preco_original: 259.90, categoria: "anel", imagem: "imagens/anel_curve.png", destaque: true, sale: true, desconto: 27 },
    { id: 2, nome: "Pulseira Disco", preco: 149.90, preco_original: 219.90, categoria: "pulseira", imagem: "imagens/pulseira_disco_polido.png", destaque: true, sale: true, desconto: 32 },
    { id: 3, nome: "Colar Quartz", preco: 229.90, preco_original: 329.90, categoria: "colar", imagem: "imagens/colar_pontodeluz.png", destaque: true, sale: false, desconto: 0 },
    { id: 4, nome: "Brincos Cascata", preco: 99.90, preco_original: 149.90, categoria: "brincos", imagem: "imagens/brinco_cascata.png", destaque: true, sale: false, desconto: 0 },
    { id: 5, nome: "Anel Gema", preco: 159.90, preco_original: 229.90, categoria: "anel", imagem: "imagens/anel_gema.png", destaque: false, sale: true, desconto: 30 },
    { id: 6, nome: "Pulseira Elos", preco: 199.90, preco_original: 289.90, categoria: "pulseira", imagem: "imagens/pulseira_elos.png", destaque: false, sale: true, desconto: 31 },
    { id: 7, nome: "Colar Riviera", preco: 279.90, preco_original: 399.90, categoria: "colar", imagem: "imagens/colar_riviera.png", destaque: false, sale: false, desconto: 0 },
    { id: 8, nome: "Brincos Gardênia", preco: 129.90, preco_original: 189.90, categoria: "brincos", imagem: "imagens/brinco_flor.png", destaque: false, sale: true, desconto: 32 },
    { id: 9, nome: "Anel Quartz", preco: 139.90, preco_original: 199.90, categoria: "anel", imagem: "imagens/anel_solitario.png", destaque: false, sale: false, desconto: 0 },
    { id: 10, nome: "Pulseira Correntes", preco: 179.90, preco_original: 259.90, categoria: "pulseira", imagem: "imagens/pulseira_rivieira.png", destaque: false, sale: true, desconto: 31 },
    { id: 11, nome: "Colar Ponto de Luz", preco: 259.90, preco_original: 369.90, categoria: "colar", imagem: "imagens/colar_pontosluz.png", destaque: false, sale: false, desconto: 0 },
    { id: 12, nome: "Brincos Ponto de Luz", preco: 89.90, preco_original: 139.90, categoria: "brincos", imagem: "imagens/brinco_pontodeluz.png", destaque: false, sale: true, desconto: 36 }
];

// ==================== CARRINHO ====================
let carrinho = [];

function carregarCarrinho() {
    const saved = localStorage.getItem("nineSevenCart");
    if(saved) carrinho = JSON.parse(saved);
    atualizarContadorCarrinho();
    renderizarCarrinhoSidebar();
}

function salvarCarrinho() {
    localStorage.setItem("nineSevenCart", JSON.stringify(carrinho));
}

function atualizarContadorCarrinho() {
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.innerText = totalItens);
}

function renderizarCarrinhoSidebar() {
    const container = document.getElementById('cart-items');
    if(!container) return;
    
    if(carrinho.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 2rem;">Seu carrinho está vazio.</p>';
        document.getElementById('cart-total').innerText = '0.00';
        return;
    }
    
    let html = '';
    let total = 0;
    carrinho.forEach((item) => {
        total += item.preco * item.quantidade;
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <p><strong>${item.nome}</strong></p>
                    <p>R$ ${item.preco.toFixed(2)} x ${item.quantidade}</p>
                    <p style="font-size: 0.8rem; color: #666;">Total: R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
    });
    
    container.innerHTML = html;
    document.getElementById('cart-total').innerText = total.toFixed(2);
    
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => removerDoCarrinho(parseInt(btn.dataset.id)));
    });
}

function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho();
    atualizarContadorCarrinho();
    renderizarCarrinhoSidebar();
}

function adicionarAoCarrinho(produto) {
    const existente = carrinho.find(item => item.id === produto.id);
    if(existente) {
        existente.quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }
    salvarCarrinho();
    atualizarContadorCarrinho();
    renderizarCarrinhoSidebar();
    
    const mensagem = document.createElement('div');
    mensagem.textContent = `${produto.nome} adicionado ao carrinho!`;
    mensagem.style.cssText = `position: fixed; bottom: 20px; right: 20px; background: #000; color: #fff; padding: 12px 24px; border-radius: 4px; z-index: 2000; animation: fadeInOut 2s ease;`;
    document.body.appendChild(mensagem);
    setTimeout(() => mensagem.remove(), 2000);
}

// ==================== CHECKOUT COM FORMULÁRIO MODAL ====================
function finalizarCompraWhatsApp() {
    if(carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return false;
    }

    // Cria o modal dinamicamente
    const modal = document.createElement('div');
    modal.id = 'checkout-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    `;

    modal.innerHTML = `
        <div style="background: white; max-width: 500px; width: 90%; padding: 2rem; border-radius: 8px; position: relative;">
            <h3 style="margin-bottom: 1rem;">Complete seus dados</h3>
            <form id="dados-cliente-form">
                <div style="margin-bottom: 1rem;">
                    <label>Nome completo *</label>
                    <input type="text" id="cliente-nome" required style="width:100%; padding: 8px; margin-top: 4px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label>Telefone (com DDD) *</label>
                    <input type="tel" id="cliente-telefone" required style="width:100%; padding: 8px; margin-top: 4px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label>Endereço completo *</label>
                    <textarea id="cliente-endereco" rows="2" required style="width:100%; padding: 8px; margin-top: 4px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
                </div>
                <div style="margin-bottom: 1rem;">
                    <label>Forma de pagamento *</label>
                    <select id="cliente-pagamento" required style="width:100%; padding: 8px; margin-top: 4px; border: 1px solid #ccc; border-radius: 4px;">
                        <option value="">Selecione</option>
                        <option>Cartão de crédito</option>
                        <option>Cartão de débito</option>
                        <option>PIX</option>
                        <option>Boleto</option>
                    </select>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button type="button" id="fechar-modal" style="background: #ccc; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Cancelar</button>
                    <button type="submit" style="background: #25D366; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Enviar pedido via WhatsApp</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const form = modal.querySelector('#dados-cliente-form');
    const fecharBtn = modal.querySelector('#fechar-modal');

    fecharBtn.addEventListener('click', () => modal.remove());

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('cliente-nome').value.trim();
        const telefone = document.getElementById('cliente-telefone').value.trim();
        const endereco = document.getElementById('cliente-endereco').value.trim();
        const pagamento = document.getElementById('cliente-pagamento').value;

        if (!nome || !telefone || !endereco || !pagamento) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Montar mensagem completa
        let mensagem = "🛍️ *NOVO PEDIDO - NINE SEVEN* 🛍️\n\n";
        mensagem += "*PRODUTOS:*\n";
        let total = 0;
        carrinho.forEach(item => {
            const subtotal = item.preco * item.quantidade;
            total += subtotal;
            mensagem += `- ${item.nome} | ${item.quantidade}x | R$ ${item.preco.toFixed(2)} = R$ ${subtotal.toFixed(2)}\n`;
        });
        mensagem += `\n*TOTAL: R$ ${total.toFixed(2)}*\n\n`;
        mensagem += "------------------------------------\n";
        mensagem += "*DADOS DO CLIENTE:*\n";
        mensagem += `Nome: ${nome}\n`;
        mensagem += `Telefone: ${telefone}\n`;
        mensagem += `Endereço: ${endereco}\n`;
        mensagem += `Forma de pagamento: ${pagamento}\n\n`;
        mensagem += "💎 *Nine Seven - Enalteça o seu brilho!*";

        const textoCodificado = encodeURIComponent(mensagem);
        const numeroWhatsApp = "5583981694919";
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${textoCodificado}`;

        window.open(urlWhatsApp, '_blank');

        // Limpar carrinho e fechar modal
        carrinho = [];
        salvarCarrinho();
        atualizarContadorCarrinho();
        renderizarCarrinhoSidebar();
        modal.remove();

        alert("✅ Pedido enviado! Obrigada por escolher a Nine Seven!");
    });
}

// ==================== MENSAGENS DE CONTATO ====================
function salvarMensagemContato(dados) {
    let mensagens = JSON.parse(localStorage.getItem('nineSevenMensagens') || '[]');
    const novaMensagem = {
        id: Date.now(),
        ...dados,
        data: new Date().toLocaleString('pt-BR'),
        lida: false
    };
    mensagens.unshift(novaMensagem);
    localStorage.setItem('nineSevenMensagens', JSON.stringify(mensagens));
}

function enviarMensagemWhatsApp(dados) {
    const numeroEmpresa = "5583981694919";
    
    const mensagem = `
🆕 *NOVA MENSAGEM DO SITE NINE SEVEN*
━━━━━━━━━━━━━━━━━━━━━

👤 *NOME:* ${dados.nome}
📧 *E-MAIL:* ${dados.email}
📱 *TELEFONE:* ${dados.telefone || "Não informado"}

💬 *MENSAGEM:*
${dados.mensagem}

━━━━━━━━━━━━━━━━━━━━━
📅 Data: ${new Date().toLocaleString('pt-BR')}
🌐 Enviado pelo site Nine Seven
    `;
    
    const textoCodificado = encodeURIComponent(mensagem);
    const urlWhatsApp = `https://wa.me/${numeroEmpresa}?text=${textoCodificado}`;
    
    window.open(urlWhatsApp, '_blank');
    
    return { success: true };
}

// ==================== FORMULÁRIO DE CONTATO ====================
function inicializarFormContato() {
    const form = document.getElementById('form-contato');
    if(!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('nome-contato')?.value.trim() || '';
        const email = document.getElementById('email-contato')?.value.trim() || '';
        const telefone = document.getElementById('telefone-contato')?.value.trim() || '';
        const mensagem = document.getElementById('msg-contato')?.value.trim() || '';
        const feedback = document.getElementById('form-feedback');
        
        if(!nome) return mostrarErro(feedback, 'Preencha seu nome');
        if(!email || !email.includes('@')) return mostrarErro(feedback, 'E-mail inválido');
        if(!mensagem || mensagem.length < 10) return mostrarErro(feedback, 'Mensagem deve ter pelo menos 10 caracteres');
        
        const dados = { nome, email, telefone, mensagem };
        
        salvarMensagemContato(dados);
        enviarMensagemWhatsApp(dados);
        
        feedback.innerHTML = '<p style="color: #28a745; background: #d4edda; padding: 1rem; border-radius: 4px;">✅ Mensagem enviada! Entraremos em contato pelo WhatsApp em breve.</p>';
        form.reset();
        
        setTimeout(() => feedback.innerHTML = '', 5000);
    });
}

function mostrarErro(feedback, mensagem) {
    feedback.innerHTML = `<p style="color: #d9534f; background: #f8d7da; padding: 1rem; border-radius: 4px;">❌ ${mensagem}</p>`;
    setTimeout(() => { if(feedback.innerHTML.includes(mensagem)) feedback.innerHTML = ''; }, 3000);
}

// ==================== RENDERIZAÇÃO DE PRODUTOS ====================
function renderizarProdutos(containerId, filtroCategoria = null, apenasSale = false, apenasDestaque = false) {
    let produtosFiltrados = [...produtos];
    
    if(apenasSale) produtosFiltrados = produtosFiltrados.filter(p => p.sale === true);
    else if(apenasDestaque) produtosFiltrados = produtosFiltrados.filter(p => p.destaque === true);
    else if(filtroCategoria && filtroCategoria !== 'todos') produtosFiltrados = produtosFiltrados.filter(p => p.categoria === filtroCategoria);
    
    const container = document.getElementById(containerId);
    if(!container) return;
    
    if(produtosFiltrados.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 3rem;">Nenhum produto encontrado.</p>';
        return;
    }
    
    container.innerHTML = produtosFiltrados.map(prod => {
        if(prod.sale === true) {
            const original = prod.preco_original || (prod.preco / 0.7);
            const desconto = prod.desconto || Math.round((1 - prod.preco / original) * 100);
            
            return `
                <div class="product-card">
                    <img src="${prod.imagem}" alt="${prod.nome}" class="product-img">
                    <h3 class="product-name">${prod.nome}</h3>
                    <div class="price-box">
                        <span class="price-old">De: R$ ${original.toFixed(2)}</span>
                        <span class="price-sale">Por: R$ ${prod.preco.toFixed(2)}</span>
                    </div>
                    <span class="sale-badge">🔥 ${desconto}% OFF</span>
                    <button class="btn-buy" data-id="${prod.id}" data-nome="${prod.nome}" data-preco="${prod.preco}" data-imagem="${prod.imagem}">
                        Adicionar ao Carrinho
                    </button>
                </div>
            `;
        }
        
        return `
            <div class="product-card">
                <img src="${prod.imagem}" alt="${prod.nome}" class="product-img">
                <h3 class="product-name">${prod.nome}</h3>
                <p class="price-normal">R$ ${prod.preco.toFixed(2)}</p>
                <button class="btn-buy" data-id="${prod.id}" data-nome="${prod.nome}" data-preco="${prod.preco}" data-imagem="${prod.imagem}">
                    Adicionar ao Carrinho
                </button>
            </div>
        `;
    }).join('');
    
    document.querySelectorAll(`#${containerId} .btn-buy`).forEach(btn => {
        btn.addEventListener('click', () => {
            adicionarAoCarrinho({
                id: parseInt(btn.dataset.id),
                nome: btn.dataset.nome,
                preco: parseFloat(btn.dataset.preco),
                imagem: btn.dataset.imagem
            });
        });
    });
}

function inicializarFiltros() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if(!filterButtons.length) return;
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderizarProdutos('produtos-lista', btn.dataset.cat);
        });
    });
}

// ==================== MENU, CARRINHO, CARROSSEL ====================
function inicializarMenuHamburguer() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if(!hamburger || !navMenu) return;
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    document.querySelectorAll('.nav-menu ul li a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

function inicializarCartSidebar() {
    const cartIcon = document.getElementById('cart-icon');
    const cartIconMobile = document.getElementById('cart-icon-mobile');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCart = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if(!cartSidebar) return;
    
    function openCart() {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeCartFunc() {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if(cartIcon) cartIcon.addEventListener('click', openCart);
    if(cartIconMobile) cartIconMobile.addEventListener('click', openCart);
    if(closeCart) closeCart.addEventListener('click', closeCartFunc);
    if(cartOverlay) cartOverlay.addEventListener('click', closeCartFunc);
    if(checkoutBtn) checkoutBtn.addEventListener('click', () => { finalizarCompraWhatsApp(); closeCartFunc(); });
}

class HeroSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length;
        if(this.slides.length) this.init();
    }
    init() {
        this.createDots();
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.getElementById('prevSlide');
        this.nextBtn = document.getElementById('nextSlide');
        if(this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
        if(this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.dots.forEach((dot, index) => dot.addEventListener('click', () => this.goToSlide(index)));
        this.startAutoPlay();
    }
    createDots() {
        const dotsContainer = document.getElementById('sliderDots');
        if(!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for(let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if(i === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        }
    }
    updateSlides() {
        this.slides.forEach((slide, index) => slide.classList.toggle('active', index === this.currentSlide));
        if(this.dots) this.dots.forEach((dot, index) => dot.classList.toggle('active', index === this.currentSlide));
    }
    nextSlide() { this.currentSlide = (this.currentSlide + 1) % this.totalSlides; this.updateSlides(); this.resetAutoPlay(); }
    prevSlide() { this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides; this.updateSlides(); this.resetAutoPlay(); }
    goToSlide(index) { if(index >= 0 && index < this.totalSlides) { this.currentSlide = index; this.updateSlides(); this.resetAutoPlay(); } }
    startAutoPlay() { if(this.autoPlay) clearInterval(this.autoPlay); this.autoPlay = setInterval(() => this.nextSlide(), 5000); }
    resetAutoPlay() { clearInterval(this.autoPlay); this.startAutoPlay(); }
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinho();
    
    const path = window.location.pathname;
    if(path.includes('produtos.html')) {
        renderizarProdutos('produtos-lista', 'todos');
        inicializarFiltros();
    } else if(path.includes('sale.html')) {
        renderizarProdutos('sale-products', null, true);
    } else if(path.includes('index.html') || path === '/' || path.endsWith('/nine-seven/')) {
        renderizarProdutos('featured-products', null, false, true);
    } else {
        if(document.getElementById('featured-products')) renderizarProdutos('featured-products', null, false, true);
        if(document.getElementById('sale-products')) renderizarProdutos('sale-products', null, true);
        if(document.getElementById('produtos-lista')) {
            renderizarProdutos('produtos-lista', 'todos');
            inicializarFiltros();
        }
    }
    
    inicializarMenuHamburguer();
    inicializarCartSidebar();
    inicializarFormContato();
    new HeroSlider();
});

const style = document.createElement('style');
style.textContent = `@keyframes fadeInOut { 0% { opacity: 0; transform: translateY(20px); } 15% { opacity: 1; transform: translateY(0); } 85% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-20px); } }`;
document.head.appendChild(style);