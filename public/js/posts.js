// Select all posts
document.querySelectorAll(".post").forEach(function (post) {
  const commentList = post.querySelector(".comments");
  const input = post.querySelector(".comment-input");
  const addButton = post.querySelector(".add-comment");
  const commentCount = post.querySelector(".comment-count");
  const postUuid = post.querySelector(".like-button").dataset.id;

  // Update comment count
  function updateCommentCount() {
    const count = commentList.querySelectorAll(".comment-item").length;
    commentCount.innerHTML = `<i class="bi bi-chat-left-text"></i> Comments (${count})`;
  }

  // Render comments
  function renderComments(comments, username) {
    commentList.innerHTML = ""; // Clear existing comments
    comments.forEach((comment) => {
      const commentItem = document.createElement("div");
      commentItem.classList.add(
        "comment-item",
        "d-flex",
        "justify-content-between",
        "align-items-center",
        "mb-2"
      );
      commentItem.innerHTML = `
        <span><strong>${comment.username}</strong>: ${comment.text}</span>
        ${
          comment.username === username
            ? `<button class="btn btn-sm btn-outline-danger delete-comment" data-id="${comment._id}">
                <i class="bi bi-trash"></i>
              </button>`
            : ""
        }
      `;
      commentList.appendChild(commentItem);
    });
    updateCommentCount();
  }

  // Add comment
  addButton.addEventListener("click", async () => {
    const text = input.value.trim();

    if (!text) return;

    try {
      const response = await fetch(`/posts/${postUuid}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }), // Send comment text as JSON
      });

      if (response.ok) {
        const data = await response.json();
        renderComments(data.comments, data.username); // Use "username"
        input.value = ""; // Clear input
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  });

  // Delete comment
  commentList.addEventListener("click", async (e) => {
    if (e.target.closest(".delete-comment")) {
      const commentId = e.target.closest(".delete-comment").dataset.id;

      try {
        const response = await fetch(
          `/posts/${postUuid}/comment/${commentId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          const data = await response.json();
          renderComments(data.comments, data.username); // Use "username"
        }
      } catch (err) {
        console.error("Error deleting comment:", err);
      }
    }
  });

  // Add event listener to the like button
  let likeButton = post.querySelector(".like-button");
  let likesCountSpan = post.querySelector(".likes-count");

  likeButton.addEventListener("click", async () => {
    const postUuid = likeButton.dataset.id;
    const isLiked = likeButton.dataset.liked === "true";

    try {
      const response = await fetch(`/posts/${postUuid}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        likeButton.dataset.liked = (!isLiked).toString();
        likeButton.innerHTML = `<i class="bi ${
          !isLiked ? "bi-heart-fill" : "bi-heart"
        }"></i>`;

        if (likesCountSpan) {
          likesCountSpan.textContent = `${data.likesCount} likes`;
        }
      } else {
        console.error("Failed to toggle like");
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  });
});
