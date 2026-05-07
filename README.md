# UI Components Live Builder 🚀

A modern, high-performance platform for creating, sharing, and exploring beautifully crafted UI components. Built with Next.js, Tailwind CSS, and Framer Motion.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.3-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)

## ✨ Features

- **Live UI Builder**: Write HTML and CSS and see the preview instantly.
- **Component Library**: Browse a community-driven gallery of UI components.
- **Personal Dashboard**: Manage your projects, saved components, and track views.
- **Modern Animations**: Smooth transitions and interactive elements powered by Framer Motion.
- **Privacy & Security**: Authentication system to keep your designs safe.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS 4, Framer Motion.
- **Backend**: Node.js, Express, MongoDB (see `/back` directory).
- **Icons**: Tabler Icons.
- **Code Editor**: CodeMirror.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ui-components
   ```

2. **Install Frontend dependencies**:
   ```bash
   cd front
   npm install
   ```

3. **Install Backend dependencies**:
   ```bash
   cd ../back
   npm install
   ```

4. **Environment Variables**:
   - Create a `.env` file in the `/front` directory:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:5000/api
     ```
   - Create a `.env` file in the `/back` directory with your MongoDB URI and JWT Secret.

5. **Run Development Server**:
   ```bash
   # In /front
   npm run dev
   
   # In /back
   npm run dev
   ```

## 📸 Screenshots

| Landing Page | Component Gallery |
| :---: | :---: |
| [Preview Coming Soon] | [Preview Coming Soon] |

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.
