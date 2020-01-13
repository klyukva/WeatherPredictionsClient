import firebase from 'firebase';
import firebaseConfig from './configs/FirebaseConfig';

class Fire {
  constructor() {
    this.init();
    this.observeAuth();
  }

  init = () => {
    firebase.initializeApp(firebaseConfig);
  };

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      try {
        firebase.auth().signInAnonymously();
      } catch ({ message }) {
        alert(message);
      }
    }
  };

  getRefRequestTable(name) {
    return firebase
      .database()
      .ref('predictions')
      .child('request')
      .child(name);
  }

  off(name) {
    this.getRefRequestTable(name).off();
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  sendPrediction = prediction => {
    prediction.timestamp = this.timestamp;
    this.append(prediction);
  };

  append = prediction => {
    const name = prediction.name;
    delete prediction.name;
    this.getRefRequestTable(name).push(prediction);
  };
}

Fire.shared = new Fire();
export default Fire;
