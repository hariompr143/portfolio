function loadComponent(path, selector) {
    const container = document.querySelector(selector);
    if (!container) return Promise.resolve();
    return fetch(path)
        .then(function(response) {
            return response.text();
        })
        .then(function(html) {
            container.innerHTML = html;
        })
        .catch(function() {
            container.innerHTML = "";
        });
}

function initDateTime() {
    var display = document.getElementById("current-datetime");
    if (!display) return;

    function update() {
        var now = new Date();
        var options = {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        };
        display.textContent = now.toLocaleString(undefined, options);
    }

    update();
    setInterval(update, 60000);
}

function getPageKey() {
    var key = document.body.getAttribute("data-page");
    if (key) return key;
    var path = window.location.pathname.split("/").pop() || "index.html";
    var map = {
        "index.html": "home",
        "education.html": "education",
        "skills.html": "skills",
        "projects.html": "projects",
        "about.html": "about",
        "contact.html": "contact"
    };
    return map[path] || "home";
}

function initActiveNav() {
    var pageKey = getPageKey();
    var links = document.querySelectorAll(".site-nav a[data-page]");
    links.forEach(function(link) {
        if (link.getAttribute("data-page") === pageKey) {
            link.classList.add("active");
        }
    });
}

function initBreadcrumb() {
    var container = document.getElementById("breadcrumb-trail");
    if (!container) return;

    var pageKey = getPageKey();
    var titles = {
        home: "Home",
        education: "Education",
        skills: "Skills",
        projects: "Projects",
        about: "About",
        contact: "Contact"
    };
    var currentTitle = titles[pageKey] || "Home";

    container.innerHTML = "";

    var homeItem = document.createElement("li");
    var homeLink = document.createElement("a");
    homeLink.href = "index.html";
    homeLink.textContent = "Home";
    homeItem.appendChild(homeLink);
    container.appendChild(homeItem);

    if (pageKey !== "home") {
        var currentItem = document.createElement("li");
        currentItem.className = "breadcrumb-current";
        currentItem.textContent = currentTitle;
        container.appendChild(currentItem);
    }
}

function initContactForm() {
    var form = document.getElementById("contact-form");
    var status = document.getElementById("form-status");
    if (!form || !status) return;

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        status.textContent = "Thank you for reaching out. This form is for showcase only.";
        form.reset();
    });
}

function initPreHeader() {
    var bar = document.getElementById("pre-header");
    var hideBtn = document.getElementById("pre-header-toggle");
    var showBtn = document.getElementById("pre-header-show");
    if (!bar || !hideBtn || !showBtn) return;

    function collapse() {
        bar.classList.add("pre-header-collapsed");
        hideBtn.setAttribute("aria-expanded", "false");
        showBtn.setAttribute("aria-expanded", "true");
    }

    function expand() {
        bar.classList.remove("pre-header-collapsed");
        hideBtn.setAttribute("aria-expanded", "true");
        showBtn.setAttribute("aria-expanded", "false");
    }

    hideBtn.addEventListener("click", collapse);
    showBtn.addEventListener("click", expand);

    setTimeout(collapse, 5000);
}

document.addEventListener("DOMContentLoaded", function() {
    var tasks = [];

    tasks.push(loadComponent("components/header.html", "#site-header"));
    tasks.push(loadComponent("components/breadcrumb.html", "#breadcrumb-container"));
    tasks.push(loadComponent("components/sidebar.html", "#site-sidebar"));
    tasks.push(loadComponent("components/footer.html", "#site-footer"));

    Promise.all(tasks).then(function() {
        initDateTime();
        initActiveNav();
        initBreadcrumb();
        initContactForm();
        initPreHeader();
    });
});