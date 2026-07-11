export function ajoutListenersAvis() {
  const piecesElements = document.querySelectorAll(".fiches article button");

  for (let i = 0; i < piecesElements.length; i++) {
    piecesElements[i].addEventListener("click", async function (event) {
      const id = event.target.dataset.id;
      let reponse = window.localStorage.getItem("avis-" + id);
      if (!reponse) {
        reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`);
        reponse = await reponse.json();
        window.localStorage.setItem("avis-" + id, JSON.stringify(reponse));
      } else {
        reponse = JSON.parse(reponse);
      }
      const avis = reponse;

      const pieceElement = event.target.parentElement;

      const avisExistants = pieceElement.querySelector(".avis");
      if (!avisExistants) {
        const avisElement = document.createElement("p");
        avisElement.classList.add("avis");
        for (let i = 0; i < avis.length; i++) {
          avisElement.innerHTML += `${avis[i].utilisateur}: ${avis[i].commentaire} <br>`;
        }
        pieceElement.appendChild(avisElement);

      }
    });
  }
}

export function ajoutListenerEnvoyerAvis() {

  const formulaireAvis = document.querySelector(".formulaire-avis");
  formulaireAvis.addEventListener("submit", function (event) {
    event.preventDefault();

    const avis = {
      pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
      utilisateur: event.target.querySelector("[name=utilisateur]").value,
      nbEtoiles: parseInt(event.target.querySelector("[name=nb-etoiles]").value),
      commentaire: event.target.querySelector("[name=commentaire]").value
    };

    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(avis);

    // Appel de la fonction fetch avec toutes les informations nécessaires
    fetch("http://localhost:8081/avis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile
    });

    console.log("Avis envoyé :", avis);
  });
}

export async function afficherGraphiqueAvis() {

  // Calcul du nombre total de commentaires par quantité d'étoiles attribuées
  const avis = await fetch("http://localhost:8081/avis").then(avis => avis.json());
  const nb_commentaires = [0, 0, 0, 0, 0];
  for (let commentaire of avis) {
    nb_commentaires[commentaire.nbEtoiles - 1]++;
  }

  const data = {
    labels: ["5 étoiles", "4 étoiles", "3 étoiles", "2 étoiles", "1 étoile"],
    datasets: [{
      axis: 'y',
      label: "Étoiles attribuées",
      data: nb_commentaires.reverse(),
      fill: false,
      backgroundColor: 'rgba(255, 205, 86, 0.2)',
      borderColor: 'rgb(255, 205, 86)',
      borderWidth: 1
    }]
  };

  // Objet de configuration final
  const config = {
    type: "bar",
    data: data,
    options: {
      indexAxis: "y",
    },
  };

  // Rendu du graphique dans l'élément canvas
  new Chart(document.querySelector("#graphique-avis"), config,);

  const nb_availability = [0, 0];

  const pieceJSON = window.localStorage.getItem("pieces");
  const pieces = JSON.parse(pieceJSON);
  for (let commentaire of avis) {
    if (commentaire.pieceId !== null) {
      //const piece = await fetch(`http://localhost:8081/pieces/${commentaire.pieceId}`).then(piece => piece.json());

      const piece = pieces.find(p => p.id === commentaire.pieceId);
      if (piece.disponibilite) {
        nb_availability[1]++;
      } else {
        nb_availability[0]++;
      }
    }
  }

  const labels1 = ["les pièces disponibles", "les pièces non disponibles"]
  const data1 = {
    labels: labels1,
    datasets: [{
      label: 'Avis sur les pièces disponibles et non disponibles',
      data: nb_availability.reverse(),
      backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
      borderColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
      borderWidth: 1
    }]
  };

  const config1 = {
    type: 'bar',
    data: data1,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };

  // Rendu du graphique dans l'élément canvas
  new Chart(
    document.querySelector("#graphique-avis-piece-availability"),
    config1,
  );
}

