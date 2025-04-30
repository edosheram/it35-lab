import { useState, useEffect } from "react";
import {
  IonApp,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonTextarea,
  IonLabel,
  IonModal,
  IonFooter,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonAlert,
  IonText,
  IonAvatar,
  IonCol,
  IonGrid,
  IonRow,
  IonIcon,
  IonPopover,
} from "@ionic/react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabaseClient";
import { ellipsisVertical } from "ionicons/icons";

interface Post {
  post_id: string;
  user_id: number;
  username: string;
  avatar_url: string;
  post_content: string;
  post_created_at: string;
  post_updated_at: string;
}

const FeedContainer = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState("");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [popoverState, setPopoverState] = useState<{
    open: boolean;
    event: Event | null;
    postId: string | null;
  }>({ open: false, event: null, postId: null });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.email?.endsWith("@nbsc.edu.ph")) {
        setUser(authData.user);
        const { data: userData, error } = await supabase
          .from("users")
          .select("user_id, username, user_avatar_url")
          .eq("user_email", authData.user.email)
          .single();
        if (!error && userData) {
          setUser({ ...authData.user, id: userData.user_id });
          setUsername(userData.username);
        }
      }
    };
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("post_created_at", { ascending: false });
      if (!error) setPosts(data as Post[]);
    };
    fetchUser();
    fetchPosts();
  }, []);

  const createPost = async () => {
    if (!postContent || !user || !username) return;

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("user_avatar_url")
      .eq("user_id", user.id)
      .single();

    if (userError) return;

    const avatarUrl =
      userData?.user_avatar_url || "https://ionicframework.com/docs/img/demos/avatar.svg";

    const { data, error } = await supabase
      .from("posts")
      .insert([{ post_content: postContent, user_id: user.id, username, avatar_url: avatarUrl }])
      .select("*");

    if (!error && data) {
      setPosts([data[0] as Post, ...posts]);
    }

    setPostContent("");
  };

  const deletePost = async (post_id: string) => {
    await supabase.from("posts").delete().match({ post_id });
    setPosts(posts.filter((post) => post.post_id !== post_id));
  };

  const startEditingPost = (post: Post) => {
    setEditingPost(post);
    setPostContent(post.post_content);
    setIsModalOpen(true);
  };

  const savePost = async () => {
    if (!postContent || !editingPost) return;
    const { data, error } = await supabase
      .from("posts")
      .update({ post_content: postContent })
      .match({ post_id: editingPost.post_id })
      .select("*");
    if (!error && data) {
      const updatedPost = data[0] as Post;
      setPosts(posts.map((post) => (post.post_id === updatedPost.post_id ? updatedPost : post)));
      setPostContent("");
      setEditingPost(null);
      setIsModalOpen(false);
      setIsAlertOpen(true);
    }
  };

  return (
  
        <><IonContent style={{ backgroundColor: "#e9ebee" }}>
      {user ? (
        <div style={{ padding: "1rem" }}>
          <IonCard style={{ borderRadius: "10px", padding: "10px" }}>
            <IonRow className="ion-align-items-center">
              <IonCol size="auto">
                <IonAvatar>
                  <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="User" />
                </IonAvatar>
              </IonCol>
              <IonCol>
                <IonTextarea
                  value={postContent}
                  onIonChange={(e) => setPostContent(e.detail.value!)}
                  placeholder="What's on your mind?"
                  autoGrow
                  style={{ background: "#f0f2f5", borderRadius: "10px", padding: "10px" }} />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-right">
                <IonButton onClick={createPost} color="primary">
                  Post
                </IonButton>
              </IonCol>
            </IonRow>
          </IonCard>

          {posts.map((post) => (
            <IonCard
              key={post.post_id}
              style={{ marginTop: "1rem", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", background: "#fff" }}
            >
              <IonCardHeader style={{ paddingBottom: 0 }}>
                <IonRow className="ion-align-items-center">
                  <IonCol size="auto">
                    <IonAvatar>
                      <img src={post.avatar_url} alt={post.username} />
                    </IonAvatar>
                  </IonCol>
                  <IonCol>
                    <div style={{ fontWeight: 600 }}>{post.username}</div>
                    <div style={{ fontSize: "0.8rem", color: "gray" }}>
                      {new Date(post.post_created_at).toLocaleString()}
                    </div>
                  </IonCol>
                  <IonCol size="auto">
                    <IonButton
                      fill="clear"
                      onClick={(e) => setPopoverState({
                        open: true,
                        event: e.nativeEvent,
                        postId: post.post_id,
                      })}
                    >
                      <IonIcon icon={ellipsisVertical} />
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonCardHeader>

              <IonCardContent style={{ paddingTop: "10px", fontSize: "1rem" }}>
                <IonText color="dark">{post.post_content}</IonText>
              </IonCardContent>

              <IonPopover
                isOpen={popoverState.open && popoverState.postId === post.post_id}
                event={popoverState.event}
                onDidDismiss={() => setPopoverState({ open: false, event: null, postId: null })}
              >
                <IonButton
                  fill="clear"
                  onClick={() => {
                    startEditingPost(post);
                    setPopoverState({ open: false, event: null, postId: null });
                  } }
                >
                  Edit
                </IonButton>
                <IonButton
                  fill="clear"
                  color="danger"
                  onClick={() => {
                    deletePost(post.post_id);
                    setPopoverState({ open: false, event: null, postId: null });
                  } }
                >
                  Delete
                </IonButton>
              </IonPopover>
            </IonCard>
          ))}
        </div>
      ) : (
        <IonLabel>Loading...</IonLabel>
      )}
    </IonContent><IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Post</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonTextarea
            value={postContent}
            onIonChange={(e) => setPostContent(e.detail.value!)}
            placeholder="Edit your post..."
            autoGrow />
        </IonContent>
        <IonFooter>
          <IonButton onClick={savePost}>Save</IonButton>
          <IonButton onClick={() => setIsModalOpen(false)}>Cancel</IonButton>
        </IonFooter>
      </IonModal><IonAlert
        isOpen={isAlertOpen}
        onDidDismiss={() => setIsAlertOpen(false)}
        header="Success"
        message="Post updated successfully!"
        buttons={["OK"]} /></>
     
  );
};

export default FeedContainer;
