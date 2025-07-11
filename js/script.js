/* File: js/script.js */

document.addEventListener('DOMContentLoaded', function() {

    // --- DATA ---
    // The complete initial list with 6 examples.
    // This list is only used the very first time the site is opened.
    const defaultSkills = [
        {
            user: 'Jane Smith',
            skill: 'Beginner Guitar Lessons',
            category: 'Creative',
            wants: 'Help with gardening.'
        },
        {
            user: 'Mike Johnson',
            skill: 'WordPress Website Setup',
            category: 'Technical',
            wants: 'Photography lessons.'
        },
        {
            user: 'Sarah Chen',
            skill: 'Conversational Spanish',
            category: 'Languages',
            wants: 'Dog walking or pet sitting.'
        },
        {
            user: 'David Lee',
            skill: 'Home Organization',
            category: 'Home & Garden',
            wants: 'Help with resume writing.'
        },
        {
            user: 'Emily White',
            skill: 'Guided Meditation Sessions',
            category: 'Wellness',
            wants: 'Freshly baked goods.'
        },
        {
            user: 'Tom Brown',
            skill: 'Bicycle Repair',
            category: 'Technical',
            wants: 'Cooking lessons (Italian).'
        }
    ];

    // --- FUNCTIONS ---

    /**
     * Loads skills from localStorage or uses the default data.
     * @returns {Array} The array of skills.
     */
    function getSkills() {
        const skillsFromStorage = localStorage.getItem('skillswap_skills');
        if (skillsFromStorage) {
            return JSON.parse(skillsFromStorage);
        } else {
            return defaultSkills;
        }
    }

    /**
     * Saves an array of skills to localStorage.
     * @param {Array} skillsArray - The array of skills to save.
     */
    function saveSkills(skillsArray) {
        localStorage.setItem('skillswap_skills', JSON.stringify(skillsArray));
    }

    /**
     * Renders skill cards into the marketplace page.
     * @param {Array} skillsToRender - The array of skill objects to display.
     */
    function renderSkills(skillsToRender) {
        const container = document.getElementById('skill-listings');
        if (!container) return;

        container.innerHTML = '';

        if (skillsToRender.length === 0) {
            container.innerHTML = '<p>No skills found.</p>';
            return;
        }

        skillsToRender.forEach(skill => {
            const card = document.createElement('div');
            card.className = 'skill-card';
            card.innerHTML = `
                <h3>${skill.skill}</h3>
                <p class="user-info">Offered by: ${skill.user}</p>
                <p>Category: ${skill.category}</p>
                <div class="wants">
                    <strong>In exchange for:</strong> ${skill.wants}
                </div>
                <br>
                <a href="messages.html" class="btn">Send Proposal</a>
            `;
            container.appendChild(card);
        });
    }
    
    /**
     * Filters skills based on search and category.
     */
    function filterSkills() {
        const allSkills = getSkills();
        const searchText = document.getElementById('searchInput').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;

        const filteredSkills = allSkills.filter(skill => {
            const matchesSearch = skill.skill.toLowerCase().includes(searchText) || skill.user.toLowerCase().includes(searchText);
            const matchesCategory = category === 'all' || skill.category === category;
            return matchesSearch && matchesCategory;
        });

        renderSkills(filteredSkills);
    }

    // --- INITIALIZATION ---
    
    if (document.getElementById('skill-listings')) {
        const skills = getSkills();
        renderSkills(skills);

        document.getElementById('searchInput').addEventListener('keyup', filterSkills);
        document.getElementById('categoryFilter').addEventListener('change', filterSkills);
    }

    if (document.getElementById('offerForm')) {
        const form = document.getElementById('offerForm');
        const messageDiv = document.getElementById('formMessage');

        form.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            const newSkill = {
                user: 'Gabriel Lessa',
                skill: document.getElementById('skillTitle').value,
                category: document.getElementById('skillCategory').value,
                wants: document.getElementById('skillWants').value
            };

            const currentSkills = getSkills();
            currentSkills.push(newSkill);
            saveSkills(currentSkills);

            form.classList.add('hidden');
            messageDiv.classList.remove('hidden');
            messageDiv.style.color = 'green';
            messageDiv.innerHTML = `
                <h3>Thank you!</h3>
                <p>Your skill "${newSkill.skill}" has been added to the marketplace.</p>
                <br>
                <a href="index.html" class="btn">View in Marketplace</a>
            `;
        });
    }
});
