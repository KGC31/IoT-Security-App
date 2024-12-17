# IoT-Security-App

A React Native app for monitoring security cameras in an IoT setup. This app allows users to view live video feeds from connected devices, manage devices, and receive notifications.

## Features

- Live streaming from security cameras
- Device management (add, remove, and view devices)
- Real-time notifications for events
- Time tracking for live feeds

## Requirements

- Node.js (>= 16.x)
- React Native CLI
- Xcode (for iOS development) or Android Studio (for Android development)
- A physical device or emulator for testing

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/IoT-Security-App.git
cd IoT-Security-App
```

### 2. Install dependencies

```bash
npm install
```

or, if you prefer yarn:

```bash
yarn install
```

### 3.Set up environment variables

Ensure that you have a `.env` file in the root directory with the following variables:

```env
# Firebase private keys
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
```

### 4. Run the app

```bash
npx expo start
```


## Folder Structure

```
src/
├── assets/                # Static assets like images, icons, etc.
├── components/            # Reusable components (Buttons, Dropdowns, etc.)
├── hooks/                 # Custom React hooks
├── services/              # API calls and service logic
├── screens/               # App screens (Livestream, Device Management, etc.)
├── navigation/            # Navigation logic and routing
├── utils/                 # Utility functions
├── .env                   # Environment variables
├── App.tsx                # Main app entry point
└── package.json           # NPM package configuration
```

## Contributing

1. Fork the repository.
2. Create a new branch (git checkout -b feature/your-feature).
3. Make your changes.
4. Commit your changes (git commit -am 'Add new feature').
5. Push to the branch (git push origin feature/your-feature).
6. Create a new pull request.

## Contact
For more information, contact the project maintainer:

Name: Kim Nguyen

Email: kimnguyenblc@gmail.com

GitHub: https://github.com/KGC31