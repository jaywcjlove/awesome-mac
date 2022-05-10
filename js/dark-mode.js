/**
 * @package @wcj/dark-mode@1.0.14
 * Web Component that toggles dark mode 🌒
 * Github: https://github.com/jaywcjlove/dark-mode.git
 * Website: https://jaywcjlove.github.io/dark-mode
 *
 * Licensed under the MIT license.
 * @license Copyright © 2022. Licensed under the MIT License
 * @author kenny wong <wowohoo@qq.com>
 */
const t = document;
const e = '_dark_mode_theme_';
const s = 'permanent';
const o = 'colorschemechange';
const i = 'permanentcolorscheme';
const h = 'light';
const r = 'dark';
const n = (t, e, s = e) => {
  Object.defineProperty(t, s, {
    enumerable: true,
    get() {
      const t = this.getAttribute(e);
      return t === null ? '' : t;
    },
    set(t) {
      this.setAttribute(e, t);
    },
  });
};
const c = (t, e, s = e) => {
  Object.defineProperty(t, s, {
    enumerable: true,
    get() {
      return this.hasAttribute(e);
    },
    set(t) {
      if (t) {
        this.setAttribute(e, '');
      } else {
        this.removeAttribute(e);
      }
    },
  });
};
class a extends HTMLElement {
  static get observedAttributes() {
    return ['mode', h, r, s];
  }
  LOCAL_NANE = e;
  constructor() {
    super();
    this.t();
  }
  connectedCallback() {
    n(this, 'mode');
    n(this, r);
    n(this, h);
    c(this, s);
    const a = localStorage.getItem(e);
    if (a && [h, r].includes(a)) {
      this.mode = a;
      this.permanent = true;
    }
    if (this.permanent && !a) {
      localStorage.setItem(e, this.mode);
    }
    const l = [h, r].includes(a);
    if (this.permanent && a) {
      this.o();
    } else {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.mode = r;
        this.o();
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        this.mode = h;
        this.o();
      }
    }
    if (!this.permanent && !l) {
      window.matchMedia('(prefers-color-scheme: light)').onchange = (t) => {
        this.mode = t.matches ? h : r;
        this.o();
      };
      window.matchMedia('(prefers-color-scheme: dark)').onchange = (t) => {
        this.mode = t.matches ? r : h;
        this.o();
      };
    }
    const d = new MutationObserver((s, h) => {
      this.mode = t.documentElement.dataset.colorMode;
      if (this.permanent && l) {
        localStorage.setItem(e, this.mode);
        this.i(i, { permanent: this.permanent });
      }
      this.h();
      this.i(o, { colorScheme: this.mode });
    });
    d.observe(t.documentElement, { attributes: true });
    this.i(o, { colorScheme: this.mode });
    this.h();
  }
  attributeChangedCallback(t, s, o) {
    if (t === 'mode' && s !== o && [h, r].includes(o)) {
      const t = localStorage.getItem(e);
      if (this.mode === t) {
        this.mode = o;
        this.h();
        this.o();
      } else if (this.mode && this.mode !== t) {
        this.h();
        this.o();
      }
    } else if ((t === h || t === r) && s !== o) {
      this.h();
    }
    if (t === 'permanent' && typeof this.permanent === 'boolean') {
      this.permanent ? localStorage.setItem(e, this.mode) : localStorage.removeItem(e);
    }
  }
  o() {
    t.documentElement.setAttribute('data-color-mode', this.mode);
  }
  h() {
    this.icon.textContent = this.mode === h ? '🌒' : '🌞';
    this.text.textContent = this.mode === h ? this.getAttribute(r) : this.getAttribute(h);
  }
  t() {
    var s = this.attachShadow({ mode: 'open' });
    this.label = t.createElement('span');
    this.label.setAttribute('class', 'wrapper');
    this.label.onclick = () => {
      this.mode = this.mode === h ? r : h;
      if (this.permanent) {
        localStorage.setItem(e, this.mode);
      }
      this.o();
      this.h();
    };
    s.appendChild(this.label);
    this.icon = t.createElement('span');
    this.label.appendChild(this.icon);
    this.text = t.createElement('span');
    this.label.appendChild(this.text);
    const o = `\n[data-color-mode*='dark'], [data-color-mode*='dark'] body {\n  color-scheme: dark;\n  --color-theme-bg: #0d1117;\n  --color-theme-text: #c9d1d9;\n  background-color: var(--color-theme-bg);\n  color: var(--color-theme-text);\n}\n\n[data-color-mode*='light'], [data-color-mode*='light'] body {\n  color-scheme: light;\n  --color-theme-bg: #fff;\n  --color-theme-text: #24292f;\n  background-color: var(--color-theme-bg);\n  color: var(--color-theme-text);\n}`;
    const i = '_dark_mode_style_';
    const n = t.getElementById(i);
    if (!n) {
      var c = t.createElement('style');
      c.id = i;
      c.textContent = o;
      t.head.appendChild(c);
    }
    var a = t.createElement('style');
    a.textContent = `\n    .wrapper { cursor: pointer; user-select: none; position: relative; }\n    .wrapper > span + span { margin-left: .4rem; }\n    `;
    s.appendChild(a);
  }
  i(t, e) {
    this.dispatchEvent(new CustomEvent(t, { bubbles: true, composed: true, detail: e }));
  }
}
customElements.define('dark-mode', a);
