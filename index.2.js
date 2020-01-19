const admin = require('firebase-admin');
const ipID = 'eadd711e640e7f8376792e69427151d3';
const request = require('request');
const CronJob = require('cron').CronJob;

const serviceAccount =
  './weatherpredictions-36b69-firebase-adminsdk-akq1k-dae40ad218.json';
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://weatherpredictions-36b69.firebaseio.com`
});

// const markJob = new CronJob('* */2 * * * *', markPredictionsAsInProgress);
// const checkResultJob = new CronJob('* 1-59/2 * * * *', checkPredictions);

// markJob.start();
// checkResultJob.start();

(async () => {
  await markPredictionsAsInProgress();
  await checkPredictions();
  process.exit(0);
})();

async function addPredictions(name, city, temperature) {
  const predictionsRef = admin
    .database()
    .ref('predictions')
    .child('request');
  await predictionsRef.push({
    name,
    city,
    temperature,
    status: 'created'
  });
  console.log(`${name} ${city} ${temperature}`);
  await sleep(1000);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function markPredictionsAsInProgress() {
  const predictionsRef = admin
    .database()
    .ref('predictions')
    .child('request');

  const markCallback = async snapshot => {
    let predictObj = snapshot.val();
    predictObj.status = 'inProgress';
    await snapshot.ref.set(predictObj);
  };

  await predictionsRef
    .orderByChild('status')
    .equalTo('created')
    .on('child_added', markCallback);
  await sleep(10000);
  await predictionsRef
    .orderByChild('status')
    .equalTo('created')
    .off('child_added', markCallback);
}

async function checkPredictions() {
  const predictionsRef = admin
    .database()
    .ref('predictions')
    .child('request');
  const resultsRef = admin
    .database()
    .ref('predictions')
    .child('result');

  const checkCallback = async snapshot => {
    let predictObj = snapshot.val();
    predictObj.status = 'processed';
    await snapshot.ref.set(predictObj);
    await request(
      {
        url: `https://api.openweathermap.org/data/2.5/weather?q=${predictObj.city}&appid=${ipID}`,
        json: true
      },
      async (error, response, body) => {
        const realTemp = (body.main.temp - 273.15).toFixed(2);
        console.log(`city: ${predictObj.city} tempReal: ${realTemp}`);
        const point = realTemp == predictObj.temperature ? 1 : 0;
        if (context.has(predictObj.name)) {
        }
        context.set(predictObj.name, point);
        console.log(`context.get(predictObj.name)`);
        // await resultsRef
        //   .orderByChild('name')
        //   .equalTo(predictObj.name)
        //   .once('child_added', async snapshotInIn => {
        //     let resultObj = snapshotInIn.val();
        //     resultObj.point = (+resultObj.point + +point).toFixed(2);
        //     await snapshotInIn.ref.set(resultObj);
        //   });
      }
    );
  };
  let context = new Map();
  const getContext = async (map, key) => map.get(key);
  await predictionsRef
    .orderByChild('status')
    .equalTo('inProgress')
    .on('child_added', checkCallback, () => {}, context);
  await sleep(10000);
  // for (let i of context.keys()) {
  //   console.log(`key: ${i} value: ${getContext(context, i)}`);
  // }
  await predictionsRef
    .orderByChild('status')
    .equalTo('inProgress')
    .off('child_added', checkCallback);
}
