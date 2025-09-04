# Audio Castaway Mobile App

A React Native Expo mobile application converted from the Audio Castaway web app. This app provides a mobile-first experience for accessing educational audio content with features like topic-based browsing, audio playback, bookmarks, and user authentication.

## 🚀 Features

- **Topic-based UI Flow**: Kuku FM style interface for easy content discovery
- **Real Supabase Integration**: Same database structure as the web app
- **Audio Playback**: Native mobile audio playback with Expo AV
- **User Authentication**: Secure authentication with Supabase Auth
- **Bookmarks**: Save and manage favorite audio content
- **Downloads**: Offline download functionality (coming soon)
- **Admin Panel**: Administrative features (coming soon)
- **Profile Management**: User profile and statistics
- **Responsive Design**: Optimized for mobile screens
- **Dark Theme**: Consistent branding with the web app

## 📱 Screenshots

*Screenshots will be added after the app is built and tested*

## 🛠 Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe development
- **Supabase**: Backend as a Service (Database, Auth, Storage)
- **React Navigation**: Navigation library
- **Expo AV**: Audio/Video playback
- **Expo Linear Gradient**: Gradient components
- **Expo Vector Icons**: Icon library

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) app on your mobile device (for testing)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd audio-castaway-main/mobile
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment

The app uses the same Supabase configuration as the web app. The Supabase URL and API key are already configured in `src/lib/supabase.ts`.

### 4. Start the Development Server

```bash
npm start
# or
yarn start
```

This will start the Expo development server and show a QR code.

### 5. Run on Device/Simulator

#### On Physical Device:
1. Install the [Expo Go](https://expo.dev/client) app
2. Scan the QR code with your camera (iOS) or Expo Go app (Android)

#### On iOS Simulator:
```bash
npm run ios
# or
yarn ios
```

#### On Android Emulator:
```bash
npm run android
# or
yarn android
```

## 📁 Project Structure

```
mobile/
├── App.tsx                 # Main app component
├── app.json               # Expo configuration
├── babel.config.js        # Babel configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── src/
    ├── contexts/          # React contexts
    │   ├── AuthContext.tsx
    │   └── AudioContext.tsx
    ├── lib/               # Utilities and services
    │   ├── database.ts
    │   └── supabase.ts
    ├── navigation/        # Navigation configuration
    │   └── AppNavigator.tsx
    └── screens/           # App screens
        ├── AdminScreen.tsx
        ├── AuthScreen.tsx
        ├── BookmarksScreen.tsx
        ├── DownloadsScreen.tsx
        ├── HomeScreen.tsx
        ├── ProfileScreen.tsx
        ├── SubjectPlaylistScreen.tsx
        └── TopicDetailScreen.tsx
```

## 🔧 Configuration

### Supabase Configuration

The app is configured to use the same Supabase instance as the web app:

- **URL**: `https://uhiouyerssbfqohnxsba.supabase.co`
- **Anon Key**: Already configured in the code

### Audio Configuration

The app uses Expo AV for audio playback with the following features:
- Background audio playback
- Play/pause controls
- Seek functionality
- Volume control
- Playback speed adjustment

## 📱 App Screens

### 1. Authentication Screen
- Sign in/Sign up functionality
- Email and password authentication
- Responsive design with gradient background

### 2. Home Screen
- Hero section with app branding
- Categories section for subject browsing
- Trending topics carousel
- Recommended topics grid
- Pull-to-refresh functionality

### 3. Topic Detail Screen
- List of audio files for a specific topic
- Play/pause functionality
- Bookmark toggle
- Audio metadata display

### 4. Bookmarks Screen
- User's bookmarked audio content
- Play and remove functionality
- Empty state handling

### 5. Profile Screen
- User information display
- Listening statistics
- Settings menu
- Sign out functionality

### 6. Downloads Screen
- Placeholder for offline download functionality
- Will be implemented in future updates

## 🎨 Design System

The app follows a consistent design system:

### Colors
- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#8b5cf6` (Purple)
- **Background**: `#0F0F23` (Dark Blue)
- **Surface**: `#1F1F37` (Lighter Dark Blue)
- **Text Primary**: `#FFFFFF` (White)
- **Text Secondary**: `#9CA3AF` (Gray)

### Typography
- **Headers**: Bold, 20-32px
- **Body**: Regular, 14-16px
- **Captions**: Regular, 12px

### Components
- **Cards**: Rounded corners (12px), subtle shadows
- **Buttons**: Gradient backgrounds, rounded corners
- **Icons**: Ionicons from Expo Vector Icons

## 🔊 Audio Features

### Audio Context
The app includes a comprehensive audio context that provides:
- Global audio state management
- Play/pause functionality
- Seek controls
- Volume adjustment
- Playback speed control
- Background audio support

### Audio Player Features
- **Play/Pause**: Toggle audio playback
- **Seek**: Jump to specific time positions
- **Skip**: 10-second forward/backward
- **Volume**: Adjustable volume control
- **Speed**: Playback speed adjustment (1x, 1.25x, 1.5x, 2x)
- **Background Play**: Continue playing when app is backgrounded

## 🔐 Authentication

The app uses Supabase Auth for user management:
- Email/password authentication
- Secure token storage with Expo SecureStore
- Automatic session management
- Sign out functionality

## 📊 Database Integration

The app maintains the same database structure as the web app:
- **Topics**: Audio content organized by topics
- **Subjects**: Subject categorization
- **Chapters**: Chapter organization
- **Audios**: Individual audio files
- **Bookmarks**: User bookmarks
- **Downloads**: Download tracking
- **Profiles**: User profiles
- **Listening History**: Playback tracking

## 🚧 Future Enhancements

### Planned Features
1. **Offline Downloads**: Download audio for offline listening
2. **Enhanced Admin Panel**: Full admin functionality
3. **Subject Playlists**: Curated subject-based playlists
4. **Push Notifications**: Content updates and reminders
5. **Social Features**: Sharing and community features
6. **Advanced Analytics**: Detailed listening analytics
7. **Sleep Timer**: Auto-stop functionality
8. **Equalizer**: Audio enhancement controls

### Technical Improvements
1. **Performance Optimization**: Lazy loading and caching
2. **Error Handling**: Comprehensive error management
3. **Testing**: Unit and integration tests
4. **CI/CD**: Automated build and deployment
5. **Accessibility**: Screen reader support
6. **Internationalization**: Multi-language support

## 🐛 Known Issues

1. TypeScript errors for missing React Native types (resolved after npm install)
2. Some placeholder screens need full implementation
3. Audio progress tracking needs enhancement
4. Download functionality is not yet implemented

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- Original Audio Castaway web app team
- Expo team for the excellent development platform
- Supabase team for the backend infrastructure
- React Native community for the amazing ecosystem

---

**Note**: This mobile app is a direct conversion of the Audio Castaway web application, maintaining the same functionality and database structure while providing a native mobile experience.