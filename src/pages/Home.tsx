import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonText } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer'; // Custom container for your content
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>

      
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Welcome</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="home-content">
          <ExploreContainer />
         
          <IonText color="primary">
            <h2>Welcome to the Home Page!</h2>
          </IonText>
          <IonButton expand="block" color="primary" onClick={() => alert('Button clicked!')}>
            Click Me
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
