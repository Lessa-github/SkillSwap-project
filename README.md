# SkillSwap - A Skill Exchange Platform

SkillSwap is a front-end web application developed for the IST107 - Introduction to Internet Programming course. It simulates a community marketplace where users can offer their skills and trade them for other skills they want to learn, all without any financial transactions.

Live Demo: <https://lessa-github.github.io/SkillSwap-project/index.html>

Features
Dynamic Marketplace: Browse a list of all available skills offered by the community.

Live Search & Filter: Instantly filter the skills by title, user, or category as you type.

Offer a Skill: Users can add their own skills to the marketplace via a simple form, which are then automatically saved locally and to the cloud.

Cloud Data Sync & Management: The application now features robust data management capabilities, allowing users to persist their data beyond a single browser.

Automatic Cloud Loading: On startup, the app automatically checks for a saved Cloud Bin ID and loads the user's data, ensuring a seamless experience across sessions.

Save to Cloud: Manually push the current list of skills to a personal, secure cloud bin on JSONBin.io.

Load from Cloud: Manually pull data from the cloud by providing a specific Bin ID.

Import/Export Files: Easily import and export the skills list as a local .json file for backup or sharing.

Multi-Page Layout: A clean, multi-page structure with separate pages for the marketplace, user profile, and messages.

How Data Persistence Works
SkillSwap uses a hybrid model for data persistence to ensure both speed and portability:

Local Storage: The browser's localStorage is used for immediate data access and offline availability. This makes the app feel fast and responsive.

Cloud Storage (JSONBin.io): The application integrates with the JSONBin.io API to provide a free and simple cloud backup solution.

When a user saves to the cloud for the first time, a unique and private "Bin" is created, and the user is given a Bin ID.

This ID is then saved in localStorage, allowing the app to automatically sync with that specific cloud bin on future visits.

Technologies Used
This project was built using fundamental web technologies.

HTML5: For the structure and content of the web pages.

CSS3: For all custom styling, layout (Flexbox/Grid), and responsiveness.

JavaScript (ES6+): For all client-side logic, including:

DOM manipulation and event handling.

async/await with the fetch API for communicating with the JSONBin.io service.

Interaction with localStorage.

JSONBin.io: As a free, REST-based JSON storage solution for cloud persistence.

Setup and Installation
This project requires no complex installation or dependencies.

Clone the repository:

git clone <https://github.com/Lessa-github/SkillSwap-project.git>

Navigate to the directory:

cd SkillSwap-project

Run the application:
Simply open the index.html file in your favorite web browser.

This project was created by Gabriel Lessa as a final assignment for the IST107 course.
