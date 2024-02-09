// ---------IMPORTATION DU FICHIER FUNCTION-----------//

import {
  sendAllBookSessionStorage,
  deleteBookIdToPochList,
} from "./function.js";

const divElement = document.createElement("div");
divElement.classList.add("add_Books");

const divBooks = document.createElement("div");
divBooks.id = "divBooks";

// ----------- CHARGEMENT DE LA PAGE---------------//

function pageLoaded() {
  //---------------●Création de notre bouton => "Ajouter un livre"----------------//
  const addBooksContainer = document.getElementById("content");

  const buttonAddBook = document.createElement("button");
  buttonAddBook.textContent = "Ajouter un livre";
  buttonAddBook.classList.add("custom-button");

  divElement.appendChild(buttonAddBook);
  addBooksContainer.appendChild(divElement);

  //------------●Gestion de notre positionnement des balises----------//
  const hrElement = document.querySelector("hr");
  document.body.insertBefore(divElement, hrElement);

  addButtonSearchBook(buttonAddBook, hrElement);

  //---------------Poch'List - Gestion de la visibilité------------------------//
  if (sessionStorage.getItem(key) > 0) {
    document.getElementById("#content").style.display = "block";
  } else {
    document.getElementById("#content").style.display = "none";
  }
}

//--------------------------------------------------------------------------------//

// ------- FETCH--- RETRIEVE RESULTS GOOGLE API BOOKS --------------------------//

function addButtonSearchBook(buttonAddBook, hrElement) {
  //----- ●Ecoute de l'évènement du bouton " ajouter un livre"-------------------//
  buttonAddBook.addEventListener("click", function (event) {
    divElement.style.display = "none";
    divBooks.innerHTML = "";

    //------------●Construction de notre formulaire------------------------//
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

    document.body.appendChild(form);
    document.body.appendChild(buttonDiv);

    document.body.insertBefore(form, hrElement);
    document.body.insertBefore(buttonDiv, hrElement);

    submitButton.addEventListener("click", function (e) {
      const titleValue = titleInput.value.trim();
      const authorValue = authorInput.value.trim();
      const alertError = document.createElement("p");

      //--------------------●Vérification des saisies--------------//

      if (titleValue === "" || authorValue === "") {
        alertError.innerText = "Veuillez vérifier votre saisie";
        titleInput.style.borderColor = "#BD5758";
        authorInput.style.borderColor = "#BD5758";
        buttonDiv.appendChild(alertError);
      } else {
        //----------------● AFFICHAGE DES RESULTATS DE RECHERCHES------------------------------//
        const URLBooks = `https://www.googleapis.com/books/v1/volumes?q=${titleValue}+inauthor:${authorValue}`;

        fetch(URLBooks)
          .then((response) => response.json())
          .then((data) => {
            console.log("Data received:", data);

            if (data.items && data.items.length > 0) {
              const title = document.createElement("h5");
              title.textContent = "Résultats de recherches ";
              document.body.insertBefore(title, hrElement);

              let articleElement;

              for (let books of data.items) {
                //-----------------------//

                // ----Vérification si nous recevons toute la liste Item[]------------//
                console.log("Processing book:", books);

                const uniqueKey = `book_${books.id}`;
                articleElement = document.createElement("article");

                const NoretrieveImg = books.volumeInfo.imageLinks
                  ? books.volumeInfo.imageLinks.thumbnail
                  : "images/unavailable.png";
                const limitedDescription =
                  books.volumeInfo.description &&
                  books.volumeInfo.description.length > 150
                    ? books.volumeInfo.description.slice(0, 150) + "..."
                    : books.volumeInfo.description || "Information manquante";

                //---------------●Construction de notre article-----------------//

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

    //------------------●Ecoute de l'évènement du bouton "ANNULER"-------------------//

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

document.addEventListener("DOMContentLoaded", function (e) {
  pageLoaded();
});
