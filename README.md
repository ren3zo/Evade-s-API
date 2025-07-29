# Discord Bio Card

A beautiful, modern Discord bio card generator built with React, TypeScript, and the Evade API. Create stunning glassmorphism-style bio cards that showcase your Discord profile, status, activities, and more.

![Discord Bio Card Preview](https://files.catbox.moe/gjbisi.webp)

## ✨ Features

### 🎨 **Modern Design**
- **Glassmorphism UI**: Beautiful frosted glass effects with blur and transparency
- **Blue & Black Theme**: Elegant color scheme with blue accents
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Fade-in, slide-up, and bounce animations throughout

### 📱 **Discord Integration**
- **Real-time Status**: Shows your current Discord status (Online, Idle, DND, Offline)
- **Activity Display**: Shows what you're playing, listening to, or watching
- **Device Activity**: Displays which Discord clients you're active on
- **Avatar Integration**: Your Discord profile picture with hover effects
- **Location Support**: Shows your location if set in Discord

### 🏷️ **Special Features**
- **Guild Tag Detection**: Automatically detects and displays server tags
- **Special Badges**: Custom badges for owners, developers, and staff
- **Activity Images**: Shows game/activity artwork when available
- **Shareable URLs**: Generate and share your bio card with others

### 🚀 **User Experience**
- **5-Second Loading**: Beautiful loading animation with progress tracking
- **Home Page**: Landing page with feature showcase
- **Credits System**: Built-in credits page with creator information
- **Error Handling**: Graceful error messages and fallbacks

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with Glassmorphism effects
- **Icons**: Lucide React & FontAwesome
- **API**: Evade API (Discord integration)
- **Deployment**: Ready for Vercel, Netlify, or any static hosting

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd discord-bio-card

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🎯 Usage

### For Users
1. **Visit the Home Page**: See the beautiful landing page with feature showcase
2. **Enter Discord User ID**: Input any Discord user ID (e.g., `785306533050974259`)
3. **Load User Data**: Click "Load User" to fetch Discord information
4. **View Bio Card**: See the generated bio card with all user information
5. **Share**: Copy the shareable URL to share with others

### For Developers
```typescript
// Example API call
const response = await fetchEvadeData('785306533050974259');
if (response.success) {
  const userData = response.data;
  // Access user information
  console.log(userData.discord_user.username);
  console.log(userData.discord_status);
  console.log(userData.activities);
}
```

## 🔧 API Integration

### Evade API Endpoints
- **User Data**: `https://api.lanyard.rest/v1/users/{userId}`
- **Guild Info**: `https://api.lanyard.rest/v1/users/{userId}/guilds`

### Data Structure
```typescript
interface EvadeData {
  discord_user: DiscordUser;
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: Activity[];
  listening_to_spotify: boolean;
  spotify?: SpotifyData;
  kv: Record<string, any>;
  active_on_discord_web?: boolean;
  active_on_discord_desktop?: boolean;
  active_on_discord_mobile?: boolean;
}
```

## 🎨 Customization

### Colors
The application uses a blue and black theme. To customize colors, edit the CSS variables in `src/index.css`:

```css
:root {
  --primary-blue: #3b82f6;
  --secondary-blue: #1d4ed8;
  --background-dark: #0a0a0a;
  --glass-bg: rgba(255, 255, 255, 0.1);
}
```

### Animations
Customize animations by modifying the keyframes in `src/App.css`:

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### Special Badges
Add custom badges for specific users by modifying the `getSpecialBadges()` function in `src/App.tsx`:

```typescript
const getSpecialBadges = () => {
  if (userData.discord_user.id === 'YOUR_USER_ID') {
    return [
      { text: 'Owner', icon: faCrown },
      { text: 'Developer', icon: faBolt }
    ];
  }
  return null;
};
```

## 📁 Project Structure

```
discord-bio-card/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   ├── services/
│   │   └── evadeApi.ts          # API integration
│   ├── types/
│   │   └── evade.ts             # TypeScript interfaces
│   ├── App.tsx                  # Main component
│   ├── App.css                  # Component styles
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build the project
npm run build

# Deploy the dist folder to Netlify
```

### Static Hosting
```bash
# Build for production
npm run build

# The dist folder contains the static files
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

**Created by:**
- **ren3zo** - [GitHub](https://github.com/ren3zo)
- **Phineas** - [GitHub](https://github.com/Phineas)

**Special thanks to:**
- [Evade API](https://github.com/Phineas/lanyard) for Discord integration
- [Lucide React](https://lucide.dev/) for beautiful icons
- [FontAwesome](https://fontawesome.com/) for additional icons

## 🔗 Links

- **Live Demo**: [Your deployed URL]
- **GitHub Repository**: [Repository URL]
- **Evade API Documentation**: [API Docs URL]

## 📊 Features Overview

| Feature | Status | Description |
|---------|--------|-------------|
| Glassmorphism Design | ✅ | Beautiful frosted glass effects |
| Real-time Status | ✅ | Live Discord status updates |
| Activity Display | ✅ | Shows current activities with images |
| Device Activity | ✅ | Desktop, mobile, web client status |
| Guild Tag Detection | ✅ | Auto-detects server tags |
| Special Badges | ✅ | Custom badges for specific users |
| Shareable URLs | ✅ | Generate and share bio cards |
| Responsive Design | ✅ | Works on all devices |
| Loading Animations | ✅ | 5-second loading with progress |
| Error Handling | ✅ | Graceful error messages |
| Location Support | ✅ | Shows user location if set |

## 🐛 Known Issues

- Guild tag detection relies on Lanyard KV store configuration
- Some activity images may not load due to Discord CDN restrictions
- Location feature requires manual setup in Discord

## 🔮 Future Enhancements

- [ ] Spotify integration with album artwork
- [ ] Custom themes and color schemes
- [ ] Export bio card as image
- [ ] Multiple bio card layouts
- [ ] Real-time updates via WebSocket
- [ ] User preferences and settings
- [ ] Dark/Light mode toggle

---

**Made with ❤️ using React, TypeScript, and the Evade API** 