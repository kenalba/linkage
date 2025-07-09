# 🔗 Linkages

A lightweight word connection puzzle game inspired by NYT Connections. Create engaging puzzles with both manual and AI-powered tools that generate standalone HTML files for mobile microlearning applications.

## 📁 Project Structure

```
/
├── index.html              # Main game template
├── README.md              # This file
├── CLAUDE.md              # Claude Code specific documentation
├── generator/             # Puzzle creation tools
│   ├── puzzle-creator.html # Web-based puzzle creator GUI
│   ├── puzzle-creator.css  # Creator styling
│   ├── puzzle-creator.js   # Creator application logic
│   ├── ai-service.js       # Claude AI integration
│   └── game-generator.js   # CLI tool for creating games
├── samples/               # Sample game data
│   ├── game-data.json     # Basic sample game
│   ├── new-test-game.json # Science & nature theme
│   └── sample-game.json   # Generated sample data
└── output/                # Generated HTML games
    ├── sample-game.html   # Sample generated game
    ├── science-nature-game.html
    └── test-game.html
```

## 🎮 Features

- **Complete Linkages Game Logic**: 4x4 grid with category matching (like NYT Connections)
- **Mobile-Optimized Interface**: Responsive design with touch-friendly controls
- **Dynamic Font Sizing**: Text automatically scales based on word length
- **Difficulty Levels**: Color-coded difficulty (Yellow → Green → Blue → Purple)
- **Dual Creation Modes**: Manual entry and AI-powered puzzle generation
- **Standalone HTML Generation**: Self-contained files with no external dependencies
- **Flexible Input Options**: Manual forms, JSON paste, or AI text analysis
- **Clean Architecture**: Separated concerns with modular file structure

## 🚀 Quick Start

### Playing Games

1. **Demo Game**: Open `index.html` in a web browser
2. **Generated Games**: Check the `output/` folder for sample games

### Creating Puzzles

1. **Open the Creator**: Open `generator/puzzle-creator.html` in a web browser
2. **Choose Your Mode**:
   - **Basic Mode**: Manual entry with forms or JSON paste
   - **AI Mode**: Generate from text using Claude AI
3. **Create Your Puzzle**:
   - **Manual**: Enter categories and words directly
   - **JSON**: Paste existing game data or download sample format
   - **AI**: Provide source text and let Claude analyze it
4. **Review & Download**: Edit the generated puzzle and download HTML game

### Manual Puzzle Creation

1. **Using the CLI Tool**:
   ```bash
   cd generator
   node game-generator.js ../samples/game-data.json ../output/my-game.html
   ```

2. **Create Sample Data**:
   ```bash
   cd generator
   node game-generator.js --sample
   ```

## 🤖 AI Integration

The puzzle creator uses Claude AI for intelligent puzzle generation:

- **Claude 3.5 Sonnet**: Recommended for balanced speed and quality
- **Claude 3.5 Haiku**: Faster generation with good results
- **Claude 3 Opus**: Most capable but slower

### API Configuration

1. Get your API key from [console.anthropic.com](https://console.anthropic.com/settings/keys)
2. Enter the key in the puzzle creator (stored locally)
3. Select your preferred Claude model
4. Paste source text and generate your puzzle

## 📊 Game Data Format

```json
{
  "title": "My Linkages Game",
  "instructions": "Find groups of four items that share something in common.",
  "groups": [
    {
      "category": "Category Name",
      "words": ["WORD1", "WORD2", "WORD3", "WORD4"],
      "difficulty": "yellow"
    },
    {
      "category": "Another Category",
      "words": ["WORD5", "WORD6", "WORD7", "WORD8"],
      "difficulty": "green"
    },
    {
      "category": "Third Category",
      "words": ["WORD9", "WORD10", "WORD11", "WORD12"],
      "difficulty": "blue"
    },
    {
      "category": "Final Category",
      "words": ["WORD13", "WORD14", "WORD15", "WORD16"],
      "difficulty": "purple"
    }
  ]
}
```

### Requirements

- Exactly 4 groups
- Each group must have exactly 4 words
- Each group must have a unique difficulty level: `yellow`, `green`, `blue`, `purple`
- Words should be uppercase for consistency

## 🎨 Game Rules

Find groups of four items that share something in common (just like NYT Connections). Each game has:
- 16 words arranged in a 4x4 grid
- 4 categories with 4 words each
- Color-coded difficulty levels (Yellow easiest, Purple hardest)
- 4 mistakes allowed before game over

## 📱 Mobile Optimization

The game is designed for mobile devices with:
- Touch-friendly word selection
- Responsive grid layout with consistent card sizes
- Dynamic font sizing for long words
- Gesture-friendly controls

## 🔧 Usage Examples

### CLI Generator

```bash
# Generate a game from JSON data
cd generator
node game-generator.js ../samples/game-data.json ../output/my-game.html

# Generate with custom output filename
node game-generator.js ../samples/new-test-game.json ../output/science-quiz.html

# Create sample data to get started
node game-generator.js --sample
```

### Web-Based Creation

1. Open `generator/puzzle-creator.html`
2. **Basic Mode**: Manually enter 4 categories with 4 words each
3. **AI Mode**: Paste article text and let Claude generate categories
4. Review and edit the generated puzzle
5. Download standalone HTML game

### JSON-Based Creation

1. Download sample JSON from the creator
2. Edit the structure with your own categories and words
3. Paste back into the creator's JSON mode
4. Generate your custom game

## 🚀 Deployment

Generated HTML files are completely self-contained and can be:
- Hosted on any web server
- Embedded in mobile apps
- Used offline
- Integrated into learning management systems

## 🎯 Perfect For

- **Educational Content**: Transform articles into interactive puzzles
- **Microlearning Apps**: Standalone games for mobile learning
- **Content Creation**: Quick puzzle generation from any text
- **Training Materials**: Engaging review activities

## 📄 License

MIT License - Feel free to use and modify for your projects.