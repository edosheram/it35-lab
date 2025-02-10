import React from 'react';
import { 
  IonButtons, 
  IonContent, 
  IonHeader, 
  IonMenuButton, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonMenu, 
  IonList, 
  IonItem 
} from '@ionic/react';

const Menu: React.FC = () => {
  return (
    <IonPage>
    
      <IonMenu side="start" menuId="first" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem button>
              <span>Item 1</span>
            </IonItem>
            <IonItem button>
              <span>Item 2</span>
            </IonItem>
            <IonItem button>
              <span>Item 3</span>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

    
      <IonContent id="main-content" fullscreen>
        <IonHeader>
          <IonToolbar>
            
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Page</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonContent>
          
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Menu;
