function pageLoaded() {
  document.addEventListener("DOMContentLoaded", function () {
    //Masquer les éléments au chargement de la page
    const contenth2 = document.querySelector("h2");
    contenth2.style.display = "none";
    const contentDiv = document.getElementById("content");
    contentDiv.style.display = "none";

    //Création d'une div avec createElement, insertion dans cette div d'un bouton

    const addBooksContainer = document.getElementById("content");
    const divElement = document.createElement("div");
    divElement.classList.add("add_Books");

    // Création du bouton pour rechercher un livre
    const buttonAddBook = document.createElement("button");
    buttonAddBook.textContent = "Ajouter un livre";
    buttonAddBook.classList.add("custom-button");

    // Ajout du bouton à la div
    divElement.appendChild(buttonAddBook);

    // Append div as a child to the container
    addBooksContainer.appendChild(divElement);
    document.body.appendChild(divElement);

    // ECOUTE EVEN AJOUTER UN BOOK //
    buttonAddBook.addEventListener("click", function (event) {
      // Création du formulaire de recherche;
      console.log("J'ai cliqué");

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

      // Créer une div pour les boutons
      const buttonDiv = document.createElement("div");
      buttonDiv.classList.add("flex-Button-Search-Cancel");
      // Création du button de recherche
      const submitButton = document.createElement("button");
      submitButton.type = "submit";
      submitButton.textContent = "Rechercher";
      submitButton.style.backgroundColor = "#128064";
      buttonDiv.appendChild(submitButton);
      // Création du button d'annulation
      const cancelButton = document.createElement("button");
      cancelButton.type = "reset";
      cancelButton.textContent = "Annuler";
      cancelButton.style.backgroundColor = "#BD5758";
      buttonDiv.appendChild(cancelButton);
      document.body.appendChild(form);
      document.body.appendChild(buttonDiv);
      // ECOUTE EVENT SEARCH BOOK TO API GOOGLE BOOKS
      submitButton.addEventListener("click", function (e) {
        e.preventDefault();
        const titleValue = titleInput.value.trim();
        const authorValue = authorInput.value.trim();
        const alertError = document.createElement("p");
        // CONDITIONEMENT //
        // SI VALEURS VIDE BLOQUER LA RECHERCHE
        if (titleValue.trim() === "" || authorValue.trim() === "") {
          alertError.innerText = "Veuillez vérifier votre saisie";
          titleInput.style.borderColor = "#BD5758";
          authorInput.style.borderColor = "#BD5758";
          buttonDiv.appendChild(alertError);
        }
        // SINON DIPLAYS RESULTS
        else {
          const divBooks = document.createElement("div");
          const titleValue = titleInput.value;
          const authorValue = authorInput.value;
          const URLBooks = `https://www.googleapis.com/books/v1/volumes?q=${titleValue}+inauthor:${authorValue}`;

          // Fetch request
          fetch(URLBooks)
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              //---Itération pour afficher les données de l'API---//
              // CONDITIONNEMENT = SAERCH DOES NOT RETURN RESULTS
              if (data.items && data.items.length > 0) {
                const title = document.createElement("h5");
                title.textContent = "Résultats de recherches ";
                document.body.appendChild(title);

                for (let books of data.items) {
                  const NoretrieveImg = books.volumeInfo.imageLinks
                    ? books.volumeInfo.imageLinks.thumbnail
                    : "images/unavailable.png";
                  const limitedDescription =
                    books.volumeInfo.description &&
                    books.volumeInfo.description.length > 150
                      ? books.volumeInfo.description.slice(0, 150) + "..."
                      : books.volumeInfo.description || "Information manquante";
                  divBooks.id = "divBooks";
                  // Book information and HTML template -->
                  divBooks.innerHTML += `    
                      
            <article>
                  <h5><strong>Titre:</strong> ${books.volumeInfo.title}</h5></br>
                  <p><strong>Id:</strong> ${books.id}</p></br>
                  <p>Autors: ${books.volumeInfo.authors}</p></br>
                  <p>Description: ${limitedDescription}</p></br>
                  <img src="${NoretrieveImg}" alt="Book Cover" class="img-cover"></br>
                   <div class="icon">
                      <span type="button" class="bookmark-btn">
                          <i class="fas fa-bookmark"></i>
                      </span>
                    </div>
            </article>
                  
              `;
                  document.body.appendChild(divBooks);
                  const bookData = {
                    title: books.volumeInfo.title,
                    id: books.id,
                    authors: books.volumeInfo.authors,
                    description: limitedDescription,
                    image: NoretrieveImg,
                  };

                  function sendProductLocalStorage() {
                    const uniqueKey = `book_${books.id}`;
                    const bookmarkButtons =
                      divBooks.querySelectorAll(".bookmark-btn");

                    bookmarkButtons.forEach((bookmarkButton) => {
                      bookmarkButton.addEventListener("click", () => {
                        bookmarkButton.style.color = "#128064";
                        sessionStorage.setItem(
                          uniqueKey,
                          JSON.stringify(bookData)
                        );
                      });
                    });
                  }
                  sendProductLocalStorage();
                }
              } else {
                divBooks.innerHTML += `    
                  <div>
                  <p>Aucun livre n’a été trouvé</p>
                  </div
              `;
                document.body.appendChild(divBooks);
              }
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });
        }
      });

      function cancelSearch() {
        cancelButton.addEventListener("click", function () {
          document.body.removeChild(form);
          document.body.removeChild(buttonDiv);
        });
      }
      cancelSearch();
    });
  });
}
pageLoaded();
