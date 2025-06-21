document.addEventListener('DOMContentLoaded', () => {
  // ============ 1. ANIMAÇÃO DOS ELEMENTOS DECORATIVOS ============
  // Animação do sol (flutuante)
  gsap.to(".decor-sun", {
    duration: 8,
    y: 20,
    rotation: 360,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // Animação do coração (pulsante)
  gsap.to(".decor-heart", {
    duration: 3,
    scale: 1.1,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
  });

  // Animação da lua (flutuante suave)
  gsap.to(".decor-moon", {
    duration: 10,
    y: -15,
    x: 10,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // ============ 2. ANIMAÇÃO DO CONTEÚDO PRINCIPAL ============
  // Título + Imagem
  gsap.from(".donation-wrapper h1", {
    duration: 1,
    y: 40,
    opacity: 0,
    ease: "back.out(1.2)"
  });

  gsap.from(".nurse-image", {
    duration: 1.2,
    x: -50,
    opacity: 0,
    ease: "power3.out"
  });

  // Texto descritivo
  gsap.from(".donation-description", {
    duration: 0.8,
    y: 30,
    opacity: 0,
    delay: 0.3,
    ease: "power2.out"
  });

  // ============ 3. ANIMAÇÃO DO FORMULÁRIO ============
  const formElements = document.querySelectorAll(".donation-form *:not(button)");
  
  gsap.from(".donation-form", {
    scrollTrigger: {
      trigger: ".donation-form",
      start: "top 70%"
    },
    duration: 0.5,
    opacity: 0,
    ease: "power2.inOut"
  });

  // Animação dos botões de valor
  gsap.from(".donation-options button", {
    scrollTrigger: {
      trigger: ".donation-options",
      start: "top 75%"
    },
    duration: 0.6,
    y: 30,
    opacity: 0,
    stagger: 0.1,
    ease: "back.out(1.5)"
  });

  // Efeito hover nos botões
  document.querySelectorAll(".donation-options button, .donate-other").forEach(button => {
    button.addEventListener("mouseenter", () => {
      gsap.to(button, {
        duration: 0.2,
        scale: 1.05,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        ease: "power2.out"
      });
    });

    button.addEventListener("mouseleave", () => {
      gsap.to(button, {
        duration: 0.2,
        scale: 1,
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        ease: "power2.out"
      });
    });
  });

  // Entrada dos campos do formulário
  gsap.from(formElements, {
    scrollTrigger: {
      trigger: ".donation-form",
      start: "top 60%"
    },
    duration: 0.8,
    y: 20,
    opacity: 0,
    stagger: 0.05,
    ease: "power2.out"
  });

  // ============ 4. ANIMAÇÃO DO FOOTER ============
  gsap.from(".footer-container", {
    scrollTrigger: {
      trigger: ".site-footer",
      start: "top 90%"
    },
    duration: 1,
    y: 40,
    opacity: 0,
    ease: "power2.out"
  });
});