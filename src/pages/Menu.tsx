import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonPage,
  IonRouterOutlet,
  IonSplitPane,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Icon } from "ionicons/dist/types/components/icon/icon";
import { homeOutline, rocketOutline } from "ionicons/icons";
import { Redirect, Route } from "react-router";
import About from "./About";
import Home from "./Home";

const Menu: React.FC = () => {
  const path = [
    { name: "Home", url: "/it35-lab/app/home", icon: homeOutline },
    { name: "About", url: "/it35-lab/app/about", icon: rocketOutline },
  ];

  return (
    <IonPage>
      <IonSplitPane contentId="main">
        <IonMenu contentId="main">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Menu</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonContent fullscreen>
            {path.map((item, index) => (
              <IonMenuToggle key={index}>
                <IonItem routerLink={item.url} routerDirection="forward">
                  <IonIcon icon={item.icon} slot="start"></IonIcon>
                  {item.name}
                </IonItem>
              </IonMenuToggle>
            ))}

            <IonButton
              routerLink="/it35-lab"
              routerDirection="back"
              expand="full"
            >
              <IonIcon icon="logOutline" slot="start"></IonIcon>
              Logout
            </IonButton>
          </IonContent>
        </IonMenu>
        <IonRouterOutlet id="main">
          <Route exact path="/it35-lab/app/home" component={Home} />
          <Route exact path="/it35-lab/app/about" component={About} />
          <Route exact path="/it35-lab/app">
            <Redirect to="/it35-lab/app/home" />
          </Route>
        </IonRouterOutlet>
      </IonSplitPane>
    </IonPage>
  );
};

export default Menu;