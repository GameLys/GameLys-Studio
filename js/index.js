document.addEventListener('DOMContentLoaded', () => {
    // --- 1. GESTION DU THÈME ---
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;

    const currentTheme = localStorage.getItem('theme') || 'dark-mode';
    if (currentTheme === 'light-mode') {
        body.classList.add('light-mode');
        if (themeIcon) themeIcon.textContent = '🌙';
    }

    // Ajout d'une vérification pour ne pas bloquer le code si le bouton n'existe pas
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            if (themeIcon) themeIcon.textContent = isLight ? '🌙' : '☀️';
            localStorage.setItem('theme', isLight ? 'light-mode' : 'dark-mode');
        });
    }

    // --- 2. EFFET LUMINEUX ---
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
        document.addEventListener('mousemove', (e) => {
            glow.style.left = `${e.clientX}px`;
            glow.style.top = `${e.clientY}px`;
        });
    }

    // --- 3. ANIMATION DE COMPTEUR ---
    function animateValue(id, target) {
        const obj = document.getElementById(id);
        if (!obj || isNaN(target)) return;
        let current = 0;
        const duration = 2000;
        const stepTime = 20;
        const increment = target / (duration / stepTime);

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                obj.innerText = Math.floor(target) + "+";
                clearInterval(timer);
            } else {
                obj.innerText = Math.floor(current);
            }
        }, stepTime);
    }

    // --- 4. FETCH GITHUB ---
    async function fetchGitHubRepos() {
        try {
            const response = await fetch('https://api.github.com/users/GameLys/repos?per_page=100');
            const repos = await response.json();
            const count = repos.filter(repo => !repo.private).length;
            animateValue('repoCount', count || 12);
        } catch (error) {
            animateValue('repoCount', 12);
        }
    }

    // --- 5. FETCH DISCORD ---
    async function fetchDiscordMembers() {
        try {
            const response = await fetch('https://discord.com/api/v10/invites/kfzjBfYV8J?with_counts=true');
            const data = await response.json();
            animateValue('memberCount', data.approximate_member_count || 150);
        } catch (error) {
            animateValue('memberCount', 150);
        }
    }

    // Lancement
    fetchGitHubRepos();
    fetchDiscordMembers();

    // Vérification de l'existence du bouton pour éviter l'erreur sur lostsoul.html
    const myButton = document.getElementById("myButton");
    if (myButton) {
        myButton.onclick = () => {
            location.href = "lostsoul.html";
        };
    }
});

// --- TRADUCTION AUTOMATIQUE ---
const langToggle = document.getElementById('langToggle');

function updateLanguage(isEn) {
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(el => {
        // Si l'élément a des enfants (comme ton titre avec le span couleur)
        const subElements = el.querySelectorAll('[data-fr]');
        if (subElements.length > 0) {
            subElements.forEach(sub => {
                sub.textContent = isEn ? sub.getAttribute('data-en') : sub.getAttribute('data-fr');
            });
        } else {
            // Pour les paragraphes ou boutons simples
            const text = isEn ? el.getAttribute('data-en') : el.getAttribute('data-fr');
            if (text) el.textContent = text;
        }
    });
    
    // Sauvegarder la préférence
    localStorage.setItem('lang', isEn ? 'en' : 'fr');
}

// Écouteur de clic
langToggle.addEventListener('change', () => {
    updateLanguage(langToggle.checked);
});

// Charger la langue au démarrage
const savedLang = localStorage.getItem('lang');
if (savedLang === 'en') {
    langToggle.checked = true;
    updateLanguage(true);
}