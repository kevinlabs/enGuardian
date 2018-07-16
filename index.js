var msTask = require("ms-task");

let delay = 1000;

let timerId = setTimeout(function request() {

  msTask.list('', (err, processString) => {

    if (processString) {
      // console.log('Showing list: ', processString);
      const threatName = findThreat(processString);

      if (threatName !== null) {
        msTask.kill(threatName, (err) => {
          if (err) {
            console.warn('Error from killing: ', err);
          }
        });
      }
    } else {
      console.log('Program not found');
    }

  });

  timerId = setTimeout(request, delay);

}, delay);

function findThreat(inputString) {
  let threatTarget = null;

  if (inputString.match(/firefox.exe/g)) {
    threatTarget = 'firefox.exe';
  }

  return threatTarget;
}