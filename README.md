# Vite Chrome Browser Extension

This repository provides a scaffold for building a Chrome browser extension using [Vite](https://vitejs.dev/), a fast build tool for modern web projects. 

## Features

- *Vite-powered development*: Leverage fast builds and HMR for a better development experience.
- *Manifest V3 support*: Build extensions with the latest Chrome extension manifest format.
- *Modular architecture*: Easily customize and extend functionalities.

## Prerequisites

Ensure you have the following installed:

- Node.js (version 14 or higher)
- npm or yarn package manager
- A Chromium-based browser (e.g., Chrome, Edge)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/vite-chrome-extension.git
cd vite-chrome-extension
```

2.Install Dependencies
```bash
npm install
```

4. Load the Extension in Chrome

1. Go to ``` chrome://extensions/ ```


2. Enable "Developer mode" in the top right corner.


3. Click "Load unpacked" and select the dist folder from the project directory.



5. Build for Production

When you're ready to publish your extension, build the project using:

npm run build

The production-ready files will be available in the dist folder.

Resources

Vite Documentation

Chrome Extensions Documentation


Contributing :

Contributions are welcome! Please fork this repository and submit a pull request with your improvements.
