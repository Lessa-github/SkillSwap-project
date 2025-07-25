/* File: js/script.js */

document.addEventListener("DOMContentLoaded", function () {
  // --- API CONFIGURATION ---
  const JSONBIN_MASTER_KEY =
    "$2a$10$5gCX6FHsVo7mCGzdFKxsU.wfmAmg4X1uw/LovJOJCqVVCJgvz.W32";
  let binId = localStorage.getItem("skillswap_binId") || null;

  // --- DATA ---
  const defaultSkills = [
    {
      user: "Jane Smith",
      skill: "Beginner Guitar Lessons",
      category: "Creative",
      wants: "Help with gardening.",
    },
    {
      user: "Mike Johnson",
      skill: "WordPress Website Setup",
      category: "Technical",
      wants: "Photography lessons.",
    },
    {
      user: "Sarah Chen",
      skill: "Conversational Spanish",
      category: "Languages",
      wants: "Dog walking or pet sitting.",
    },
    {
      user: "David Lee",
      skill: "Home Organization",
      category: "Home & Garden",
      wants: "Help with resume writing.",
    },
    {
      user: "Emily White",
      skill: "Guided Meditation Sessions",
      category: "Wellness",
      wants: "Freshly baked goods.",
    },
    {
      user: "Tom Brown",
      skill: "Bicycle Repair",
      category: "Technical",
      wants: "Cooking lessons (Italian).",
    },
  ];

  // --- NEW FUNCTION FOR AUTOMATIC (SILENT) LOADING ---
  async function loadDataSilently(cloudBinId) {
    if (!cloudBinId) return; // Do nothing if there's no ID
    console.log("Found Cloud Bin ID. Attempting to load data automatically...");
    try {
      const response = await fetch(
        `https://api.jsonbin.io/v3/b/${cloudBinId}/latest`,
        {
          method: "GET",
          headers: { "X-Master-Key": JSONBIN_MASTER_KEY },
        }
      );
      if (!response.ok) {
        // If the bin is not found, clear the invalid ID and load default skills
        if (response.status === 404) {
          console.error(
            "Bin not found. Clearing invalid ID from localStorage."
          );
          localStorage.removeItem("skillswap_binId");
          renderSkills(getSkills());
        }
        throw new Error("API download failed.");
      }
      const result = await response.json();
      const skillsData = result.record;
      if (Array.isArray(skillsData)) {
        console.log("Data successfully loaded from the cloud.");
        saveSkills(skillsData);
        renderSkills(skillsData);
      } else {
        throw new Error("Invalid data format in the Bin.");
      }
    } catch (error) {
      console.error("Error during automatic data load:", error);
      // If something goes wrong, load local data as a fallback
      renderSkills(getSkills());
    }
  }

  // --- API FUNCTIONS ---

  async function saveDataToCloud(skillsData) {
    const url = binId
      ? `https://api.jsonbin.io/v3/b/${binId}`
      : "https://api.jsonbin.io/v3/b";
    const method = binId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": JSONBIN_MASTER_KEY,
          "X-Bin-Name": "SkillSwapData",
        },
        body: JSON.stringify(skillsData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API upload failed: ${errorData.message}`);
      }
      const result = await response.json();
      if (method === "POST" && result.metadata.id) {
        binId = result.metadata.id;
        localStorage.setItem("skillswap_binId", binId);
        console.log("New Bin created with ID:", binId);
        alert(
          "Your data has been saved to a new cloud Bin with ID: " +
            binId +
            ". Please save this ID!"
        );
      } else {
        console.log("Data successfully updated in the cloud in Bin:", binId);
        alert("Skills successfully saved to the cloud!");
      }
    } catch (error) {
      console.error("Error saving data to the cloud:", error);
      alert("An error occurred while trying to save your data to the cloud.");
    }
  }

  async function loadDataFromCloud() {
    const requestedBinId = prompt(
      "To load data from the cloud, please enter your Bin ID:"
    );
    if (!requestedBinId) {
      alert("No ID provided.");
      return;
    }
    // We can reuse the silent loading function here!
    await loadDataSilently(requestedBinId);
  }

  // --- LOCAL, FILE & MESSAGE FUNCTIONS ---
  function getSkills() {
    const skillsFromStorage = localStorage.getItem("skillswap_skills");
    return skillsFromStorage ? JSON.parse(skillsFromStorage) : defaultSkills;
  }
  function saveSkills(skillsArray) {
    localStorage.setItem("skillswap_skills", JSON.stringify(skillsArray));
  }
  function getMessages() {
    const messagesFromStorage = localStorage.getItem("skillswap_messages");
    return messagesFromStorage ? JSON.parse(messagesFromStorage) : [];
  }
  function saveMessages(messagesArray) {
    localStorage.setItem("skillswap_messages", JSON.stringify(messagesArray));
  }
  function sendProposal(skillName, toUser) {
    const messages = getMessages();
    messages.push({
      type: "sent",
      skill: skillName,
      text: `Hi! I'm interested in your '${skillName}' skill.`,
    });
    messages.push({
      type: "received",
      user: toUser,
      skill: skillName,
      text: `Hello! Thanks for your interest in '${skillName}'. Yes, let's talk!`,
    });
    saveMessages(messages);
    window.location.href = "messages.html";
  }

  function importSkillsFromJson(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      try {
        const newSkills = JSON.parse(e.target.result);
        if (Array.isArray(newSkills)) {
          saveSkills(newSkills);
          renderSkills(newSkills);
          alert("Skills imported successfully!");
        } else {
          alert("Error: The JSON file does not contain a valid data format.");
        }
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        alert("Could not read the file. Please ensure it is a valid JSON.");
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }

  function exportSkillsToFile() {
    const skillsData = getSkills();
    const jsonString = JSON.stringify(skillsData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "skillswap_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("Skills have been exported to skillswap_data.json!");
  }

  // --- UI RENDERING ---
  function renderSkills(skillsToRender) {
    const container = document.getElementById("skill-listings");
    if (!container) return;
    container.innerHTML = "";
    if (skillsToRender.length === 0) {
      container.innerHTML = "<p>No skills found.</p>";
      return;
    }
    skillsToRender.forEach((skill) => {
      const card = document.createElement("div");
      card.className = "skill-card";
      card.innerHTML = `
                <h3>${skill.skill}</h3>
                <p class="user-info">Offered by: ${skill.user}</p>
                <p>Category: ${skill.category}</p>
                <div class="wants">
                    <strong>In exchange for:</strong> ${skill.wants}
                </div>
                <br>
                <button class="btn proposal-btn" data-skill="${skill.skill}" data-user="${skill.user}">Send Proposal</button>
            `;
      container.appendChild(card);
    });
  }

  function renderMessages() {
    const container = document.getElementById("message-list");
    if (!container) return;
    const messages = getMessages();
    container.innerHTML = "";
    if (messages.length === 0) {
      container.innerHTML = `<section class="placeholder-box"><h3>No messages yet.</h3><p>Send a proposal to start a conversation.</p></section>`;
      return;
    }
    messages.forEach((msg) => {
      const messageDiv = document.createElement("div");
      messageDiv.className = `message ${msg.type}`;
      if (msg.type === "sent") {
        messageDiv.innerHTML = `<span class="skill-name">Proposal for: ${msg.skill}</span>${msg.text}`;
      } else {
        messageDiv.innerHTML = `<span class="user-name">From: ${msg.user}</span><span class="skill-name">Re: ${msg.skill}</span>${msg.text}`;
      }
      container.appendChild(messageDiv);
    });
  }

  function filterSkills() {
    const allSkills = getSkills();
    const searchText = document
      .getElementById("searchInput")
      .value.toLowerCase();
    const category = document.getElementById("categoryFilter").value;
    const filteredSkills = allSkills.filter((skill) => {
      const matchesSearch =
        skill.skill.toLowerCase().includes(searchText) ||
        skill.user.toLowerCase().includes(searchText);
      const matchesCategory = category === "all" || skill.category === category;
      return matchesSearch && matchesCategory;
    });
    renderSkills(filteredSkills);
  }

  // --- INITIALIZATION & EVENT LISTENERS ---

  // --- MODIFIED INITIALIZATION LOGIC ---
  // This part runs as soon as the page is ready
  async function initializeApp() {
    // We check for the binId right at the start
    const savedBinId = localStorage.getItem("skillswap_binId");
    if (savedBinId) {
      // If we have an ID, we try to load the data from the cloud automatically
      await loadDataSilently(savedBinId);
    } else {
      // Otherwise, we just load the skills from local storage or the default ones
      renderSkills(getSkills());
    }

    // The rest of the event listeners are set up after the initial data is loaded
    if (document.getElementById("skill-listings")) {
      document
        .getElementById("skill-listings")
        .addEventListener("click", function (e) {
          if (e.target && e.target.classList.contains("proposal-btn")) {
            sendProposal(e.target.dataset.skill, e.target.dataset.user);
          }
        });
      document
        .getElementById("searchInput")
        .addEventListener("keyup", filterSkills);
      document
        .getElementById("categoryFilter")
        .addEventListener("change", filterSkills);

      const loadCloudButton = document.getElementById("load-cloud-btn");
      const saveCloudButton = document.getElementById("save-cloud-btn");
      const importButton = document.getElementById("import-btn");
      const importFileInput = document.getElementById("import-file");
      const exportFileButton = document.getElementById("export-file-btn");

      if (loadCloudButton) {
        loadCloudButton.addEventListener("click", loadDataFromCloud);
      }
      if (saveCloudButton) {
        saveCloudButton.addEventListener("click", () =>
          saveDataToCloud(getSkills())
        );
      }
      if (importButton && importFileInput) {
        importButton.addEventListener("click", () => importFileInput.click());
        importFileInput.addEventListener("change", importSkillsFromJson);
      }
      if (exportFileButton) {
        exportFileButton.addEventListener("click", exportSkillsToFile);
      }
    }

    if (document.getElementById("message-list")) {
      renderMessages();
    }

    if (document.getElementById("offerForm")) {
      const form = document.getElementById("offerForm");
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const newSkill = {
          user: "Gabriel Lessa",
          skill: document.getElementById("skillTitle").value,
          category: document.getElementById("skillCategory").value,
          wants: document.getElementById("skillWants").value,
        };
        const currentSkills = getSkills();
        currentSkills.push(newSkill);
        saveSkills(currentSkills);
        saveDataToCloud(currentSkills);
        const messageDiv = document.getElementById("formMessage");
        form.classList.add("hidden");
        messageDiv.classList.remove("hidden");
        messageDiv.style.color = "green";
        messageDiv.innerHTML = `<h3>Thank you!</h3><p>Your skill "${newSkill.skill}" has been added and saved to the cloud.</p><br><a href="index.html" class="btn">View in Marketplace</a>`;
      });
    }
  }

  // Starts the entire application
  initializeApp();
});
