// Au chargement de la page //
// Fonctionnalité 1 = Button "Ajouter un livre"

function pageLoaded() {
  document.addEventListener("DOMContentLoaded", function () {
    //Création d'une div avec createElement, insertion dans cette div d'un bouton
    let newDiv = document.createElement("div");
    const buttonAddBook = document.createElement("button");
    buttonAddBook.textContent = "Ajouter un livre";

    // Ajout d'une classe "classList"
    buttonAddBook.classList.add("custom-button");

    newDiv.appendChild(buttonAddBook);

    //Ajoutons notre div dans notre body
    newDiv.classList.add("div-add-book");
    let body = document.querySelector("body");
    body.appendChild(newDiv);

    //Masquer les éléments au chargement de la page
    const contenth2 = document.querySelector("h2");
    contenth2.style.display = "none";

    const contentDiv = document.getElementById("content");
    contentDiv.style.display = "none";

    // ECOUTE EVEN AJOUTER UN BOOK //

    buttonAddBook.addEventListener(
      "click",
      function (event) {
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
        authorInput.name = "author"; // Correct the name attribute
        form.appendChild(authorLabel);
        form.appendChild(authorInput);

        // Créer une div pour les boutons
        const buttonDiv = document.createElement("div");

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
            titleInput.style.borderColor = "#50C75B";
            authorInput.style.borderColor = "#50C75B";
            buttonDiv.appendChild(alertError);

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
                  for (let books of data.items) {
                    const NoretrieveImg = books.volumeInfo.imageLinks
                      ? books.volumeInfo.imageLinks.thumbnail
                      : "images/unavailable.png";

                    divBooks.id = "divBooks";

                    divBooks.innerHTML += `    

              <articles>
                  <h4>Resultats de recherches</>
                  
                  <div class="text">
                  <h5>${books.volumeInfo.title}</h5>
                  <p>Id:${books.id}</p>
                  <p>Autors:${books.volumeInfo.authors}</p>
                  <p>Description:${
                    books.volumeInfo.description
                      ? books.volumeInfo.description
                      : "Information manquante"
                  }</p>
                  </div>
                  <div>
                  <img src="${NoretrieveImg}" alt="Book Cover">
                  </div>

                  <div class="icon">
                  <i class="fas fa-bookmark" onclick="addToSessionStorage()"></i>
                  </div>

              </articles>
              `;

                    document.body.appendChild(divBooks);

              // Création d'une fonction
              



                  }
                } else {
                  console.log("No");
                  divBooks.innerHTML += `    

              <articles>
                  <p>Aucun livre n’a été trouvé</p>   
              </articles>
              `;
                }
              })
              .catch((error) => {
                console.error("Error fetching data:", error);
              });
          }
        });

        cancelButton.addEventListener("click", function () {
          document.body.removeChild(form);
          document.body.removeChild(buttonDiv);
        });
      }
      //{ once: true }
    );
  });
}

pageLoaded();

//Fonction Fetch => URL => fetch(`https://www.googleapis.com/books/v1/volumes?q=${}`)
//{} déclaration d'une variable qui récupére les values des input

// ERROR
// - Le formulaire se recharge plusieuros fois au click
