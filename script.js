document.querySelectorAll('.faq-item button').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = answer.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach((other) => {
      other.querySelector('.faq-answer').classList.remove('open');
      other.querySelector('button').setAttribute('aria-expanded', 'false');
      other.querySelector('button i').textContent = '+';
    });

    if (!isOpen) {
      answer.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
      button.querySelector('i').textContent = '−';
    }
  });
});

/* ---- Modal with work examples ---- */
const exampleData = {
  visitka: {
    tag: 'Сайт-визитка',
    title: 'Пример: сайт-визитка',
    what: 'Концепт небольшого сайта для услуги, мастера или личного проекта. Такой формат подходит, когда нужно коротко рассказать о себе и дать человеку быстрый способ связаться.',
    does: 'Показывает кто вы, чем занимаетесь, какие услуги предлагаете и как с вами связаться. Без лишних страниц и сложной структуры.',
    useful: 'Такой сайт можно поставить в профиль, отправлять клиентам или использовать как аккуратную страницу о себе вместо пустой ссылки на соцсети.',
    link: '#services',
    shots: ['01 Первый экран', '02 Услуги / описание', '03 Контакты']
  },
  landing: {
    tag: 'Лендинг',
    title: 'Пример: лендинг',
    what: 'Концепт одностраничного сайта под конкретную услугу, продукт или предложение.',
    does: 'Понятно объясняет предложение, показывает основные преимущества, отвечает на частые вопросы и ведёт человека к контакту.',
    useful: 'Лендинг удобно отправлять клиентам, прикреплять в профиль или использовать как страницу для рекламы и презентации услуги.',
    link: '#services',
    shots: ['01 Hero-блок', '02 Преимущества', '03 Форма / FAQ']
  },
  visitkaForm: {
    tag: 'Визитка + Telegram',
    title: 'Пример: визитка + форма записи',
    what: 'Концепт сайта-визитки с простой формой записи в Telegram: человек оставляет имя, телефон и нужную услугу.',
    does: 'После отправки данные сразу приходят владельцу в Telegram. Дальше администратор, менеджер или сам владелец связывается с человеком.',
    useful: 'Подходит для салонов, мастеров, студий и небольших услуг, где важно быстро увидеть обращение и не потерять контакт.',
    link: '#contact',
    shots: ['01 Сайт-визитка', '02 Форма записи', '03 Заявка в Telegram']
  },
  landingForm: {
    tag: 'Лендинг + Telegram',
    title: 'Пример: лендинг + форма записи',
    what: 'Связка лендинга и формы записи: сайт рассказывает об услуге, а форма передаёт обращение прямо в Telegram.',
    does: 'Человек смотрит страницу, выбирает нужную услугу, оставляет контакт — и сообщение сразу приходит владельцу.',
    useful: 'Это простой вариант для бизнеса без сложной CRM: лендинг выглядит аккуратно, а обращения приходят туда, где удобно отвечать.',
    link: '#contact',
    shots: ['01 Лендинг', '02 Выбор услуги', '03 Telegram-уведомление']
  }
};

const modalOverlay = document.getElementById('exampleModal');
const modalGallery = document.getElementById('exampleModalGallery');
const modalTag = document.getElementById('exampleModalTag');
const modalTitle = document.getElementById('exampleModalTitle');
const modalWhat = document.getElementById('exampleModalWhat');
const modalDoes = document.getElementById('exampleModalDoes');
const modalUseful = document.getElementById('exampleModalUseful');
const modalLink = document.getElementById('exampleModalLink');
const modalClose = document.getElementById('exampleModalClose');
let lastFocusedTrigger = null;

function openExampleModal(key, trigger) {
  const item = exampleData[key];
  if (!item || !modalOverlay) return;
  lastFocusedTrigger = trigger || null;
  modalTag.textContent = item.tag;
  modalTitle.textContent = item.title;
  modalWhat.textContent = item.what;
  modalDoes.textContent = item.does;
  modalUseful.textContent = item.useful;
  if (modalLink) modalLink.href = item.link || '#';
  modalGallery.innerHTML = '';
  item.shots.forEach((label, index) => {
    const shot = document.createElement('div');
    shot.className = 'example-shot' + (index === 0 ? ' example-shot-large' : '');
    shot.innerHTML = '<span>' + label + '</span><small>Заменить на скрин проекта</small>';
    modalGallery.appendChild(shot);
  });
  modalOverlay.classList.add('open');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeExampleModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusedTrigger) lastFocusedTrigger.focus();
}

document.querySelectorAll('.example-trigger').forEach((btn) => {
  btn.addEventListener('click', () => openExampleModal(btn.dataset.example, btn));
});
if (modalClose) modalClose.addEventListener('click', closeExampleModal);
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeExampleModal();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) closeExampleModal();
});

/* ---- Contact form -> Telegram notification ---- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('contactFormStatus');
    const submitBtn = contactForm.querySelector('.contact-submit');
    const payload = {
      username: contactForm.username.value.trim(),
      need: contactForm.need.value.trim()
    };
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляю...';
    status.textContent = 'Отправляю...';
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('bad response');
      status.textContent = 'Заявка отправлена. Я напишу вам в Telegram.';
      contactForm.reset();
    } catch (err) {
      status.textContent = 'Не получилось отправить. Напишите мне напрямую в Telegram.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}
