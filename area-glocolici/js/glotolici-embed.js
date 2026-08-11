(function () {
  'use strict';

  const scriptUrl = document.currentScript && document.currentScript.src;
  const appUrl = new URL('../index.html', scriptUrl || document.baseURI);
  const parameters = ['lang','theme','group','color','sort','q','continent','match','certainty'];
  const hostIsEmbed = new URLSearchParams(location.search).get('embed') === '1';

  class GlotoliciEmbed extends HTMLElement {
    static get observedAttributes() {
      return parameters;
    }

    constructor() {
      super();
      const root = this.attachShadow({ mode:'open' });
      root.innerHTML = `<style>
        :host{display:block;width:100%;height:100%;min-height:420px;background:transparent}
        .stage{position:relative;width:100%;height:100%;overflow:hidden;background:transparent}
        iframe{position:absolute;inset:0;display:block;width:100%;height:100%;border:0;background:transparent;opacity:0;pointer-events:none;transition:opacity .5s ease}
        iframe.active{opacity:1;pointer-events:auto}
        @media(prefers-reduced-motion:reduce){iframe{transition:none}}
      </style><div class="stage">
        <iframe title="Glotolici interactive visualization" loading="lazy"></iframe>
        <iframe title="Glotolici interactive visualization" loading="lazy"></iframe>
      </div>`;
      this.frames = [...root.querySelectorAll('iframe')];
      this.activeIndex = 0;
      this.loadToken = 0;
    }

    connectedCallback() {
      if (hostIsEmbed) return;
      this.update();
    }

    attributeChangedCallback() {
      if (!hostIsEmbed && this.isConnected) this.update();
    }

    configure(values) {
      this._configuring = true;
      parameters.forEach((name) => {
        const value = values[name];
        if (value === undefined || value === null || value === '') this.removeAttribute(name);
        else this.setAttribute(name, value);
      });
      this._configuring = false;
      this.update();
    }

    update() {
      if (hostIsEmbed || this._configuring) return;
      const url = new URL(appUrl);
      url.searchParams.set('embed', '1');
      parameters.forEach((name) => {
        if (this.hasAttribute(name)) url.searchParams.set(name, this.getAttribute(name));
      });
      const source = url.toString();
      const label = this.getAttribute('label');
      const activeFrame = this.frames[this.activeIndex];
      if (activeFrame.src === source) {
        if (label) activeFrame.title = label;
        return;
      }
      const nextIndex = this.activeIndex === 0 ? 1 : 0;
      const nextFrame = this.frames[nextIndex];
      const token = ++this.loadToken;
      nextFrame.classList.remove('active');
      if (label) nextFrame.title = label;
      nextFrame.onload = () => {
        if (token !== this.loadToken) return;
        activeFrame.classList.remove('active');
        nextFrame.classList.add('active');
        this.activeIndex = nextIndex;
      };
      nextFrame.src = source;
    }
  }

  if (!customElements.get('glotolici-embed')) customElements.define('glotolici-embed', GlotoliciEmbed);
})();
