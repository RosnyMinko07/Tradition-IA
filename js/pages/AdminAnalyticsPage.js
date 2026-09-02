/**
 * TRADITION IA - ADMIN ANALYTICS PAGE VIEW
 */

import { Store } from '../store.js';
import { renderSidebar } from '../components/Sidebar.js';

export function renderAdminAnalyticsPage() {
  const translationsCount = Store.translations.length;
  const dictionaryCount = Store.dictionary.length;

  return `
    <div class="layout-container">
      ${renderSidebar('admin')}

      <main class="main-content">
        <div class="page-header">
          <div class="page-title-group">
            <h1>Analyses & Rapports de Fréquentation</h1>
            <p class="page-subtitle">Statistiques d'utilisation des traductions par province et métriques IA</p>
          </div>
        </div>

        <div class="grid-2">
          <!-- Carte Répartition par Langue -->
          <div class="glass-card" style="padding: 28px;">
            <h2 style="font-size: 1.2rem; margin-bottom: 20px; color: var(--primary);">📊 Demandes de Traduction par Langue</h2>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-weight: 600;">
                  <span>Fang (Estuaire, Woleu-Ntem)</span>
                  <span style="color: var(--primary);">48%</span>
                </div>
                <div style="width: 100%; height: 10px; background: rgba(255,255,255,0.05); border-radius: 5px; overflow: hidden;">
                  <div style="width: 48%; height: 100%; background: var(--primary);"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-weight: 600;">
                  <span>Myènè (Ogooué-Maritime, Moyen-Ogooué)</span>
                  <span style="color: var(--blue);">24%</span>
                </div>
                <div style="width: 100%; height: 10px; background: rgba(255,255,255,0.05); border-radius: 5px; overflow: hidden;">
                  <div style="width: 24%; height: 100%; background: var(--blue);"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-weight: 600;">
                  <span>Punu (Nyanga, Ngounié)</span>
                  <span style="color: var(--gold);">18%</span>
                </div>
                <div style="width: 100%; height: 10px; background: rgba(255,255,255,0.05); border-radius: 5px; overflow: hidden;">
                  <div style="width: 18%; height: 100%; background: var(--gold);"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-weight: 600;">
                  <span>Kota / Autres (Ogooué-Ivindo, Haut-Ogooué)</span>
                  <span style="color: var(--text-muted);">10%</span>
                </div>
                <div style="width: 100%; height: 10px; background: rgba(255,255,255,0.05); border-radius: 5px; overflow: hidden;">
                  <div style="width: 10%; height: 100%; background: var(--text-muted);"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Carte Performance IA -->
          <div class="glass-card" style="padding: 28px;">
            <h2 style="font-size: 1.2rem; margin-bottom: 20px; color: var(--gold);">⚡ Métriques & Précision du Modèle IA</h2>
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px; background: rgba(255,255,255,0.02); border-radius: 8px;">
                <span>Précision Moyenne du Modèle</span>
                <span style="font-weight: 700; color: var(--primary); font-size: 1.2rem;">94.2%</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px; background: rgba(255,255,255,0.02); border-radius: 8px;">
                <span>Mots Validés par Experts Linguistes</span>
                <span style="font-weight: 700; color: var(--blue); font-size: 1.2rem;">${dictionaryCount + 300} mots</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px; background: rgba(255,255,255,0.02); border-radius: 8px;">
                <span>Temps de Génération Moyen</span>
                <span style="font-weight: 700; color: var(--gold); font-size: 1.2rem;">240 ms</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px; background: rgba(255,255,255,0.02); border-radius: 8px;">
                <span>Total Traductions Enregistrées</span>
                <span style="font-weight: 700; color: #FFF; font-size: 1.2rem;">${translationsCount + 120}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
}
