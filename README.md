# Tetris Game

A classic Tetris game built with HTML, CSS, and JavaScript.

## Features

- Classic Tetris gameplay
- Score tracking and level progression
- Next piece preview
- Pause functionality
- Responsive design
- Smooth animations

## How to Play

- **←/→ Arrow Keys**: Move piece left/right
- **↑ Arrow Key**: Rotate piece
- **↓ Arrow Key**: Soft drop (move down faster)
- **Space Bar**: Hard drop (instant drop)
- **P Key**: Pause/Resume game

## Running Locally

1. Clone this repository
2. Open `index.html` in your web browser
3. Click "Start Game" and enjoy!

No build process or dependencies required!

## Deployment Instructions

### Option 1: GitHub Pages (Recommended for Static Sites)

1. **Create a GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Tetris game"
   ```

2. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/tetris-game.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click on "Settings"
   - Scroll down to "Pages" in the left sidebar
   - Under "Source", select "main" branch
   - Click "Save"
   - Your site will be live at: `https://YOUR_USERNAME.github.io/tetris-game/`

### Option 2: Railway Deployment

1. **Create a `railway.toml` file** (already included in this project)

2. **Create a simple server** (Railway requires a server process):
   - Option A: Use the included `server.js` (Node.js server)
   - Option B: Use a static file server

3. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "Start a New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account and select this repository
   - Railway will automatically detect and deploy your app
   - Your app will be live at the provided Railway URL

4. **Alternative Railway deployment via CLI:**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

### Option 3: Other Deployment Options

- **Netlify**: Drag and drop the folder to [netlify.com](https://www.netlify.com)
- **Vercel**: Push to GitHub and import to [vercel.com](https://vercel.com)
- **Cloudflare Pages**: Connect your GitHub repo to [pages.cloudflare.com](https://pages.cloudflare.com)

## Technologies Used

- HTML5 Canvas
- CSS3 (with backdrop filters and gradients)
- Vanilla JavaScript (no frameworks)

## Game Rules

- Clear lines by filling rows completely
- Score increases with cleared lines
- Level increases every 10 lines
- Game speeds up with each level
- Game ends when pieces reach the top

## License

MIT License - Feel free to use and modify!
