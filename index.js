var msTask = require("ms-task");
var EventLogger = require('node-windows').EventLogger;
var nrc = require('node-run-cmd');
var log = new EventLogger('protector');

let mainAppIsLoaded = false;
let delay = 1000;

let timerId = setTimeout(function request() {

  msTask.list('', (err, processString) => {

    if (processString) {
      const MainStatus = checkMainStatus(processString);

      if (mainAppIsLoaded) {
        const threatName = findThreat(processString);

        if (!MainStatus) {
          log.warn('Security threat detected. [Main gone]');
          console.warn('Security threat detected. [Main gone]');
          nrc.run('shutdown /s /f /t 0');
        }

        if (threatName !== null) {
          msTask.kill(threatName, (err) => {
            if (err) {
              console.warn('Error from killing: ', err);
              log.error('failed to kill the task that was given.');
            }
          });
        }

      } else {
        if (MainStatus) {
          mainAppIsLoaded = true;
        }
      }
    } else {
      console.log('No process list was generated');
      log.error('No process list was generated');
    }

    if(err) {
      console.warn('Error from generating task list: ', err);
      log.error('Error from generating task list: ', err);
    }
  });

  timerId = setTimeout(request, delay);

}, delay);

function findThreat(inputString) {
  let threatTarget = null;

  if (inputString.match(/regedit.exe/g)) {
    threatTarget = 'regedit.exe';
    log.info('Regedit kill has been executed.');
    console.info('Regedit kill has been executed.');
  }

  return threatTarget;
}

function checkMainStatus(inputString) {
  if (inputString.match(/_targetguard.exe/g) && inputString.match(/targetclient.exe/g)) {
    return true;
  } else {
    return false;
  }
}
