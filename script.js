// This is the name used to save the settings in Local Storage.
var settingsKey = "portfolioSettings";
var settings = {
    theme: "light",
    visitorName: "",
    lastVisit: ""
};

// Get the saved settings from Local Storage.
function loadSettings() {
    try {
        var savedSettings = localStorage.getItem(settingsKey);

        if (savedSettings) {
            var savedObject = JSON.parse(savedSettings);

            if (savedObject && savedObject.theme === "dark") {
                settings.theme = "dark";
            }

            if (savedObject && typeof savedObject.visitorName === "string") {
                settings.visitorName = savedObject.visitorName;
            }

            if (savedObject && typeof savedObject.lastVisit === "string") {
                settings.lastVisit = savedObject.lastVisit;
            }
        }
    } catch (error) {
        console.warn("Saved settings could not be read. Default settings will be used.");
    }
}

// Save all the settings together.
function saveSettings() {
    try {
        localStorage.setItem(settingsKey, JSON.stringify(settings));
    } catch (error) {
        console.warn("Settings could not be saved in Local Storage.");
    }
}

loadSettings();

document.documentElement.dataset.theme = settings.theme;

var navToggle = document.querySelector(".nav-toggle");
var navMenu = document.querySelector(".nav-menu");
var themeToggle = document.querySelector(".theme-toggle");
var contactForm = document.getElementById("contact-form");

var nameInput = document.getElementById("name");
var emailInput = document.getElementById("email");
var messageInput = document.getElementById("message");
var formStatus = document.getElementById("form-status");
var welcomeHeading = document.getElementById("welcome-heading");
var lastVisitText = document.getElementById("last-visit");

function updateVisitorDetails() {
    if (settings.visitorName) {
        welcomeHeading.textContent = "Welcome back, " + settings.visitorName + "!";
    } else {
        welcomeHeading.textContent = "Welcome!";
    }

    if (settings.lastVisit) {
        var previousVisit = new Date(settings.lastVisit);
        lastVisitText.textContent = "Your previous visit was: " + previousVisit.toLocaleString();
    } else {
        lastVisitText.textContent = "This is your first visit.";
    }
}

// Show the old visit before saving the new visit time.
updateVisitorDetails();
settings.lastVisit = new Date().toISOString();
saveSettings();

function updateThemeButton() {
    themeToggle.setAttribute("aria-pressed", String(settings.theme === "dark"));
}

updateThemeButton();

navToggle.addEventListener("click", function () {
    if (navMenu.classList.contains("show")) {
        navMenu.classList.remove("show");
        navToggle.setAttribute("aria-expanded", "false");
    } else {
        navMenu.classList.add("show");
        navToggle.setAttribute("aria-expanded", "true");
    }
});

var navLinks = navMenu.querySelectorAll("a");
for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function () {
        navMenu.classList.remove("show");
        navToggle.setAttribute("aria-expanded", "false");
    });
}

themeToggle.addEventListener("click", function () {
    if (settings.theme === "dark") {
        settings.theme = "light";
    } else {
        settings.theme = "dark";
    }

    document.documentElement.dataset.theme = settings.theme;
    updateThemeButton();
    saveSettings();
});

// Make a card for every project.
function displayProjects(projects) {
    var projectList = document.getElementById("content-list");
    projectList.innerHTML = "";

    if (projects.length === 0) {
        projectList.textContent = "There are no projects to display yet.";
        return;
    }

    for (var i = 0; i < projects.length; i++) {
        var project = projects[i];
        var card = document.createElement("article");
        card.classList.add("project-card");

        var title = document.createElement("h3");
        title.textContent = project.title || "Untitled project";

        var description = document.createElement("p");
        description.textContent = project.description || "No description available.";

        card.appendChild(title);
        card.appendChild(description);
        projectList.appendChild(card);
    }
}

var myProjects = [
    {
        title: "My First Website",
        description: "This is a simple website that I made while learning HTML and CSS."
    },
    {
        title: "To-Do App",
        description: "A small project where I practiced JavaScript and list functions."
    },
    {
        title: "Portfolio Page",
        description: "This page shows my projects and contact information in a clean layout."
    }
];

displayProjects(myProjects);

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var message = messageInput.value.trim();
    var isValid = true;

    var nameError = document.getElementById("name-error");
    var emailError = document.getElementById("email-error");
    var messageError = document.getElementById("message-error");

    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";

    nameInput.setAttribute("aria-invalid", "false");
    emailInput.setAttribute("aria-invalid", "false");
    messageInput.setAttribute("aria-invalid", "false");

    if (name.length < 2) {
        nameError.textContent = "Please enter your name (at least 2 characters).";
        nameInput.setAttribute("aria-invalid", "true");
        isValid = false;
    }

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
        emailInput.setAttribute("aria-invalid", "true");
        isValid = false;
    }

    if (message.length < 10) {
        messageError.textContent = "Message must be at least 10 characters long.";
        messageInput.setAttribute("aria-invalid", "true");
        isValid = false;
    }

    if (isValid) {
        settings.visitorName = name;
        saveSettings();
        updateVisitorDetails();

        formStatus.textContent = "Your message passed validation. This demo does not send messages to a server.";
        contactForm.reset();
    } else {
        formStatus.textContent = "Please fix the errors and try again.";
    }
});
