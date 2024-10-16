
const navLinks = document.querySelectorAll('nav ul li a');

// Отримуємо всі секції
const sections = document.querySelectorAll('section');


navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();

        
        const targetSectionId = this.getAttribute('href').substring(1);

        
        sections.forEach(section => {
            section.style.display = 'none';
        });

        document.getElementById(targetSectionId).style.display = 'block';
    });
});

document.getElementById('books').style.display = 'block';

let books = [];
let visitors = [];

// Картки з книгами (видача та повернення)
const issuedBooks = [];
const issuedBooksUl = document.getElementById('issued-books-ul');
const issueBookButton = document.getElementById('issue-book-button');

// Статистика
const topBooksUl = document.getElementById('top-books-ul');
const topVisitorsUl = document.getElementById('top-visitors-ul');
const bookBorrowCount = {};
const visitorBorrowCount = {};

// Функція для додавання книги
const addBookButton = document.getElementById('add-book-button');
const bookTitleInput = document.getElementById('book-title');
const bookAuthorInput = document.getElementById('book-author');
const bookListUl = document.getElementById('book-list-ul');

addBookButton.addEventListener('click', function () {
    const bookTitle = bookTitleInput.value;
    const bookAuthor = bookAuthorInput.value;

    if (bookTitle && bookAuthor) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>Назва книги:</strong> ${bookTitle}<strong>. Автор книги:</strong> ${bookAuthor} <button class="edit-button">Редагувати</button> <button class="delete-button">Видалити</button>`;
        bookListUl.appendChild(li);


        books.push({ title: bookTitle, author: bookAuthor });


        bookTitleInput.value = '';
        bookAuthorInput.value = '';


        li.querySelector('.delete-button').addEventListener('click', function () {
            li.remove();
            books = books.filter(book => book.title !== bookTitle || book.author !== bookAuthor);
        });


        li.querySelector('.edit-button').addEventListener('click', function () {
            bookTitleInput.value = bookTitle;
            bookAuthorInput.value = bookAuthor;
            li.remove();
            books = books.filter(book => book.title !== bookTitle || book.author !== bookAuthor);
        });
    } else {
        alert('Будь ласка, заповніть усі поля');
    }
});

// Функція для додавання відвідувача
const addVisitorButton = document.getElementById('add-visitor-button');
const visitorNameInput = document.getElementById('visitor-name');
const visitorPhoneInput = document.getElementById('visitor-phone');
const visitorListUl = document.getElementById('visitor-list-ul');

addVisitorButton.addEventListener('click', function () {
    const visitorName = visitorNameInput.value;
    const visitorPhone = visitorPhoneInput.value;

    if (visitorName && visitorPhone) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>Імя:</strong>${visitorName} <strong>Номер:</strong>(${visitorPhone}) <button class="delete-button">Видалити</button>`;
        visitorListUl.appendChild(li);


        visitors.push({ name: visitorName, phone: visitorPhone });


        visitorNameInput.value = '';
        visitorPhoneInput.value = '';


        li.querySelector('.delete-button').addEventListener('click', function () {
            li.remove();
            visitors = visitors.filter(visitor => visitor.name !== visitorName || visitor.phone !== visitorPhone);
        });
    } else {
        alert('Будь ласка, заповніть усі поля');
    }
});

// Функцііія для видачі книги
issueBookButton.addEventListener('click', function () {
    const visitorName = document.getElementById('visitor-name-issue').value;
    const bookTitle = document.getElementById('book-title-issue').value;

    if (visitorName && bookTitle) {
        const currentDate = new Date();
        const issueEntry = { visitorName, bookTitle, issueDate: currentDate };


        issuedBooks.push(issueEntry);


        updateIssuedBooksList();
        updateStatistics(visitorName, bookTitle);


        document.getElementById('visitor-name-issue').value = '';
        document.getElementById('book-title-issue').value = '';
    } else {
        alert('Будь ласка, заповніть усі поля');
    }
});

// Функція для оновлення списку виданих книг
function updateIssuedBooksList() {
    issuedBooksUl.innerHTML = '';
    issuedBooks.forEach((entry, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${entry.visitorName} <strong>взяв книгу</strong> "${entry.bookTitle}" (${entry.issueDate.toLocaleDateString()}) <button class="return-button" data-index="${index}">Повернути книгу</button>`;
        issuedBooksUl.appendChild(li);
    });

    // Додаємо функцію для повернення книг
    const returnButtons = document.querySelectorAll('.return-button');
    returnButtons.forEach(button => {
        button.addEventListener('click', function () {
            const index = button.getAttribute('data-index');
            const returnDate = new Date();
            const book = issuedBooks[index];

            alert(`Книга "${book.bookTitle}" була повернена відвідувачем "${book.visitorName}" ${returnDate.toLocaleDateString()}.`);

            // Видаляємо книгу з виданих
            issuedBooks.splice(index, 1);
            updateIssuedBooksList();
        });
    });
}
//Функція для оновлення топ-5 книг
function updateTopBooks() {
    const sortedBooks = Object.entries(bookBorrowCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
    topBooksUl.innerHTML = '';
    sortedBooks.forEach(book => {
        const li = document.createElement('li');
        li.innerHTML = `${book[0]} (Взяли ${book[1]} разів)`;
        topBooksUl.appendChild(li);
    });
}

// Функція для оновлення топ-5 відвідувачів
function updateTopVisitors() {
    const sortedVisitors = Object.entries(visitorBorrowCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
    topVisitorsUl.innerHTML = '';
    sortedVisitors.forEach(visitor => {
        const li = document.createElement('li');
        li.innerHTML = `${visitor[0]} (Взяв ${visitor[1]} книг)`;
        topVisitorsUl.appendChild(li);
    });

}
// Функція для оновлення статистики
function updateStatistics(visitorName, bookTitle) {

    if (bookBorrowCount[bookTitle]) {
        bookBorrowCount[bookTitle]++;
    } else {
        bookBorrowCount[bookTitle] = 1;
    }


    if (visitorBorrowCount[visitorName]) {
        visitorBorrowCount[visitorName]++;
    } else {
        visitorBorrowCount[visitorName] = 1;
    }

    // Оновлення списків статистики
    updateTopBooks();
    updateTopVisitors();
}


// Пошук книги
const searchBookInput = document.getElementById('search-book');
const searchBookButton = document.getElementById('search-book-button');

searchBookButton.addEventListener('click', function () {
    const searchQuery = searchBookInput.value.toLowerCase();
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery) ||
        book.author.toLowerCase().includes(searchQuery)
    );

    // Оновлення списку книг
    bookListUl.innerHTML = '';
    filteredBooks.forEach(book => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>Назва книги:</strong> ${book.title}. <strong>Автор книги:</strong> ${book.author} <button class="edit-button">Редагувати</button> <button class="delete-button">Видалити</button>`;
        bookListUl.appendChild(li);

        // Додавання функцій для редагування та видалення
        li.querySelector('.delete-button').addEventListener('click', function () {
            li.remove();
            books = books.filter(b => b.title !== book.title || b.author !== book.author);
        });

        li.querySelector('.edit-button').addEventListener('click', function () {
            bookTitleInput.value = book.title;
            bookAuthorInput.value = book.author;
            li.remove();
            books = books.filter(b => b.title !== book.title || b.author !== book.author);
        });
    });

    
    searchBookInput.value = '';
});




