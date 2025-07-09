class PuzzleCreator {
    constructor() {
        this.currentStep = 1;
        this.currentMode = null;
        this.generatedPuzzle = null;
        this.gameTemplate = null;
        this.loadGameTemplate();
        this.initializeManualGroups();
    }

    async loadGameTemplate() {
        try {
            const response = await fetch('../index.html');
            this.gameTemplate = await response.text();
        } catch (error) {
            console.error('Failed to load game template:', error);
            this.gameTemplate = this.getEmbeddedTemplate();
        }
    }

    getEmbeddedTemplate() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f7f7; padding: 20px; min-height: 100vh; display: flex; flex-direction: column; align-items: center; }
        .game-container { max-width: 500px; width: 100%; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 20px; }
        .game-header { text-align: center; margin-bottom: 20px; }
        .game-title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 10px; }
        .game-instructions { font-size: 14px; color: #666; margin-bottom: 10px; }
        .game-stats { display: flex; justify-content: space-between; font-size: 14px; color: #888; margin-bottom: 20px; }
        .mistakes { color: #e74c3c; }
        .word-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 20px; max-width: 460px; margin: 0 auto 20px auto; }
        .word-card { background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 16px 8px; text-align: center; font-size: 14px; font-weight: 500; color: #333; cursor: pointer; transition: all 0.2s ease; width: 110px; height: 60px; display: flex; align-items: center; justify-content: center; user-select: none; word-wrap: break-word; hyphens: auto; }
        .word-card:hover { background: #e9ecef; border-color: #dee2e6; }
        .word-card.selected { background: #333; color: white; border-color: #333; }
        .word-card.found { cursor: default; opacity: 0.8; }
        .word-card.found.yellow { background: #f1c40f; border-color: #f39c12; color: #333; }
        .word-card.found.green { background: #2ecc71; border-color: #27ae60; color: white; }
        .word-card.found.blue { background: #3498db; border-color: #2980b9; color: white; }
        .word-card.found.purple { background: #9b59b6; border-color: #8e44ad; color: white; }
        .controls { text-align: center; margin-bottom: 20px; }
        .btn { background: #333; color: white; border: none; border-radius: 20px; padding: 10px 20px; font-size: 14px; font-weight: 500; cursor: pointer; margin: 0 5px; transition: all 0.2s ease; }
        .btn:hover { background: #555; }
        .btn:disabled { background: #ccc; cursor: not-allowed; }
        .found-groups { margin-top: 20px; }
        .group-result { background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 10px; text-align: center; }
        .group-result.yellow { background: #f1c40f; color: #333; }
        .group-result.green { background: #2ecc71; color: white; }
        .group-result.blue { background: #3498db; color: white; }
        .group-result.purple { background: #9b59b6; color: white; }
        .group-category { font-weight: bold; font-size: 16px; margin-bottom: 5px; text-transform: uppercase; }
        .group-words { font-size: 14px; opacity: 0.9; }
        .game-message { text-align: center; padding: 15px; margin: 10px 0; border-radius: 8px; font-weight: 500; }
        .game-message.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .game-message.error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .game-message.warning { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
        @media (max-width: 480px) {
            .game-container { padding: 15px; }
            .word-grid { max-width: 320px; }
            .word-card { padding: 12px 6px; font-size: 12px; width: 75px; height: 50px; }
            .game-title { font-size: 20px; }
        }
    </style>
</head>
<body>
    <div class="game-container">
        <div class="game-header">
            <div class="game-title">{{TITLE}}</div>
            <div class="game-instructions">{{INSTRUCTIONS}}</div>
            <div class="game-stats">
                <span>Mistakes remaining: <span class="mistakes" id="mistakes">4</span></span>
                <span>Groups found: <span id="groups-found">0</span>/4</span>
            </div>
        </div>
        <div id="game-message" class="game-message" style="display: none;"></div>
        <div class="word-grid" id="word-grid"></div>
        <div class="controls">
            <button class="btn" id="shuffle-btn">Shuffle</button>
            <button class="btn" id="deselect-btn">Deselect All</button>
            <button class="btn" id="submit-btn" disabled>Submit</button>
        </div>
        <div class="found-groups" id="found-groups"></div>
    </div>
    <script>
        class ConnectionsGame {
            constructor() {
                this.gameData = null;
                this.selectedWords = [];
                this.foundGroups = [];
                this.mistakes = 4;
                this.gameComplete = false;
                this.shuffledWords = [];
                this.initializeElements();
                this.setupEventListeners();
                this.loadGame();
            }
            initializeElements() {
                this.wordGrid = document.getElementById('word-grid');
                this.mistakesEl = document.getElementById('mistakes');
                this.groupsFoundEl = document.getElementById('groups-found');
                this.gameMessageEl = document.getElementById('game-message');
                this.foundGroupsEl = document.getElementById('found-groups');
                this.shuffleBtn = document.getElementById('shuffle-btn');
                this.deselectBtn = document.getElementById('deselect-btn');
                this.submitBtn = document.getElementById('submit-btn');
            }
            setupEventListeners() {
                this.shuffleBtn.addEventListener('click', () => this.shuffleWords());
                this.deselectBtn.addEventListener('click', () => this.deselectAll());
                this.submitBtn.addEventListener('click', () => this.submitGuess());
            }
            loadGame() {
                this.gameData = {{GAME_DATA}};
                this.initializeGame();
            }
            initializeGame() {
                this.selectedWords = [];
                this.foundGroups = [];
                this.mistakes = 4;
                this.gameComplete = false;
                this.shuffledWords = this.shuffleArray(this.getAllWords());
                this.renderGrid();
                this.updateStats();
                this.hideMessage();
            }
            getAllWords() {
                return this.gameData.groups.flatMap(group => group.words);
            }
            shuffleArray(array) {
                const shuffled = [...array];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                return shuffled;
            }
            renderGrid() {
                this.wordGrid.innerHTML = '';
                this.shuffledWords.forEach(word => {
                    const wordCard = document.createElement('div');
                    wordCard.className = 'word-card';
                    wordCard.textContent = word;
                    wordCard.dataset.word = word;
                    this.adjustFontSize(wordCard, word);
                    const foundGroup = this.foundGroups.find(group => group.words.includes(word));
                    if (foundGroup) {
                        wordCard.classList.add('found', foundGroup.difficulty);
                    } else {
                        wordCard.addEventListener('click', () => this.toggleWord(word));
                    }
                    this.wordGrid.appendChild(wordCard);
                });
                this.updateSelectedState();
            }
            adjustFontSize(wordCard, word) {
                const maxFontSize = window.innerWidth <= 480 ? 12 : 14;
                const minFontSize = window.innerWidth <= 480 ? 9 : 10;
                let fontSize = maxFontSize;
                if (word.length <= 6) {
                    fontSize = maxFontSize;
                } else if (word.length <= 8) {
                    fontSize = maxFontSize - 1;
                } else if (word.length <= 10) {
                    fontSize = maxFontSize - 2;
                } else {
                    fontSize = minFontSize;
                }
                wordCard.style.fontSize = fontSize + 'px';
            }
            toggleWord(word) {
                if (this.gameComplete) return;
                const index = this.selectedWords.indexOf(word);
                if (index > -1) {
                    this.selectedWords.splice(index, 1);
                } else if (this.selectedWords.length < 4) {
                    this.selectedWords.push(word);
                }
                this.updateSelectedState();
                this.updateSubmitButton();
            }
            updateSelectedState() {
                const wordCards = this.wordGrid.querySelectorAll('.word-card');
                wordCards.forEach(card => {
                    const word = card.dataset.word;
                    if (this.selectedWords.includes(word)) {
                        card.classList.add('selected');
                    } else {
                        card.classList.remove('selected');
                    }
                });
            }
            updateSubmitButton() {
                this.submitBtn.disabled = this.selectedWords.length !== 4;
            }
            deselectAll() {
                this.selectedWords = [];
                this.updateSelectedState();
                this.updateSubmitButton();
            }
            shuffleWords() {
                const remainingWords = this.shuffledWords.filter(word => 
                    !this.foundGroups.some(group => group.words.includes(word))
                );
                const foundWords = this.shuffledWords.filter(word => 
                    this.foundGroups.some(group => group.words.includes(word))
                );
                this.shuffledWords = [...this.shuffleArray(remainingWords), ...foundWords];
                this.renderGrid();
            }
            submitGuess() {
                if (this.selectedWords.length !== 4) return;
                const correctGroup = this.gameData.groups.find(group => 
                    this.selectedWords.every(word => group.words.includes(word)) &&
                    group.words.every(word => this.selectedWords.includes(word))
                );
                if (correctGroup) {
                    this.foundGroups.push(correctGroup);
                    this.selectedWords = [];
                    this.renderFoundGroup(correctGroup);
                    this.showMessage('Correct! Well done.', 'success');
                    if (this.foundGroups.length === 4) {
                        this.gameComplete = true;
                        this.showMessage('Congratulations! You solved the puzzle!', 'success');
                    }
                } else {
                    this.mistakes--;
                    this.selectedWords = [];
                    if (this.mistakes === 0) {
                        this.gameComplete = true;
                        this.showMessage('Game Over! Better luck next time.', 'error');
                        this.revealAllGroups();
                    } else {
                        this.showMessage(\`Not quite right. \${this.mistakes} mistake\${this.mistakes === 1 ? '' : 's'} remaining.\`, 'warning');
                    }
                }
                this.updateStats();
                this.updateSubmitButton();
                this.renderGrid();
            }
            renderFoundGroup(group) {
                const groupEl = document.createElement('div');
                groupEl.className = \`group-result \${group.difficulty}\`;
                groupEl.innerHTML = \`
                    <div class="group-category">\${group.category}</div>
                    <div class="group-words">\${group.words.join(', ')}</div>
                \`;
                this.foundGroupsEl.appendChild(groupEl);
            }
            revealAllGroups() {
                this.gameData.groups.forEach(group => {
                    if (!this.foundGroups.includes(group)) {
                        this.foundGroups.push(group);
                        this.renderFoundGroup(group);
                    }
                });
            }
            updateStats() {
                this.mistakesEl.textContent = this.mistakes;
                this.groupsFoundEl.textContent = this.foundGroups.length;
            }
            showMessage(text, type) {
                this.gameMessageEl.textContent = text;
                this.gameMessageEl.className = \`game-message \${type}\`;
                this.gameMessageEl.style.display = 'block';
                setTimeout(() => {
                    this.hideMessage();
                }, 3000);
            }
            hideMessage() {
                this.gameMessageEl.style.display = 'none';
            }
        }
        document.addEventListener('DOMContentLoaded', () => {
            new ConnectionsGame();
        });
    </script>
</body>
</html>`;
    }

    initializeManualGroups() {
        const container = document.getElementById('manual-groups');
        if (!container) return;

        const difficulties = ['yellow', 'green', 'blue', 'purple'];
        const difficultyLabels = ['Yellow (Easiest)', 'Green (Medium-Easy)', 'Blue (Medium-Hard)', 'Purple (Hardest)'];
        
        container.innerHTML = '';
        
        difficulties.forEach((difficulty, index) => {
            const groupDiv = document.createElement('div');
            groupDiv.className = `manual-group ${difficulty}`;
            groupDiv.innerHTML = `
                <div class="group-header">
                    <div class="difficulty-badge ${difficulty}">${difficultyLabels[index]}</div>
                    <input type="text" class="category-input" placeholder="Category name..." 
                           data-group="${index}">
                </div>
                <div class="words-grid">
                    <input type="text" class="word-input" placeholder="WORD 1" data-group="${index}" data-word="0">
                    <input type="text" class="word-input" placeholder="WORD 2" data-group="${index}" data-word="1">
                    <input type="text" class="word-input" placeholder="WORD 3" data-group="${index}" data-word="2">
                    <input type="text" class="word-input" placeholder="WORD 4" data-group="${index}" data-word="3">
                </div>
            `;
            container.appendChild(groupDiv);
        });
    }


    createPuzzleFromManual() {
        const title = document.getElementById('puzzleTitle').value.trim() || 'Linkages Puzzle';
        const groups = [];
        const difficulties = ['yellow', 'green', 'blue', 'purple'];

        for (let i = 0; i < 4; i++) {
            const categoryInput = document.querySelector(`input.category-input[data-group="${i}"]`);
            const category = categoryInput ? categoryInput.value.trim() : '';
            
            if (!category) {
                alert(`Please enter a category name for the ${difficulties[i]} group.`);
                return;
            }

            const words = [];
            for (let j = 0; j < 4; j++) {
                const wordInput = document.querySelector(`input.word-input[data-group="${i}"][data-word="${j}"]`);
                const word = wordInput ? wordInput.value.trim().toUpperCase() : '';
                
                if (!word) {
                    alert(`Please enter all 4 words for the ${difficulties[i]} group.`);
                    return;
                }
                words.push(word);
            }

            groups.push({
                category: category,
                words: words,
                difficulty: difficulties[i]
            });
        }

        this.generatedPuzzle = { groups: groups };
        this.showStep(3);
        this.displayPuzzlePreview(this.generatedPuzzle);
    }

    createPuzzleFromJSON() {
        const jsonData = document.getElementById('jsonData').value.trim();
        
        if (!jsonData) {
            alert('Please paste JSON game data.');
            return;
        }

        try {
            const puzzle = JSON.parse(jsonData);
            
            if (!this.validatePuzzleData(puzzle)) {
                alert('Invalid JSON format. Please check the structure and try again.');
                return;
            }

            this.generatedPuzzle = puzzle;
            this.showStep(3);
            this.displayPuzzlePreview(this.generatedPuzzle);
        } catch (error) {
            alert('Invalid JSON format: ' + error.message);
        }
    }

    validatePuzzleData(puzzle) {
        if (!puzzle.groups || !Array.isArray(puzzle.groups) || puzzle.groups.length !== 4) {
            return false;
        }

        const difficulties = ['yellow', 'green', 'blue', 'purple'];
        const usedDifficulties = new Set();

        for (const group of puzzle.groups) {
            if (!group.category || !group.words || !group.difficulty) {
                return false;
            }
            
            if (!Array.isArray(group.words) || group.words.length !== 4) {
                return false;
            }
            
            if (!difficulties.includes(group.difficulty)) {
                return false;
            }
            
            if (usedDifficulties.has(group.difficulty)) {
                return false;
            }
            
            usedDifficulties.add(group.difficulty);
        }

        return true;
    }

    getSampleData() {
        return {
            "groups": [
                {
                    "category": "Types of Pasta",
                    "words": ["PENNE", "RIGATONI", "FUSILLI", "SPAGHETTI"],
                    "difficulty": "yellow"
                },
                {
                    "category": "Things in a Toolbox",
                    "words": ["HAMMER", "WRENCH", "SCREWDRIVER", "PLIERS"],
                    "difficulty": "green"
                },
                {
                    "category": "Words That Can Precede 'Board'",
                    "words": ["SURF", "CLIP", "SCORE", "DASH"],
                    "difficulty": "blue"
                },
                {
                    "category": "Homophones of Numbers",
                    "words": ["WON", "TOO", "FOR", "ATE"],
                    "difficulty": "purple"
                }
            ]
        };
    }

    downloadSampleJSON() {
        const sampleData = this.getSampleData();
        const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'linkages-sample.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async copySampleJSON() {
        const sampleData = this.getSampleData();
        const jsonString = JSON.stringify(sampleData, null, 2);
        
        try {
            await navigator.clipboard.writeText(jsonString);
            // Show temporary feedback
            const btn = document.querySelector('[onclick="copySampleJSON()"]');
            const originalText = btn.textContent;
            btn.textContent = '✓ Copied!';
            btn.style.background = '#28a745';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = jsonString;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Sample JSON copied to clipboard!');
        }
    }

    displayPuzzlePreview(puzzle) {
        const groupsContainer = document.getElementById('puzzleGroups');
        groupsContainer.innerHTML = '';

        puzzle.groups.forEach((group, index) => {
            const groupEditor = document.createElement('div');
            groupEditor.className = `group-editor ${group.difficulty}`;
            groupEditor.innerHTML = `
                <div class="group-header">
                    <div class="difficulty-badge ${group.difficulty}">${group.difficulty.toUpperCase()}</div>
                    <input type="text" class="category-input" value="${group.category}" 
                           onchange="puzzleCreator.updateGroupCategory(${index}, this.value)">
                </div>
                <div class="words-grid">
                    ${group.words.map((word, wordIndex) => `
                        <input type="text" class="word-input" value="${word}" 
                               onchange="puzzleCreator.updateGroupWord(${index}, ${wordIndex}, this.value)">
                    `).join('')}
                </div>
            `;
            groupsContainer.appendChild(groupEditor);
        });

        this.hideLoading();
        this.showPuzzlePreview();
    }

    updateGroupCategory(groupIndex, newCategory) {
        if (this.generatedPuzzle) {
            this.generatedPuzzle.groups[groupIndex].category = newCategory;
        }
    }

    updateGroupWord(groupIndex, wordIndex, newWord) {
        if (this.generatedPuzzle) {
            this.generatedPuzzle.groups[groupIndex].words[wordIndex] = newWord.toUpperCase();
        }
    }

    downloadPuzzle() {
        if (!this.generatedPuzzle) return;

        const title = document.getElementById('puzzleTitle').value || 'Linkages Puzzle';
        const instructions = 'Find groups of four items that share something in common.';
        
        let html = this.gameTemplate;
        html = html.replace(/\{\{TITLE\}\}/g, title);
        html = html.replace(/\{\{INSTRUCTIONS\}\}/g, instructions);
        html = html.replace(/\{\{GAME_DATA\}\}/g, JSON.stringify(this.generatedPuzzle, null, 8));

        // Clean filename and ensure .html extension
        let filename = title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-')         // Replace spaces with hyphens
            .replace(/-+/g, '-')          // Replace multiple hyphens with single
            .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens
        
        if (!filename) filename = 'linkages-puzzle';
        if (!filename.endsWith('.html')) filename += '.html';

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showStep(stepNumber) {
        for (let i = 1; i <= 3; i++) {
            const step = document.getElementById(`step${i}`);
            if (step) {
                if (i === stepNumber) {
                    step.classList.add('active');
                    step.classList.remove('completed');
                } else if (i < stepNumber) {
                    step.classList.add('completed');
                    step.classList.remove('active');
                } else {
                    step.classList.remove('active', 'completed');
                }
            }
        }
    }

    showLoading() {
        document.getElementById('generationLoading').classList.add('show');
        document.getElementById('puzzlePreview').classList.remove('show');
        document.getElementById('generationError').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('generationLoading').classList.remove('show');
    }

    showPuzzlePreview() {
        document.getElementById('puzzlePreview').classList.add('show');
    }

    showError(message) {
        const errorDiv = document.getElementById('generationError');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        this.hideLoading();
    }
}

// Global functions for HTML event handlers
const puzzleCreator = new PuzzleCreator();

function selectMode(mode) {
    puzzleCreator.currentMode = mode;
    puzzleCreator.showStep(2);
    
    // Show the appropriate input method based on mode
    if (mode === 'wizard') {
        switchInputMethod('wizard');
    } else if (mode === 'json') {
        switchInputMethod('json');
    }
}

function switchInputMethod(method) {
    const tabs = document.querySelectorAll('.tab-btn');
    const methods = document.querySelectorAll('.input-method');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    methods.forEach(method => method.classList.remove('active'));
    
    document.querySelector(`[onclick="switchInputMethod('${method}')"]`).classList.add('active');
    document.getElementById(`${method}-input`).classList.add('active');
}

function backToStep1() {
    puzzleCreator.showStep(1);
}

function backToStep2() {
    puzzleCreator.showStep(2);
}

function createPuzzleFromManual() {
    puzzleCreator.createPuzzleFromManual();
}

function createPuzzleFromJSON() {
    puzzleCreator.createPuzzleFromJSON();
}

function downloadSampleJSON() {
    puzzleCreator.downloadSampleJSON();
}

function copySampleJSON() {
    puzzleCreator.copySampleJSON();
}

function downloadPuzzle() {
    puzzleCreator.downloadPuzzle();
}