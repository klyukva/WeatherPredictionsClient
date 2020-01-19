const admin = require('firebase-admin');
const ipID = 'eadd711e640e7f8376792e69427151d3';
// const ipID = '53cdc79cb971168c14ddbbbc01b68bc0';
const request = require('request');
const CronJob = require('cron').CronJob;

const serviceAccount =
  './weatherpredictions-36b69-firebase-adminsdk-akq1k-dae40ad218.json';
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://weatherpredictions-36b69.firebaseio.com`
});

// const markJob = new CronJob('00 1-59/2 * * * *', markPredictionsAsInProgress);
// const checkResultJob = new CronJob('00 */2 * * * *', checkPredictions);

// markJob.start();
// checkResultJob.start();

(async () => {
  await markPredictionsAsInProgress();
  await checkPredictions();
  process.exit(0);
})();

async function addPredictions(name, cityName, temperature) {
  const predictionsRef = admin
    .database()
    .ref('predictions')
    .child('request');
  await predictionsRef.push({
    name,
    cityName,
    temperature,
    status: 'created'
  });
  console.log(`${name} ${cityName} ${temperature}`);
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
    await request(
      {
        url: `https://api.openweathermap.org/data/2.5/weather?q=${predictObj.cityName}&appid=${ipID}`,
        json: true
      },
      async (error, response, body) => {
        console.log(JSON.stringify(body));
        const realTemp = (body.main.temp - 273.15).toFixed(2);
        console.log(`cityName: ${predictObj.cityName} tempReal: ${realTemp}`);
        const point = realTemp == predictObj.temperature ? 1 : 0;
        if (context[predictObj.name] !== undefined) {
          context[predictObj.name] += point;
        } else {
          context[predictObj.name] = point;
        }
        predictObj.realTemperature = +realTemp;
        predictObj.date = +new Date();
        await snapshot.ref.set(predictObj);
        console.log(JSON.stringify(predictObj));
        //
      }
    );
  };
  let context = {};
  const getContext = async key => key;
  await predictionsRef
    .orderByChild('status')
    .equalTo('inProgress')
    .on('child_added', checkCallback);
  await sleep(10000);
  console.log(JSON.stringify(await getContext(context)));
  await predictionsRef
    .orderByChild('status')
    .equalTo('inProgress')
    .off('child_added', checkCallback);

  for (let name of Object.keys(context)) {
    await resultsRef
      .orderByChild('name')
      .equalTo(name)
      .once('child_added', async snapshot => {
        let resultObj = snapshot.val();
        resultObj.point = (+resultObj.point + +context[name]).toFixed(2);
        await snapshot.ref.set(resultObj);
      });
  }
}
