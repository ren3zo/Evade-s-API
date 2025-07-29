const express = require('express');
const cors = require('cors');
// Node.js 18+ has fetch built-in, no need for node-fetch

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Discord API endpoints
const DISCORD_API_BASE = 'https://discord.com/api/v10';

// Custom API endpoint to get user data
app.get('/api/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // You'll need to set up a Discord bot token
    const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    
    if (!DISCORD_BOT_TOKEN) {
      // Return mock data for testing when no bot token is configured
      console.log('No Discord bot token configured, returning mock data');
      const mockResponse = {
        success: true,
        data: {
          active_on_discord_mobile: false,
          active_on_discord_desktop: true,
          listening_to_spotify: true,
          // Lanyard KV
          kv: {
            location: "Los Angeles, CA"
          },
          // Below is a custom crafted "spotify" object, which will be null if listening_to_spotify is false
          spotify: {
            track_id: "3kdlVcMVsSkbsUy8eQcBjI",
            timestamps: {
              start: 1615529820677,
              end: 1615530068733
            },
            song: "Let Go",
            artist: "Ark Patrol; Veronika Redd",
            album_art_url: "https://i.scdn.co/image/ab67616d0000b27364840995fe43bb2ec73a241d",
            album: "Let Go"
          },
          discord_user: {
            username: "Phineas",
            public_flags: 131584,
            id: userId,
            discriminator: "0001",
            avatar: "a_7484f82375f47a487f41650f36d30318"
          },
          discord_status: "online",
          // activities contains the plain Discord activities array that gets sent down with presences
          activities: [
            {
              type: 2,
              timestamps: {
                start: 1615529820677,
                end: 1615530068733
              },
              sync_id: "3kdlVcMVsSkbsUy8eQcBjI",
              state: "Ark Patrol; Veronika Redd",
              session_id: "140ecdfb976bdbf29d4452d492e551c7",
              party: {
                id: "spotify:94490510688792576"
              },
              name: "Spotify",
              id: "spotify:1",
              flags: 48,
              details: "Let Go",
              created_at: 1615529838051,
              assets: {
                large_text: "Let Go",
                large_image: "spotify:ab67616d0000b27364840995fe43bb2ec73a241d"
              }
            },
            {
              type: 0,
              timestamps: {
                start: 1615438153941
              },
              state: "Workspace: lanyard",
              name: "Visual Studio Code",
              id: "66b84f5317e9de6c",
              details: "Editing README.md",
              created_at: 1615529838050,
              assets: {
                small_text: "Visual Studio Code",
                small_image: "565945770067623946",
                large_text: "Editing a MARKDOWN file",
                large_image: "565945077491433494"
              },
              application_id: "383226320970055681"
            }
          ]
        }
      };
      return res.json(mockResponse);
    }

    // Fetch user data from Discord API
    const userResponse = await fetch(`${DISCORD_API_BASE}/users/${userId}`, {
      headers: {
        'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!userResponse.ok) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = await userResponse.json();

    // Fetch user's guild memberships (servers)
    const guildsResponse = await fetch(`${DISCORD_API_BASE}/users/@me/guilds`, {
      headers: {
        'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    let guilds = [];
    if (guildsResponse.ok) {
      guilds = await guildsResponse.json();
    }

    // Custom response format similar to Lanyard
    const customResponse = {
      success: true,
      data: {
        discord_user: {
          id: userData.id,
          username: userData.username,
          discriminator: userData.discriminator,
          avatar: userData.avatar,
          global_name: userData.global_name,
          display_name: userData.global_name || userData.username,
          display_avatar: userData.avatar
        },
        activities: [], // You can implement activity tracking
        listening_to_spotify: false, // You can implement Spotify integration
        spotify: null,
        discord_status: 'online', // You can implement status tracking
        active_on_discord_mobile: false,
        active_on_discord_desktop: true,
        active_on_discord_web: false,
        guilds: guilds
      }
    };

    res.json(customResponse);

  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Add error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Guild info endpoint
app.get('/api/guild/:guildId', async (req, res) => {
  try {
    const { guildId } = req.params;
    const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

    if (!DISCORD_BOT_TOKEN) {
      // Return mock guild data for testing
      console.log('No Discord bot token configured, returning mock guild data');
      const mockGuildResponse = {
        success: true,
        data: {
          id: guildId,
          name: 'Test Guild',
          icon: null,
          owner: false,
          permissions: '0'
        }
      };
      return res.json(mockGuildResponse);
    }

    const guildResponse = await fetch(`${DISCORD_API_BASE}/guilds/${guildId}`, {
      headers: {
        'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!guildResponse.ok) {
      return res.status(404).json({ error: 'Guild not found' });
    }

    const guildData = await guildResponse.json();
    res.json({ success: true, data: guildData });

  } catch (error) {
    console.error('Error fetching guild data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Custom Discord API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 