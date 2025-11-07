# 🚀 SkillFrame CV Builder - Complete Setup Guide

## ✨ Features Overview

This is the ULTIMATE CV/Portfolio builder with:
- **Live Preview Updates** - See changes instantly as you type
- **LinkedIn Integration** - Import your profile directly
- **100+ Animations & Effects** - Mind-blowing visual effects
- **Portfolio-Style Layout** - Professional scrolling portfolio
- **Advanced Customization** - Complete control over appearance
- **Profile Picture Animations** - 16 different animation styles
- **Interactive Features** - Parallax, 3D effects, and more
- **Export Options** - Clean PDF or animated HTML

## 🛠️ Setup Instructions

### 1. Basic Setup (No LinkedIn)

The CV builder works out-of-the-box with MAMP:

1. Ensure files are in `/Applications/MAMP/htdocs/SkillFrame/`
2. Start MAMP
3. Navigate to `http://localhost:8888/SkillFrame/`
4. Click "🚀 Fill with Test Data" to see it in action!

### 2. LinkedIn Integration Setup

To enable LinkedIn profile import:

#### Step 1: Create LinkedIn App

1. Go to https://www.linkedin.com/developers/apps
2. Click "Create App"
3. Fill in the required information:
   - App name: "CV Builder"
   - LinkedIn Page: Select or create one
   - App logo: Upload any image
   - Legal agreement: Check the box
4. Click "Create app"

#### Step 2: Configure OAuth

1. In your LinkedIn app settings, go to "Auth" tab
2. Add Redirect URL: `http://localhost:3000/callback`
3. Note your:
   - Client ID
   - Client Secret

#### Step 3: Setup Backend Server

1. Navigate to backend folder:
```bash
cd /Applications/MAMP/htdocs/SkillFrame/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` and add your LinkedIn credentials:
```
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
LINKEDIN_REDIRECT_URI=http://localhost:3000/callback
PORT=3000
```

5. Start the backend server:
```bash
npm start
```

#### Step 4: Update Frontend Configuration

Edit `linkedin-integration.js` and replace:
```javascript
clientId: 'YOUR_LINKEDIN_CLIENT_ID'
```
With your actual LinkedIn Client ID.

## 📱 Using the CV Builder

### Quick Start

1. **Test Data**: Click "🚀 Fill with Test Data" to populate all fields
2. **Generate**: Click "Generate CV" or just start typing (live preview)
3. **Customize**: Toggle "Advanced Options" for effects
4. **Export**: Download as PDF (clean) or HTML (with animations)

### LinkedIn Import

1. Click "Import from LinkedIn" button
2. Authorize the app on LinkedIn
3. Your profile data will be imported automatically
4. The preview updates instantly with your data

### Live Preview Features

The preview updates AUTOMATICALLY when you:
- Type in any field (500ms delay after typing stops)
- Change any dropdown selection
- Toggle any checkbox
- Adjust slider values
- Select color schemes

Look for the **"LIVE Preview Active"** indicator in the top-right!

### Advanced Options

#### Animation Types (19 options)
- Basic: Fade, Slide, Bounce, Zoom, Flip, Rotate
- Advanced: 3D Matrix, Cube, Helix, Explosion, Liquid Morph
- Futuristic: Hologram, Quantum Fade, Neural Network, Vortex

#### Background Effects (18 options)
- Animated Gradients, Particles, Waves
- Cosmic Nebula, Circuit Board, DNA Strands
- Matrix Rain, Aurora, Fireflies, Portal

#### Text Effects (17 options)
- Neon Glow, Chrome, Gold Foil, Ice, Fire
- Smoke, Electric Surge, Laser, Holographic

#### Border Styles (15 options)
- Laser Scanner, Energy Field, Hexagon
- Plasma, Force Field, Circuit Trace, Diamond Cut

#### Interactive Features
- ✅ Parallax Scrolling
- ✅ Hover Animations
- ✅ Magnetic Cursor
- ✅ Scroll Reveal
- ✅ Particle Trail
- ✅ Floating Elements
- ✅ Ripple Click Effect
- ✅ 3D Tilt Effect
- ✅ Morphing Shapes

### Keyboard Shortcuts

- `Ctrl + P` - Toggle preview visibility
- `Ctrl + F` - Fullscreen preview mode
- `Ctrl + R` - Refresh preview
- `T` - Toggle mouse trail effect

### Profile Picture Animations

Upload a profile picture and choose from:
- Spin, Pulse, Morph, Glitch
- Rainbow Border, Float, Shake
- 3D Flip, Glow, Heartbeat
- Swing, Bounce, Jello
- Rubber Band, Tada!

## 🎨 Color Schemes

Pre-configured themes:
- **Cyberpunk** - Neon pink & cyan
- **Vaporwave** - Retro pink & blue
- **Sunset** - Warm oranges & yellows
- **Ocean** - Deep blues
- **Forest** - Natural greens
- **Candy** - Sweet pastels
- **Monochrome** - Professional grays
- **Neon** - Bright electric colors

## 🚨 Troubleshooting

### Preview Not Showing?
1. Enter at least your name
2. Click "Generate CV" or wait for live update
3. Check browser console for errors

### LinkedIn Import Not Working?
1. Ensure backend server is running (`npm start` in backend folder)
2. Check LinkedIn app credentials in `.env`
3. Verify redirect URL matches exactly
4. Check browser console for errors

### Effects Not Showing?
1. Make sure Advanced Options is expanded
2. Select desired effects from dropdowns
3. HTML export shows all effects (PDF is clean)

## 🔥 INSANE MODE

For the ultimate experience:
1. Show Advanced Options
2. Set Performance Mode to "INSANE MODE 🔥"
3. Enable ALL checkboxes
4. Watch your CV come alive!

**Warning**: This mode uses significant CPU/GPU resources!

## 📦 Export Options

### HTML Export
- Contains ALL animations and effects
- Standalone file (no dependencies)
- Perfect for online portfolios
- Share via URL or email

### PDF Export
- Clean, professional format
- No animations (printer-friendly)
- Perfect for traditional applications
- ATS-compatible

## 🎯 Tips for Best Results

1. **For Job Applications**: Use Classic layout, minimal effects, export as PDF
2. **For Portfolio**: Use Portfolio layout, enable all effects, export as HTML
3. **For LinkedIn**: Import profile first, then customize
4. **For Maximum Impact**: Enable INSANE MODE with all effects!

## 🆘 Support

If you encounter any issues:
1. Check browser console for errors
2. Ensure all files are in correct locations
3. Try clearing browser cache
4. Test with different browsers

## 🎉 Enjoy Your MASTERPIECE CV!

You now have the most advanced CV builder ever created! Your CV is not just a document - it's a DIGITAL EXPERIENCE! 🚀✨🎆
