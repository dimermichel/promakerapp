# PromakerApp

PromakerApp is a mobile application designed to help you express your ideas more effectively. With PromakerApp, you can create scripts and record yourself to refine and share your thoughts effortlessly.

---

## 🚀 Features

- **Script Creation**: Write and organize scripts for your ideas.
- **Recording Feature**: Record yourself presenting your scripts directly within the app.
- **Save & Replay**: Save recordings for future use or review.
- **User-Friendly Interface**: Intuitive design for easy script editing and recording.
- **Cross-Platform**: Available on both Android and iOS devices.

---

## 🛠️ Tech Stack

- **Mobile**: [React Native](https://reactnative.dev/)  
- **Navigation**: [React Navigation](https://reactnavigation.org/)  
- **Media Handling**: [Expo AV](https://docs.expo.dev/versions/latest/sdk/av/) or similar library for audio/video recording.  
- **Styling**: [Styled Components](https://styled-components.com/)

---

## 📂 Project Structure

```plaintext
promakerapp/
├── android/              # Android-specific code and configurations
├── ios/                  # iOS-specific code and configurations
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Application screens/views
│   ├── navigation/       # Navigation setup
│   ├── services/         # Media and storage handling
│   ├── utils/            # Utility functions
│   └── assets/           # Images, fonts, and other static resources
├── App.js                # Main application entry point
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## 🔧 Prerequisites

Before you begin, ensure you have the following installed on your machine:

1. **Node.js** (>=16.x):  
   Download and install it from [Node.js official site](https://nodejs.org/).

2. **Yarn** or **npm**:  
   Install either Yarn or npm as your package manager.

3. **Expo CLI**:  
   Install it globally by running:  
   ```bash
   npm install -g expo-cli
   
4. **Android Studio**:
Required for running the app on Android emulators or physical devices. Follow the installation guide for your operating system:
Android Studio Download.

5. **Xcode (macOS only)**:
Required for running the app on iOS simulators or physical devices. Install it from the Mac App Store.

## 📦 Installation

Follow these steps to set up and run the project locally:

1. **Clone the repository**:  
   Use the `git clone` command to download the project to your local machine.  
   ```bash
   git clone https://github.com/dimermichel/promakerapp.git
   cd promakerapp
   ```
2. **Install dependencies**:  
   Use npm or yarn to install the required packages.

```bash
npm install
# or
yarn install
```
3. **Start the development server**:  
   Launch the Metro Bundler, which serves as the development server for React Native.

```bash
npx react-native start
```
4. **Run the application**:  
   Choose the platform to run the app.

- For Android:
  
  Use the following command to run the app on an Android emulator or connected device:

```bash
npx react-native run-android
```
- For iOS (macOS only):
  Use the following command to run the app on an iOS simulator or connected device:

```bash
npx react-native run-ios
```
5. **View the app**:  
   Once the app is running, you can make changes to the code, and the app will reload automatically.

---

## 📧 Contact

For questions, suggestions, or feedback, feel free to reach out:

- **Michel Maia**  
  [GitHub Profile](https://github.com/dimermichel)  
  [Email](mailto:dimermichel@gmail.com)

We’d love to hear from you!

---

## 🛡️ License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute this software, subject to the terms of the license.


