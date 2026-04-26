feather.replace();

const API = "https://api.voluntariosdasaude.com.br/api/dashboard";
const token = localStorage.getItem("token");
let formularioSelecionado = {};

// Estado global dos dados e filtros
let dadosOriginais = { voluntarios: [], doancoesMensais: [], faleConosco: [] };
let ordenacaoAtual = null;   // null | 'data' | 'alfabetico'
let direcaoAtual = 'desc';   // 'asc' | 'desc'

if (!token) {
  alert("Você não está logado.");
  window.location.href = "http://voluntariosdasaude.com.br/login.html";
}

// ─── Carregar formulários ────────────────────────────────────────────────────

async function carregarFormularios() {
  const lista = document.getElementById("lista");
  lista.innerHTML = `<div class="loading"><i data-feather="loader"></i><p>Carregando formulários...</p></div>`;
  feather.replace();

  try {
    const res = await fetch(`${API}/formularios`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const dados = await res.json();

    dadosOriginais = {
      voluntarios:    dados.voluntarios    || [],
      doancoesMensais: dados.doancoesMensais || [],
      faleConosco:    dados.faleConosco    || []
    };

    renderizarTudo();

  } catch (err) {
    lista.innerHTML = `<p class="error-msg">Erro ao carregar os dados.</p>`;
    console.error(err);
  }
}

// ─── Filtros e ordenação ─────────────────────────────────────────────────────

function aplicarFiltros() {
  const termo = document.getElementById("buscaEmail").value.trim().toLowerCase();

  // Mostra/oculta botão de limpar
  document.getElementById("btnLimparBusca").style.display = termo ? "flex" : "none";

  renderizarTudo(termo);
}

function ordenarPor(campo) {
  if (ordenacaoAtual === campo) {
    // Mesmo campo: inverte direção
    direcaoAtual = direcaoAtual === 'desc' ? 'asc' : 'desc';
  } else {
    ordenacaoAtual = campo;
    direcaoAtual = campo === 'data' ? 'desc' : 'asc'; // data: mais recente primeiro; alfa: A→Z
  }

  atualizarBotoesOrdenacao();

  const termo = document.getElementById("buscaEmail").value.trim().toLowerCase();
  renderizarTudo(termo);
}

function resetarFiltros() {
  ordenacaoAtual = null;
  direcaoAtual = 'desc';
  document.getElementById("buscaEmail").value = "";
  document.getElementById("btnLimparBusca").style.display = "none";
  atualizarBotoesOrdenacao();
  renderizarTudo("");
}

function limparBusca() {
  document.getElementById("buscaEmail").value = "";
  document.getElementById("btnLimparBusca").style.display = "none";
  renderizarTudo("");
}

function atualizarBotoesOrdenacao() {
  const btnData = document.getElementById("btnData");
  const btnAlfa = document.getElementById("btnAlfabetico");
  const iconData = document.getElementById("iconData");
  const iconAlfa = document.getElementById("iconAlfabetico");

  btnData.classList.toggle("ativo", ordenacaoAtual === 'data');
  btnAlfa.classList.toggle("ativo", ordenacaoAtual === 'alfabetico');

  iconData.textContent = (ordenacaoAtual === 'data' && direcaoAtual === 'asc') ? '↑' : '↓';
  iconAlfa.textContent = (ordenacaoAtual === 'alfabetico' && direcaoAtual === 'desc') ? '↓' : '↑';
}

// ─── Ordenar array ───────────────────────────────────────────────────────────

function ordenarArray(arr) {
  if (!arr || arr.length === 0) return arr;

  const copia = [...arr];

  if (ordenacaoAtual === 'data') {
    copia.sort((a, b) => {
      const da = new Date(a.createdAt || a.created_at || a.data || 0);
      const db = new Date(b.createdAt || b.created_at || b.data || 0);
      return direcaoAtual === 'desc' ? db - da : da - db;
    });
  }

  if (ordenacaoAtual === 'alfabetico') {
    copia.sort((a, b) => {
      const na = (a.nome || a.nomeCompleto || a.nome_completo || "").toLowerCase();
      const nb = (b.nome || b.nomeCompleto || b.nome_completo || "").toLowerCase();
      return direcaoAtual === 'asc' ? na.localeCompare(nb) : nb.localeCompare(na);
    });
  }

  return copia;
}

// ─── Filtrar por e-mail ──────────────────────────────────────────────────────

function filtrarPorEmail(arr, termo) {
  if (!termo) return arr;
  return arr.filter(item => {
    const email = (item.email || item.e_mail || "").toLowerCase();
    return email.includes(termo);
  });
}

// ─── Render principal ────────────────────────────────────────────────────────

function renderizarTudo(termo = "") {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const secoes = [
    { titulo: "Seja Voluntário",  icone: "briefcase",     chave: "voluntarios" },
    { titulo: "Doação Mensal",    icone: "heart",          chave: "doancoesMensais" },
    { titulo: "Fale Conosco",     icone: "message-square", chave: "faleConosco" }
  ];

  secoes.forEach(({ titulo, icone, chave }) => {
    const filtrado  = filtrarPorEmail(dadosOriginais[chave], termo);
    const ordenado  = ordenarArray(filtrado);
    montarSecao(titulo, icone, ordenado, termo);
  });
}

// ─── Montar seção de cards ───────────────────────────────────────────────────

function montarSecao(titulo, icone, data, termoBusca = "") {
  const container = document.getElementById("lista");
  const section   = document.createElement("div");
  section.className = "form-section";

  const count = data ? data.length : 0;
  section.innerHTML = `
    <h2 class="section-title">
      <i data-feather="${icone}"></i> ${titulo}
      <span class="badge">${count} registro${count !== 1 ? 's' : ''}</span>
    </h2>
    <div class="cards-grid"></div>
  `;
  container.appendChild(section);
  const grid = section.querySelector(".cards-grid");

  if (!data || data.length === 0) {
    grid.innerHTML = `<p class="empty-message">Nenhum registro encontrado.</p>`;
    feather.replace();
    return;
  }

  data.forEach(item => {
    const nome      = item.nome || item.nomeCompleto || item.nome_completo || "-";
    const email     = item.email || item.e_mail || "-";
    const telefone  = item.telefone || item.whatsapp || "-";
    const mensagem  = item.mensagem || item.obs || "-";
    const dataEnvio = item.createdAt || item.created_at || item.data || null;

    // Destaque do e-mail se corresponde à busca
    const emailDisplay = termoBusca && email.toLowerCase().includes(termoBusca)
      ? email.replace(
          new RegExp(`(${termoBusca})`, 'gi'),
          '<mark class="highlight">$1</mark>'
        )
      : email;

    const card = document.createElement("div");
    card.className = "card";

    // Borda de destaque se e-mail corresponde à busca
    if (termoBusca && email.toLowerCase().includes(termoBusca)) {
      card.classList.add("card-destaque");
    }

    card.onclick = () => {
      formularioSelecionado = { nome, email, telefone, mensagemOriginal: mensagem, nomeFormulario: titulo };
      document.getElementById("emailDestino").value = email;
      document.getElementById("emailDestino").focus();
      alert("Formulário carregado e pronto para responder!");
    };

    // Formatação da data
    const dataFormatada = dataEnvio
      ? new Date(dataEnvio).toLocaleString("pt-BR", {
          day: "2-digit", month: "2-digit", year: "numeric",
          hour: "2-digit", minute: "2-digit"
        })
      : null;

    card.innerHTML = `
      <div class="card-header">
        <h3>${nome}</h3>
        <i data-feather="user"></i>
      </div>
      <div class="card-body">
        <div class="info-line"><i data-feather="mail"></i><span class="email-chip">${emailDisplay}</span></div>
        <div class="info-line"><i data-feather="phone"></i><span>${telefone}</span></div>
        ${dataFormatada ? `<div class="info-line"><i data-feather="clock"></i><span class="data-envio">${dataFormatada}</span></div>` : ""}
        <div class="info-line message"><i data-feather="message-circle"></i><p>${mensagem.substring(0, 120)}${mensagem.length > 120 ? '...' : ''}</p></div>
      </div>
    `;
    grid.appendChild(card);
  });

  feather.replace();
}

// ─── Enviar e-mail ───────────────────────────────────────────────────────────

async function enviarEmail() {
  const email    = document.getElementById("emailDestino").value.trim();
  const assunto  = document.getElementById("assunto").value.trim();
  const mensagem = document.getElementById("mensagem").value.trim();

  if (!email || !assunto || !mensagem) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const res = await fetch(`${API}/email`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        assunto,
        mensagem,
        nomeFormulario:   formularioSelecionado.nomeFormulario,
        nome:             formularioSelecionado.nome,
        telefone:         formularioSelecionado.telefone,
        mensagemOriginal: formularioSelecionado.mensagemOriginal
      })
    });

    const text = await res.text();

    if (!res.ok) {
      console.warn("Erro da API (ignorado):", text);
    }

    alert("E-mail enviado com sucesso!");
    document.getElementById("assunto").value  = "";
    document.getElementById("mensagem").value = "";

  } catch (err) {
    console.error(err);
    alert("Erro real ao enviar (problema de conexão).");
  }
}

// ─── Inicializar ─────────────────────────────────────────────────────────────
carregarFormularios();