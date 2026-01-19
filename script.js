/**
 * WORD TREASURY - CLIENT SIDE LOGIC
 * ------------------------------------------------------------------
 * This script handles all the interactive functionality for the Word Treasury
 * application, including:
 * - Single Page Application (SPA) navigation.
 * - State management (Filtering, Search, User Preferences).
 * - Data persistence using LocalStorage (mocking a backend database).
 * - Dynamic HTML generation (Rendering views).
 * - CRUD operations for the Admin panel.
 */

// --- 1. STATE & CONSTANTS ---
// Holds the runtime state of the application.
const APP_STATE = {
    currentView: 'home',        // Tracks which section is currently visible
    currentProfileTab: 'overview', // Tracks the active tab in the user profile
    editMode: false,            // Flag: Are we creating a new book or editing an existing one?
    editId: null,               // ID of the book currently being edited
    searchQuery: '',            // Global text search query
    filters: {                  // Active filters for the 'Browse' section
        categories: [],         // Selected genres
        maxPrice: 100,          // Maximum price slider value
        minRating: 0,           // Minimum star rating
        sortBy: 'Newest'        // Sort order
    }
};

// --- 2. MOCK DATA SEEDER ---
// Initial data to populate the application if LocalStorage is empty.
// In a real app, this would come from a database API.
const SEED_DATA = [
    {
        id: 1705350000001,
        title: "The Midnight Library",
        author: "Matt Haig",
        genre: "Fantasy",
        price: 18.50,
        rating: 4.2,
        isbn: "978-0525559474",
        year: 2020,
        desc: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
        cover: "https://picsum.photos/seed/midnight/200/300",
        reviews: [
            { user: "Sarah J.", rating: 5, text: "A life-changing read. Absolutely beautiful." },
            { user: "Mike T.", rating: 4, text: "Great concept, slightly slow middle." }
        ]
    },
    {
        id: 1705350000002,
        title: "Project Hail Mary",
        author: "Andy Weir",
        genre: "Sci-Fi",
        price: 24.00,
        rating: 4.8,
        isbn: "978-0593135204",
        year: 2021,
        desc: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.",
        cover: "https://picsum.photos/seed/hailmary/200/300",
        reviews: [
            { user: "Elon M.", rating: 5, text: "Couldn't put it down. Weir is back!" }
        ]
    },
    {
        id: 1705350000003,
        title: "Atomic Habits",
        author: "James Clear",
        genre: "Non-Fiction",
        price: 15.99,
        rating: 4.9,
        isbn: "978-0735211292",
        year: 2018,
        desc: "No matter your goals, Atomic Habits offers a proven framework for improving--every day.",
        cover: "https://picsum.photos/seed/atomic/200/300",
        reviews: []
    },
    {
        id: 1705350000004,
        title: "Dune",
        author: "Frank Herbert",
        genre: "Sci-Fi",
        price: 12.00,
        rating: 4.5,
        isbn: "978-0441172719",
        year: 1965,
        desc: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange.",
        cover: "https://picsum.photos/seed/dune/200/300",
        reviews: [
            { user: "Paul A.", rating: 5, text: "The spice must flow." }
        ]
    },
    {
        id: 1705350000005,
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        genre: "Psychology",
        price: 14.50,
        rating: 4.0,
        isbn: "978-0374275631",
        year: 2011,
        desc: "The major work of the Nobel Prize winner, expanding on the thesis that our minds are ruled by two systems.",
        cover: "https://picsum.photos/seed/thinking/200/300",
        reviews: []
    },
    {
        id: 1705350000006,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        genre: "Classic",
        price: 9.99,
        rating: 4.7,
        isbn: "978-1503290563",
        year: 1813,
        desc: "A romantic novel of manners written by Jane Austen. The novel follows the character development of Elizabeth Bennet.",
        cover: "https://picsum.photos/seed/pride/200/300",
        reviews: [
            { user: "Lizzy B.", rating: 5, text: "Mr. Darcy is quite tolerable, I suppose." }
        ]
    },
    {
        id: 1705350000007,
        title: "The Guns of August",
        author: "Barbara W. Tuchman",
        genre: "History",
        price: 16.00,
        rating: 4.6,
        isbn: "978-0345476098",
        year: 1962,
        desc: "A non-fiction book that provides a narrative of the first month of World War I.",
        cover: "https://picsum.photos/seed/guns/200/300",
        reviews: []
    },
    {
        id: 1705350000008,
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        genre: "History",
        price: 18.99,
        rating: 4.5,
        isbn: "978-0062316097",
        year: 2014,
        desc: "Harari surveys the history of humankind from the evolution of archaic human species in the Stone Age up to the twenty-first century.",
        cover: "https://picsum.photos/seed/sapiens/200/300",
        reviews: []
    }
];

const SEED_ORDERS = [
    { id: '#ORD-7829', date: 'Oct 24, 2025', total: '$45.00', status: 'Delivered', items: ['Dune', 'Atomic Habits'] },
    { id: '#ORD-7812', date: 'Sep 12, 2025', total: '$12.50', status: 'Delivered', items: ['The Midnight Library'] },
    { id: '#ORD-7901', date: 'Jan 15, 2026', total: '$28.99', status: 'Processing', items: ['Project Hail Mary'] }
];

const SEED_PAYMENTS = [
    { type: 'Visa', last4: '4242', expiry: '12/28', holder: 'Alex Reader', isDefault: true },
    { type: 'Mastercard', last4: '8832', expiry: '09/27', holder: 'Alex Reader', isDefault: false }
];

// --- 3. DOM ELEMENTS ---
// Cache references to important DOM nodes to improve performance and code readability.
const sections = {
    home: document.getElementById('home-section'),
    browse: document.getElementById('browse-section'),
    authors: document.getElementById('authors-section'),
    collections: document.getElementById('collections-section'),
    profile: document.getElementById('profile-section'),
    support: document.getElementById('support-section'),
    admin: document.getElementById('admin-section')
};

const adminForm = {
    container: document.getElementById('adminFormContainer'),
    toggleBtn: document.getElementById('toggleFormBtn'),
    saveBtn: document.getElementById('saveBookBtn'),
    cancelBtn: document.getElementById('cancelBtn'),
    inputs: {
        title: document.getElementById('bookName'),
        author: document.getElementById('authorName'),
        genre: document.getElementById('genre'),
        cover: document.getElementById('coverUrl'),
        desc: document.getElementById('description')
    }
};

const grids = {
    home: document.getElementById('home-book-grid'),
    browse: document.getElementById('browse-grid'),
    authors: document.getElementById('authors-grid'),
    collections: document.getElementById('collections-grid'),
    adminTable: document.getElementById('adminBookList'),
    orderList: document.getElementById('order-list'),
    paymentList: document.getElementById('payment-list')
};

const filters = {
    categories: document.getElementById('categoryFilters'),
    priceRange: document.getElementById('priceRange'),
    priceValue: document.getElementById('priceValue'),
    ratings: document.getElementById('ratingFilters'),
    sortSelect: document.querySelector('#browse-section select')
};

const advSearch = {
    modal: document.getElementById('advancedSearchModal'),
    query: document.getElementById('advQuery'),
    author: document.getElementById('advAuthor'),
    isbn: document.getElementById('advIsbn'),
    genre: document.getElementById('advGenre'),
    year: document.getElementById('advYear')
};

const modal = {
    el: document.getElementById('bookModal'),
    title: document.getElementById('modalTitle'),
    author: document.getElementById('modalAuthor'),
    genre: document.getElementById('modalGenre'),
    desc: document.getElementById('modalDesc'),
    cover: document.getElementById('modalCover'),
    price: document.getElementById('modalPriceDisplay'),
    isbn: document.getElementById('modalIsbn'),
    stars: document.getElementById('modalStars'),
    ratingText: document.getElementById('modalRatingText'),
    reviews: document.getElementById('modalReviews')
};

// --- 4. INITIALIZATION ---
// Runs when the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    initData();           // Load or Seed data
    initEventListeners(); // Attach click/change handlers
    navigateTo('home');   // Show the default view
});

/**
 * Initializes the application data.
 * Checks if data exists in LocalStorage. If not, it populates it with SEED_DATA.
 * Also handles data migration/upgrades if structure changes (rudimentary).
 */
function initData() {
    // Books - Check for legacy data and upgrade or seed
    if (!localStorage.getItem('books')) {
        localStorage.setItem('books', JSON.stringify(SEED_DATA));
    } else {
        // Robustness: ensure existing data has all required fields (e.g. if we added 'isbn' later)
        let books = JSON.parse(localStorage.getItem('books'));
        let updated = false;
        books = books.map(b => {
            const seedMatch = SEED_DATA.find(s => s.title === b.title); // Try to match seed data
            return {
                ...b,
                price: b.price || (Math.random() * 20 + 5).toFixed(2),
                rating: b.rating || (Math.random() * 2 + 3).toFixed(1),
                isbn: b.isbn || (seedMatch ? seedMatch.isbn : `978-${Math.floor(Math.random()*10000000000)}`),
                year: b.year || (seedMatch ? seedMatch.year : 2020),
                reviews: b.reviews || (seedMatch ? seedMatch.reviews : [])
            };
        });
        localStorage.setItem('books', JSON.stringify(books));
    }

    if (!localStorage.getItem('orders')) localStorage.setItem('orders', JSON.stringify(SEED_ORDERS));
    if (!localStorage.getItem('payments')) localStorage.setItem('payments', JSON.stringify(SEED_PAYMENTS));

    refreshAllViews(); // Render the UI with the loaded data
}

// Helpers to get data from LocalStorage
function getBooks() { return JSON.parse(localStorage.getItem('books') || '[]'); }
function getOrders() { return JSON.parse(localStorage.getItem('orders') || '[]'); }
function getPayments() { return JSON.parse(localStorage.getItem('payments') || '[]'); }

// Helper to save books to LocalStorage
function saveBooks(books) {
    localStorage.setItem('books', JSON.stringify(books));
    refreshAllViews(); // Re-render to reflect changes
}

// --- 5. NAVIGATION ---
/**
 * Switches the visible section of the application.
 * @param {string} viewName - The ID suffix of the section to show (e.g., 'home', 'browse').
 */
window.navigateTo = function(viewName) {
    // Hide all sections
    Object.values(sections).forEach(sec => sec.classList.add('hidden'));
    
    // Show the target section
    if(sections[viewName]) {
        sections[viewName].classList.remove('hidden');
        APP_STATE.currentView = viewName;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // If navigating to 'browse', re-apply filters to ensure view is consistent
        if(viewName === 'browse') applyFilters();
    }
}

/**
 * Quick shortcut to filter by genre from the Home page.
 * @param {string} genre - The genre to filter by.
 */
window.filterByGenre = function(genre) {
    APP_STATE.filters.categories = [genre];
    // Sync UI: Uncheck all checkboxes, then check the target one
    document.querySelectorAll('#categoryFilters input').forEach(cb => cb.checked = false);
    const cb = document.querySelector(`#categoryFilters input[value="${genre}"]`);
    if(cb) cb.checked = true;
    
    navigateTo('browse');
}

/**
 * Switches tabs within the Profile section.
 * @param {string} tabName - The name of the tab content to show.
 */
window.switchProfileTab = function(tabName) {
    document.querySelectorAll('.profile-content').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(`profile-${tabName}`);
    if(target) target.classList.remove('hidden');

    // Update active button styling
    document.querySelectorAll('.profile-tab-btn').forEach(btn => {
        btn.classList.remove('bg-slate-50', 'text-primary');
        if(btn.onclick.toString().includes(tabName)) {
            btn.classList.add('bg-slate-50', 'text-primary');
        }
    });
}

// --- 6. ADVANCED SEARCH ---
/**
 * Toggles the visibility of the Advanced Search modal.
 */
window.toggleAdvancedSearch = function() {
    advSearch.modal.classList.toggle('hidden');
}

/**
 * Executes the advanced search logic.
 * Reads values from the modal inputs, filters the book list, and renders the results.
 */
window.performAdvancedSearch = function() {
    // Reset basic filters to avoid conflicts
    clearFilters(); 
    
    const query = advSearch.query.value.toLowerCase();
    const author = advSearch.author.value.toLowerCase();
    const isbn = advSearch.isbn.value.trim();
    const genre = advSearch.genre.value;
    const year = advSearch.year.value;

    let books = getBooks();

    // Apply filters sequentially
    if(query) books = books.filter(b => b.title.toLowerCase().includes(query) || b.desc.toLowerCase().includes(query));
    if(author) books = books.filter(b => b.author.toLowerCase().includes(author));
    if(isbn) books = books.filter(b => b.isbn && b.isbn.includes(isbn));
    if(genre) books = books.filter(b => b.genre === genre);
    if(year) books = books.filter(b => b.year == year);

    // Navigate to browse and override the grid directly
    navigateTo('browse');
    renderBrowseGrid(books); // Direct render (bypassing applyFilters for this specific action)
    toggleAdvancedSearch();  // Close modal
}

// --- 7. FILTERING LOGIC (Standard) ---
/**
 * Applies the current state of filters (Category, Price, Rating, Sort) to the book list.
 * Updates the 'Browse' grid with the filtered results.
 */
function applyFilters() {
    let books = getBooks();
    
    // 1. Global Search Query
    if(APP_STATE.searchQuery) {
        const q = APP_STATE.searchQuery.toLowerCase();
        books = books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.isbn && b.isbn.includes(q)));
    }

    // 2. Categories (OR logic: match any selected category)
    if(APP_STATE.filters.categories.length > 0) {
        books = books.filter(b => APP_STATE.filters.categories.includes(b.genre));
    }

    // 3. Price & Rating
    books = books.filter(b => parseFloat(b.price) <= APP_STATE.filters.maxPrice);
    books = books.filter(b => parseFloat(b.rating) >= APP_STATE.filters.minRating);

    // 4. Sorting
    if(APP_STATE.filters.sortBy === 'Price') {
        books.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else {
        // Default: Newest (using ID as proxy for creation time)
        books.sort((a, b) => b.id - a.id);
    }

    renderBrowseGrid(books);
}

/**
 * Resets all filters to their default states.
 */
window.clearFilters = function() {
    APP_STATE.filters = { categories: [], maxPrice: 100, minRating: 0, sortBy: 'Newest' };
    APP_STATE.searchQuery = '';
    
    // Reset UI elements
    document.getElementById('globalSearch').value = '';
    filters.priceRange.value = 100;
    filters.priceValue.textContent = '$100';
    document.querySelectorAll('#categoryFilters input').forEach(cb => cb.checked = false);
    document.querySelector('input[name="rating"][value="0"]').checked = true;

    applyFilters();
}

// --- 8. RENDERING LOGIC ---
/**
 * Master render function that refreshes all dynamic parts of the UI.
 * Called after data changes.
 */
function refreshAllViews() {
    const books = getBooks();
    renderHomeGrid(books);
    renderAdminTable(books);
    renderAuthors(books);
    renderCollections(books);
    renderOrders();
    renderPayments();
}

/**
 * Generates the HTML for a single Book Card.
 * @param {Object} book - The book object to render.
 * @returns {string} HTML string.
 */
function renderCard(book) {
    const coverUrl = book.cover || `https://ui-avatars.com/api/?name=${book.title}&background=random&color=fff&size=200`;
    
    // Generate star rating HTML
    let stars = '';
    const rating = Math.round(book.rating || 0);
    for(let i=0; i<5; i++) stars += i < rating ? '<i class="fa-solid fa-star text-amber-400 text-xs"></i>' : '<i class="fa-regular fa-star text-slate-300 text-xs"></i>';

    return `
    <div class="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col h-full animate-fade-up">
        <div class="relative aspect-[2/3] overflow-hidden bg-slate-100 cursor-pointer" onclick="openModal(${book.id})">
            <img src="${coverUrl}" alt="${book.title}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
            <div class="absolute top-3 left-3">
                <span class="bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-slate-700 shadow-sm">${book.genre || 'General'}</span>
            </div>
            <div class="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-800 shadow-sm">
                $${parseFloat(book.price).toFixed(2)}
            </div>
        </div>
        <div class="p-4 flex flex-col flex-grow">
            <h3 class="font-bold text-slate-800 text-lg mb-1 line-clamp-1 cursor-pointer hover:text-primary transition" onclick="openModal(${book.id})">${book.title}</h3>
            <p class="text-slate-500 text-sm mb-2">${book.author}</p>
            <div class="flex items-center gap-1 mb-3">${stars} <span class="text-xs text-slate-400 ml-1">(${book.rating})</span></div>
            <div class="mt-auto flex justify-between items-center pt-3 border-t border-slate-50">
                <button class="text-slate-400 hover:text-primary transition text-sm"><i class="fa-regular fa-heart"></i></button>
                <button onclick="openModal(${book.id})" class="text-primary text-sm font-medium hover:underline">View Details</button>
            </div>
        </div>
    </div>`;
}

/**
 * Renders the 'New Arrivals' grid on the Home page (limit 5).
 */
function renderHomeGrid(books) {
    const displayBooks = books.slice(0, 5);
    grids.home.innerHTML = displayBooks.map(renderCard).join('');
}

/**
 * Renders the main grid on the Browse page.
 */
function renderBrowseGrid(books) {
    if(books.length === 0) {
        grids.browse.innerHTML = `<div class="col-span-full text-center py-12 text-slate-500">No books found.</div>`;
    } else {
        grids.browse.innerHTML = books.map(renderCard).join('');
    }
}

/**
 * Renders the Author list based on unique authors in the book list.
 */
function renderAuthors(books) {
    const authors = [...new Set(books.map(b => b.author))].sort();
    grids.authors.innerHTML = authors.map(author => `
        <div class="bg-white p-6 rounded-xl border border-slate-100 text-center hover:shadow-lg transition cursor-pointer group">
            <div class="w-24 h-24 mx-auto bg-slate-200 rounded-full mb-4 overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=${author}&background=random&size=128" class="w-full h-full object-cover group-hover:scale-110 transition">
            </div>
            <h3 class="font-bold text-slate-800 text-lg mb-1">${author}</h3>
            <p class="text-slate-500 text-sm">${books.filter(b => b.author === author).length} Books</p>
        </div>
    `).join('');
}

/**
 * Renders filtered collections (Best in Sci-Fi, etc.).
 */
function renderCollections(books) {
    const categories = ['Sci-Fi', 'Fantasy', 'History', 'Classic'];
    grids.collections.innerHTML = categories.map(cat => {
        const catBooks = books.filter(b => b.genre === cat).slice(0, 4);
        if(catBooks.length === 0) return '';
        
        return `
        <div>
            <div class="flex justify-between items-center mb-6">
                <h3 class="font-serif text-2xl font-bold text-slate-800">Best in ${cat}</h3>
                <button onclick="filterByGenre('${cat}')" class="text-primary font-medium hover:underline">View Collection</button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                ${catBooks.map(renderCard).join('')}
            </div>
        </div>`;
    }).join('');
}

/**
 * Renders the user's order history.
 */
function renderOrders() {
    grids.orderList.innerHTML = getOrders().map(order => `
        <div class="bg-white p-6 rounded-xl border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <div class="flex items-center gap-3 mb-1">
                    <span class="font-bold text-slate-800">${order.id}</span>
                    <span class="text-xs px-2 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} font-bold">${order.status}</span>
                </div>
                <div class="text-sm text-slate-500">${order.items.join(', ')}</div>
            </div>
            <div class="text-right">
                <div class="font-bold text-slate-800">${order.total}</div>
                <div class="text-xs text-slate-400">${order.date}</div>
            </div>
        </div>
    `).join('');
}

/**
 * Renders the user's saved payment methods.
 */
function renderPayments() {
    grids.paymentList.innerHTML = getPayments().map(card => `
        <div class="bg-slate-900 text-white p-6 rounded-xl relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            <div class="flex justify-between items-start mb-8">
                <i class="fa-brands fa-cc-${card.type.toLowerCase()} text-3xl opacity-80"></i>
                ${card.isDefault ? '<span class="bg-white/20 text-xs px-2 py-1 rounded">Default</span>' : ''}
            </div>
            <div class="text-xl tracking-widest mb-4">•••• •••• •••• ${card.last4}</div>
            <div class="flex justify-between text-sm opacity-70">
                <div><div class="text-xs uppercase mb-1">Holder</div><div>${card.holder}</div></div>
                <div><div class="text-xs uppercase mb-1">Expires</div><div>${card.expiry}</div></div>
            </div>
        </div>
    `).join('');
}

/**
 * Renders the table in the Admin dashboard.
 */
function renderAdminTable(books) {
    grids.adminTable.innerHTML = ''; // Clear current rows
    
    if (books.length === 0) {
        document.getElementById('emptyState').classList.remove('hidden');
        return;
    } else {
        document.getElementById('emptyState').classList.add('hidden');
    }

    books.forEach(book => {
        // Create table row element
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition border-b border-slate-50 last:border-0 group';
        tr.dataset.id = book.id;

        // Populate row content
        tr.innerHTML = `
            <td class="p-4">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-16 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                        <img src="${book.cover || 'https://via.placeholder.com/50'}" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <div class="font-bold text-slate-800">${book.title}</div>
                        <div class="text-xs text-slate-400">ID: ${book.id}</div>
                    </div>
                </div>
            </td>
            <td class="p-4 text-slate-600">${book.author}</td>
            <td class="p-4"><span class="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">${book.genre || 'N/A'}</span></td>
            <td class="p-4 text-right">
                <button class="edit-btn bg-amber-100 text-amber-600 w-8 h-8 rounded-full hover:bg-amber-200 transition mr-2" title="Edit Book">
                    <i class="fa-solid fa-pen pointer-events-none"></i>
                </button>
                <button class="delete-btn bg-red-100 text-red-600 w-8 h-8 rounded-full hover:bg-red-200 transition" title="Delete Book">
                    <i class="fa-solid fa-trash pointer-events-none"></i>
                </button>
            </td>
        `;
        
        // Append the newly created row to the table body
        grids.adminTable.appendChild(tr);
    });
}

// --- 9. EVENT LISTENERS ---
/**
 * Attaches event listeners to interactive elements.
 */
function initEventListeners() {
    // Admin Form Toggle
    adminForm.toggleBtn.addEventListener('click', () => { adminForm.container.classList.toggle('hidden'); resetForm(); });
    adminForm.cancelBtn.addEventListener('click', () => { adminForm.container.classList.add('hidden'); resetForm(); });
    adminForm.saveBtn.addEventListener('click', handleSaveBook);

    // Event Bubbling for Admin Table (Edit and Delete)
    grids.adminTable.addEventListener('click', (e) => {
        const tr = e.target.closest('tr');
        if (!tr) return;
        
        const id = parseInt(tr.dataset.id);

        if (e.target.closest('.delete-btn')) {
            if (confirm('Are you sure you want to delete this book?')) {
                // Step 1: Remove from DOM directly for immediate feedback
                tr.remove();
                
                // Step 2: Update Local Storage
                const books = getBooks().filter(b => b.id !== id);
                localStorage.setItem('books', JSON.stringify(books));
                
                // Step 3: Check if table is now empty
                if (books.length === 0) {
                    document.getElementById('emptyState').classList.remove('hidden');
                }
                
                // Refresh other views (Home, Browse etc)
                refreshAllViews();
            }
        } else if (e.target.closest('.edit-btn')) {
            editBook(id);
        }
    });

    // Global Search Input
    const searchInput = document.getElementById('globalSearch');
    if(searchInput){
        searchInput.addEventListener('input', (e) => {
            APP_STATE.searchQuery = e.target.value;
            // If searching on another page, switch to browse
            if(APP_STATE.searchQuery.length > 0 && APP_STATE.currentView !== 'browse') navigateTo('browse');
            applyFilters();
        });
    }

    // Category Filter (Checkbox)
    filters.categories.addEventListener('change', (e) => {
        if(e.target.type === 'checkbox') {
            const val = e.target.value;
            if(e.target.checked) APP_STATE.filters.categories.push(val);
            else APP_STATE.filters.categories = APP_STATE.filters.categories.filter(c => c !== val);
            applyFilters();
        }
    });

    // Price Filter (Slider)
    filters.priceRange.addEventListener('input', (e) => {
        APP_STATE.filters.maxPrice = parseFloat(e.target.value);
        filters.priceValue.textContent = `$${e.target.value}`;
        applyFilters();
    });

    // Rating Filter (Radio)
    filters.ratings.addEventListener('change', (e) => {
        if(e.target.name === 'rating') { APP_STATE.filters.minRating = parseFloat(e.target.value); applyFilters(); }
    });
    
    // Sort Select
    if(filters.sortSelect) {
        filters.sortSelect.addEventListener('change', (e) => {
            APP_STATE.filters.sortBy = e.target.value;
            applyFilters();
        });
    }
}

// --- 10. CRUD ACTIONS (Admin) ---
/**
 * Handles creating a new book or updating an existing one.
 */
function handleSaveBook() {
    const title = adminForm.inputs.title.value.trim();
    const author = adminForm.inputs.author.value.trim();
    
    // Basic validation
    if(!title || !author) return alert('Title and Author are required!');

    // Construct book object
    const bookData = {
        id: APP_STATE.editMode ? APP_STATE.editId : Date.now(),
        title, author,
        genre: adminForm.inputs.genre.value.trim(),
        cover: adminForm.inputs.cover.value.trim(),
        desc: adminForm.inputs.desc.value.trim(),
        // For prototype, randomizing price/rating if new
        price: (Math.random() * 20 + 5).toFixed(2),
        rating: (Math.random() * 2 + 3).toFixed(1),
        isbn: `978-${Math.floor(Math.random()*10000000000)}`,
        year: new Date().getFullYear(),
        reviews: []
    };

    let books = getBooks();
    if (APP_STATE.editMode) {
        // Update existing
        const index = books.findIndex(b => b.id === APP_STATE.editId);
        if(index !== -1) {
            // Merge with existing to keep price/rating/reviews/isbn unless overridden
            books[index] = { 
                ...books[index], 
                ...bookData, 
                price: books[index].price, 
                rating: books[index].rating, 
                reviews: books[index].reviews, 
                isbn: books[index].isbn 
            };
        }
    } else {
        // Create new (add to top of list)
        books.unshift(bookData);
    }
    
    saveBooks(books);
    
    // Cleanup
    adminForm.container.classList.add('hidden');
    resetForm();
    applyFilters();
}

/**
 * Deletes a book by ID.
 * @param {number} id - The ID of the book to delete.
 */
function deleteBook(id) {
    if(confirm('Delete this book?')) {
        const books = getBooks().filter(b => b.id !== id);
        saveBooks(books);
        applyFilters();
    }
}

/**
 * Prepares the form for editing an existing book.
 * @param {number} id - The ID of the book to edit.
 */
function editBook(id) {
    const book = getBooks().find(b => b.id === id);
    if(!book) return;
    
    // Populate form
    adminForm.container.classList.remove('hidden');
    adminForm.inputs.title.value = book.title;
    adminForm.inputs.author.value = book.author;
    adminForm.inputs.genre.value = book.genre || '';
    adminForm.inputs.cover.value = book.cover || '';
    adminForm.inputs.desc.value = book.desc || '';
    
    // Set Edit Mode state
    APP_STATE.editMode = true;
    APP_STATE.editId = id;
    
    // Update button text
    adminForm.saveBtn.textContent = 'Update Book';
    adminForm.saveBtn.classList.replace('bg-green-600', 'bg-amber-600');
    adminForm.saveBtn.classList.replace('hover:bg-green-700', 'hover:bg-amber-700');
    
    // Scroll to form
    adminForm.container.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Resets the Admin form to its default 'Add New' state.
 */
function resetForm() {
    adminForm.inputs.title.value = '';
    adminForm.inputs.author.value = '';
    adminForm.inputs.genre.value = '';
    adminForm.inputs.cover.value = '';
    adminForm.inputs.desc.value = '';
    APP_STATE.editMode = false;
    APP_STATE.editId = null;
    adminForm.saveBtn.textContent = 'Save Book';
    adminForm.saveBtn.classList.replace('bg-amber-600', 'bg-green-600');
    adminForm.saveBtn.classList.replace('hover:bg-amber-700', 'hover:bg-green-700');
}

// --- 11. MODAL LOGIC ---
/**
 * Opens the Book Details modal.
 * @param {number} id - The ID of the book to show.
 */
window.openModal = function(id) {
    const book = getBooks().find(b => b.id === id);
    if(!book) return;

    // Populate Modal Content
    modal.title.textContent = book.title;
    modal.author.textContent = `by ${book.author}`;
    modal.genre.textContent = book.genre || 'General';
    modal.desc.textContent = book.desc || 'No description available.';
    modal.cover.src = book.cover || `https://ui-avatars.com/api/?name=${book.title}&background=random`;
    modal.price.textContent = `$${parseFloat(book.price).toFixed(2)}`;
    modal.isbn.textContent = `ISBN: ${book.isbn || 'N/A'}`;
    modal.ratingText.textContent = `(${book.rating || 0})`;

    // Stars
    let stars = '';
    const rating = Math.round(book.rating || 0);
    for(let i=0; i<5; i++) stars += i < rating ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star text-slate-300"></i>';
    modal.stars.innerHTML = stars;

    // Reviews
    if(book.reviews && book.reviews.length > 0) {
        modal.reviews.innerHTML = book.reviews.map(r => `
            <div class="bg-slate-50 p-3 rounded-lg">
                <div class="flex justify-between items-center mb-1">
                    <span class="font-bold text-slate-700 text-sm">${r.user}</span>
                    <span class="text-amber-500 text-xs flex"><i class="fa-solid fa-star"></i> ${r.rating}</span>
                </div>
                <p class="text-slate-600 text-sm">"${r.text}"</p>
            </div>
        `).join('');
    } else {
        modal.reviews.innerHTML = '<p class="text-slate-400 text-sm italic">No reviews yet.</p>';
    }

    // Show Modal & Disable Background Scroll
    modal.el.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; 
}

/**
 * Closes the Book Details modal.
 */
window.closeModal = function() {
    modal.el.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Re-enable scroll
}