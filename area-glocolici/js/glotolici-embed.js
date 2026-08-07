(function () {
  'use strict';

  const scriptUrl = document.currentScript && document.currentScript.src;
  const appUrl = new URL('../index.html', scriptUrl || document.baseURI);
  const parameters = ['lang','group','color','sort','q','continent','match','certainty'];
  const hostIsEmbed = new URLSearchParams(location.search).get('embed') === '1';

  class GlotoliciEmbed extends HTMLElement {
    static get observedAttributes() {
      return parameters;
    }

    constructor() {
      super();
      const root = this.attachShadow({ mode:'open' });
      root.innerHTML = `<style>
        :host{display:block;width:100%;height:100%;min-height:420px;background:#f7f5ef}
        iframe{display:block;width:100%;height:100%;border:0;background:#f7f5ef}
      </style><iframe title="Glotolici interactive visualization" loading="lazy"></iframe>`;
      this.frame = root.querySelector('iframe');
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
      if (this.frame.src !== source) this.frame.src = source;
      const label = this.getAttribute('label');
      if (label) this.frame.title = label;
    }
  }

  if (!customElements.get('glotolici-embed')) customElements.define('glotolici-embed', GlotoliciEmbed);
})();
