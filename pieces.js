const reponse = await fetch('pieces-autos.json');
const pieces = await reponse.json();

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
  categoriePiece.innerText = pieces[i].categorie;

  const descriptionPiece = document.createElement("p");
  descriptionPiece.innerText = `${pieces[i].description || "No description at the moment."}`;

  const stockPiece = document.createElement("p");
  stockPiece.innerText = `${stockPiece === false ? "Out of Stock" : "In stock"}`

  sectionFiches.appendChild(articlePiece);
  articlePiece.appendChild(imgPiece);
  articlePiece.appendChild(nomPiece);
  articlePiece.appendChild(prixPiece);
  articlePiece.appendChild(categoriePiece);
  articlePiece.appendChild(descriptionPiece);
  articlePiece.appendChild(stockPiece);
}

const btnTrier = document.querySelector(".btn-trier");

btnTrier.addEventListener("click", function () {
  const piecesOrdonnees = Array.from(pieces);
  piecesOrdonnees.sort(function (a, b) {
    return b.prix - a.prix;
  });
  
  console.log(piecesOrdonnees);
});

const btnFilter = document.querySelector(".btn-filter");

btnFilter.addEventListener("click", function () {
  const piecesFiltrees = pieces.filter(function (piece) {
    return piece.description;
  });
  console.log(piecesFiltrees);
});
