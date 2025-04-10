import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonInputPasswordToggle,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useIonToast } from "@ionic/react";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

const Login: React.FC = () => {
  const [present] = useIonToast();
  const navigation = useIonRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const errorToast = (position: "top" | "middle" | "bottom") => {
    present({
      color: "danger",
      message: "Error, Invalid password or email!",
      duration: 1500,
      position: position,
    });
  };
  const successToast = (position: "top" | "middle" | "bottom") => {
    present({
      color: "primary",
      message: "Login successful! Redirecting....",
      duration: 1500,
      position: position,
    });
  };

  const doLogin = async () => {
    let { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      errorToast("top");
      setError(true);
      return;
    }
    setTimeout(() => {
      navigation.push("/it35-lab/app", "forward", "replace");
    }, 300);
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="">
        <IonCard style={{ height: "90%" }}>
          <IonCardHeader>
            <IonCardTitle></IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <div>
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)}
                  fill="outline"
                  errorText="Invalid email"
                />
              </div>
              <div style={{ marginTop: 10 }}>
                <IonLabel position="stacked">Password</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)}
                  placeholder="************"
                  fill="outline"
                  style={{ marginTop: 0 }}
                >
                  <IonInputPasswordToggle slot="end" />
                </IonInput>
              </div>
              <IonButton onClick={() => doLogin()} expand="block" style={{ marginTop: 20 }}>
                Login
              </IonButton>
              <div style={{ textAlign: "center", marginTop: "80%" }}>
                <span>Don't have an account yet? </span>
              </div>
              <IonButton routerLink="/it35-lab/signup" expand="block" style={{ marginTop: 10 }}>
                Signup
              </IonButton>
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Login;