# Letterly - Write Beautiful Letters

Letterly is a modern web application that allows users to write beautiful letters and share them with anyone using links or QR codes. Built with React, Firebase, and designed for easy deployment on GitHub Pages.

## Features

- **User Authentication**: Simple email/password login and signup using Firebase Auth
- **Letter Writing**: Clean, distraction-free editor for writing letters in any language
- **Letter Sharing**: Generate shareable links and QR codes for your letters
- **Beautiful Letter View**: Old-style letter interface for reading shared letters
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18 with Vite
- **Backend**: Firebase (Authentication & Firestore)
- **Styling**: CSS3 with modern design patterns
- **QR Codes**: qrcode.react
- **Routing**: React Router DOM
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Firebase project (for backend services)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/letterly.git
cd letterly
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password
   - Create a Firestore database
   - Update the Firebase configuration in `src/firebase.js` with your project details

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Deployment to GitHub Pages

### Step 1: Build the Project

```bash
npm run build
```

### Step 2: Deploy to GitHub Pages

1. Create a new repository on GitHub named `letterly`
2. Push your code to the repository:
```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/letterly.git
git push -u origin main
```

3. Go to your repository settings on GitHub
4. Navigate to "Pages" in the sidebar
5. Under "Source", select "Deploy from a branch"
6. Choose the `main` branch and `/docs` folder (or root)
7. Click "Save"

### Step 3: Configure GitHub Actions (Optional)

For automatic deployment, create a GitHub Actions workflow:

1. Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build project
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## Firebase Configuration

Make sure to update the Firebase configuration in `src/firebase.js` with your project details:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

## Project Structure

```
letterly/
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── LetterPreview.jsx
│   │   ├── LetterView.jsx
│   │   └── *.css
│   ├── App.jsx
│   ├── App.css
│   ├── firebase.js
│   └── main.jsx
├── public/
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Features in Detail

### Authentication
- Email/password signup and login
- Automatic session management
- Protected routes for authenticated users

### Letter Writing
- Clean, distraction-free editor
- Support for any language
- Real-time content saving
- Responsive textarea with proper styling

### Letter Sharing
- Unique URLs for each letter
- QR code generation for easy mobile sharing
- Copy-to-clipboard functionality
- Public access to shared letters

### Letter Viewing
- Beautiful old-style letter design
- Responsive layout
- Proper typography and spacing
- Vintage paper effect with lined background

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the maintainers.

---

Built with ❤️ using React and Firebase
