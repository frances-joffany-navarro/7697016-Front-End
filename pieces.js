import { afficherGraphiqueAvis, ajoutListenersAvis, ajoutListenerEnvoyerAvis } from "./avis.js";

let pieces = window.localStorage.getItem("pieces");

if (pieces === null) {
  const reponse = await fetch('http://localhost:8081/pieces');
  pieces = await reponse.json();
  const valuerPieces = JSON.stringify(pieces);
  window.localStorage.setItem("pieces", valuerPieces);
} else {
  pieces = JSON.parse(pieces);
}


genererPieces(pieces);
ajoutListenerEnvoyerAvis();


const btnTrierAsc = document.querySelector(".btn-trier-asc");

btnTrierAsc.addEventListener("click", function () {
  const piecesOrdonnees = Array.from(pieces);
  piecesOrdonnees.sort(function (a, b) {
    return a.prix - b.prix;
  });

  // Efface le contenu de la balise body et donc l’écran
  document.querySelector(".fiches").innerHTML = '';
  genererPieces(piecesOrdonnees);

});

const btnTrierDec = document.querySelector(".btn-trier-dec");

btnTrierDec.addEventListener("click", function () {
  const piecesOrdonnees = Array.from(pieces);
  piecesOrdonnees.sort(function (a, b) {
    return b.prix - a.prix;
  });

  // Efface le contenu de la balise body et donc l’écran
  document.querySelector(".fiches").innerHTML = '';
  genererPieces(piecesOrdonnees);

});

const btnFilterAvecDescription = document.querySelector(".btn-filter-avec-description");

btnFilterAvecDescription.addEventListener("click", function () {
  const piecesFiltrees = pieces.filter(function (piece) {
    return piece.description;
  });

  // Efface le contenu de la balise body et donc l’écran
  document.querySelector(".fiches").innerHTML = '';
  genererPieces(piecesFiltrees);
});

const btnFilterCher = document.querySelector(".btn-filter-cher");

btnFilterCher.addEventListener("click", function () {
  const piecesFiltrees = pieces.filter(function (piece) {
    return piece.prix >= 35;
  });

  // Efface le contenu de la balise body et donc l’écran
  document.querySelector(".fiches").innerHTML = '';
  genererPieces(piecesFiltrees);
});

const inputRange = document.getElementById("input-range");
inputRange.addEventListener("input", function () {
  const piecesFiltrees = pieces.filter(function (piece) {
    return piece.prix <= inputRange.value;
  });

  // Efface le contenu de la balise body et donc l’écran
  document.querySelector(".fiches").innerHTML = '';
  genererPieces(piecesFiltrees);
});

const nomsAbordables = pieces.map(piece => piece.nom);
for (let i = pieces.length - 1; i >= 0; i--) {
  if (pieces[i].prix < 35) {
    nomsAbordables.splice(i, 1)
  }
}

const abordablesElement = document.createElement("ul");
for (let i = 0; i < nomsAbordables.length; i++) {
  const nomElement = document.createElement("li");
  nomElement.textContent = nomsAbordables[i];
  abordablesElement.appendChild(nomElement);
}

document.querySelector(".abordables").appendChild(abordablesElement);

const nomsDisponibles = pieces.map(piece => piece.nom);
const prixDisponibles = pieces.map(piece => piece.prix);
for (let i = pieces.length - 1; i >= 0; i--) {
  if (pieces[i].available === false) {
    nomsDisponibles.splice(i, 1)
    prixDisponibles.splice(i, 1)
  }
}

const disponiblesElement = document.createElement("ul");
for (let i = 0; i < nomsDisponibles.length; i++) {
  const nomElement = document.createElement("li");
  nomElement.textContent = `${nomsDisponibles[i]} - €${prixDisponibles[i].toFixed(2)}`;
  disponiblesElement.appendChild(nomElement);
}

document.querySelector(".availables").appendChild(disponiblesElement);


function genererPieces(pieces) {
  for (let i = 0; i < pieces.length; i++) {
    const sectionFiches = document.querySelector(".fiches");

    const articlePiece = document.createElement("article");

    const imgPiece = document.createElement("img");
    imgPiece.src = pieces[i].image;

    const nomPiece = document.createElement("h2")
    nomPiece.textContent = pieces[i].nom;

    const prixPiece = document.createElement("p");
    prixPiece.innerText = `Prix: ${pieces[i].prix} € (${pieces[i].prix < 35 ? "€" : "€€€"})`;

    const categoriePiece = document.createElement("p");
    categoriePiece.innerText = pieces[i].categorie || "";

    const descriptionPiece = document.createElement("p");
    descriptionPiece.innerText = `${pieces[i].description || "No description at the moment."}`;

    const stockPiece = document.createElement("p");
    stockPiece.innerText = `${pieces[i].disponibilite === true ? "In stock" : "Out of stock"}`;

    const buttonAvis = document.createElement("button");

    buttonAvis.dataset.id = pieces[i].id;
    buttonAvis.textContent = "Afficher les avis";

    sectionFiches.appendChild(articlePiece);
    articlePiece.appendChild(imgPiece);
    articlePiece.appendChild(nomPiece);
    articlePiece.appendChild(prixPiece);
    articlePiece.appendChild(categoriePiece);
    articlePiece.appendChild(descriptionPiece);
    articlePiece.appendChild(stockPiece);
    articlePiece.appendChild(buttonAvis);
  }

  // Ajout de la fonction ajoutListenersAvis
  ajoutListenersAvis();
}

// Ajout du listener pour mettre à jour des données du localStorage
const boutonMettreAJour = document.querySelector(".btn-maj");

boutonMettreAJour.addEventListener("click", function () {
  window.localStorage.removeItem("pieces");
  window.localStorage.removeItem("avis");
});

afficherGraphiqueAvis();
