// Au chargement de la page //
// Fonctionnalité 1 = Button "Ajouter un livre"

function pageLoaded() {
  document.addEventListener("DOMContentLoaded", function () {
    // Créer le bouton
    const buttonAddBook = document.createElement("button");
    buttonAddBook.textContent = "Ajouter un livre";

    // Ajouter le bouton au DOM
    document.body.appendChild(buttonAddBook);
  });
}
pageLoaded();
