// Au chargement de la page //
// Fonctionnalité 1 = Button "Ajouter un livre"

function pageLoaded() {
  document.addEventListener("DOMContentLoaded", function () {
    // Créer le bouton
    const buttonAddBook = document.createElement("button");
    buttonAddBook.textContent = "Ajouter un livre";

    // Ajout d'un style CSS au bouton "classList"
    buttonAddBook.classList.add("custom-button");
    document.body.appendChild(buttonAddBook);

    //Masquer les élements au chargement
    const contenth2 = document.querySelector("h2");
    contenth2.style.display = "none";

    const contentDiv = document.getElementById("content");
    contentDiv.style.display = "none";

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
        authorInput.name = "title";
        form.appendChild(authorLabel);
        form.appendChild(authorInput);

        // Créer une div pour les boutons
        const buttonDiv = document.createElement("div");

        // Création du buttton de recherche
        const submitButton = document.createElement("button");
        submitButton.textContent = "Rechercher";
        submitButton.type = "submit";
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
      },
      { once: true }
    );

    //Fonction Fetch => URL => fetch(`https://www.googleapis.com/books/v1/volumes?q=${}`)
    //{} déclaration d'une variable qui récupére les values des input
  });
}

pageLoaded();
