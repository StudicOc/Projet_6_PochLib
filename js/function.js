//--------------------- ENREGISTRMENT DE NOS ARTICLES DANS SESSIONSTORAGE--------------//

export function sendAllBookSessionStorage(
  articleElement,
  bookData,
  uniqueKey,
  bookbody
) {
  const bookmarkButton = articleElement.querySelector(".bookmark-btn");

  const divBooks = document.createElement("div");
  divBooks.id = "divBooks";

  //--------------------------Affichage de la poch’liste--------------------------------//

  //----- Ecoute de l'évènement de l'icon "Bookmark" pour ajouter un livre à notre Poch'List-------------------//
  bookmarkButton.addEventListener("click", (event) => {
    event.preventDefault();

    if (sessionStorage.getItem(uniqueKey)) {
      alert("Vous ne pouvez ajouter deux fois le même livre");
      return;
    } else {
      sessionStorage.setItem(uniqueKey, JSON.stringify(bookData));
      bookmarkButton.style.color = "#128064";
      console.log("Ajouté dans notre sessionStorage");

      let bookbody = document.querySelector("#content");

      // Vider le contenu afin d'éviter les doublons //

      //ATTENTION ERREUR 0 RESOUDRE SI CONTENU VIDE pochlist titre disparait
      bookbody.innerHTML = "";

      for (let key in sessionStorage) {
        if (sessionStorage.hasOwnProperty(key)) {
          let booksData = JSON.parse(sessionStorage.getItem(key));

          console.log(bookData.title);
          if (
            booksData &&
            booksData.title &&
            booksData.authors &&
            booksData.description &&
            booksData.image
          ) {
            //---------------●Construction de notre article-----------------//

            const articleElement = document.createElement("article");
            articleElement.innerHTML = `
            <h5><strong>Titre:</strong> ${booksData.title}</h5></br>
            <p><strong>Id:</strong> ${booksData.id}</p></br>
            <p>Auteurs: ${booksData.authors}</p></br>
            <p>Description: ${booksData.description}</p></br>
            <img src="${booksData.image}" alt="Book Cover" class="img-cover"></br>
            <div class="icon">
              <a><span type="button" class="bookmark-btn-delete">
              <i class="fas fa-trash"></i></a>
              </span>
            </div>
            `;

            bookbody.appendChild(articleElement);

            deleteBookIdToPochList(articleElement, uniqueKey);
          }
        }
      }

      //document.body.appendChild(bookbody);
    }
  });
}

//----- Ecoute de l'évènement de l'icon "Bookmark" de supression d'un article-------------------//

export function deleteBookIdToPochList(articleElement, uniqueKey) {
  const bookmarkButtonDelete = articleElement.querySelector(
    ".bookmark-btn-delete"
  );

  if (bookmarkButtonDelete) {
    bookmarkButtonDelete.addEventListener("click", (event) => {
      sessionStorage.removeItem(uniqueKey);
      articleElement.parentNode.removeChild(articleElement);

      
      //----------Affichage dynamique---------------//
      Swal.fire({
        title: "Article supprimé",
        icon: "success",
        background: "#C7F0BB",
        showConfirmButton: false,
        timer: 2500,
      });

      console.log("Nous avons bien supprimé l'article: " + uniqueKey);
    });
  }
}

//----------------Affichage de la Poch-List lors du rechargement de la page--------------//

export function displayStaticDataofSessionSorage() {
  const displayBooksContent = document.getElementById("content");
  const pochListTitle = displayBooksContent.querySelector("h2");

  displayBooksContent.innerHTML = "";

  for (let key in sessionStorage) {
    if (sessionStorage.hasOwnProperty(key)) {
      try {
        let bookData = JSON.parse(sessionStorage.getItem(key));

        if (
          typeof bookData === "object" &&
          bookData.title &&
          bookData.authors &&
          bookData.description &&
          bookData.image
        ) {
          const articleElement = document.createElement("article");
          articleElement.innerHTML = `
            <h5><strong>Titre:</strong> ${bookData.title}</h5></br>
            <p><strong>Id:</strong> ${bookData.id}</p></br>
            <p>Auteurs: ${bookData.authors}</p></br>
            <p>Description: ${bookData.description}</p></br>
            <img src="${bookData.image}" alt="Book Cover" class="img-cover"></br>
            <div class="icon">
              <a><span type="button" class="bookmark-btn-delete">
                <i class="fas fa-trash"></i></a>
              </span>
            </div>
          `;

          displayBooksContent.appendChild(articleElement);

          deleteBookIdToPochList(articleElement, key);
        }
      } catch (error) {
        console.error("Error parsing sessionStorage item:", error);
      }
    }
  }
}
