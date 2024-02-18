// ---------IMPORTATION DU FICHIER FUNCTION-----------//

import {
  sendAllBookSessionStorage,
  deleteBookIdToPochList,
  displayStaticDataofSessionSorage,
} from "./function.js";

const divElement = document.createElement("div");
divElement.classList.add("add_Books");

const divBooks = document.createElement("div");
divBooks.id = "divBooks";

// ----------- FUNCTION CHARGEMENT DE LA PAGE---------------//

function pageLoaded() {
  //---------------Création de notre bouton "Ajouter un livre"----------------//
  const addBooksContainer = document.getElementById("content");

  const buttonAddBook = document.createElement("button");
  buttonAddBook.textContent = "Ajouter un livre";
  buttonAddBook.classList.add("custom-button");

  divElement.appendChild(buttonAddBook);
  addBooksContainer.appendChild(divElement);

  //------------Gestion de notre positionnement des balises----------//
  const hrElement = document.querySelector("hr");
  document.body.insertBefore(divElement, hrElement);

  addButtonSearchBook(buttonAddBook, hrElement);
}

// ------- FETCH---AFFICHAGE DES RESULTATS  --------------------------//

function addButtonSearchBook(buttonAddBook, hrElement) {
  //----- Ecoute de l'évènement du bouton " ajouter un livre"-------------------//
  buttonAddBook.addEventListener("click", function (event) {
    divElement.style.display = "none";

    //------------Construction de notre formulaire------------------------//
    const form = document.createElement("form");

    //--------------INPUT-------------------//

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

    //----------------BUTTON : SEARCH + CANCEL --------------------//

    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("flex-Button-Search-Cancel");

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Rechercher";
    submitButton.style.backgroundColor = "#128064";
    buttonDiv.appendChild(submitButton);

    const cancelButton = document.createElement("button");
    cancelButton.type = "reset";
    cancelButton.textContent = "Annuler";
    cancelButton.style.backgroundColor = "#BD5758";
    buttonDiv.appendChild(cancelButton);

    //------------------AJOUT DES ELEMENTS DANS LE DOM --------------//

    document.body.appendChild(form);
    document.body.appendChild(buttonDiv);

    document.body.insertBefore(form, hrElement);
    document.body.insertBefore(buttonDiv, hrElement);

    //------------------ECOUTE DE NOTRE EVENEMENT SUBMIT-----------------------//

    submitButton.addEventListener("click", function (e) {
      e.preventDefault();
      const titleValue = titleInput.value.trim();
      const authorValue = authorInput.value.trim();

      //--------------------VERIFICATION DES SAISIES--------------//

      if (
        titleValue === "" ||
        authorValue === "" ||
        titleValue.length < 3 ||
        authorValue.length < 3
      ) {
        alert(
          "Veuillez vérifier votre saisie et saisir au moins 3 caractères pour le titre et l'auteur pour valider votre recherche"
        );
      } else {
        let encodedTtile = encodeURI(titleValue);
        let encodedAuthor = encodeURI(authorValue);

        //----------------AFFICHAGE DES RESULTATS DE RECHERCHES------------------------------//
        const URLBooks = `https://www.googleapis.com/books/v1/volumes?q=${encodedTtile}+inauthor:${encodedAuthor}`;
        console.log(URLBooks);

        fetch(URLBooks)
          .then((response) => response.json())
          .then((data) => {
            if (data.items.length > 0) {
              //---------------MAP-----------------//
              let tmpMapId = new Map();

              if (data.items.length > 0) {
                for (let i = 0; i < data.items.length; i++) {
                  tmpMapId.set(data.items[i].id, data.items[i]);
                }
              }
              //----------------TITLE---------------//
              const title = document.createElement("h6");
              title.textContent = "Résultats de recherches ";

              document.body.insertBefore(title, hrElement);

              let articleElement;

              for (let books of tmpMapId.values()) {
                const uniqueKey = `book_${books.id}`;
                articleElement = document.createElement("article");

                const NoretrieveImg = books.volumeInfo.imageLinks
                  ? books.volumeInfo.imageLinks.thumbnail
                  : "images/unavailable.png";
                const limitedDescription =
                  books.volumeInfo.description &&
                  books.volumeInfo.description.length > 200
                    ? books.volumeInfo.description.slice(0, 200) + "..."
                    : books.volumeInfo.description || "Information manquante";

                //---------------CONSTRUCTION DE NOS ARTICLES-----------------//

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

                // Appel de notre function de suppression d'un article//
                deleteBookIdToPochList(articleElement, uniqueKey);

                const bookData = {
                  title: books.volumeInfo.title,
                  id: books.id,
                  authors: books.volumeInfo.authors,
                  description: limitedDescription,
                  image: NoretrieveImg,
                };

                sendAllBookSessionStorage(
                  articleElement,
                  bookData,
                  uniqueKey,
                  divBooks
                );
              }

              document.body.insertBefore(divBooks, hrElement);
            } else {
              //------------------CONDITION PAS DE RESULTATS GOOGLE API BOOK--------------//
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

    //------------------ANNULER LE FORMULAIRE + RECHERCHES-------------------//

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

      divElement.style.display = "flex";
      addBooksContainer.appendChild(divElement);
    });
  });
}

//----------------FUNCTION RECHARGEMENT ------------------------//

document.addEventListener("DOMContentLoaded", function (e) {
  pageLoaded();
  displayStaticDataofSessionSorage();
});
