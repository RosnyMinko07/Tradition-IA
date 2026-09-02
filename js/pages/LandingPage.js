/**
 * TRADITION IA - LANDING PAGE VIEW
 */

import { Store } from '../store.js';
const Masks = window.Masks || { render: (v, s) => `<div class="mask-img-wrapper" style="width:${s||72}px;height:${s||72}px"><img src="images/${(v||'fang').toLowerCase()}.png" class="mask-real-img"/></div>` };

export function renderLandingPage() {
  const languages = Store.languages;

  return `
    <main class="main-content" style="max-width: 1200px; margin: 0 auto; width: 100%;">
      <!-- Hero Section -->
      <section class="hero-section">
        <div>
          <span class="badge badge-green" style="margin-bottom: 16px;">IA & Patrimoine Culturel du Gabon</span>
          <h1 class="hero-title">Préserver & Traduire les <span>Langues Gabonaises</span></h1>
          <p class="hero-desc">
            Découvrez la première plateforme intelligente dédiée au Fang, Punu, Nzébi, Myènè, Téké, Vili, Obamba, Guisir et Kota du Gabon. Traduisez, apprenez et échangez avec notre assistant virtuel spécialisé.
          </p>
          <div class="hero-buttons">
            <a href="#translate" class="btn btn-primary" style="padding: 14px 28px; font-size: 1.05rem;">
              Commencer à Traduire ➔
            </a>
            <a href="#dictionary" class="btn btn-secondary" style="padding: 14px 24px; font-size: 1.05rem;">
              Explorer le Dictionnaire
            </a>
          </div>
        </div>

        <div class="hero-mask-display">
          <div class="hero-mask-glow"></div>
          <img src="images/gabon_masque_nobg.png" alt="Carte du Gabon et Masques Traditionnels" class="hero-gabon-map-img" />
        </div>
      </section>

      <!-- Statistiques -->
      <div class="grid-4" style="margin-top: 60px;">
        <div class="glass-card stat-card">
          <div>
            <div style="color: var(--text-muted); font-size: 0.85rem;">Langues Supportées</div>
            <div class="stat-val" style="color: var(--primary);">${languages.length}+</div>
          </div>
          <div class="stat-icon" style="background: rgba(0, 230, 118, 0.15); color: var(--primary);">🗣️</div>
        </div>
        <div class="glass-card stat-card">
          <div>
            <div style="color: var(--text-muted); font-size: 0.85rem;">Mots au Dictionnaire</div>
            <div class="stat-val" style="color: var(--blue);">5,240+</div>
          </div>
          <div class="stat-icon" style="background: rgba(33, 150, 243, 0.15); color: var(--blue);">📚</div>
        </div>
        <div class="glass-card stat-card">
          <div>
            <div style="color: var(--text-muted); font-size: 0.85rem;">Précision IA</div>
            <div class="stat-val" style="color: var(--gold);">94.2%</div>
          </div>
          <div class="stat-icon" style="background: rgba(255, 214, 0, 0.15); color: var(--gold);">⚡</div>
        </div>
        <div class="glass-card stat-card">
          <div>
            <div style="color: var(--text-muted); font-size: 0.85rem;">Traduction IA</div>
            <div class="stat-val" style="color: var(--text-main);">Instantanée</div>
          </div>
          <div class="stat-icon" style="background: rgba(255, 255, 255, 0.1); color: var(--text-main);">🤖</div>
        </div>
      </div>

      <!-- Grille des Langues -->
      <div style="margin-top: 80px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h2 style="font-size: 2.2rem; font-family: 'Space Grotesk', sans-serif;">Langues Locales du Gabon</h2>
          <p style="color: var(--text-muted);">Explorez la richesse linguistique des 9 provinces gabonaises</p>
        </div>
        <div class="grid-4">
          ${languages.map(l => `
            <div class="glass-card glass-card-interactive" style="padding: 22px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                  <div>${Masks.render(l.name.toLowerCase(), 72)}</div>
                  <span class="badge badge-green" style="font-size: 0.75rem; font-weight: 600;">${l.code ? l.code.toUpperCase() : 'GAB'}</span>
                </div>
                <h3 style="font-size: 1.25rem; margin-bottom: 4px; color: var(--text-main);">${l.name}</h3>
                <p style="font-size: 0.85rem; color: var(--primary); margin-bottom: 8px; font-weight: 500;">Nom natif: ${l.nativeName}</p>
                <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.45; min-height: 48px;">${l.description}</p>
              </div>
              <a href="#translate?target=${encodeURIComponent(l.name)}" class="btn btn-outline" style="width: 100%; margin-top: 16px; justify-content: center; font-size: 0.85rem;">Traduire le ${l.name}</a>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section Fonctionnalités -->
      <div style="margin-top: 80px; margin-bottom: 60px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h2 style="font-size: 2rem;">Pourquoi Tradition IA ?</h2>
        </div>
        <div class="grid-3">
          <div class="glass-card" style="padding: 28px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">🤖</div>
            <h3 style="font-size: 1.2rem; margin-bottom: 8px; color: var(--text-main);">Assistant IA Linguistique</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Discutez en langage naturel pour apprendre la grammaire, la culture et la prononciation des langues locales.</p>
          </div>
          <div class="glass-card" style="padding: 28px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">📖</div>
            <h3 style="font-size: 1.2rem; margin-bottom: 8px; color: var(--text-main);">Dictionnaire Collaboratif</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Consultez et enrichissez une base de connaissances vérifiée par des experts linguistes du Gabon.</p>
          </div>
          <div class="glass-card" style="padding: 28px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">⚡</div>
            <h3 style="font-size: 1.2rem; margin-bottom: 8px; color: var(--text-main);">Validation & Analytics Admin</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Un espace dédié aux modérateurs pour surveiller la qualité des traductions et les suggestions IA.</p>
          </div>
        </div>
      </div>
    </main>
  `;
}
