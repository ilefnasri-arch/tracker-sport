/**
 * Tracker de Sport Personnel - Logique Complète
 */

// --- Variables Globales ---
let sessions = [];
let sportsData = [];
let userProfile = {
    name: "Champion",
    goal: 30,
    weight: 70,
    height: 175
};

const healthTips = [
    "Buvez au moins 2 litres d'eau par jour pour une meilleure récupération.",
    "L'échauffement réduit le risque de blessure de 50%.",
    "Dormir 8h par nuit est essentiel pour la croissance musculaire.",
    "Variez vos activités pour solliciter différents groupes musculaires.",
    "Un repas riche en protéines après le sport aide à réparer les muscles.",
    "La régularité est plus importante que l'intensité au début.",
    "Écoutez votre corps : si vous avez mal, faites une pause.",
    "Le yoga améliore la flexibilité et réduit le stress.",
    "Marcher 30 minutes par jour améliore la santé cardiovasculaire.",
    "Prenez un fruit 30 minutes avant votre séance pour un boost d'énergie."
];

// --- Sélecteurs DOM ---
const sportForm = document.getElementById('sport-form');
const profileForm = document.getElementById('profile-form');
const sportSelect = document.getElementById('sport-select');
const dashboardContainer = document.getElementById('dashboard-sessions-container');
const fullHistoryContainer = document.getElementById('full-sessions-container');
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page-content');

// Eléments Profil & Dashboard
const userDisplayName = document.getElementById('user-display-name');
const userAvatar = document.getElementById('user-avatar');
const profilePreview = document.getElementById('profile-preview');
const inputProfileName = document.getElementById('profile-name');
const inputProfileGoal = document.getElementById('profile-goal');
const inputProfileWeight = document.getElementById('profile-weight');
const inputProfileHeight = document.getElementById('profile-height');

// Eléments Objectif (Dashboard)
const goalText = document.getElementById('goal-text');
const goalProgressBar = document.getElementById('goal-progress-bar');
const goalMessage = document.getElementById('goal-message');

// Eléments Conseils Santé
const healthTipText = document.getElementById('health-tip-text');
const newTipBtn = document.getElementById('new-tip-btn');

// Stats
const totalSessionsEl = document.getElementById('total-sessions');
const totalMinutesEl = document.getElementById('total-minutes');
const totalCaloriesEl = document.getElementById('total-calories');

/**
 * Initialisation de l'application
 */
async function init() {
    const storedSessions = localStorage.getItem('sportSessions');
    if (storedSessions) sessions = JSON.parse(storedSessions);

    const storedProfile = localStorage.getItem('sportProfile');
    if (storedProfile) userProfile = JSON.parse(storedProfile);

    applyProfile();
    setupNavigation();
    showRandomTip();
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;

    await loadSports();
    updateUI();
}

/**
 * Navigation entre pages
 */
function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetPage = item.getAttribute('data-page');
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            pages.forEach(page => page.id === `page-${targetPage}` ? page.classList.remove('hidden') : page.classList.add('hidden'));
            updateUI();
        });
    });
}

/**
 * Charge la liste des sports
 */
async function loadSports() {
    try {
        const response = await fetch('sports.json');
        sportsData = await response.json();
        
        sportSelect.innerHTML = '<option value="">Choisir un sport...</option>';
        sportsData.forEach(sport => {
            const option = document.createElement('option');
            option.value = sport.id;
            option.textContent = sport.nom;
            sportSelect.appendChild(option);
        });
    } catch (e) { console.error(e); }
}

/**
 * Enregistre une séance
 */
function handleAddSession(e) {
    e.preventDefault();
    const sportId = parseInt(document.getElementById('sport-select').value);
    const duration = parseInt(document.getElementById('duration').value);
    const date = document.getElementById('date').value;

    const selectedSport = sportsData.find(s => s.id === sportId);
    const calories = selectedSport ? (selectedSport.caloriesParMinute * duration) : 0;

    const newSession = { 
        id: Date.now(), 
        sportName: selectedSport ? selectedSport.nom : 'Inconnu', 
        duration, 
        date, 
        calories,
        repas: selectedSport ? selectedSport.repas : 'Repas équilibré (Protéines + Légumes)'
    };
    sessions.unshift(newSession);
    localStorage.setItem('sportSessions', JSON.stringify(sessions));
    
    updateUI();
    sportForm.reset();
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
}

/**
 * Gère la mise à jour du profil
 */
function handleProfileUpdate(e) {
    e.preventDefault();
    userProfile.name = inputProfileName.value;
    userProfile.goal = parseInt(inputProfileGoal.value);
    userProfile.weight = parseFloat(inputProfileWeight.value);
    userProfile.height = parseFloat(inputProfileHeight.value);
    
    localStorage.setItem('sportProfile', JSON.stringify(userProfile));
    applyProfile();
    updateUI();
    alert("Profil mis à jour !");
}

/**
 * Applique les données du profil
 */
function applyProfile() {
    userDisplayName.textContent = userProfile.name;
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=6366f1&color=fff`;
    userAvatar.src = avatarUrl;
    profilePreview.src = avatarUrl;
    inputProfileName.value = userProfile.name;
    inputProfileGoal.value = userProfile.goal;
    inputProfileWeight.value = userProfile.weight || "";
    inputProfileHeight.value = userProfile.height || "";
}

/**
 * Met à jour l'UI globale
 */
function updateUI() {
    const totals = sessions.reduce((acc, s) => {
        acc.min += s.duration;
        acc.cal += s.calories;
        return acc;
    }, { min: 0, cal: 0 });

    totalSessionsEl.textContent = sessions.length;
    totalMinutesEl.textContent = totals.min;
    totalCaloriesEl.textContent = totals.cal;

    updateGoalProgress();
    renderSessions(dashboardContainer, sessions.slice(0, 3));
    renderSessions(fullHistoryContainer, sessions);
}

/**
 * Calcule et affiche la progression de l'objectif
 */
function updateGoalProgress() {
    const today = new Date().toISOString().split('T')[0];
    const todayMinutes = sessions
        .filter(s => s.date === today)
        .reduce((sum, s) => sum + s.duration, 0);

    const percent = Math.min(Math.round((todayMinutes / userProfile.goal) * 100), 100);
    
    goalText.textContent = `${todayMinutes} / ${userProfile.goal} min`;
    goalProgressBar.style.width = `${percent}%`;

    if (percent >= 100) {
        goalMessage.textContent = "Bravo ! Objectif atteint pour aujourd'hui ! 🏆";
        goalMessage.style.color = "var(--primary)";
    } else if (percent > 0) {
        goalMessage.textContent = `Encore ${userProfile.goal - todayMinutes} minutes pour atteindre votre objectif !`;
        goalMessage.style.color = "var(--text-muted)";
    } else {
        goalMessage.textContent = "Commencez une activité pour atteindre votre objectif !";
    }
}

/**
 * Affiche un conseil santé aléatoire
 */
function showRandomTip() {
    const randomIndex = Math.floor(Math.random() * healthTips.length);
    healthTipText.textContent = healthTips[randomIndex];
}

/**
 * Rendu des sessions
 */
function renderSessions(container, data) {
    if (!container) return;
    if (data.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-folder-open"></i><p>Aucune donnée</p></div>`;
        return;
    }
    container.innerHTML = '';
    data.forEach(session => {
        const div = document.createElement('div');
        div.className = 'session-item';
        div.innerHTML = `
            <div class="session-main">
                <h4>${session.sportName}</h4>
                <div class="session-meta">
                    <span><i class="fas fa-clock"></i> ${session.duration} min</span>
                    <span><i class="fas fa-fire"></i> ${session.calories} kcal</span>
                    <span><i class="fas fa-calendar-day"></i> ${formatDate(session.date)}</span>
                </div>
                <div class="session-meal">
                    <i class="fas fa-utensils"></i> Repas suggéré : <span>${session.repas}</span>
                </div>
            </div>
            <button class="btn-delete-icon" onclick="deleteSession(${session.id})"><i class="fas fa-trash-alt"></i></button>`;
        container.appendChild(div);
    });
}

window.deleteSession = function(id) {
    if (confirm("Supprimer cette séance ?")) {
        sessions = sessions.filter(s => s.id !== id);
        localStorage.setItem('sportSessions', JSON.stringify(sessions));
        updateUI();
    }
}

document.getElementById('clear-history')?.addEventListener('click', () => {
    if (confirm("Effacer tout l'historique ?")) {
        sessions = [];
        localStorage.setItem('sportSessions', JSON.stringify(sessions));
        updateUI();
    }
});

newTipBtn?.addEventListener('click', showRandomTip);

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

sportForm.addEventListener('submit', handleAddSession);
profileForm.addEventListener('submit', handleProfileUpdate);
document.addEventListener('DOMContentLoaded', init);
