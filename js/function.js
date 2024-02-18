//--------------------- ENREGISTRMENT DE NOS ARTICLES DANS SESSIONSTORAGE--------------//

export function sendAllBookSessionStorage(
  articleElement,
  bookData,
  uniqueKey,
  bookbody
) {
  const bookmarkButton = articleElement.querySelector(".bookmark-btn");

  bookmarkButton.addEventListener("click", (event) => {
    event.preventDefault();

    function isExisteInSessionStorage() {
      if (sessionStorage.getItem(uniqueKey) !== null) {
        return true;
      }
      return false;
    }

    if (isExisteInSessionStorage()) {
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

      if (!isExisteInSessionStorage()) {
        sessionStorage.setItem(uniqueKey, JSON.stringify(bookData));

        bookmarkButton.style.color = "#128064";
        console.log("Ajouté dans notre sessionStorage");

        let bookbody = document.querySelector("#content");

        const articlesContainer = document.createElement("div");
        articlesContainer.id = "divBooks";

        if (sessionStorage.hasOwnProperty(uniqueKey)) {
          let booksData = JSON.parse(sessionStorage.getItem(uniqueKey));

          console.log(bookData.title);
          if (
            booksData &&
            booksData.title &&
            booksData.authors &&
            booksData.description &&
            booksData.image
          ) {
            const articleElement = document.createElement("article");
            articleElement.innerHTML = `
            <h5><strong>Titre:</strong> ${booksData.title}</h5></br>
            <p><strong>Id:</strong> ${booksData.id}</p></br>
            <p>Auteurs: ${booksData.authors}</p></br>
            <p>Description: ${booksData.description}</p></br>
            <img src="${booksData.image}" alt="Book Cover" class="img-cover"></br>
            <div class="icon">
            <span type="button" class="bookmark-btn-delete">
            <i class="fas fa-trash"></i>
            </span>
            </div>
            `;

            articlesContainer.appendChild(articleElement);

            deleteBookIdToPochList(articleElement, uniqueKey);
          }
        }

        bookbody.appendChild(articlesContainer);
      }
    }
    checkSessionStorageElement();
  });
}

//------------------------AFFICHAGE DES DOUBLONS----------------------------------//
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
              <span type="button" class="bookmark-btn-delete">
                <i class="fas fa-trash"></i>
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

//-------------------------CHECKER LES ELEMENTS SESSIONSTORAGE-----------------------//
export function checkSessionStorageElement() {
  const titleContent = document.querySelector("#content h2");
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

//---------------------------SUPRESSION FAVORIS--------------------------------------//
export function deleteBookIdToPochList(articleElement, uniqueKey) {
  const bookmarkButtonDelete = articleElement.querySelector(
    ".bookmark-btn-delete"
  );

  if (bookmarkButtonDelete) {
    bookmarkButtonDelete.addEventListener("click", (event) => {
      sessionStorage.removeItem(uniqueKey);
      articleElement.parentNode.removeChild(articleElement);

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
