const teams = {
  "Art Racing": {
    description: "Uma equipe focada em design e desempenho aerodinâmico.",
    members: ["Piloto 1", "Piloto 2"],
  },
  "Andrades Race Group": {
    description: "Equipe de longa tradição no mundo do rally.",
    members: ["Piloto 3", "Piloto 4"],
  },
};

window.showTeamInfo = function (teamName) {
  const teamInfo = teams[teamName];
  if (!teamInfo) {
    alert("Equipe não encontrada!");
    return;
  }

  const container = document.getElementById("team-info-container");
  container.innerHTML = `
        <h3>${teamName}</h3>
        <p>${teamInfo.description}</p>
        <h4>Membros:</h4>
        <ul>
            ${teamInfo.members.map((member) => `<li>${member}</li>`).join("")}
        </ul>
    `;
  container.style.display = "block";
};
