// Select all posts
document.querySelectorAll(".post").forEach(function (post) {
  // Get comment list and input within this post
  let commentList = post.querySelector(".comments");
  let input = post.querySelector(".comment-input");
  let addButton = post.querySelector(".add-comment");
  let commentCount = post.querySelector(".comment-count");

  // Update comment count function
  function updateCommentCount() {
    const count = commentList.querySelectorAll("p").length;
    commentCount.innerText = `Comments (${count})`;
  }

  // Add event listener to Add Comment button
  addButton.addEventListener("click", function () {
    let commentText = input.value.trim();

    if (commentText) {
      let comment = document.createElement("p");
      comment.innerText = commentText;

      let deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete";
      deleteBtn.style.marginLeft = "10px";

      deleteBtn.addEventListener("click", function () {
        comment.remove();
        updateCommentCount(); // Update count when deleted
      });

      comment.appendChild(deleteBtn);

      commentList.appendChild(comment);

      // Update count when added
      updateCommentCount();

      // Clear input
      input.value = "";
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
        likeButton.textContent = !isLiked ? "❤️" : "🤍";

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
