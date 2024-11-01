// Subscription Modal Control
document.addEventListener("DOMContentLoaded", () => {
    const subscriptionModal = document.getElementById("subscriptionModal");
    const subscriptionForm = document.getElementById("subscriptionForm");
    const subscriptionMessage = document.getElementById("subscriptionMessage");
    const mainContainer = document.querySelector(".container");

    // Show modal on load
    subscriptionModal.style.display = "flex";

    // Handle Subscription Form Submission
    subscriptionForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();

        if (name && email) {
            subscriptionMessage.textContent = "Thank you for subscribing!";
            setTimeout(() => {
                subscriptionModal.style.display = "none";
                mainContainer.style.display = "block";
            }, 1000);
        } else {
            subscriptionMessage.textContent = "Please enter valid information.";
        }
    });
});

// CV Upload and Display Functions
document.getElementById("cvForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const cvFile = document.getElementById("cvFile").files[0];
    const description = document.getElementById("description").value.trim();
    const reader = new FileReader();

    reader.onload = (e) => {
        const cvUrl = e.target.result;
        addCVToGrid(cvUrl, description);
    };

    if (cvFile) {
        reader.readAsDataURL(cvFile);
        document.getElementById("cvForm").reset();
    }
});

// Comments and Likes
const cvComments = {};
const cvLikes = {};

// Display full CV and comments
function displayCV(cvUrl) {
    const cvModal = document.getElementById("cvModal");
    const modalComments = document.getElementById("modalComments");
    
    cvModal.style.display = "flex";
    document.getElementById("fullCvIframe").src = cvUrl;
    modalComments.innerHTML = "";

    (cvComments[cvUrl] || []).forEach(({ text, timestamp }) => {
        const commentElement = document.createElement("div");
        commentElement.className = "comment";
        commentElement.innerText = `${text} - ${timestamp}`;
        modalComments.appendChild(commentElement);
    });

    document.getElementById("likeCount").innerText = `${cvLikes[cvUrl] || 0} Likes`;
}

// Close modal
function closeModal() {
    document.getElementById("cvModal").style.display = "none";
}

// Add new comment
function addModalComment() {
    const newCommentText = document.getElementById("newComment").value.trim();
    if (newCommentText) {
        const cvUrl = document.getElementById("fullCvIframe").src;

        if (!cvComments[cvUrl]) cvComments[cvUrl] = [];
        const timestamp = new Date().toLocaleString();
        cvComments[cvUrl].push({ text: newCommentText, timestamp });

        const commentElement = document.createElement("div");
        commentElement.className = "comment";
        commentElement.innerText = `${newCommentText} - ${timestamp}`;
        document.getElementById("modalComments").appendChild(commentElement);
        
        document.getElementById("newComment").value = ""; // Clear input

        // Scroll to the bottom of comments
        const commentsContainer = document.getElementById("modalComments");
        commentsContainer.scrollTop = commentsContainer.scrollHeight;
    }
}

// Like functionality
function likeCv() {
    const cvUrl = document.getElementById("fullCvIframe").src;
    cvLikes[cvUrl] = (cvLikes[cvUrl] || 0) + 1;
    document.getElementById("likeCount").innerText = `${cvLikes[cvUrl]} Likes`;
}

// Download CV
function downloadCv() {
    const cvUrl = document.getElementById("fullCvIframe").src;
    const a = document.createElement("a");
    a.href = cvUrl;
    a.download = "CV_Download.pdf";
    a.click();
}

// Add CV to grid
function addCVToGrid(cvUrl, description) {
    const cvList = document.getElementById("cvList");
    const cvItem = document.createElement("div");
    cvItem.className = "cv-item";

    const iframe = document.createElement("iframe");
    iframe.className = "cv-preview";
    iframe.src = cvUrl;
    cvItem.appendChild(iframe);

    const desc = document.createElement("p");
    desc.innerText = description;
    cvItem.appendChild(desc);

    const viewButton = document.createElement("button");
    viewButton.className = "view-button";
    viewButton.innerText = "View Full CV";
    viewButton.onclick = () => displayCV(cvUrl);
    cvItem.appendChild(viewButton);

    const commentCount = document.createElement("p");
    commentCount.innerText = `Comments: ${cvComments[cvUrl] ? cvComments[cvUrl].length : 0}`;
    cvItem.appendChild(commentCount);

    cvList.appendChild(cvItem);
}
