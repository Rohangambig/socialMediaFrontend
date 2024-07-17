import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpoint = "http://localhost:3001/posts";
        if (isProfile) {
          endpoint = `http://localhost:3001/posts/${userId}/posts`;
        }
        const response = await fetch(endpoint, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        dispatch(setPosts(data));
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Handle error state or alert user
      }
    };

    fetchData();
  }, [dispatch, token, userId, isProfile]);

  // Check if posts is undefined or null, render loading or error message
  if (!posts) {
    return <p>Loading...</p>;
  }

  // Check if posts is an array before mapping over it
  if (!Array.isArray(posts)) {
    console.error("Posts is not an array:", posts);
    return <p>Error fetching posts. Please try again later.</p>;
  }

  return (
    <div>
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </div>
  );
};

export default PostsWidget;
