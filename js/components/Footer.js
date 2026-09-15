/**
 * TRADITION IA - FOOTER COMPONENT
 */

export function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-grid">
          <!-- Col 1: Brand -->
          <div class="footer-col footer-col-brand">
            <a href="index.html" class="footer-brand">
              <img src="images/tradiia_icon.png" alt="Tradition IA Logo" class="footer-logo-img" />
              <span class="footer-brand-title">Tradition<span class="highlight">IA</span></span>
            </a>
            <p class="footer-tagline">
              Plateforme intelligente dédiée à la traduction, l'apprentissage et la préservation du patrimoine linguistique.
            </p>
          </div>

          <!-- Col 2: Produit -->
          <div class="footer-col">
            <h4 class="footer-heading">Produit</h4>
            <ul class="footer-links">
              <li><a href="index.html">Accueil</a></li>
              <li><a href="translate.html">Traduction</a></li>
              <li><a href="ai-assistant.html">Assistant IA</a></li>
              <li><a href="dictionary.html">Dictionnaire</a></li>
              <li><a href="history.html">Historique</a></li>
            </ul>
          </div>

          <!-- Col 3: Ressources -->
          <div class="footer-col">
            <h4 class="footer-heading">Ressources</h4>
            <ul class="footer-links">
              <li><a href="profile.html">Mon Compte</a></li>
              <li><a href="javascript:void(0)">Guide d'utilisation</a></li>
              <li><a href="javascript:void(0)">Foire Aux Questions (FAQ)</a></li>
              <li><a href="javascript:void(0)">Support & Contact</a></li>
            </ul>
          </div>

          <!-- Col 4: Légal & Sécurité -->
          <div class="footer-col">
            <h4 class="footer-heading">Légal & Sécurité</h4>
            <ul class="footer-links">
              <li><a href="javascript:void(0)">Conditions d'utilisation</a></li>
              <li><a href="javascript:void(0)">Politique de confidentialité</a></li>
              <li><a href="javascript:void(0)">Mentions légales</a></li>
              <li><a href="admin.html">Administration</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-divider"></div>

        <div class="footer-bottom">
          <div class="footer-copyright">
            © 2026 <strong>Tradition IA</strong>. Tous droits réservés.
          </div>
          <div class="footer-legal-links">
            <a href="javascript:void(0)">Confidentialité</a>
            <span class="legal-separator">•</span>
            <a href="javascript:void(0)">CGU</a>
            <span class="legal-separator">•</span>
            <a href="javascript:void(0)">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}


