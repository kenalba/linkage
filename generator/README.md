# Linkages Puzzle Creator

This directory contains the puzzle creation tools for generating Linkages games.

## Development

### Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:3000/puzzle-creator.html`

The development server uses Vite to serve files with proper CORS headers, allowing the template loading to work correctly.

### Creating Puzzles

The puzzle creator supports two modes:

- **Wizard Mode**: Step-by-step form for manual entry
- **JSON Mode**: Paste JSON data directly or use Claude for custom topics

### Preview and Download

- **🎮 Preview Game**: Saves the game to `/output` directory and provides a preview link
- **📥 Download HTML Game**: Downloads the standalone HTML file to your computer

### Command Line Tool

You can also generate games from the command line:

```bash
# Generate from JSON file
node game-generator.js sample-data.json output-game.html

# Create sample data
node game-generator.js --sample
```

## File Structure

- `puzzle-creator.html` - Main creator interface
- `puzzle-creator.js` - Application logic
- `puzzle-creator.css` - Styling
- `game-template.html` - Template for generated games
- `game-generator.js` - CLI tool for batch generation

## Output

Generated games are standalone HTML files that include:
- Enhanced banner system for found groups
- Mobile-responsive design
- All necessary CSS and JavaScript embedded
- No external dependencies

The output games work both locally and when hosted on any web server, including GitHub Pages.

## Deployment

The puzzle creator is automatically deployed to GitHub Pages when changes are pushed to the main branch. The GitHub Action:

1. Builds the Vite project
2. **Regenerates all sample games** with the latest template and UI features
3. Combines the built generator with the main site files  
4. Deploys everything using GitHub's native Pages deployment action

This ensures that sample games always showcase the latest enhancements like the banner system.

The live puzzle creator will be available at: `https://[username].github.io/linkage/generator/`

## Future Features

- **LMS Integration**: Completion tracking with JSON output for learning management systems
- **Analytics**: Game performance metrics and user behavior tracking
- **Bulk Generation**: Command-line tools for generating multiple puzzles from spreadsheets
- **Custom Themes**: Configurable color schemes and styling options