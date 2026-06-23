function setStatus(el, ok) {
  el.classList.remove("online", "offline");
  el.classList.add(ok ? "online" : "offline");
  el.dataset.status = ok ? "online" : "offline";

  // Also color the card itself
  const card = el.closest(".site-card");
  if (card) {
    card.classList.remove("online", "offline");
    card.classList.add(ok ? "online" : "offline");
  }
}

async function checkStatus(url, dotEl, labelEl) {
  labelEl.textContent = "Checking";

  async function attempt(u) {
    try {
      let res = await fetch(u, { method: "HEAD" });
      if (res.ok) return true;
      res = await fetch(u, { cache: "no-store" });
      return !!res.ok;
    } catch {
      return false;
    }
  }

  try {
    const ok = await attempt(url);
    if (ok) {
      setStatus(dotEl, true);
      labelEl.textContent = "Online";
      return;
    }

    const alt = url.endsWith("/") ? url.slice(0, -1) : url + "/";
    const okAlt = await attempt(alt);
    setStatus(dotEl, okAlt);
    labelEl.textContent = okAlt ? "Online" : "Offline";
  } catch {
    setStatus(dotEl, false);
    labelEl.textContent = "Offline";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("sites-list");

  fetch("catassets/directory/sites.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to load sites.json");
      }
      return res.json();
    })
    .then((sites) => {
      sites.forEach((site) => {
        const li = document.createElement("li");
        const url = `https://cats1337.github.io/${site.subdirectory}`;

        const card = document.createElement("a");
        card.href = url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.className = "site-card";

        const titleRow = document.createElement("div");
        titleRow.className = "site-title";

        const statusDot = document.createElement("span");
        statusDot.className = "status-dot";
        statusDot.title = "Checking status";

        const title = document.createElement("h2");
        title.textContent = site.subdirectory;

        titleRow.appendChild(statusDot);
        titleRow.appendChild(title);

        const desc = document.createElement("p");
        desc.className = "site-description";
        desc.textContent = site.description;

        const footer = document.createElement("div");
        footer.className = "card-footer";

        const urlEl = document.createElement("div");
        urlEl.className = "site-url";
        urlEl.textContent = url;

        const statusLabel = document.createElement("div");
        statusLabel.className = "status-label";

        const statusInnerDot = document.createElement("span");
        statusInnerDot.className = "status-dot";
        statusInnerDot.style.width = "8px";
        statusInnerDot.style.height = "8px";

        const statusText = document.createElement("span");
        statusText.className = "status-text";
        statusText.textContent = "Checking";

        statusLabel.appendChild(statusInnerDot);
        statusLabel.appendChild(statusText);

        footer.appendChild(urlEl);
        footer.appendChild(statusLabel);

        card.appendChild(titleRow);
        card.appendChild(desc);
        card.appendChild(footer);

        li.appendChild(card);
        list.appendChild(li);

        checkStatus(url, statusDot, statusText);

        const observer = new MutationObserver(() => {
          statusInnerDot.classList.remove("online", "offline");
          statusLabel.classList.remove("online", "offline");

          if (statusDot.classList.contains("online")) {
            statusInnerDot.classList.add("online");
            statusLabel.classList.add("online");
          } else if (statusDot.classList.contains("offline")) {
            statusInnerDot.classList.add("offline");
            statusLabel.classList.add("offline");
          }
        });

        observer.observe(statusDot, {
          attributes: true,
          attributeFilter: ["class"],
        });
      });
    })
    .catch((err) => {
      console.error(err);
      list.textContent = "Failed to load site list.";
    });
});
