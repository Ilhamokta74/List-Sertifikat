let DataList = [];

const fetchData = async () => {
    try {
        const response = await fetch('/data');
        if (!response.ok) throw new Error('Network response was not ok');
        DataList = await response.json();
        renderAllBooks();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
};

const saveData = async (data) => {
    try {
        const response = await fetch('/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Network response was not ok');
        console.log(await response.text());
    } catch (error) {
        console.error('There has been a problem with your save operation:', error);
    }
};

const handleFormSubmit = (event) => {
    event.preventDefault();

    let title = document.getElementById('bookFormTitle').value;
    let author = document.getElementById('bookFormAuthor').value;
    let year = document.getElementById('bookFormYear').value;
    let isComplete = document.getElementById('bookFormIsComplete').checked;
    let id = new Date().getTime();

    let newBook = {
        id: id,
        Judul: title,
        Penulis: author,
        Tahun: year,
        isComplete: isComplete
    };

    DataList.push(newBook);
    saveData(DataList); // Save the updated data list to the server
    addBookToDOM(newBook);
    event.target.reset();
    document.querySelector('#bookFormSubmit span').textContent = 'Belum selesai dibaca';
};

const deleteBook = (idToDelete, Judul) => {
    const userConfirmed = confirm(`Apakah Anda yakin ingin menghapus buku dengan Judul ${Judul} ?`);

    if (userConfirmed) {
        DataList = DataList.filter(item => item.id !== idToDelete);
        saveData(DataList); // Save the updated data list to the server
        document.getElementById(`book-${idToDelete}`).remove();
    }
};

const editBook = (idToEdit) => {
    const bookToEdit = DataList.find(item => item.id === idToEdit);

    if (!bookToEdit) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Buku tidak ditemukan!',
        });
        return;
    }

    Swal.fire({
        title: 'Edit Buku',
        html:
            `<input id="swal-input1" class="swal2-input" value="${bookToEdit.Judul}">` +
            `<input id="swal-input2" class="swal2-input" value="${bookToEdit.Penulis}">` +
            `<input id="swal-input3" class="swal2-input" value="${bookToEdit.Tahun}">`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
            return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value,
                document.getElementById('swal-input3').value
            ];
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const newTitle = result.value[0];
            const newAuthor = result.value[1];
            const newYear = result.value[2];

            bookToEdit.Judul = newTitle;
            bookToEdit.Penulis = newAuthor;
            bookToEdit.Tahun = newYear;

            saveData(DataList); // Save the updated data list to the server
            updateBookInDOM(bookToEdit);

            Swal.fire({
                title: 'Success!',
                text: 'Buku berhasil diperbarui.',
                icon: 'success'
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
                title: 'Cancelled',
                text: 'Perubahan dibatalkan.',
                icon: 'info'
            });
        }
    });
};

const updatedBook = (idToUpdate) => {
    const bookToUpdate = DataList.find(item => item.id === idToUpdate);

    if (!bookToUpdate) {
        alert('Buku tidak ditemukan!');
        return;
    }

    bookToUpdate.isComplete = !bookToUpdate.isComplete;
    updateBookInDOM(bookToUpdate);

    saveData(DataList); // Save the updated data list to the server
};

const addBookToDOM = (book) => {
    const section = book.isComplete ? document.getElementById('finish') : document.getElementById('unfinish');
    const bookElement = document.createElement('div');
    bookElement.className = 'mb-4';
    bookElement.id = `book-${book.id}`;
    
    // Choose background color based on completion status
    const bgColor = book.isComplete ? 'bg-green-200' : 'bg-red-200';
    
    bookElement.innerHTML = `
            <div class="${bgColor} shadow-sm rounded-md p-4">
                <a href=${book.url} target="_blank">
                    <h3 class="text-lg font-semibold">${book.label}</h3>
                    <p class="text-sm text-gray-600">Penulis: ${book.summary}</p>
                </a>
            </div>
    `;
    
    section.appendChild(bookElement);
};

const updateBookInDOM = (book) => {
    const bookElement = document.getElementById(`book-${book.id}`);
    bookElement.remove();
    addBookToDOM(book);
};

const renderAllBooks = () => {
    DataList.forEach(book => {
        addBookToDOM(book);
    });
};

const handleSearch = (event) => {
    event.preventDefault();

    let searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
    let searchResults = DataList.filter(book => book.Judul.toLowerCase().includes(searchTitle));

    if (searchTitle !== "") {
        var sectionElementUnfinish = document.querySelector('#unfinish');
        var sectionElementFinish = document.querySelector('#finish');

        sectionElementUnfinish.innerHTML = '';
        sectionElementFinish.innerHTML = '';

        searchResults.forEach(book => {
            addBookToDOM(book);
        });
    } else {
        window.location.reload();
    }
};

const setupEventListeners = () => {
    const form = document.getElementById('bookForm');
    form.addEventListener('submit', handleFormSubmit);

    const searchForm = document.getElementById('searchBook');
    searchForm.addEventListener('submit', handleSearch);

    const checkbox = document.getElementById('bookFormIsComplete');
    const spanElement = document.querySelector('#bookFormSubmit span');

    checkbox.addEventListener('change', () => {
        spanElement.textContent = checkbox.checked ? 'Selesai dibaca' : 'Belum selesai dibaca';
    });
};

document.addEventListener('DOMContentLoaded', (event) => {
    fetchData();
    setupEventListeners();
});
