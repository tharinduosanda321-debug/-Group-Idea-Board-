document.addEventListener('DOMContentLoaded', () => {
    const participantSelect = document.getElementById('participantSelect');
    const ideaInput = document.getElementById('ideaInput');
    const addIdeaBtn = document.getElementById('addIdeaBtn');
    const ideasPanel = document.getElementById('ideasPanel');
    const resetBtn = document.getElementById('resetBtn');

    // Focus input on load
    ideaInput.focus();

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

    resetBtn.addEventListener('click', () => {
        participantSelect.selectedIndex = 0;
        ideaInput.value = '';
        ideaInput.focus();
    });

    function addIdea(name, idea) {
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
                ideasPanel.removeChild(entry);
                updateCount();
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
        const countElem = document.getElementById('ideaCount');
        const total = ideasPanel.children.length;
        countElem.textContent = `${total} IDEA${total === 1 ? '' : 'S'}`;
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
});
