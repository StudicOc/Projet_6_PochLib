//--------------------- ENREGISTRMENT DE NOS ARTICLES DANS SESSIONSTORAGE--------------//

export function sendAllBookSessionStorage(
  articleElement,
  bookData,
  uniqueKey,
  bookbody
) {
  const bookmarkButton = articleElement.querySelector(".bookmark-btn");

  //--------------------------Affichage de la poch’liste--------------------------------//
  //----- Ecoute de l'évènement de l'icon "Bookmark" pour ajouter un livre à notre Poch'List-------------------//

  bookmarkButton.addEventListener("click", (event) => {
    event.preventDefault();

    const articleDivFlex = document.createElement("div");
    articleDivFlex.classList.add("article_Div_Flex");

    if (sessionStorage.getItem(uniqueKey)) {
      alert("Vous ne pouvez ajouter deux fois le même livre");
    } else {
      Swal.fire({
        title: "Hello",
        text: "Ajouté à vos favoris!",
        icon: "success",
        showConfirmButton: false,
        timer: 2500,
        buttonsStyling: false,
      });
      sessionStorage.setItem(uniqueKey, JSON.stringify(bookData));

      bookmarkButton.style.color = "#128064";
      console.log("Ajouté dans notre sessionStorage");

      let bookbody = document.querySelector("#content"); // Créer un conteneur div pour les articles

      const articlesContainer = document.createElement("div");
      articlesContainer.classList.add("articleflex");

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
            <i class="fas fa-trash"></i>
            </span></a>
            </div>
            `;

            articlesContainer.appendChild(articleElement);

            deleteBookIdToPochList(articleElement, uniqueKey);
          }
        }
      } // Ajouter le conteneur d'articles au contenu de la page //bookbody.innerHTML = "";

      bookbody.appendChild(articlesContainer);
    }
    checkSessionStorageElement();
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
      articleElement.parentNode.removeChild(articleElement); //----------Affichage dynamique---------------//

      Swal.fire({
        title: "Good job!",
        text: "Livre supprimé!",
        icon: "success",
        showConfirmButton: false,
        timer: 2500,
      });
      checkSessionStorageElement();
      console.log("Nous avons bien supprimé l'article: " + uniqueKey);
    });
  }
}

//----------------Affichage de la Poch-List lors du rechargement de la page--------------//

export function displayStaticDataofSessionSorage() {
  const displayBooksContent = document.getElementById("content");

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
          const articleContainer = document.createElement("div");
          articleContainer.id = "divBooks";

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

          articleContainer.appendChild(articleElement);
          displayBooksContent.appendChild(articleContainer);

          deleteBookIdToPochList(articleContainer, key);
          checkSessionStorageElement();
        }
      } catch (error) {
        console.error("Error parsing sessionStorage item:", error);
      }
    }
  }
}

//----------------------------//

export function checkSessionStorageElement() {
  const titleContent = document.querySelector("#content h2"); //const titleContent =displayBooksContent.childNodes[1] //console.log(!!Object.keys(sessionStorage).find((sessionElement)=> sessionElement.includes("book")))
  if (
    !!Object.keys(sessionStorage).find((sessionElement) =>
      sessionElement.includes("book")
    )
  ) {
    titleContent.style.display = "block";
    console.log(titleContent);
  } else {
    titleContent.style.display = "none";
    console.log(titleContent);
  }

  console.log("check");
}
