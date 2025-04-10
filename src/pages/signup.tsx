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
    IonAlert,
    IonModal,
  } from "@ionic/react";
  import { useIonToast } from "@ionic/react";
  import { useState } from "react";
  import bcrypt from "bcryptjs";
  import { Link } from "react-router-dom";
  import { supabase } from "../utils/supabaseClient";
  
  const signup: React.FC = () => {
    const [present] = useIonToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
  
    const showToast = (message: string, color: "primary" | "danger") => {
      present({
        color,
        message,
        duration: 1500,
        position: "top",
      });
    };
  
    const handleOpenVerificationModal = () => {
      if (!email.endsWith("@nbsc.edu.ph")) {
        setAlertMessage("Only @nbsc.edu.ph emails are allowed to register.");
        setShowAlert(true);
        return;
      }
      if (password !== confirmPassword) {
        setAlertMessage("Passwords do not match.");
        setShowAlert(true);
        return;
      }
      setShowVerificationModal(true);
    };
  
    const doRegister = async () => {
      setShowVerificationModal(false);
  
      try {
        // Sign up in Supabase authentication
        const { data, error } = await supabase.auth.signUp({ email, password });
  
        if (error) {
          throw new Error("Account creation failed: " + error.message);
        }
  
        // Hash password before storing in the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
  
        // Insert user data into 'users' table
        const { error: insertError } = await supabase.from("users").insert([
          {
            username,
            user_email: email,
            user_password: hashedPassword,
          },
        ]);
  
        if (insertError) {
          throw new Error("Failed to save user data: " + insertError.message);
        }
  
        setShowSuccessModal(true);
      } catch (err) {
        // Ensure err is treated as an Error instance
        if (err instanceof Error) {
          setAlertMessage(err.message);
        } else {
          setAlertMessage("An unknown error occurred.");
        }
        setShowAlert(true);
      }
    };
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Signup</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonCard style={{ height: "90%" }}>
            <IonCardHeader>
              <IonCardTitle>Create an Account</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonLabel position="stacked">Username</IonLabel>
                <IonInput
                  fill="outline"
                  type="text"
                  placeholder="Enter a unique username"
                  value={username}
                  onIonChange={(e) => setUsername(e.detail.value!)}
                />
                <div style={{ marginTop: 10 }}>
                  <IonLabel position="stacked">Email</IonLabel>
                  <IonInput
                    type="email"
                    placeholder="Enter a valid nbsc.edu.ph email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value!)}
                    fill="outline"
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
                  >
                    <IonInputPasswordToggle slot="end" />
                  </IonInput>
                </div>
                <div style={{ marginTop: 10 }}>
                  <IonLabel position="stacked">Confirm Password</IonLabel>
                  <IonInput
                    type="password"
                    value={confirmPassword}
                    onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                    placeholder="************"
                    fill="outline"
                  >
                    <IonInputPasswordToggle slot="end" />
                  </IonInput>
                </div>
                <IonButton
                  onClick={handleOpenVerificationModal}
                  expand="block"
                  style={{ marginTop: 20 }}
                >
                  Signup
                </IonButton>
                <div style={{ textAlign: "center", marginTop: "20vh" }}>
                  <span>Already have an account? </span>
                  <Link to="/it35-lab/">Login</Link>
                </div>
              </IonList>
            </IonCardContent>
          </IonCard>
  
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header="Error🔴"
            message={alertMessage}
            buttons={["OK"]}
          />
  
          <IonModal isOpen={showVerificationModal}>
            <IonContent>
              <div style={{ padding: 20, textAlign: "center" }}>
                <h2>Verify Your Information</h2>
                <p>Are you sure you want to proceed with the registration?</p>
                <IonButton onClick={doRegister} expand="block" style={{ marginTop: 20 }}>
                  Confirm
                </IonButton>
                <IonButton
                  onClick={() => setShowVerificationModal(false)}
                  expand="block"
                  color="light"
                  style={{ marginTop: 10 }}
                >
                  Cancel
                </IonButton>
              </div>
            </IonContent>
          </IonModal>
  
          <IonModal isOpen={showSuccessModal} onDidDismiss={() => setShowSuccessModal(false)}>
            <IonContent>
              <div style={{ padding: 20, textAlign: "center" }}>
                <h2>Registration Successful</h2>
                <p>You have successfully registered. Please check your email for verification.</p>
                <IonButton
                  onClick={() => setShowSuccessModal(false)}
                  expand="block"
                  style={{ marginTop: 20 }}
                  routerLink="/it35-lab/"
                >
                  Close
                </IonButton>
              </div>
            </IonContent>
          </IonModal>
        </IonContent>
      </IonPage>
    );
  };
  
  export default signup;