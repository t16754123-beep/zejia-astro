import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/offcanvas';
import Swiper from 'swiper';
import {Autoplay, Navigation, Pagination} from 'swiper/modules';

const header = document.querySelector('#header');
function updateHeader() {
  header.classList.toggle('sf-header', window.scrollY > 0);
}
updateHeader();
window.addEventListener('scroll', updateHeader, {passive: true});

const banner = document.querySelector('.swiper-banner');
if (banner) {
  new Swiper(banner, {
    modules: [Autoplay, Navigation, Pagination],
    speed: 700,
    autoplay: {delay: 3000, reverseDirection: true},
    navigation: {prevEl: '#swiper-button-prev-banner', nextEl: '#swiper-button-next-banner'},
    pagination: {el: '#swiper-pagination-banner', clickable: true}
  });
}
document.querySelector('.dropdown-search')?.addEventListener('shown.bs.dropdown', () => document.querySelector('#searchKey').focus());
const backToTop = document.querySelector('.side-share .share-link');
const scrollUp = () => window.scrollTo({top: 0, behavior: 'smooth'});
backToTop?.addEventListener('click',scrollUp);
backToTop?.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollUp(); }
});
document.querySelector('[data-back]')?.addEventListener('click', e => {
  if (document.referrer && new URL(document.referrer).origin === location.origin) {
    e.preventDefault();
    history.back();
  }
});
const current = location.pathname.replace(/\/$/, '') || '/';
for (const link of document.querySelectorAll('.canvas-menu a')) {
  if (link.pathname === current) link.classList.add('active');
}

if (document.querySelector('.magiczoom')) {
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = '/plugins/magiczoom/magiczoomplus.min.css';
  document.head.append(style);
  // The gallery plugin expects the thumbnail to be a direct child of the link.
  for (const picture of document.querySelectorAll('.magiczoom picture')) {
    const img = picture.querySelector('img');
    if (matchMedia('(max-width: 991px)').matches) {
      img.src = picture.querySelector('source').srcset;
      picture.parentElement.href = img.src;
    }
    picture.replaceWith(img);
  }
  const script = document.createElement('script');
  script.src = '/plugins/magiczoom/magiczoomplus.js';
  document.head.append(script);
}
const form = document.querySelector('#form-feedback');
form?.addEventListener('submit', async e => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const button = form.querySelector('button[type=submit]');
  const status = form.querySelector('.feedback-result');
  button.disabled = true;
  try {
    const res = await fetch(form.action, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(Object.fromEntries(new FormData(form)))});
    status.textContent = res.status >= 500 ? '暂时无法保存，请稍后重试。' : await res.text();
    if (res.ok) form.reset();
  } catch {
    status.textContent = '网络连接失败，请重试。';
  } finally {
    form.elements.Captcha.value = '';
    form.querySelector('[data-name=captchacode]').click();
    button.disabled = false;
  }
});

