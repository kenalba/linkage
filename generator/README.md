# Linkages Puzzle Creator

This directory contains the puzzle creation tools for generating Linkages games with full mobile optimization and universal preview functionality.

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

- **Basic Mode**: Step-by-step form for manual entry
- **AI Mode**: Use Claude API to analyze text and automatically generate themed puzzles

### Preview and Download

- **🎮 Preview Game**: One-click preview that works everywhere
  - **Development**: Saves to `/output` directory for persistent testing  
  - **Production**: Uses blob URLs for instant in-memory preview
  - **Mobile optimized**: Responsive layout with dynamic font sizing
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
- **Enhanced banner system** for found groups with color-coded difficulty
- **Advanced mobile optimization**:
  - Dynamic font sizing (14px down to 9px based on word length)
  - Soft hyphenation for proper word breaking
  - Edge-to-edge responsive layout using full screen width
  - Optimized padding and spacing (all multiples of 4px)
- **Universal compatibility**: Works locally, on web servers, and GitHub Pages
- **Zero dependencies**: All CSS and JavaScript embedded

### Mobile Enhancements

The games feature comprehensive mobile optimization:
- **Responsive grid**: Automatically adjusts to screen width
- **Smart text sizing**: Longer words get smaller fonts automatically
- **Proper hyphenation**: Soft hyphens (&shy;) break long words cleanly
- **Touch-friendly**: Optimized tap targets and spacing
- **Container-aware**: Grid properly contained within game boundaries

## Deployment

The puzzle creator is automatically deployed to GitHub Pages when changes are pushed to the main branch. The GitHub Action:

1. **Builds the Vite project** with relative asset paths for subdirectory deployment
2. **Regenerates all sample games** with the latest template and mobile optimizations
3. **Combines built generator** with main site files using modern deployment methods
4. **Deploys to Pages** using GitHub's native `actions/deploy-pages` action

Key deployment features:
- **Universal preview**: Works in both development and production environments
- **Automatic sample updates**: Sample games always showcase latest UI enhancements
- **Optimized assets**: Relative paths ensure proper loading in subdirectories
- **Modern CI/CD**: Uses latest GitHub Actions versions

The live puzzle creator is available at: `https://[username].github.io/linkage/generator/`

## Recent Improvements

### Version 2.0 Enhancements
- **Universal Preview**: One-click preview works in development (file-based) and production (blob URLs)
- **Mobile Optimization**: Comprehensive responsive design with dynamic font sizing and hyphenation
- **Layout Improvements**: Proper container containment and consistent 4px-grid spacing
- **Deployment Fixes**: Relative asset paths and modern GitHub Actions workflow
- **AI Integration**: Enhanced Claude API integration with better error handling

### Upcoming Features

- **LMS Integration**: Completion tracking with JSON output for learning management systems
- **Analytics**: Game performance metrics and user behavior tracking
- **Bulk Generation**: Command-line tools for generating multiple puzzles from spreadsheets
- **Custom Themes**: Configurable color schemes and styling options
- **Progressive Web App**: Enhanced mobile experience with offline capabilities