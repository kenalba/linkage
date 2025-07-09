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
            const response = await fetch('./game-template.html');
            if (!response.ok) {
                throw new Error(`Failed to fetch template: ${response.status}`);
            }
            this.gameTemplate = await response.text();
        } catch (error) {
            console.error('Failed to load game template:', error);
            alert('Failed to load game template. Please run "npm run dev" to start the development server.');
        }
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

    generateGameHTML() {
        if (!this.generatedPuzzle || !this.gameTemplate) {
            alert('Please wait for the template to load or try refreshing the page.');
            return null;
        }

        const title = document.getElementById('puzzleTitle').value || 'Linkages Puzzle';
        const instructions = 'Find groups of four items that share something in common.';
        
        let html = this.gameTemplate;
        html = html.replace(/\{\{TITLE\}\}/g, title);
        html = html.replace(/\{\{INSTRUCTIONS\}\}/g, instructions);
        html = html.replace(/\{\{GAME_DATA\}\}/g, JSON.stringify(this.generatedPuzzle, null, 8));

        return { html, title };
    }

    getCleanFilename(title) {
        let filename = title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-')         // Replace spaces with hyphens
            .replace(/-+/g, '-')          // Replace multiple hyphens with single
            .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens
        
        if (!filename) filename = 'linkages-puzzle';
        if (!filename.endsWith('.html')) filename += '.html';
        
        return filename;
    }

    async previewPuzzle() {
        const gameData = this.generateGameHTML();
        if (!gameData) return;

        const filename = this.getCleanFilename(gameData.title);

        try {
            const response = await fetch('/api/save-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filename: filename,
                    content: gameData.html
                })
            });

            const result = await response.json();
            if (result.success) {
                // Update UI to show preview link
                this.showPreviewLink(result.filename);
            } else {
                alert('Failed to save game for preview: ' + result.error);
            }
        } catch (error) {
            alert('Failed to save game for preview: ' + error.message);
        }
    }

    downloadPuzzle() {
        const gameData = this.generateGameHTML();
        if (!gameData) return;

        const filename = this.getCleanFilename(gameData.title);

        const blob = new Blob([gameData.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showPreviewLink(filename) {
        const previewContainer = document.getElementById('previewContainer');
        if (!previewContainer) {
            // Create preview container if it doesn't exist
            const container = document.createElement('div');
            container.id = 'previewContainer';
            container.className = 'preview-container';
            container.innerHTML = `
                <div class="preview-message">
                    <strong>✅ Game saved successfully!</strong>
                    <a href="../output/${filename}" target="_blank" class="preview-link">
                        🎮 Preview Game
                    </a>
                </div>
            `;
            
            const buttonGroup = document.querySelector('#step3 .button-group');
            buttonGroup.parentNode.insertBefore(container, buttonGroup);
        } else {
            // Update existing preview container
            previewContainer.innerHTML = `
                <div class="preview-message">
                    <strong>✅ Game saved successfully!</strong>
                    <a href="../output/${filename}" target="_blank" class="preview-link">
                        🎮 Preview Game
                    </a>
                </div>
            `;
        }
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

function previewPuzzle() {
    puzzleCreator.previewPuzzle();
}

function downloadPuzzle() {
    puzzleCreator.downloadPuzzle();
}