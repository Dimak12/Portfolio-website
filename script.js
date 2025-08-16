// Load projects on index.html
if (document.getElementById("projects-grid")) {
  fetch("projects.json")
    .then((res) => res.json())
    .then((projects) => {
      const grid = document.getElementById("projects-grid");
      projects.forEach((p) => {
        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `
          <div class="project-header">
            <div class="project-title">${p.title}</div>
            <div class="project-description">${p.description}</div>
          </div>
          <div class="project-tech">
            ${p.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        `;
        card.addEventListener("click", () => {
          window.location.href = `project.html?id=${p.id}`;
        });
        grid.appendChild(card);
      });
    });
}

// Load project details on project.html
if (window.location.pathname.includes("project.html")) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  fetch("projects.json")
    .then((res) => res.json())
    .then((projects) => {
      const project = projects.find((p) => p.id === id);
      if (project) {
        document.getElementById("project-title").textContent = project.title;
        document.getElementById("project-subtitle").textContent =
          project.subtitle;
        document.getElementById("project-status").textContent =
          "Status: " + project.status;
        document.getElementById("project-duration").textContent =
          "Duration: " + project.duration;
        document.getElementById("project-category").textContent =
          "Category: " + project.category;
        document.getElementById("project-description").innerHTML =
          project.fullDescription
            .split("\n\n")
            .map((p) => `<p>${p}</p>`)
            .join("");
        document.getElementById("project-technologies").innerHTML =
          project.technologies
            .map((t) => `<span class="tech-tag">${t}</span>`)
            .join("");
        const mediaContainer = document.getElementById("project-media");
        project.images.forEach((img) => {
          const imageEl = document.createElement("img");
          imageEl.src = img;
          imageEl.className = "project-image";
          imageEl.style.maxWidth = "100%";
          mediaContainer.appendChild(imageEl);
        });
        project.videos.forEach((vid) => {
          const videoEl = document.createElement("video");
          videoEl.src = vid;
          videoEl.controls = true;
          videoEl.style.maxWidth = "100%";
          mediaContainer.appendChild(videoEl);
        });
      }
    });
}
