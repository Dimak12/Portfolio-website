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

        // Limit description to 3 lines (CSS handles truncation)
        const description = `
          <div class="project-header">
            <div class="project-title">${p.title}</div>
            <div class="project-description">${p.description}</div>
            <a class="read-more">Read more →</a>
          </div>
        `;

        // Limit tags to 5, then add "+X more"
        const maxTags = 5;
        let tagsHTML = "";
        p.technologies.forEach((t, i) => {
          if (i < maxTags) {
            tagsHTML += `<span class="tech-tag">${t}</span>`;
          }
        });
        if (p.technologies.length > maxTags) {
          tagsHTML += `<span class="tech-tag more">+${p.technologies.length - maxTags} more</span>`;
        }

        const techSection = `<div class="project-tech">${tagsHTML}</div>`;

        card.innerHTML = description + techSection;

        // Click → go to project details page
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
        document.getElementById("project-category").textContent =
          "Category: " + project.category;

        // Full description
        const descContainer = document.getElementById("project-description");
        descContainer.innerHTML = marked.parse(project.fullDescription);

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

// ===============================
// Skills Modal System
// ===============================
const skillsData = {
  // CATEGORY 1: Consolidated
  dev: {
    title: "Software Development & Cloud",
    skills: [
      "Python",
      "Java",
      "Vue.JS",
      "JavaScript (ES6+)",
      "C/C++",
      "PHP",
      "REST APIs",
      "Full-Stack Development",
      "MySQL",
      "Microsoft Azure",
      "API-driven Data Management",
    ],
  },
  // CATEGORY 2: No Change
  ai: {
    title: "Artificial Intelligence & Cybersecurity",
    skills: [
      "Machine Learning",
      "Deep Learning",
      "EDA",
      "Intrusion Detection Systems",
      "Cybersecurity Tools",
    ],
  },
  // CATEGORY 3: Consolidated
  networking: {
    title: "Networking & Embedded Systems",
    skills: [
      "CCNA 1 & 2",
      "Software-Defined Networking (SDN)",
      "Cisco IOS XRv",
      "OpenDaylight",
      "GNS3 / QEMU",
      "Network Protocols",
      "Arduino / ESP32",
      "RFID & GPS",
      "IoT Solutions (Azure IoT, Twilio)",
    ],
  },
  // CATEGORY 4: No Change
  tools: {
    title: "Tools & Productivity",
    skills: [
      "Git / GitHub",
      "Matlab",
      "Microsoft Office Suite",
      "Tinkercad",
    ],
  },
  // CATEGORY 5: No Change
  soft: {
    title: "Soft Skills",
    skills: [
      "Communication",
      "Collaboration",
      "Problem Solving",
      "Leadership",
      "Adaptability",
      "Fast learner",
      "Time Management",
      "Critical Thinking",
      "Continuous Learning",
    ],
  },
};

// ===============================
// Populate skill previews in cards (NEW LOGIC)
// ===============================
document.querySelectorAll(".skill-category.modal-trigger").forEach((card) => {
  const key = card.dataset.skill;
  const tagsContainer = card.querySelector(".skill-tags");

  if (skillsData[key]) {
    const maxPreview = 5 // show up to 5 skills
    const skills = skillsData[key].skills;

    // Add preview skills
    skills.slice(0, maxPreview).forEach((s) => {
      const tag = document.createElement("span");
      tag.className = "skill-tag";
      tag.textContent = s;
      tagsContainer.appendChild(tag);
    });

    // Add "+X more" if there are hidden skills
    if (skills.length > maxPreview) {
      const moreTag = document.createElement("span");
      moreTag.className = "skill-tag more-hint";
      moreTag.textContent = `+${skills.length - maxPreview} more`;
      tagsContainer.appendChild(moreTag);
    }
  }
});

// Modal logic
const modal = document.getElementById("skill-modal");
if (modal) {
  const modalTitle = document.getElementById("modal-title");
  const modalSkills = document.getElementById("modal-skills");
  const closeBtn = document.querySelector(".modal .close");

  document.querySelectorAll(".modal-trigger").forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.dataset.skill;
      modalTitle.textContent = skillsData[key].title;
      modalSkills.innerHTML = skillsData[key].skills
        .map((s) => `<span class="skill-tag">${s}</span>`)
        .join("");
      modal.classList.remove("hidden");
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });
}

// ===============================
// Mobile Navigation Toggle
// ===============================
const menuToggle = document.querySelector(".menu-toggle");
const navCenter = document.querySelector(".nav-center");

if (menuToggle && navCenter) {
  menuToggle.addEventListener("click", () => {
    navCenter.classList.toggle("active");
  });

  // Close menu when clicking a link
  navCenter.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navCenter.classList.remove("active");
    });
  });
}