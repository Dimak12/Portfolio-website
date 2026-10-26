// =====================================================
// Shared helpers
// =====================================================
const src = (path) => encodeURI(path);

// Media entries can be plain strings or { src, caption } objects
function normaliseMedia(item) {
  if (typeof item === "string") {
    const name = item.split("/").pop().replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
    return { src: item, caption: name.charAt(0).toUpperCase() + name.slice(1) };
  }
  return item;
}

// Minimal Markdown fallback (headings, lists, bold) in case the CDN fails to load
function basicMarkdown(md) {
  const inline = (s) => s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  return md
    .split(/\n\n+/)
    .map((block) => {
      const lines = block.split("\n");
      let html = "";
      let list = [];
      const flush = () => {
        if (list.length) html += `<ul>${list.map((l) => `<li>${inline(l)}</li>`).join("")}</ul>`;
        list = [];
      };
      lines.forEach((line) => {
        if (line.startsWith("- ")) list.push(line.slice(2));
        else {
          flush();
          const h = line.match(/^(#{1,6})\s+(.*)/);
          html += h ? `<h${h[1].length}>${inline(h[2])}</h${h[1].length}>` : `<p>${inline(line)}</p>`;
        }
      });
      flush();
      return html;
    })
    .join("");
}

function coverFor(p) {
  if (p.cover) return p.cover;
  if (p.images && p.images.length) return normaliseMedia(p.images[0]).src;
  return null;
}

// Footer year
document.querySelectorAll(".year").forEach((el) => (el.textContent = new Date().getFullYear()));

// =====================================================
// Mobile navigation
// =====================================================
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open);
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    })
  );
}

// =====================================================
// Skills (index.html)
// =====================================================
const skillsData = [
  {
    title: "Artificial Intelligence",
    skills: [
      "Deep learning (MLP, CNN, LSTM)",
      "Spatio-temporal graph neural networks",
      "Natural language processing",
      "Knowledge representation & reasoning",
      "Explainable AI",
      "AutoML (BOHB, DEHB)",
      "Bayesian networks",
      "PyTorch",
      "TensorFlow / Keras",
      "PyTorch Geometric, TSL",
    ],
  },
  {
    title: "Software & Cloud",
    skills: [
      "Python",
      "Java",
      "JavaScript",
      "Vue.js",
      "C / C++",
      "PHP",
      "REST APIs",
      "MySQL",
      "Microsoft Azure",
    ],
  },
  {
    title: "Networking & Security",
    skills: [
      "Software-defined networking",
      "OpenDaylight",
      "Cisco IOS XRv",
      "GNS3 / QEMU",
      "Intrusion detection systems",
      "CCNA 1 & 2",
    ],
  },
  {
    title: "Embedded & IoT",
    skills: ["Arduino", "ESP32", "RFID & GPS", "Azure IoT", "Twilio"],
  },
  {
    title: "Tools",
    skills: [
      "Git / GitHub",
      "Linux",
      "Docker",
      "Jupyter",
      "LaTeX",
      "MATLAB",
      "Excel, Word & PowerPoint",
      "Power BI (introductory)",
    ],
  },
];

const skillsGrid = document.getElementById("skills-grid");
if (skillsGrid) {
  skillsGrid.innerHTML = skillsData
    .map(
      (group) => `
      <div class="skill-group">
        <h3>${group.title}</h3>
        <ul>${group.skills.map((s) => `<li>${s}</li>`).join("")}</ul>
      </div>`
    )
    .join("");
}

// =====================================================
// Project cards (index.html)
// =====================================================
const projectsGrid = document.getElementById("projects-grid");
if (projectsGrid) {
  fetch("projects.json")
    .then((res) => res.json())
    .then((projects) => {
      projects.forEach((p, i) => {
        const cover = coverFor(p);
        const maxTags = 4;
        const tags = p.technologies
          .slice(0, maxTags)
          .map((t) => `<span class="tag">${t}</span>`)
          .join("");
        const extra =
          p.technologies.length > maxTags
            ? `<span class="tag tag-muted">+${p.technologies.length - maxTags}</span>`
            : "";

        const card = document.createElement("a");
        card.href = `project.html?id=${p.id}`;
        card.className = "project-card" + (i === 0 ? " featured" : "");
        card.innerHTML = `
          <div class="card-media">
            ${
              cover
                ? `<img src="${src(cover)}" alt="" loading="lazy" />`
                : `<div class="card-placeholder"><span>${p.category}</span></div>`
            }
          </div>
          <div class="card-body">
            <p class="card-meta">${p.category}${p.duration ? ` &middot; ${p.duration}` : ""}</p>
            <h3 class="card-title">${p.title}</h3>
            <p class="card-desc">${p.description}</p>
            <div class="tag-list">${tags}${extra}</div>
            <span class="card-link">Read case study <i class="fas fa-arrow-right"></i></span>
          </div>`;
        projectsGrid.appendChild(card);
      });
    })
    .catch((err) => console.error("Error loading projects:", err));
}

// =====================================================
// Project detail (project.html)
// =====================================================
if (document.getElementById("project-title")) {
  const id = new URLSearchParams(window.location.search).get("id");

  fetch("projects.json")
    .then((res) => res.json())
    .then((projects) => {
      const index = projects.findIndex((p) => p.id === id);
      const project = projects[index];

      if (!project) {
        document.querySelector(".project-page .container").innerHTML =
          '<p class="not-found">Project not found. <a href="index.html#projects">Back to projects</a></p>';
        return;
      }

      document.title = `${project.title} | Plandi Makali`;
      document.getElementById("project-category").textContent = project.category;
      document.getElementById("project-title").textContent = project.title;
      document.getElementById("project-subtitle").textContent = project.subtitle;

      // Key facts
      const facts = [
        ["Duration", project.duration],
        ["Status", project.status],
      ].filter(([, v]) => v);
      document.getElementById("project-facts").innerHTML = facts
        .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
        .join("");

      // Action buttons
      const actions = [];
      if (project.github)
        actions.push(
          `<a class="btn btn-primary" href="${project.github}" target="_blank" rel="noopener"><i class="fab fa-github"></i> Source code</a>`
        );
      if (project.link)
        actions.push(
          `<a class="btn btn-ghost" href="${project.link}" target="_blank" rel="noopener"><i class="fas fa-arrow-up-right-from-square"></i> Live site</a>`
        );
      document.getElementById("project-actions").innerHTML = actions.join("");

      // Description
      document.getElementById("project-description").innerHTML =
        typeof marked !== "undefined" ? marked.parse(project.fullDescription) : basicMarkdown(project.fullDescription);

      // Technologies
      document.getElementById("project-technologies").innerHTML = project.technologies
        .map((t) => `<span class="tag">${t}</span>`)
        .join("");

      // Videos
      const videos = (project.videos || []).map(normaliseMedia);
      if (videos.length) {
        document.getElementById("video-section").hidden = false;
        document.getElementById("project-videos").innerHTML = videos
          .map(
            (v) => `
            <figure class="video-frame">
              <div class="video-ratio"><video src="${src(v.src)}" controls preload="metadata"></video></div>
              <figcaption>${v.caption}</figcaption>
            </figure>`
          )
          .join("");
      }

      // Image gallery
      const images = (project.images || []).map(normaliseMedia);
      if (images.length) {
        document.getElementById("gallery-section").hidden = false;
        const gallery = document.getElementById("project-gallery");
        gallery.innerHTML = images
          .map(
            (img, i) => `
            <figure class="figure">
              <button class="figure-frame" data-index="${i}" aria-label="Enlarge figure ${i + 1}">
                <img src="${src(img.src)}" alt="${img.caption}" loading="lazy" />
              </button>
              <figcaption><span>Figure ${i + 1}.</span> ${img.caption}</figcaption>
            </figure>`
          )
          .join("");
        setupLightbox(images);
      }

      // Previous / next project
      const prev = projects[(index - 1 + projects.length) % projects.length];
      const next = projects[(index + 1) % projects.length];
      document.getElementById("project-pager").innerHTML = `
        <a href="project.html?id=${prev.id}" class="pager-link">
          <span class="pager-label"><i class="fas fa-arrow-left"></i> Previous</span>
          <span class="pager-title">${prev.title}</span>
        </a>
        <a href="project.html?id=${next.id}" class="pager-link next">
          <span class="pager-label">Next <i class="fas fa-arrow-right"></i></span>
          <span class="pager-title">${next.title}</span>
        </a>`;
    })
    .catch((err) => console.error("Error loading project details:", err));
}

// =====================================================
// Lightbox
// =====================================================
function setupLightbox(images) {
  const box = document.getElementById("lightbox");
  const img = document.getElementById("lb-image");
  const cap = document.getElementById("lb-caption");
  let current = 0;

  const show = (i) => {
    current = (i + images.length) % images.length;
    img.src = src(images[current].src);
    img.alt = images[current].caption;
    cap.textContent = `Figure ${current + 1} of ${images.length}. ${images[current].caption}`;
  };
  const open = (i) => {
    show(i);
    box.hidden = false;
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    box.hidden = true;
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".figure-frame").forEach((btn) =>
    btn.addEventListener("click", () => open(Number(btn.dataset.index)))
  );
  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", () => show(current - 1));
  box.querySelector(".lb-next").addEventListener("click", () => show(current + 1));
  box.addEventListener("click", (e) => {
    if (e.target === box) close();
  });
  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  const single = images.length < 2;
  box.querySelector(".lb-prev").hidden = single;
  box.querySelector(".lb-next").hidden = single;
}