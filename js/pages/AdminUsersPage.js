/**
 * TRADITION IA - ADMIN USERS MANAGEMENT VIEW
 */

import { Store } from '../store.js';
import { renderSidebar } from '../components/Sidebar.js';
import { showToast } from '../components/Toast.js';

export function renderAdminUsersPage() {
  const users = Store.usersList;

  return `
    <div class="layout-container">
      ${renderSidebar('admin')}

      <main class="main-content">
        <div class="page-header">
          <div class="page-title-group">
            <h1>Gestion des Utilisateurs</h1>
            <p class="page-subtitle">Liste des membres inscrits et attribution des privilèges</p>
          </div>
          <button id="btn-open-add-user-spa" class="btn btn-primary">+ Nouvel Utilisateur</button>
        </div>

        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Date d'inscription</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td style="font-weight: 700; color: #FFF;">${u.name}</td>
                  <td style="color: var(--text-muted);">${u.email}</td>
                  <td><span class="badge ${u.role === 'admin' ? 'badge-gold' : 'badge-blue'}">${u.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</span></td>
                  <td style="color: var(--text-muted); font-size: 0.85rem;">${u.joinedAt || '2026-01-01'}</td>
                  <td><span class="badge badge-green">${u.status || 'Actif'}</span></td>
                  <td>
                    <button class="btn btn-danger btn-delete-user" data-id="${u.id}" style="padding: 4px 8px; font-size: 0.75rem;">Supprimer</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Modale Ajouter Utilisateur -->
        <div id="modal-add-user-spa" class="modal-backdrop">
          <div class="modal-card">
            <div class="modal-header">
              <h3 style="font-size: 1.2rem;">👥 Ajouter un Utilisateur</h3>
              <button class="btn btn-secondary btn-icon btn-close-user-modal">✕</button>
            </div>
            <form id="form-add-user-spa">
              <div class="modal-body" style="display: flex; flex-direction: column; gap: 16px;">
                <div class="form-group">
                  <label class="form-label">Nom Complet</label>
                  <input type="text" id="new-user-name" class="form-input" placeholder="ex: Marc Mbadinga" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Adresse Email</label>
                  <input type="email" id="new-user-email" class="form-input" placeholder="ex: marc@mail.ga" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Rôle</label>
                  <select id="new-user-role" class="form-select">
                    <option value="user">Utilisateur Simple</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-close-user-modal">Annuler</button>
                <button type="submit" class="btn btn-primary">Créer l'Utilisateur</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  `;
}

export function initAdminUsersPageEvents() {
  const modal = document.getElementById('modal-add-user-spa');
  document.getElementById('btn-open-add-user-spa')?.addEventListener('click', () => modal?.classList.add('active'));
  document.querySelectorAll('.btn-close-user-modal').forEach(b => b.addEventListener('click', () => modal?.classList.remove('active')));

  document.getElementById('form-add-user-spa')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newUser = {
      name: document.getElementById('new-user-name').value,
      email: document.getElementById('new-user-email').value,
      role: document.getElementById('new-user-role').value,
      status: 'Actif'
    };

    await Store.addUser(newUser);
    modal?.classList.remove('active');
    showToast('Utilisateur ajouté avec succès !');
    Router.handleRoute();
  });

  document.querySelectorAll('.btn-delete-user').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
        await Store.deleteUser(id);
        showToast('Utilisateur supprimé !');
        Router.handleRoute();
      }
    });
  });
}
