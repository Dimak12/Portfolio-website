// ===============================
// Load projects on index.html
// ===============================
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
            ${p.technologies
              .map((t) => `<span class="tech-tag">${t}</span>`)
              .join("")}
          </div>
        `;
        card.addEventListener("click", () => {
          window.location.href = `project.html?id=${p.id}`;
        });
        grid.appendChild(card);
      });
    })
    .catch((err) => console.error("Error loading projects:", err));
}

// ===============================
// Load project details on project.html
// ===============================
if (window.location.pathname.includes("project.html")) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  fetch("projects.json")
    .then((res) => res.json())
    .then((projects) => {
      const project = projects.find((p) => p.id === id);
      if (project) {
        // Title & subtitle
        document.getElementById("project-title").textContent = project.title;
        document.getElementById("project-subtitle").textContent =
          project.subtitle;

        // Meta info
        document.getElementById("project-status").textContent =
          "Status: " + project.status;
        document.getElementById("project-duration").textContent =
          "Duration: " + project.duration;
        document.getElementById("project-category").textContent =
          "Category: " + project.category;

        // Full description
        const descContainer = document.getElementById("project-description");
        descContainer.innerHTML = project.fullDescription
          .split("\n\n")
          .map((p) => `<p>${p}</p>`)
          .join("");

        // Add live demo link if available
        if (project.link) {
          const linkEl = document.createElement("a");
          linkEl.href = project.link;
          linkEl.target = "_blank";
          linkEl.className = "project-link";
          linkEl.textContent = "🔗 Click here to visit the website";
          descContainer.appendChild(linkEl);
        }

        // Add GitHub repo link if available
        if (project.github) {
          const githubEl = document.createElement("a");
          githubEl.href = project.github;
          githubEl.target = "_blank";
          githubEl.className = "project-link";
          githubEl.textContent = "💻 View Source Code on GitHub";
          descContainer.appendChild(githubEl);
        }

        // Technologies
        document.getElementById("project-technologies").innerHTML =
          project.technologies
            .map((t) => `<span class="tech-tag">${t}</span>`)
            .join("");

        // Media (images & videos)
        const mediaContainer = document.getElementById("project-media");

        if (project.images && project.images.length > 0) {
          project.images.forEach((img) => {
            const imageEl = document.createElement("img");
            imageEl.src = img;
            imageEl.className = "project-image";
            imageEl.style.maxWidth = "100%";
            imageEl.style.marginBottom = "15px";
            mediaContainer.appendChild(imageEl);
          });
        }

        if (project.videos && project.videos.length > 0) {
          project.videos.forEach((vid) => {
            const videoEl = document.createElement("video");
            videoEl.src = vid;
            videoEl.controls = true;
            videoEl.style.maxWidth = "100%";
            videoEl.style.marginBottom = "15px";
            mediaContainer.appendChild(videoEl);
          });
        }
      } else {
        document.querySelector(".project-detail .container").innerHTML =
          "<p>❌ Project not found.</p>";
      }
    })
    .catch((err) => console.error("Error loading project details:", err));
}