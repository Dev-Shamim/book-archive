# Assignment : 02

### Name : Shamim Mian

### Email: (shamimmian91@gmail.com)

[ Live url](অ্যাসাইনমেন্টের লাইভ url লিংক দিন)



# Word Treasury | Modern Book Archive

Word Treasury is a comprehensive, visually stunning, and fully functional **Book Archive Application** built with modern web technologies. It serves as a digital library where users can discover, manage, and review books with an experience akin to professional platforms like Goodreads or Amazon Books.

## 🚀 Key Features

### 🔍 Discovery & Browsing
*   **Advanced Search**: Filter books precisely by Title, Author, ISBN, Genre, or Publication Year via a dedicated modal.
*   **Smart Filtering**: Browse the catalog with real-time filters for **Category**, **Price Range**, and **Star Rating**.
*   **Author Directory**: Automatically generated grid of all authors in the collection with avatars.
*   **Curated Collections**: Dynamic showcases of books grouped by genre (e.g., "Best in Sci-Fi").
*   **Sorting**: Sort the catalog by "Newest" or "Price (Low to High)".

### 📚 Book Management
*   **Rich Details View**: Interactive modal displaying high-res covers, ISBN, Price, Synopsis, and **User Reviews**.
*   **Admin Dashboard**: A robust interface to Add, Edit, and Delete books from the global archive.
*   **Mock Data Seeding**: The app comes pre-loaded with high-quality mock data (covers, descriptions, reviews) so it never looks empty.

### 👤 User Experience
*   **User Profile Dashboard**:
    *   **Overview**: Stats on books read and wishlist items.
    *   **Reading Lists**: Manage custom book lists (e.g., "Summer 2026 To-Read").
    *   **Order History**: Track past book orders with status badges.
    *   **Payment Methods**: Manage saved credit cards visually.
*   **Support Center**: An FAQ section and contact form for user assistance.
*   **Responsive Design**: Fully optimized for Mobile, Tablet, and Desktop using a custom **Tailwind CSS** design system.

## 🛠️ Tech Stack

*   **Frontend**: HTML5, Vanilla JavaScript (ES6+).
*   **Styling**: **Tailwind CSS** (via CDN) for utility-first styling, responsiveness, and animations.
*   **Icons**: FontAwesome 6.
*   **Fonts**: Google Fonts (Inter & Playfair Display).
*   **State Management**: `localStorage` for persisting Books, Orders, Payments, and User Preferences.
*   **Architecture**: Single Page Application (SPA) logic handles routing without page reloads.

## 📂 Directory Structure

```text
Word Treasury-App/
│
├── index.html              # Main entry point containing all SPA views and modals
├── style.css               # Custom CSS for scrollbars, animations, and Tailwind config
├── script.js               # Core logic: Router, State Management, Data Seeding, UI Rendering
├── README.md               # Project documentation
└── ...
```

## 📖 How to Run

1.  **Download**: Clone or download this repository.
2.  **Open**: Simply double-click `index.html` to launch it in your default web browser. No `npm install` or backend server is required!

## 💡 Usage Guide

1.  **Browse**: Use the "Browse" tab to see all books. Use the sidebar to filter by Genre or Price.
2.  **Search**: Type in the top search bar for instant results, or click the **slider icon** for Advanced Search.
3.  **Admin**: Go to the "Admin" tab to add new books. (Note: In a real app, this would be protected).
4.  **Profile**: Click "My Account" to see your dashboard, orders, and reading lists.

## 👨‍💻 Developer Notes

*   **Data Persistence**: All changes (adding/deleting books) are saved to your browser's Local Storage. To reset the app to its initial state, simply clear your browser's cache/local storage for the page.
*   **Mock Data**: The application automatically seeds itself with 8 initial books, reviews, and order history on first load.

---
*Created on January 16, 2026*
