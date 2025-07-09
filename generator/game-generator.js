#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class ConnectionsGenerator {
    constructor() {
        this.templatePath = path.join(__dirname, '..', 'index.html');
    }

    generateGame(gameData, outputPath = '../output/connections-game.html') {
        try {
            if (!this.validateGameData(gameData)) {
                throw new Error('Invalid game data format');
            }

            const template = fs.readFileSync(this.templatePath, 'utf8');
            const gameHtml = this.injectGameData(template, gameData);
            
            fs.writeFileSync(outputPath, gameHtml);
            console.log(`Game generated successfully: ${outputPath}`);
            return outputPath;
        } catch (error) {
            console.error('Error generating game:', error.message);
            throw error;
        }
    }

    validateGameData(gameData) {
        if (!gameData || typeof gameData !== 'object') {
            return false;
        }

        if (!gameData.groups || !Array.isArray(gameData.groups)) {
            return false;
        }

        if (gameData.groups.length !== 4) {
            return false;
        }

        const difficulties = ['yellow', 'green', 'blue', 'purple'];
        const usedDifficulties = new Set();

        for (const group of gameData.groups) {
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

    injectGameData(template, gameData) {
        const title = gameData.title || 'Connections Game';
        const instructions = gameData.instructions || 'Find groups of four items that share something in common.';
        
        let modifiedTemplate = template.replace(
            '<div class="game-title">Connections</div>',
            `<div class="game-title">${title}</div>`
        );

        modifiedTemplate = modifiedTemplate.replace(
            '<div class="game-instructions">Find groups of four items that share something in common.</div>',
            `<div class="game-instructions">${instructions}</div>`
        );

        const gameDataString = JSON.stringify(gameData.groups, null, 16);
        const gameDataReplacement = `this.gameData = {
                    groups: ${gameDataString}
                };`;

        modifiedTemplate = modifiedTemplate.replace(
            /this\.gameData = \{[\s\S]*?\};/,
            gameDataReplacement
        );

        return modifiedTemplate;
    }

    generateFromFile(jsonFilePath, outputPath) {
        try {
            const gameData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
            return this.generateGame(gameData, outputPath);
        } catch (error) {
            console.error('Error reading game data file:', error.message);
            throw error;
        }
    }

    createSampleData() {
        const sampleData = {
            title: "Daily Connections",
            instructions: "Find groups of four items that share something in common.",
            groups: [
                {
                    category: "Types of Pasta",
                    words: ["PENNE", "RIGATONI", "FUSILLI", "SPAGHETTI"],
                    difficulty: "yellow"
                },
                {
                    category: "Things in a Toolbox",
                    words: ["HAMMER", "WRENCH", "SCREWDRIVER", "PLIERS"],
                    difficulty: "green"
                },
                {
                    category: "Words That Can Precede 'Board'",
                    words: ["SURF", "CLIP", "SCORE", "DASH"],
                    difficulty: "blue"
                },
                {
                    category: "Homophones of Numbers",
                    words: ["WON", "TOO", "FOR", "ATE"],
                    difficulty: "purple"
                }
            ]
        };

        fs.writeFileSync('../samples/sample-game.json', JSON.stringify(sampleData, null, 2));
        console.log('Sample game data created: ../samples/sample-game.json');
        return sampleData;
    }
}

if (require.main === module) {
    const generator = new ConnectionsGenerator();
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage:');
        console.log('  node game-generator.js <json-file> [output-file]');
        console.log('  node game-generator.js --sample');
        console.log('');
        console.log('Examples:');
        console.log('  node game-generator.js game-data.json');
        console.log('  node game-generator.js game-data.json my-game.html');
        console.log('  node game-generator.js --sample');
        process.exit(1);
    }

    if (args[0] === '--sample') {
        const sampleData = generator.createSampleData();
        generator.generateGame(sampleData, '../output/sample-game.html');
    } else {
        const jsonFile = args[0];
        const outputFile = args[1] || '../output/connections-game.html';
        generator.generateFromFile(jsonFile, outputFile);
    }
}

module.exports = ConnectionsGenerator;