import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink, Edit } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHammer, faCrown, faBolt, faWrench } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { EvadeData, Activity } from './types/evade';
import { fetchEvadeData, fetchGuildInfo, getAvatarUrl, getStatusText, getStatusClass } from './services/evadeApi';
import './App.css';

function App() {
  const [userId, setUserId] = useState<string>('');
  const [userData, setUserData] = useState<EvadeData | null>(null);
  const [guildInfo, setGuildInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [showHome, setShowHome] = useState<boolean>(true);
  const [homeUserData, setHomeUserData] = useState<EvadeData | null>(null);
  const [showCredits, setShowCredits] = useState<boolean>(false);

  // Load user data from URL params on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('id');
    if (idFromUrl) {
      setUserId(idFromUrl);
      loadUserData(idFromUrl);
    }
    
    // Load home page user data
    loadHomeUserData();
  }, [userId]);

  const loadHomeUserData = async () => {
    try {
      const response = await fetchEvadeData('785306533050974259');
      if (response.success) {
        setHomeUserData(response.data);
      }
    } catch (err) {
      console.log('Error loading home user data:', err);
    }
  };

  const loadUserData = async (id: string) => {
    if (!id.trim()) return;
    
    setLoading(true);
    setError(null);
    setShowHome(false);
    setLoadingProgress(0);
    
    try {
      const response = await fetchEvadeData(id);
      if (response.success) {
        // Start the 5-second loading delay with progress updates
        const startTime = Date.now();
        const duration = 5000; // 5 seconds
        
        const progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min((elapsed / duration) * 100, 100);
          setLoadingProgress(progress);
          
          if (progress >= 100) {
            clearInterval(progressInterval);
            setUserData(response.data);
            setLoading(false);
            setLoadingProgress(0);
          }
        }, 50); // Update every 50ms for smooth progress
        
        // Debug: Log the full response to see what data is available
        console.log('Full API Response:', response);
        console.log('User Data:', response.data);
        console.log('KV Data:', response.data?.kv);
        console.log('Discord User:', response.data?.discord_user);
        console.log('Activities:', response.data?.activities);
        console.log('Full User Data Structure:', JSON.stringify(response.data, null, 2));
        console.log('All KV Keys:', Object.keys(response.data?.kv || {}));
        console.log('All Discord User Keys:', Object.keys(response.data?.discord_user || {}));
        
        // Try to fetch guild information
        const guildData = await fetchGuildInfo(id);
        setGuildInfo(guildData);
        
        // Update URL with user ID
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('id', id);
        window.history.pushState({}, '', newUrl.toString());
      } else {
        setError('Failed to load user data');
        setLoading(false);
        setLoadingProgress(0);
      }
    } catch (err) {
      setError('Error loading user data. Please check the Discord User ID.');
      setLoading(false);
      setLoadingProgress(0);
    }
  };

  const handleLoadUser = () => {
    if (userId.trim()) {
      loadUserData(userId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLoadUser();
    }
  };

  const copyShareableUrl = () => {
    if (userData) {
      const url = new URL(window.location.href);
      url.searchParams.set('id', userData.discord_user.id);
      navigator.clipboard.writeText(url.toString());
    }
  };

  const getDeviceStatus = (device: 'desktop' | 'mobile' | 'web') => {
    if (!userData) return false;
    
    switch (device) {
      case 'desktop':
        return userData.active_on_discord_desktop || false;
      case 'mobile':
        return userData.active_on_discord_mobile || false;
      case 'web':
        return userData.active_on_discord_web || false;
      default:
        return false;
    }
  };

  const getActivityImageUrl = (activity: Activity) => {
    if (!activity.assets) return null;
    
    const imageId = activity.assets.large_image || activity.assets.small_image;
    if (!imageId) return null;
    
    // Handle different image URL formats
    if (imageId.startsWith('mp:external/')) {
      // External image
      return imageId.replace('mp:external/', 'https://media.discordapp.net/external/');
    } else if (imageId.startsWith('spotify:')) {
      // Spotify image
      return `https://i.scdn.co/image/${imageId.replace('spotify:', '')}`;
    } else if (activity.application_id) {
      // Discord CDN image with application ID
      return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${imageId}.png`;
    } else {
      // Fallback to direct image URL
      return imageId;
    }
  };

  const getGuildTag = () => {
    if (!userData) return null;
    
    // Debug: Log all possible guild tag locations
    console.log('Checking for guild tag in:', {
      discord_user_guild_tag: userData.discord_user.guild_tag,
      kv_guild_tag: userData.kv?.guild_tag,
      kv_server_tag: userData.kv?.server_tag,
      kv_data: userData.kv,
      guild_info: guildInfo,
      full_user_data: userData
    });
    
    // Check for guild tag in different possible locations
    const guildTag = userData.discord_user.guild_tag || 
           userData.kv?.guild_tag || 
           userData.kv?.server_tag ||
           userData.kv?.guild_tag ||
           userData.kv?.tag ||
           guildInfo?.guild_tag ||
           guildInfo?.tag ||
           // Check for any guild-related fields in the user data
           userData.kv?.guild ||
           userData.kv?.server ||
           userData.kv?.nickname ||
           userData.kv?.nick ||
           null;
    
    console.log('Found guild tag:', guildTag);
    return guildTag;
  };

  const getSpecialBadges = () => {
    if (!userData) return null;
    
    // Check if this is the special user ID
    if (userData.discord_user.id === '785306533050974259') {
      return [
        { text: 'Owner', icon: faCrown },
        { text: 'Developer', icon: faBolt },
        { text: 'Staff', icon: faWrench }
      ];
    }
    
    return null;
  };







  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <img 
            src="https://files.catbox.moe/gjbisi.webp" 
            alt="Discord Bio Card Logo" 
            className="header-logo"
          />
          <div className="header-text">
            <h1 className="title gradient-text">Discord Bio Card</h1>
            <p className="subtitle">
              Create beautiful bio cards with Apple's magic glass theme using Discord's Evade API.
            </p>
          </div>
        </div>
        <button 
          className="credits-button"
          onClick={() => setShowCredits(true)}
          title="Credits"
        >
          <FontAwesomeIcon icon={faHammer} size="lg" />
        </button>
      </header>

      {/* Home Page */}
      {showHome && (
        <div className="home-page">
          <div className="hero-section">
            <div className="hero-content">
              <h2 className="hero-title">Create Your Discord Bio Card</h2>
              <p className="hero-description">
                Showcase your Discord profile with a stunning glassmorphism design. 
                Display your status, activities, and more in a beautiful, modern interface.
              </p>
              <div className="hero-features">
                <div className="feature-item">
                  <div className="feature-icon">🎨</div>
                  <span>Glassmorphism Design</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📱</div>
                  <span>Real-time Status</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🎮</div>
                  <span>Activity Display</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔗</div>
                  <span>Shareable Links</span>
                </div>
              </div>
              <button 
                className="cta-button"
                onClick={() => setShowHome(false)}
              >
                Get Started
              </button>
            </div>
            <div className="hero-visual">
              <div className="floating-card">
                {homeUserData ? (
                  <>
                    <img 
                      src={getAvatarUrl(
                        homeUserData.discord_user.id,
                        homeUserData.discord_user.avatar,
                        homeUserData.discord_user.discriminator
                      )}
                      alt={`${homeUserData.discord_user.username}'s avatar`}
                      className="card-avatar"
                    />
                    <div className="card-content">
                      <div className="card-username">
                        {homeUserData.discord_user.global_name || homeUserData.discord_user.username}
                      </div>
                      <div className="card-status">
                        {getStatusText(homeUserData.discord_status)}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="card-avatar"></div>
                    <div className="card-content">
                      <div className="card-username">Loading...</div>
                      <div className="card-status">Online</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      

      {/* Main Content */}
      {!showHome && (
        <main className="main-content">
          {/* Input Card */}
          <div className="glass-card input-card animate-fade-in">
            <div className="input-section">
              <label htmlFor="userId" className="input-label">Enter Discord User ID</label>
              <div className="input-group">
                <input
                  id="userId"
                  type="text"
                  className="glass-input"
                  placeholder="Discord User ID (e.g., 1045909242101633126)"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className="glass-button load-button"
                  onClick={handleLoadUser}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                      Loading...
                    </div>
                  ) : (
                    'Load User'
                  )}
                </button>
              </div>
              {userData && (
                <button
                  className="copy-url-button link-hover"
                  onClick={copyShareableUrl}
                >
                  <Copy size={16} />
                  Copy Shareable URL
                </button>
              )}
            </div>
          </div>

          {/* Loading Animation */}
          {loading && (
            <div className="loading-overlay">
              <div className="loading-card">
                <div className="loading-avatar"></div>
                <div className="loading-content">
                  <div className="loading-username"></div>
                  <div className="loading-status"></div>
                  <div className="loading-progress-container">
                    <div className="loading-progress-bar">
                      <div 
                        className="loading-progress-fill"
                        style={{ width: `${loadingProgress}%` }}
                      ></div>
                    </div>
                    <div className="loading-progress-text">
                      {loadingProgress < 20 && "Connecting to Discord..."}
                      {loadingProgress >= 20 && loadingProgress < 40 && "Fetching user data..."}
                      {loadingProgress >= 40 && loadingProgress < 60 && "Loading activities..."}
                      {loadingProgress >= 60 && loadingProgress < 80 && "Preparing bio card..."}
                      {loadingProgress >= 80 && loadingProgress < 100 && "Almost ready..."}
                      {loadingProgress >= 100 && "Complete!"}
                    </div>
                    <div className="loading-percentage">{Math.round(loadingProgress)}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Bio Card */}
          {userData && (
            <div className="glass-card bio-card animate-slide-up">
              <div className="user-info">
                <div className="avatar-section">
                  <img
                    src={getAvatarUrl(
                      userData.discord_user.id,
                      userData.discord_user.avatar,
                      userData.discord_user.discriminator
                    )}
                    alt={`${userData.discord_user.username}'s avatar`}
                    className="avatar animate-fade-in"
                  />
                </div>
                <div className="user-details">
                  <div className="username-section">
                    <div className="username-row">
                      <h2 className="username animate-slide-in">
                        {userData.discord_user.global_name || userData.discord_user.username}
                      </h2>
                      {getSpecialBadges() && (
                        <div className="special-badges-container">
                                                  {getSpecialBadges()?.map((badge, index) => (
                          <span 
                            key={index} 
                            className="special-badge animate-bounce-in" 
                            title={badge.text}
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <span className="badge-icon">
                              <FontAwesomeIcon icon={badge.icon} />
                            </span>
                            <span className="badge-text-hover">{badge.text}</span>
                          </span>
                        ))}
                        </div>
                      )}
                    </div>
                    <p className="discord-tag animate-slide-in">
                      @{userData.discord_user.username}#{userData.discord_user.discriminator}
                    </p>
                    {getGuildTag() && (
                      <span className="guild-tag animate-bounce-in">{getGuildTag()}</span>
                    )}
                  </div>
                  <p className={`status ${getStatusClass(userData.discord_status)} animate-fade-in`}>
                    {getStatusText(userData.discord_status)}
                  </p>
                  {userData.kv?.location && (
                    <p className="location animate-fade-in">
                      📍 {userData.kv.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="activity-section">
                <div className="activity-grid">
                  <div className="activity-item animate-slide-in">
                    <h3 className="activity-title">Device Activity</h3>
                    <div className="device-list">
                      <div className="device-item">
                        <span>Desktop</span>
                        <span className={getDeviceStatus('desktop') ? 'device-active' : 'device-inactive'}>
                          {getDeviceStatus('desktop') ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="device-item">
                        <span>Mobile</span>
                        <span className={getDeviceStatus('mobile') ? 'device-active' : 'device-inactive'}>
                          {getDeviceStatus('mobile') ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="device-item">
                        <span>Web</span>
                        <span className={getDeviceStatus('web') ? 'device-active' : 'device-inactive'}>
                          {getDeviceStatus('web') ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="activity-item animate-slide-in">
                    <h3 className="activity-title">Activities</h3>
                    <div className="activity-content">
                      {(() => {
                        if (!userData || !userData.activities || userData.activities.length === 0) {
                          return <p className="activities-text">No current activities</p>;
                        }
                        
                        return (
                          <div className="activities-list">
                            {userData.activities.map((activity, index) => {
                              const imageUrl = getActivityImageUrl(activity);
                              return (
                                <div key={index} className="activity-card animate-fade-in">
                                  {imageUrl && (
                                    <img 
                                      src={imageUrl} 
                                      alt={`${activity.name} activity`}
                                      className="activity-image"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  )}
                                  <div className="activity-info">
                                    <div className="activity-header">
                                      <span className="activity-type">
                                        {activity.type === 0 ? 'Playing' : 
                                         activity.type === 1 ? 'Streaming' : 
                                         activity.type === 2 ? 'Listening' : 
                                         activity.type === 3 ? 'Watching' : 
                                         activity.type === 4 ? 'Custom' : 
                                         activity.type === 5 ? 'Competing' : 'Unknown'}
                                      </span>
                                      {activity.emoji && (
                                        <span className="activity-emoji">{activity.emoji.name}</span>
                                      )}
                                    </div>
                                    <div className="activity-main">
                                      <p className="activity-name">{activity.name}</p>
                                      {activity.details && (
                                        <p className="activity-details">{activity.details}</p>
                                      )}
                                      {activity.state && (
                                        <p className="activity-state">{activity.state}</p>
                                      )}
                                      {activity.timestamps && (
                                        <p className="activity-time">
                                          {new Date(activity.timestamps.start).toLocaleTimeString()}
                                        </p>
                                      )}
                                      {activity.assets?.large_text && (
                                        <p className="activity-asset-text">{activity.assets.large_text}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <span className="powered-by">Powered by Evade API</span>
                <a
                  href={`https://discord.com/users/${userData.discord_user.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="discord-link link-hover"
                >
                  <ExternalLink size={16} />
                  View on Discord
                </a>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="error-message animate-shake">
              {error}
            </div>
          )}

          {/* Back to Home Button */}
          <button 
            className="back-home-button"
            onClick={() => {
              setShowHome(true);
              setUserData(null);
              setError(null);
            }}
          >
            ← Back to Home
          </button>


        </main>
      )}

      {/* Credits Page */}
      {showCredits && (
        <div className="credits-overlay">
          <div className="credits-card">
            <div className="credits-header">
              <FontAwesomeIcon icon={faHammer} size="2x" className="credits-icon" />
              <h2 className="credits-title">Credits</h2>
            </div>
            <div className="credits-content">
              <p className="credits-description">This website was created by:</p>
              <div className="creator-info">
                <a 
                  href="https://github.com/ren3zo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="creator-link"
                >
                  <span className="creator-name">ren3zo</span>
                  <FontAwesomeIcon icon={faGithub} className="github-icon" />
                </a>
                <a 
                  href="https://github.com/Phineas" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="creator-link"
                >
                  <span className="creator-name">Phineas</span>
                  <FontAwesomeIcon icon={faGithub} className="github-icon" />
                </a>
              </div>
            </div>
            <button 
              className="back-button"
              onClick={() => setShowCredits(false)}
            >
              ← Back
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          Built with React, TypeScript, and Glassmorphism design • Powered by Evade API
        </p>
        <button className="edit-button link-hover">
          <Edit size={16} />
        </button>
      </footer>
    </div>
  );
}

export default App; 
