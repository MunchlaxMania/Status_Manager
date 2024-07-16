document.addEventListener('DOMContentLoaded', function() {
    let characters = [];
    
    fetch('data/characters.json')
        .then(response => response.json())
        .then(data => {
            const characterList = document.getElementById('character-list');
            characters = data.Sheet1.map(character => ({
                ...character,
                currentHP: character.maxHP,
                currentMP: character.maxMP
            }));

            renderCharacters(characterList, characters);

            document.getElementById('update-btn').addEventListener('click', function() {
                const sortValue = document.getElementById('sort-select').value;
                characters = sortCharacters(characters, sortValue);
                renderCharacters(characterList, characters);
            });
        });

    function createCharacterDiv(character) {
        const characterDiv = document.createElement('div');
        characterDiv.classList.add('character');
        characterDiv.innerHTML = `
            <h2>${character.name} (${character.HO})</h2>
            <p>HP: <span id="currentHP-${character.id}">${character.currentHP}</span> / ${character.maxHP}</p>
            <div class="bar hp-bar">
                <div class="bar-inner hp-bar-inner" id="hp-bar-${character.id}" style="width: ${character.currentHP / character.maxHP * 100}%;"></div>
            </div>
            <p>MP: <span id="currentMP-${character.id}">${character.currentMP}</span> / ${character.maxMP}</p>
            <div class="bar mp-bar">
                <div class="bar-inner mp-bar-inner" id="mp-bar-${character.id}" style="width: ${character.currentMP / character.maxMP * 100}%;"></div>
            </div>
            <button class="adjust-hp" data-id="${character.id}" data-amount="-1">-HP</button>
            <button class="adjust-hp" data-id="${character.id}" data-amount="1">+HP</button>
            <button class="adjust-mp" data-id="${character.id}" data-amount="-1">-MP</button>
            <button class="adjust-mp" data-id="${character.id}" data-amount="1">+MP</button>
        `;
        return characterDiv;
    }

    function renderCharacters(container, characters) {
        container.innerHTML = '';
        characters.forEach(character => {
            const characterDiv = createCharacterDiv(character);
            container.appendChild(characterDiv);
        });

        // HP adjustment buttons
        document.querySelectorAll('.adjust-hp').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const amount = parseInt(this.dataset.amount);
                console.log(`Adjusting HP for ID: ${id} by ${amount}`);
                adjustHP(id, amount);
            });
        });

        // MP adjustment buttons
        document.querySelectorAll('.adjust-mp').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const amount = parseInt(this.dataset.amount);
                console.log(`Adjusting MP for ID: ${id} by ${amount}`);
                adjustMP(id, amount);
            });
        });
    }

    function adjustHP(id, amount) {
        const character = characters.find(c => c.id === id);
        if (!character) {
            console.error(`Character with ID: ${id} not found`);
            return;
        }

        let newHP = character.currentHP + amount;
        newHP = Math.max(0, Math.min(character.maxHP, newHP));
        character.currentHP = newHP;

        const currentHPElement = document.getElementById(`currentHP-${id}`);
        currentHPElement.textContent = newHP;
        const hpBar = document.getElementById(`hp-bar-${id}`);
        hpBar.style.width = `${(newHP / character.maxHP) * 100}%`;

        console.log(`Updated HP for ID: ${id} to ${newHP}, width: ${hpBar.style.width}`);
    }

    function adjustMP(id, amount) {
        const character = characters.find(c => c.id === id);
        if (!character) {
            console.error(`Character with ID: ${id} not found`);
            return;
        }

        let newMP = character.currentMP + amount;
        newMP = Math.max(0, Math.min(character.maxMP, newMP));
        character.currentMP = newMP;

        const currentMPElement = document.getElementById(`currentMP-${id}`);
        currentMPElement.textContent = newMP;
        const mpBar = document.getElementById(`mp-bar-${id}`);
        mpBar.style.width = `${(newMP / character.maxMP) * 100}%`;

        console.log(`Updated MP for ID: ${id} to ${newMP}, width: ${mpBar.style.width}`);
    }

    function sortCharacters(characters, sortValue) {
        if (sortValue === 'currentHPAsc') {
            return characters.sort((a, b) => a.currentHP - b.currentHP);
        } else if (sortValue === 'currentHPDesc') {
            return characters.sort((a, b) => b.currentHP - a.currentHP);
        } else if (sortValue === 'decreasedHPAsc') {
            return characters.sort((a, b) => (a.maxHP - a.currentHP) - (b.maxHP - b.currentHP));
        } else if (sortValue === 'decreasedHPDesc') {
            return characters.sort((a, b) => (b.maxHP - b.currentHP) - (a.maxHP - a.currentHP));
        } else if (sortValue === 'currentMPAsc') {
            return characters.sort((a, b) => a.currentMP - b.currentMP);
        } else if (sortValue === 'currentMPDesc') {
            return characters.sort((a, b) => b.currentMP - a.currentMP);
        } else if (sortValue === 'decreasedMPAsc') {
            return characters.sort((a, b) => (a.maxMP - a.currentMP) - (b.maxMP - b.currentMP));
        } else if (sortValue === 'decreasedMPDesc') {
            return characters.sort((a, b) => (b.maxMP - b.currentMP) - (a.maxMP - a.currentMP));
        } else {
            return characters;
        }
    }
});
