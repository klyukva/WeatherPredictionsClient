import firebase from 'firebase';
import firebaseConfig from './configs/FirebaseConfig';

class Fire {
  constructor() {
    this.init();
    //this.observeAuth();
  }

  init = () => {
    firebase.initializeApp(firebaseConfig);
  };
  observeAuth = (callbackFn) =>
    firebase.auth().onAuthStateChanged( callbackFn || this.onAuthStateChanged );

  onAuthStateChanged = user => {
    if (!user) {
      try {
        firebase.auth().signInAnonymously();
      } catch ({ message }) {
        alert(message);
      }
    }
  };

  signup = async (email, password, name) => {
    await firebase
    .database()
    .ref('usernames')
    .orderByChild('name')
    .equalTo(name)
    .once('value', snapshot => {
      if (snapshot.exists()) throw  'name already exists'; })
    const user = await firebase.auth()
      .createUserWithEmailAndPassword(email, password);
    await firebase
    .database()
    .ref('usernames')
    .push({name, userId: user.user.uid})
    console.log(`created user ${email} ${password} ${name}`);
    return { user, name };
  }

  signIn = async (email, password) => {
    const user = await firebase.auth().signInWithEmailAndPassword(email, password);
    const name = await firebase.database().ref('usernames')
          .orderByChild('userId')
          .equalTo(user.uid)
          .once('value', snapshot => {
            if (!snapshot.exists()) throw 'User does not exist';
            return snapshot.name;
          })
    console.log(`logged in as ${email} ${password} ${name}`);
    return { user, name };
  }

  logout = async() => {
    await firebase.auth().signOut();
  }

  get refRequestTable() {
    return firebase
      .database()
      .ref('predictions')
      .child('request');
  }

  get refResultTable() {
    return firebase
      .database()
      .ref('predictions')
      .child('result');
  }

  off(name) {
    this.refRequestTable.off();
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  sendPrediction = prediction => {
    prediction.status = 'created';
    this.append(prediction);
    this.blankResult(prediction);
  };

  append = prediction => {
    this.refRequestTable.push(prediction);
  };

  blankResult = prediction => {
    this.refResultTable
      .orderByChild('name')
      .equalTo(prediction.name)
      .once('value', async snapshot => {
        if (!snapshot.exists()) {
          snapshot.ref.push({ name: prediction.name, point: 0.0 });
        }
      });
  };

  parse = snapshot => {
    const {
      cityName,
      temperature,
      status,
      realTemperature,
      date
    } = snapshot.val();
    if (realTemperature === undefined) {
      return {
        cityName,
        temperature,
        status,
        realTemperature: '',
        date: ''
      };
    }
    return {
      cityName,
      temperature,
      status,
      realTemperature,
      date: this.formatDate(new Date(date))
    };
  };

  formatDate = date => {
    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;

    return dd + '.' + mm + '.' + yy;
  };

  onSelf = (name, callback) =>
    this.refRequestTable
      .orderByChild('name')
      .equalTo(name)
      .limitToLast(10)
      .on('child_added', snapshot => callback(this.parse(snapshot)));

  onTop = callback =>
    this.refResultTable
      .orderByChild('point')
      .limitToLast(10)
      .on('child_added', snapshot => callback(snapshot.val()));
}

Fire.shared = new Fire();
export default Fire;
