// Déclarations de nos variables (portée des variables et accessibilité dans notre code)

const divElement = document.createElement("div");
divElement.classList.add("add_Books");

const divBooks = document.createElement("div");
divBooks.id = "divBooks";

//---------------------------------------------------------------------------------------//

// CHARGEMENT DE NOTRE PAGE //

// Function PAGELOADED //
function pageLoaded() {
  const addBooksContainer = document.getElementById("content");

  //--Création de notre bouton " Ajouter un livre "" --//

  const buttonAddBook = document.createElement("button");
  buttonAddBook.textContent = "Ajouter un livre";
  buttonAddBook.classList.add("custom-button");

  divElement.appendChild(buttonAddBook);
  addBooksContainer.appendChild(divElement);

  const hrElement = document.querySelector("hr");
  document.body.insertBefore(divElement, hrElement);

  addButtonSearchBook(buttonAddBook, hrElement);
}

// -- Déclaration de notre variable pour récupération dans le code --//
let uniqueKey;

function addButtonSearchBook(buttonAddBook, hrElement) {
  buttonAddBook.addEventListener("click", function (event) {
    divElement.style.display = "none";
    // CONSTRUCTION DE NOTRE HTML //

    // FORM //
    const form = document.createElement("form");

    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Titre du livre ";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.name = "title";
    form.appendChild(titleLabel);
    form.appendChild(titleInput);

    const authorLabel = document.createElement("label");
    authorLabel.textContent = "Auteur ";
    const authorInput = document.createElement("input");
    authorInput.type = "text";
    authorInput.name = "author";
    form.appendChild(authorLabel);
    form.appendChild(authorInput);

    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("flex-Button-Search-Cancel");

    // BUTTON SUBMIT //

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Rechercher";
    submitButton.style.backgroundColor = "#128064";
    buttonDiv.appendChild(submitButton);

    // BUTTON CANCEL //

    const cancelButton = document.createElement("button");
    cancelButton.type = "reset";
    cancelButton.textContent = "Annuler";
    cancelButton.style.backgroundColor = "#BD5758";
    buttonDiv.appendChild(cancelButton);

    document.body.appendChild(form);
    document.body.appendChild(buttonDiv);

    document.body.insertBefore(form, hrElement);
    document.body.insertBefore(buttonDiv, hrElement);

    // ECOUTE DE NOTRE EVENEMENT SUBMIT BUTTON //

    submitButton.addEventListener("click", function (e) {
      const titleValue = titleInput.value.trim();
      const authorValue = authorInput.value.trim();
      const alertError = document.createElement("p");

      if (titleValue === "" || authorValue === "") {
        alertError.innerText = "Veuillez vérifier votre saisie";
        titleInput.style.borderColor = "#BD5758";
        authorInput.style.borderColor = "#BD5758";
        buttonDiv.appendChild(alertError);
      } else {
        // REQUETTE HTTP DE L’API de Google Books //

        const URLBooks = `https://www.googleapis.com/books/v1/volumes?q=${titleValue}+inauthor:${authorValue}`;

        fetch(URLBooks)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);

            if (data.items && data.items.length > 0) {
              const title = document.createElement("h5");
              title.textContent = "Résultats de recherches ";
              document.body.insertBefore(title, hrElement);

              let articleElement;
              for (let books of data.items) {
                articleElement = document.createElement("article");
                const NoretrieveImg = books.volumeInfo.imageLinks
                  ? books.volumeInfo.imageLinks.thumbnail
                  : "images/unavailable.png";
                const limitedDescription =
                  books.volumeInfo.description &&
                  books.volumeInfo.description.length > 150
                    ? books.volumeInfo.description.slice(0, 150) + "..."
                    : books.volumeInfo.description || "Information manquante";

                articleElement.innerHTML = `

                    <h5><strong>Titre:</strong> ${books.volumeInfo.title}</h5></br>
                    <p><strong>Id:</strong> ${books.id}</p></br>
                    <p>Auteurs: ${books.volumeInfo.authors}</p></br>
                    <p>Description: ${limitedDescription}</p></br>
                    <img src="${NoretrieveImg}" alt="Book Cover" class="img-cover"></br>
                    <div class="icon">
                      <a><span type="button" class="bookmark-btn">
                        <i class="fas fa-bookmark"></i></a>
                      </span>
                    </div>
                  `;

                divBooks.appendChild(articleElement);

                //-- Création de notre objet livre-- //
                const bookData = {
                  title: books.volumeInfo.title,
                  id: books.id,
                  authors: books.volumeInfo.authors,
                  description: limitedDescription,
                  image: NoretrieveImg,
                };

                //-- Appel de la function sendAllBookSessionStorage--//
                sendAllBookSessionStorage(
                  articleElement,
                  bookData,
                  uniqueKey,
                  divBooks
                );
              }

              document.body.insertBefore(divBooks, hrElement);
            } else {
              const noResultsDiv = document.createElement("div");
              noResultsDiv.innerHTML = `<p>Aucun livre n’a été trouvé</p>`;
              document.body.insertBefore(noResultsDiv, hrElement);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }
    });

    // ECOUTE DE NOTRE EVENEMENT ANNULER LA RECHERCHE //

    cancelButton.addEventListener("click", function (e) {
      e.preventDefault();
      const titleElement = document.querySelector("h5");

      if (document.body.contains(form)) {
        document.body.removeChild(form);
      }

      if (document.body.contains(buttonDiv)) {
        document.body.removeChild(buttonDiv);
      }

      if (document.body.contains(divBooks)) {
        document.body.removeChild(divBooks);
      }

      if (titleElement) {
        document.body.removeChild(titleElement);
      }
      // Affichage du bouton
      divElement.style.display = "flex"; //

      // Nous retourner sa position initial
      addBooksContainer.appendChild(divElement);
    });
  });
}

// ENREGISTREMENT DANS NOTRE SESSIONSTORAGE //

// FUNCTION SENDALLBOOKSESSIONSTORAGE //
function sendAllBookSessionStorage(
  articleElement,
  bookData,
  uniqueKey,
  bookbody
) {
  //Récupération de notre icon pour sélectionner un livre
  const bookmarkButton = articleElement.querySelector(".bookmark-btn");

  // Ecoute de notre événement Bookmark //
  bookmarkButton.addEventListener("click", (event) => {
    event.preventDefault();

    // Affichage d'une alerte si un record exist déjà dans SessionStorage //

    if (sessionStorage.getItem(uniqueKey)) {
      alert("Vous ne pouvez ajouter deux fois le même livre");
      return;
    } else {
      uniqueKey = `book_${bookData.id}`;
      sessionStorage.setItem(uniqueKey, JSON.stringify(bookData));
      bookmarkButton.style.color = "#128064";
      console.log("Ajouté dans notre sessionStorage");

      let bookbody = document.querySelector("#content");

      // AFFICHAGE DE NOTRE POCH'LIST SI KEY DANS NOTRE SESSIONSTORAGE

      for (let key in sessionStorage) {
        if (sessionStorage.hasOwnProperty(key)) {
          //GET ITEM //
          let booksData = JSON.parse(sessionStorage.getItem(key));

          // Verifier l'existance des propriétés
          if (
            booksData &&
            booksData.title &&
            booksData.authors &&
            booksData.description &&
            booksData.image
          ) {
            // Construction de notre élement HTML "article"
            bookbody.innerHTML += `
            <article>
              <h5><strong>Titre:</strong> ${booksData.title}</h5></br>
              <p>Auteurs: ${booksData.authors}</p></br>
              <p>Description: ${booksData.description}</p></br>
              <img src="${booksData.image}" alt="Book Cover" class="img-cover"></br>
              <div class="icon">
                <a><span type="button" class="bookmark-btn-delete">
                <i class="fas fa-trash"></i></a>
                </span>
              </div>
            </article>`;
          }
        }
      }

      document.body.appendChild(bookbody);
    }
  });
  deleteBookIdToPochList(bookbody, uniqueKey);
}

function deleteBookIdToPochList(bookbody, key) {
  // Récupération de l'élèment du DOM
  const bookmarkButtonDelete = bookbody.querySelector(".bookmark-btn-delete");

  if (bookmarkButtonDelete) {
    bookmarkButtonDelete.addEventListener("click", (event) => {
      // Vérifier l'existance d'un article avant supression
      if (sessionStorage.getItem(key)) {
        sessionStorage.removeItem(key);
        bookbody.parentNode.removeChild(bookbody);
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function (e) {
  pageLoaded();
});
