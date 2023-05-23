//Following consent, participants see 2 negative and 2 neutral items to ensure informed consent
//Twelve-item neuroticism scale
//Half the participants informed that negative images are from special effects galleries (show screenshots of webpages)
//Emotion-induced blindness, with 28 negative, 28 neutral, and 14 baseline trials (all lag 2)
//Memory test for distractors + 9 negative foils and 9 neutral foils
//Retrospectively rate the emotional items overall for valence and arousal
//Debriefed, with a re-statement of #3 (this will be the first time the other half of the participants see this)
//If participants hit a “terminate experiment” at any point during 1-6, they will be brought to #7.

import {
  trialsPerDistractCond,
  numDistractConditions,
  trialsPerBaselineType,
  finalDistractDuration,
  pracDurSteps,
  pracNperstep,
  numFoilPics,
  instructVersion
} from './modules/constants.js'

// import { imageFilenames, positiveImageFilePaths, neutralImageFilePaths, previewNegativeFileNames } from './modules/imageFilenames.js'
// import { welcome } from './modules/welcome.js'

// have to define preview images
import {
  fixationCross,
  imageFilenames,
  picStimuli,
  positiveImageFilePaths,
  neutralImageFilePaths,
  previewNegativeFileNames,
  previewPositiveFileNames
} from './modules/newImageFilenames.js'

// import {
//   previewPositiveFilenames,
//   positiveFileNames,
//   neutFilenames,
//   previewNegFilenames,
//   standardFilenames,
//   target0Filenames,
//   target1Filenames
// } from './modules/imageFilenames.js'

import { exptTimeline } from './modules/Timeline.js'
import { mWidth, smallFontSize } from './modules/constants.js'
import { shuffleArray } from './modules/arrayManipulations.js'

let lightnessVal = 100
document.body.style.backgroundColor = 'hsl(0,0%,' + lightnessVal + '%)'

Math.seedrandom()
const rSeed = Math.floor(Math.random() * 9999999)
Math.seedrandom(rSeed)

//*** declare some global variables

let today = new Date() //helpful to have in the data file
let date =
  today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
let time =
  today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
let dateTime = date + ' ' + time

let jatosVersion = false

let subject_id = jsPsych.randomization.randomID(5) // generate a random subject ID with 5 characters

let resultsID = 0

let winWidth = 800 //800

let actualLagTypes = [2, 4] //Actually only lag 2 [Steve: change this later]

let focusCheckInterval = 1000

let itemsPerStream = 16

let earliestDistractPosition = 2 // Arrays are zero-indexed, so these are the 3rd and 10th positions - BECAUSE WE ARE ONLY DOING LAG 2! Reduce last position if including longer lags
let latestDistractPosition = 9

// This next bit gets the results ID, which will be passed in the parameters in the URL
// It uses code from https://www.xul.fr/javascript/parameters.php
if (location.search.substring(1)) {
  //USEFUL_BIT
  let parameters = location.search.substring(1).split('&') //USEFUL_BIT
  let temp = parameters[0].split('=') //USEFUL_BIT
  if (temp[1]) {
    resultsID = unescape(temp[1])
  } //USEFUL_BIT
} //USEFUL_BIT

let numBlocksTotal = 2 //in this experiment we only want to show the 28 neg + 28 neutral pics once so we only have two blocks (normally you'd have more).
let quitButtonCount = 0 // in this variation of the task, if the pp pushes q a anytime it will skip to the debrief.
let quitPlease

let pracStdDur = []
let pracDisDur = []

let numPracticeTrials = pracDurSteps.length * pracNperstep
let numPracticeTrialsDigits = 6

let tempCounter = 0

for (let i = 0; i < pracDurSteps.length; i++) {
  for (let j = 0; j < pracNperstep; j++) {
    pracStdDur[tempCounter] = pracDurSteps[i]
    pracDisDur[tempCounter] = pracDurSteps[i]
    if (i == pracDurSteps.length - 1) {
      pracDisDur[tempCounter] = finalDistractDuration
    }
    tempCounter++
  }
}

// ******************* COLLATE FILENAMES FOR PRELOADING ******************
let numStandardImages = 251
let numTargetImages = 120 // 120 images, each in left and right configurations
let numNegImages = 37
//  28 will be used for the RSVP task and 9 will be used as foils in the memory task, an additional 2 will be shown at beginning with ethics,
let numNeutImages = 37 //  24 will be used for the RSVP task and 12 will be used as foils in the memory task,

let typeOfBlock = ''

// ******************* CREATE AND SET VARIOUS USEFUL VARIABLES ******************

let trialDistractType = 3 //  Initialize as 3 so that all practice trials recorded as baseline type.
let trialDistractPos
let trialLag
let trialStandardDuration
let trialDistractDuration

let fbStrCorrect = 'correct'
let fbStrIncorrect = 'incorrect'
let trialCorrect = 0 //RSVP correct
let stimArray = []

let distractID = 'none' // Initialize as 'none' so that it records no distractor during practice
let targetID = ''

let exptPhase = 0 // 0 = practice, 1 = ACTUAL; 2 = Memory
let blockNum = 0
let trialNum = 0
let trialNumInBlock = 0

let p_language = ''
let p_country = ''

// ******************* RSVP TASK TRIALS ******************

// ******************* SET TRIAL TYPES RSVP******************

const lagType = 2 //it's always 2 in this experiment

// first let's split our negative and neutral distractor pics into two different piles (24 to be used in RSVP and 12 to be used later in the memory task).
// We want to make sure we have just the right amount of pics in these arrays (then we can sample without replacement and know that they will all be seen).
// first we calculate how many trials we need of each condition for the distractorID selection (which should be 12 trials per distractor condition, per block for the two distractor conditions).
let numTrialsPerBlock =
  trialsPerDistractCond * numDistractConditions + trialsPerBaselineType // 12 x 2 = 24 + 6 in this experiment

//then we calculate how many pics we need to have in each of the two piles. We'll then copy them from the (shuffled) pic arrays.

let maxPicsPerRSVPcond = trialsPerDistractCond * numBlocksTotal //12 x 2 = 24 pics per pile

// shuffleArray(positiveImageFilePaths)
// shuffleArray(neutralImageFilePaths)
shuffleArray(positiveImageFilePaths)
shuffleArray(neutralImageFilePaths)

//console.log(negFilenames);

let neg = []
let neut = []
let neg_foil = []
let neut_foil = []

for (let i = 0; i < maxPicsPerRSVPcond; i++) {
  //copy the first 24 pics to the 0-23 slots of the relevant arrays
  neg[i] = positiveImageFilePaths[i]
  neut[i] = neutralImageFilePaths[i]
}

for (let i = 0; i < numFoilPics; i++) {
  //copy the next 12 pics to the foil arrays
  neg_foil[i] = positiveImageFilePaths[i + maxPicsPerRSVPcond]
  neut_foil[i] = neutralImageFilePaths[i + maxPicsPerRSVPcond]
}

//unfortunately if we want to have break blocks during memory task we are going to need to have counters for all of these stim arrays
let negcounter = 0
let neutcounter = 0
let neg_foilcounter = 0
let neut_foilcounter = 0

// now let's make an array of ones, twos and threes which is used to select the trialtype on each RSVP trial (shuffled before each block)
let trialSelector = []
for (let i = 0; i < trialsPerDistractCond; i++) {
  trialSelector[i] = 1
}
for (let i = trialsPerDistractCond; i < trialsPerDistractCond * 2; i++) {
  trialSelector[i] = 2
}
for (let i = trialsPerDistractCond * 2; i < numTrialsPerBlock; i++) {
  trialSelector[i] = 3
}

shuffleArray(trialSelector)

let last_rsvp_time = 0

//here we add 81 (q) as keycode in case they want to quit.
// let correctKeyCode

// ******************* INITIAL INSTRUCTIONS ******************

// console.log(memTrialSelector)

// shuffle all the arrays, including the pic arrays that we've already fiddled with and reset the counters where necessary
shuffleArray(neg)
shuffleArray(neut)

// ETHICS ETC

// let preExposurePreamble = {
//   type: 'html-keyboard-response',
//   stimulus:
//     'Thank you for agreeing to participate in our study. As mentioned in the informed consent document, this study will involve viewing unpleasant (in addition to neutral) images. <br><br> In order to 		give you an idea of what to expect, we will briefly show you four of these images now, with a pause in between each one. <br><br> If at any stage you decide that you do not in fact 		wish to participate, you can simply close this browser window. When you are ready to see the first image, press any key.'
// }

let okToContinue = {
  type: 'html-keyboard-response',
  stimulus:
    'Do you wish to continue? <br><br> Press any key to continue or simply close this browser window if you wish to withdraw from the study.'
}

let PreExposureIAPS = {
  type: 'image-keyboard-response',
  stimulus: jsPsych.timelineVariable('stimulus'),
  trial_duration: 1000,
  choices: jsPsych.NO_KEYS
}

// let IAPS_preview = [
//   { stimulus: previewNegativeFileNames[0] },
//   { stimulus: previewNegativeFileNames[1] },
//   { stimulus: previewNegativeFileNames[2] },
//   { stimulus: previewNegativeFileNames[3] }
// ]

// let imagePreExposureProcedure = {
//   timeline: [PreExposureIAPS, okToContinue],
//   timeline_variables: IAPS_preview
// }

// *******************INSTRUCTION-D******************
//Note: edited first INSTRUCT set to contain statement that stimuli are fake
let INSTRUCTD = {
  //[STEVE: DON'T NEED INSTRUCTD OR INSTRUCTND]
  type: 'html-button-response',
  stimulus:
    '<p style="text-align:center;"><b>IMPORTANT NOTE BEFORE YOU START THE REAL EXPERIMENT</b><br><br>' +
    '			<p style="text-align:left;line-height:120%;font-size:150; color:#FFA500; margin:' +
    mWidth +
    ';">' +
    '			ALL UNPLEASANT IMAGES ARE <b>FAKE</b> OR <b>STAGED</b>, AND WERE CREATED USING SPECIAL EFFECTS OR MAKEUP.<br><br><br></p>' +
    '			In this rapid target detection task, some pictures will appear that are of people, and some of these will be graphic or unpleasant.' +
    '			The rotated target will never contain a person, so please ignore these pictures.<br><br>' +
    '			<p style="text-align:center;"><b>PARTICIPANT CONFIRMATION</b></p>' +
    '			<p style="text-align:center;font-size:' +
    smallFontSize +
    ';margin:' +
    mWidth +
    ';">Clicking the button below indicates that you have read and understood the instruction.<br><br></p>',

  choices: [
    '<p style="font-size:130%;line-height:0%;"><b>I have read the instructions!</b></p>'
  ]
}


// record the subject Num and the counterbalance condition in the jsPsych data object (adds property to every trial)
jsPsych.data.addProperties({
  subNum: subject_id,
  DateTime: dateTime,
  toldFakeGroup1Yes0No: instructVersion
})

if (jatosVersion == false) {
  //start the experiment without jatos wrapping
  jsPsych.init({
    preload_images: imageFilenames,
    display_element: jspsychTargetMLP,
    experiment_width: 900,
    timeline: exptTimeline,
    on_finish: function () {
      jsPsych.data
        .get()
        .ignore(['internal_node_id'])
        .localSave(
          'csv',
          '.myData.csv'
        ) /* This is just to store it locally!! Don't do this over  the internet or it will store on their computer!*/
    }
  })
} else {
  jatos.onLoad(function () {
    /* start the experiment with jatos wrapping AND set up the Prolific talk back*/
    // ---------- subject info ----------
    let prolific_id = jatos.urlQueryParameters.PROLIFIC_PID //
    let completion_url =
      'https://app.prolific.co/submissions/complete?cc=CDUKJ5BN'
    let finish_msg =
      'All done! Please click <a href="' +
      completion_url +
      '">here</a> to be returned to Prolific and receive your completion code notification.'
    // record the subject Num in the jsPsych data (adds property to every trial)
    jsPsych.data.addProperties({
      prolificID: prolific_id
    })

    jsPsych.init({
      preload_images: imageFilenames,
      display_element: jspsychTargetMLP,
      timeline: exptTimeline,
      on_finish: function () {
        let results = jsPsych.data
          .get()
          .ignore(['internal_node_id', 'button_pressed'])
          .csv()
        jatos.submitResultData(results)
        document.write(
          '<div id="endscreen" class="endscreen" style="width:1000px"><div class="endscreen" style="text-align:center; border:0px solid; padding:10px; font-size:120%; 						width:800px; float:right"><p><br><br><br>' +
            finish_msg +
            '</p></div></div>'
        )
      }
    })
  })
}
