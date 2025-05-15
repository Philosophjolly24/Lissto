# Listoria

**Listoria** is a web-based list management application designed for shopping at Giant Hyper. Built with React, TypeScript, and Vite, Listoria enables users to create and manage multiple product lists with ease. It follows modern web development practices and uses the browser’s localStorage for persistent data storage.

---

## 🚀 Features

- **Create, Rename, and Delete Lists**: Organize your products into custom-named lists.
- **Add Products to Lists**: Choose from a catalog of products and effortlessly add them to any list.
- **Slide-Up Modal UI**: A sleek modal interface that slides up from the bottom for adding or editing items, inspired by mobile design patterns.
- **LocalStorage Persistence**: All data is saved in the browser, so your lists and products persist across sessions without a backend.
- **Responsive Design**: Optimized for both desktop and mobile viewing.

---

## 🎨 Demo

> [Visit demo site](https://listoria.pages.dev/)

---

## 💻 Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x) or Yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Philosophjolly24/Listoria.git
   cd Listoria
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run in development mode**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` (or the port indicated in the console).

---

## 📂 Folder Structure

```text
Listoria/
├── public/           # Static assets
├── src/              # Application source code
│   ├── components/   # Reusable React components (Modals, Lists, Products)
│   ├── hooks/        # Custom React hooks (useLocalStorage)
│   ├── pages/        # Page-level components
│   ├── styles/       # Global and component-specific CSS
│   ├── App.tsx       # Main application component
│   └── main.tsx      # Entry point
├── index.html        # HTML template
├── package.json      # Project metadata and scripts
├── tsconfig.json     # TypeScript configuration
└── vite.config.ts    # Vite configuration
```

---

## 🔧 Usage

1. **Create a New List**: Click the "Create List" button, enter a name, and press Enter.
2. **Select a List**: Click on any list in the sidebar to view its contents.
3. **Add Products**: Within a selected list, click the "Add Product" button to open the slide-up modal. Choose a product and confirm.
4. **Remove or Edit Items**: Use the controls next to each product in the list to edit or remove it.

---

## 🛠️ Technologies

- **React** 18
- **TypeScript** 4.x
- **Vite** 4.x
- **CSS Modules**
- **ESLint** & **Prettier**

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeatureName`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/YourFeatureName`.
5. Open a pull request.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

> Made with ❤️ by Philosophjolly24
