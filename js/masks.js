/**
 * TRADITION IA - GABONESE MASKS & CULTURAL ICONOGRAPHY
 * Maps and renders real transparent Gabonese traditional masks (Fang, Punu, Nzébi, Myènè, Téké, Vili, Obamba, Guisir, Kota, Anglais)
 * Universal script compatible with file:// protocol and http:// servers
 */

(function (root) {
  const Masks = {
    /**
     * Get image path for a given language / ethnic mask (transparent PNGs)
     */
    getImage: function (variant) {
      if (!variant) return 'images/fang.png';

      const key = variant.toString().toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // removes accents

      switch (key) {
        case 'fang':
        case 'fan':
        case 'fang-beti':
          return 'images/fang.png';
        case 'punu':
        case 'puu':
        case 'yipunu':
          return 'images/punu.png';
        case 'nzebi':
        case 'nzb':
        case 'inzebi':
          return 'images/nzebi.png';
        case 'myene':
        case 'mye':
        case 'omyene':
          return 'images/myene.png';
        case 'teke':
        case 'tek':
        case 'iteke':
          return 'images/teke.png';
        case 'vili':
        case 'vif':
        case 'icivili':
          return 'images/vili.png';
        case 'obamba':
        case 'obb':
        case 'lembaama':
          return 'images/obamba.png';
        case 'guisir':
        case 'gisir':
        case 'gsi':
        case 'yigisir':
          return 'images/guisir.png';
        case 'kota':
        case 'kto':
        case 'ikota':
          return 'images/kota.png';
        case 'anglais':
        case 'english':
        case 'eng':
          return 'images/anglais.png';
        default:
          return 'images/fang.png';
      }
    },

    /**
     * Render transparent mask element floating seamlessly on the card
     * @param {string} variant - Name of the ethnic group or language
     * @param {number|string} size - Size in pixels (default 68)
     * @param {string} extraClass - Optional additional CSS class
     */
    render: function (variant, size, extraClass) {
      const v = variant || 'fang';
      const s = size || 68;
      const cls = extraClass || '';
      const imgUrl = this.getImage(v);
      const altText = 'Masque traditionnel ' + v;
      const dim = typeof s === 'number' ? s + 'px' : s;

      return '<div class="mask-img-wrapper ' + cls + '" style="width: ' + dim + '; height: ' + dim + '; min-width: ' + dim + '; min-height: ' + dim + ';">' +
        '<img src="' + imgUrl + '" alt="' + altText + '" class="mask-real-img" loading="lazy" onerror="this.onerror=null; this.src=\'images/fang.png\';" />' +
        '</div>';
    }
  };

  if (typeof window !== 'undefined') {
    window.Masks = Masks;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Masks;
  }
  if (typeof root !== 'undefined') {
    root.Masks = Masks;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
