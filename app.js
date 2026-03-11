document.addEventListener('DOMContentLoaded', () => {
    const participantSelect = document.getElementById('participantSelect');
    const ideaInput = document.getElementById('ideaInput');
    const addIdeaBtn = document.getElementById('addIdeaBtn');
    const ideasPanel = document.getElementById('ideasPanel');
    const resetBtn = document.getElementById('resetBtn');
    const ideaCountElem = document.getElementById('ideaCount');

    // Focus input on load
    if (ideaInput) ideaInput.focus();

    addIdeaBtn.addEventListener('click', () => {
        const name = participantSelect.value.trim();
        const idea = ideaInput.value.trim();

        if (!name || name === 'add-new') {
            alert('Please select your name first.');
            participantSelect.focus();
            return;
        }
        if (!idea) {
            alert('Please enter an idea before adding.');
            ideaInput.focus();
            return;
        }

        addIdea(name, idea);
        
        // Clear input and refocus
        ideaInput.value = '';
        updateCount();
        ideaInput.focus();
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            participantSelect.selectedIndex = 0;
            ideaInput.value = '';
            ideaInput.focus();
        });
    }

    function addIdea(name, idea) {
        // Remove empty state if it exists
        const emptyState = ideasPanel.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        const entry = document.createElement('div');
        entry.className = 'idea-entry';

        const content = document.createElement('div');
        content.className = 'idea-content';

        const text = document.createElement('div');
        text.className = 'idea-text';
        text.textContent = idea;

        const meta = document.createElement('div');
        meta.className = 'idea-meta';
        meta.innerHTML = `suggested by <span class="suggested-by">${name}</span>`;

        content.appendChild(text);
        content.appendChild(meta);

        const actions = document.createElement('div');
        actions.className = 'idea-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'icon-btn';
        editBtn.innerHTML = '✏️';
        editBtn.title = 'Edit';
        editBtn.addEventListener('click', () => editIdea(entry, text));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'icon-btn delete';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete';
        deleteBtn.addEventListener('click', () => {
            entry.style.opacity = '0';
            entry.style.transform = 'translateY(10px)';
            setTimeout(() => {
                entry.remove();
                updateCount();
                checkEmptyState();
            }, 300);
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        
        entry.appendChild(content);
        entry.appendChild(actions);
        
        ideasPanel.prepend(entry);
        
        // Scroll to top of list
        ideasPanel.scrollTop = 0;
    }

    function editIdea(entry, textElem) {
        const current = textElem.textContent;
        const newText = prompt('Edit your idea:', current);
        if (newText !== null && newText.trim() !== '') {
            textElem.textContent = newText.trim();
        }
    }

    function updateCount() {
        const total = ideasPanel.querySelectorAll('.idea-entry').length;
        if (ideaCountElem) {
            ideaCountElem.textContent = `${total} IDEA${total === 1 ? '' : 'S'}`;
        }
    }

    function checkEmptyState() {
        const total = ideasPanel.querySelectorAll('.idea-entry').length;
        if (total === 0) {
            ideasPanel.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💭</div>
                    <p>No ideas yet. Be the first to share something!</p>
                </div>
            `;
        }
    }

    // Set initial count
    updateCount();

    // Support adding new names dynamically
    participantSelect.addEventListener('change', () => {
        if (participantSelect.value === 'add-new') {
            const newName = prompt('Enter your name:');
            if (newName && newName.trim() !== '') {
                const trimmedName = newName.trim();
                const option = document.createElement('option');
                option.textContent = trimmedName;
                option.value = trimmedName;
                
                // Insert before the "Add new" option
                participantSelect.insertBefore(option, participantSelect.lastElementChild);
                participantSelect.value = trimmedName;
            } else {
                participantSelect.selectedIndex = 0;
            }
        }
    });

    // navigation toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            // In a real modern app, we'd use a class and CSS transitions, 
            // but for simplicity and reliability in this environment:
            navMenu.classList.toggle('mobile-open');
        });
    }

    // theme toggle / dark mode
    const themeToggle = document.getElementById('themeToggle');
    function updateThemeIcon() {
        if (themeToggle) {
            themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
        }
    }
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') document.body.classList.add('dark');
    updateThemeIcon();

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon();
        });
    }
});
