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
  itiDuration,
  feedbackDuration,
  finalStandardDuration,
  finalDistractDuration,
  pracDurSteps,
  pracNperstep,
  numMemBlocks,
  numMemPics,
  numFoilPics,
  fixationDuration,
  firstPracTrialDur,
  memConditionsTotal,
  initialPauseDuration,
} from './modules/pracDurSteps.js'

// import { imageFilenames, positiveImageFilePaths, neutralImageFilePaths, previewNegativeFileNames } from './modules/imageFilenames.js'
import { welcome, welcome1, welcome2 } from './modules/welcome.js'
import { demographics } from './modules/demographics.js'

import { debrief } from './modules/debrief.js'

// have to define preview images
import { fixationCross, imageFilenames, picStimuli, positiveImageFilePaths, neutralImageFilePaths, previewNegativeFileNames, previewPositiveFileNames } from './modules/newImageFilenames.js'

import { previewPositiveFilenames, positiveFileNames, neutFilenames, previewNegFilenames, standardFilenames, target0Filenames, target1Filenames } from "./modules/imageFilenames.js"

import { dass21 } from './modules/dass21.js'

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
let instructVersion = Math.round(Math.random()) // 0 = no instructions and 1 = given fake/staged instructions
console.log(instructVersion)

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

for (let i = 0; i< pracDurSteps.length; i++) {
  for (let j = 0; j < pracNperstep; j++) {
    pracStdDur[tempCounter] = pracDurSteps[i]
    pracDisDur[tempCounter] = pracDurSteps[i]
    if (i== pracDurSteps.length - 1) {
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

// fixation

let runFixation = {
  type: 'html-keyboard-response',
  stimulus: '<span style="font-size:60px;">+</span>',
  trial_duration: fixationDuration,
  response_ends_trial: false
}

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

for (let i= 0; i< maxPicsPerRSVPcond; i++) {
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
for (let i= 0; i< trialsPerDistractCond; i++) {
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

let runRSVPtrial = {
  type: 'rsvp-sequence',
  trial_target_type: Math.floor(Math.random() * 2),
  stimuli: function () {
    shuffleArray(standardFilenames)

    let stimArray = []
    for (let i = 0; i < itemsPerStream + 2; i++) {
      // Extra 2 elements in array hold distractor and target stimuli; these will be moved into position later
      stimArray[i] = standardFilenames[i]
    }

    trialDistractType = trialSelector[trialNumInBlock] // so 1 = negative, 2 = neutral, 3 = baseline.

    if (trialDistractType == 1) {
      distractID = neg[negcounter]
      negcounter++
    } else if (trialDistractType == 2) {
      distractID = neut[neutcounter]
      neutcounter++
    } else if (trialDistractType == 3) {
      distractID = standardFilenames[itemsPerStream]
    }

    stimArray[itemsPerStream] = distractID

    window.trialTargetType = Math.floor(Math.random() * 2)
    if (window.trialTargetType == 0) {
      targetID = sampleArray(target0Filenames)
    } else {
      targetID = sampleArray(target1Filenames)
    }

    if (this.trial_target_type == 0) {
      targetID = sampleArray(target0Filenames)
    } else {
      targetID = sampleArray(target1Filenames)
    }

    stimArray[itemsPerStream + 1] = targetID
    return stimArray
  },

  standardDuration: finalStandardDuration,
  distractorDuration: finalDistractDuration,
  distractorPosition: function () {
    return (trialDistractPos =
      earliestDistractPosition +
      Math.floor(
        Math.random() * (latestDistractPosition + 1 - earliestDistractPosition)
      ))
  },
  //lag_type: function () {return trialLag = actualLagTypes[lagType[trialSelector[trialNumInBlock]]]},
  lag_type: 2,
  post_trial_gap: 0,
  on_finish: function (trial_data) {
    last_rsvp_time = trial_data.rsvp_time
  }
}

//here we add 81 (q) as keycode in case they want to quit.
let correctKeyCode

let runRSVPresponse = {
  type: 'categorize-image',
  stimulus: 'images/response_prompt.png',
  choices: [37, 39, 81],

  key_answer: function () {
    correctKeyCode = 37
    if (window.trialTargetType == 1) {
      correctKeyCode = 39
    }
    return correctKeyCode
  },

  correct_text: function () {
    return "<p style='font-size:140%;'>correct</p>"
  },

  incorrect_text: function () {
    return "<p style='font-size:140%;'>incorrect</p>"
  },

  show_stim_with_feedback: false,
  feedback_duration: feedbackDuration,
  post_trial_gap: itiDuration,

  on_finish: function (trial_data) {
    window.RSVPresp = trial_data.key_press
    if (trial_data.key_press == 81) {
      quitButtonCount = 1
      quitPlease = true
      console.log(quitButtonCount)
    } else if (trial_data.key_press == 39 && window.trialTargetType == 1) {
      trialCorrect = 1
    } else if (trial_data.key_press == 37 && window.trialTargetType == 0) {
      trialCorrect = 1
    } else {
      trialCorrect = 0
    }

    jsPsych.data.addDataToLastTrial({
      exptPhase: exptPhase,
      blockNum: blockNum + 1,
      blockType: typeOfBlock,
      trialNum: trialNumInBlock + 1,
      trialDistractType: trialDistractType,
      trialDistractPos: trialDistractPos,
      trialLag: trialLag,
      RSVPtrialResp: window.RSVPresp,
      RSVPTrialCorrect: trialCorrect,
      trialTargetType: window.trialTargetType,
      distractID: distractID,
      targetID: targetID,
      rsvp_time: last_rsvp_time
    })
  }
}

let runRSVPtrialPractice = {
  type: 'rsvp-sequence',
  stimuli: function () {
    shuffleArray(standardFilenames)
    stimArray = []
    for (let i = 0; i < itemsPerStream + 2; i++) {
      // Extra 2 elements in array hold distractor and target stimuli; these will be moved into position later
      stimArray[i] = standardFilenames[i]
    }
    let trialTargetType = Math.floor(Math.random() * 2)
    if (trialTargetType == 0) {
      targetID = sampleArray(target0Filenames)
    } else {
      targetID = sampleArray(target1Filenames)
    }
    stimArray[itemsPerStream + 1] = targetID
    return stimArray
  },
  standardDuration: function () {
    return pracStdDur[trialNumInBlock]
  },
  distractorDuration: function () {
    return pracDisDur[trialNumInBlock]
  },
  distractorPosition: function () {
    return (trialDistractPos =
      earliestDistractPosition +
      Math.floor(
        Math.random() * (latestDistractPosition + 1 - earliestDistractPosition)
      ))
  },
  lag_type: 2
}

let runRSVPresponsePractice = {
  type: 'categorize-image',
  stimulus: 'images/response_prompt_noQuit.png',
  choices: [37, 39],

  key_answer: function () {
    correctKeyCode = 37
    if (window.trialTargetType == 1) {
      correctKeyCode = 39
    }
    return correctKeyCode
  },

  correct_text: function () {
    return "<p style='font-size:140%;'>correct</p>"
  },

  incorrect_text: function () {
    return "<p style='font-size:140%;'>incorrect</p>"
  },

  show_stim_with_feedback: false,
  feedback_duration: feedbackDuration,
  post_trial_gap: itiDuration,

  on_finish: function (trial_data) {
    window.RSVPresp = trial_data.key_press
    if (trial_data.key_press == 39 && window.trialTargetType == 1) {
      trialCorrect = 1
    } else if (trial_data.key_press == 37 && window.trialTargetType == 0) {
      trialCorrect = 1
    } else {
      trialCorrect = 0
    }

    jsPsych.data.addDataToLastTrial({
      exptPhase: exptPhase,
      blockNum: blockNum + 1,
      blockType: typeOfBlock,
      trialNum: trialNumInBlock + 1,
      trialDistractType: trialDistractType,
      trialDistractPos: trialDistractPos,
      trialLag: trialLag,
      RSVPtrialResp: window.RSVPresp,
      RSVPTrialCorrect: trialCorrect,
      trialTargetType: window.trialTargetType,
      distractID: distractID,
      targetID: targetID,
      rsvp_time: last_rsvp_time
    })
  }
}

// ******************* INITIAL INSTRUCTIONS ******************

let tempInstrStr =
  '<p style="text-align:left">Thanks for agreeing to take part in this study!<br><br>In this study, you will be asked to complete a <b>target detection</b> task.<br><br>Each trial will start with a cross appearing - this tells you that the trial is about to begin. You will then see a stream of pictures flash up rapidly in the center of the screen, one after another.<br><br></p>'

let target_example =
  '<p style="text-align:center"><img src="images/target_example_white.jpg" /><br></p>'
let initial_instructions = {
  type: 'instructions',
  pages: [
    tempInstrStr,
    '<p style="text-align:left">Most of the pictures will be shown upright. However, one of the pictures in the stream will be rotated, either to the left or to the right. This rotated picture is the <b>TARGET</b>.<br><br>Some examples are shown below....<br><br></p>' +
      target_example,
    '<p style="text-align:left">Your task is to identify whether the target in each stream of pictures is rotated to the left or the right.<br><br>You should wait until the stream of pictures finishes, and then press the <b>LEFT OR RIGHT ARROW KEY</b> (on the keyboard) to identify the direction in which you thought the target was rotated.<br><br></p>' +
      target_example
  ],
  show_clickable_nav: true,
  post_trial_gap: 0
}

let initial_Q0_answers
let initial_Q1_answers
let initial_Q2_answers

initial_Q0_answers = [
  ' A picture of a tree.',
  ' A picture that has been rotated to the left or right.',
  ' A picture that is upside-down.'
]
initial_Q1_answers = [
  ' I should press the left arrow key if the target picture was rotated to the left, and the right arrow key if it was rotated to the right.',
  ' I should press one of the number keys to indicate how much I liked the target picture.'
]
initial_Q2_answers = [
  ' As soon as I see the target picture.',
  ' At the end of the stream of pictures.'
]

let initial_correctstring =
  '{"Q0":"' +
  initial_Q0_answers[1] +
  '","Q1":"' +
  initial_Q1_answers[0] +
  '","Q2":"' +
  initial_Q2_answers[1] +
  '"}'

let initial_repeatInstructions = true

let initial_instruction_check = {
  type: 'survey-multi-choice',
  preamble: [
    "<p style='text-align:center;'><b>Check your knowledge before you continue!</b></p>"
  ],
  questions: [
    {
      prompt:
        'On each trial of this task, the stream of pictures will contain one target. This target will be:',
      options: initial_Q0_answers,
      required: true
    },
    {
      prompt: 'How should you respond to the target picture on each trial?',
      options: initial_Q1_answers,
      required: true
    },
    {
      prompt: 'When should you make your response?',
      options: initial_Q2_answers,
      required: true
    }
  ],
  post_trial_gap: 0,
  on_finish: function (data) {
    if (data.responses == initial_correctstring) {
      initial_repeatInstructions = false
    }

    jsPsych.data.addDataToLastTrial({
      instruct_qs: 1
    })
  }
}

let initial_check_failed_display = {
  type: 'html-button-response',
  stimulus:
    '<p><b>Unfortunately, at least one of your answers was incorrect.</b></p>',
  choices: ['<p>Click here to read the instructions again</p>'],
  button_html:
    '<button class="fancyButtonRed" style="vertical-align:middle"><span>%choice%</span></button><br><br>',
  post_trial_gap: 100
}

let initial_check_failed_conditional = {
  timeline: [initial_check_failed_display],
  conditional_function: function () {
    return initial_repeatInstructions // If this is true, it will execute timeline (show failure screen)
  }
}

let loop_initial_instructions = {
  timeline: [
    initial_instructions,
    initial_instruction_check,
    initial_check_failed_conditional
  ],
  loop_function: function () {
    return initial_repeatInstructions // If initial_repeatInstructions remains true, this will keep looping; if it becomes false, it will move on.
  }
}

// ******************* FIRST PRACTICE TRIAL ******************

let ready_to_start_practice = {
  type: 'html-keyboard-response',
  stimulus:
    "<p><b>Well done - all your answers were correct!</b></p><p>You'll now have a chance to practice the task. We'll go through the first trial very slowly.</p><p style='font-size:90%;'><br>Press any key to continue</p>"
}

let firstRSVPtrialPractice = {
  type: 'rsvp-sequence',
  stimuli: function () {
    shuffleArray(standardFilenames)
    stimArray = []
    for (let i = 0; i < 5; i++) {
      // All elements hold standard stimuli
      stimArray[i] = standardFilenames[i]
    }
    return stimArray
  },
  standardDuration: firstPracTrialDur,
  distractorDuration: firstPracTrialDur,
  distractorPosition: 0,
  lag_type: 2
}

let firstRSVPtrialTarget = {
  type: 'html-keyboard-response',
  stimulus:
    '<p style="color:black">This is the TARGET picture. On this trial, it is rotated to the right.<br>So at the end of the stream of pictures, you should press the <b>right arrow key</b>.<br><br>Press any key to continue with the stream.</p><p><img src="images/targets/target0_1.jpg"></img></p><p>This is the TARGET picture. On this trial, it is rotated to the right.<br>So at the end of the stream of pictures, you should press the <b>right arrow key</b>.<br><br>Press any key to continue with the stream.</p>', // The white bit at the start of this line is just so the image appears in the centre of the screen
  post_trial_gap: 100
}

let firstPracCorrect = false
let firstRSVPtrialresponse = {
  type: 'html-keyboard-response',
  stimulus:
    '<p style="color:black">You should now make your response to the target that you saw earlier.<br><br>On this trial, the target was rotated to the right so you should<br>press the right arrow key on the keyboard now.</p><p><img src="images/response_prompt_noQuit.png"></img></p><p>You should now make your response to the target that you saw earlier.<br><br>On this trial, the target was rotated to the right so you should<br>press the right arrow key now.</p>', // The white bit at the start of this line is just so the image appears in the centre of the screen
  choices: [37, 39],
  on_finish: function (trial_data) {
    if (trial_data.key_press == 39) {
      firstPracCorrect = true
    }

    jsPsych.data.addDataToLastTrial({
      firstPracCorrect: firstPracCorrect
    })
  }
}
const style = 'color:#FF0000'

let firstRSVPtrialFB = {
  type: 'html-keyboard-response',
  stimulus: function () {
    if (firstPracCorrect) {
      return "<p style='font-size:120%;'>correct</p>"
    } else {
      return "<p style='color:#FF0000;font-size:150%;'><b>Incorrect</b></p><p style='color:#black;font-size:120%;'>The target on this trial was this picture:<br><br><img src='images/targets/target0_1.jpg'></img><br><br>This target was rotated to the right, so you should have<br>pressed the right arrow key.</p>"
    }
  },
  trial_duration: function () {
    if (firstPracCorrect) {
      return 1500
    } else {
      return 8000
    }
  },
  response_ends_trial: false
}

let first_practice_trial_loop = {
  timeline: [
    runFixation,
    firstRSVPtrialPractice,
    firstRSVPtrialTarget,
    firstRSVPtrialPractice,
    firstRSVPtrialresponse,
    firstRSVPtrialFB
  ],
  loop_function: function () {
    return false // This means it will 'loop' only once
  }
}

let instr_before_prac_loop = {
  type: 'html-keyboard-response',
  stimulus: function () {
    typeOfBlock = 'Prac'
    return "<p><b>Now it's time to practice the task. These practice trials will start off slowly, but the streams will gradually get faster - up to the speed of the main experiment.</b></p><p style='font-size:90%;'><br>Press any key to continue</p>"
  }
}

let loop_practice_trials = {
  timeline: [runFixation, runRSVPtrialPractice, runRSVPresponsePractice],

  loop_function: function () {
    trialNumInBlock++
    if (trialNumInBlock < numPracticeTrials) {
      return true
    } else {
      exptPhase = 1
      trialNumInBlock = 0
      return false
    }
  }
}

let nextBlock = {
  type: 'html-keyboard-response',
  stimulus: function () {
    typeOfBlock = 'EIB'
    let tempTextHTML = ' '
    let reminderText = ' '
    if (instructVersion == 0)
      reminderText =
        "<p>Don't forget that the rotated target will never be of a person so you can ignore those images.</p>" //[STEVE: DON'T NEED INSTRUCTVERSION B/C EVERYONE GETS SAME INSTRUCTIONS]
    if (instructVersion == 1)
      reminderText =
        "<p>Don't forget that the graphic images you see are staged or fake.</p>"
    if (blockNum > 0) {
      tempTextHTML +=
        "<p>You're doing well!</p><p>" +
        blockNum +
        ' of ' +
        numBlocksTotal +
        ' blocks completed</p>' //[STEVE: HERE IS WHERE YOU SAY THAT IMAGES ARE FAKE (FOR ALICE)]
      tempTextHTML += reminderText
    } //[DON'T NEED THIS, DELETE]
    else if (blockNum == 0) {
      tempTextHTML +=
        "<p>You're now ready to start the main experiment. Good luck! </p>"
    }
    tempTextHTML += '<br><p>Press any key when you are ready to begin</p>'

    return tempTextHTML
  },
  post_trial_gap: initialPauseDuration
}

let nextBlockMemory = {
  type: 'html-keyboard-response',
  stimulus:
    "<p>You're finished with the rotation task. <br><br> Now you will complete a slightly different task. <br><br> On each trial you will be shown an image for 3 seconds. <br><br> Please indicate within 3 seconds whether or not you have seen the image in the previous task by pressing the LEFT arrow key (<) if you have seen the image before or the RIGHT arrow key (>) if you have not seen the image before.<br><br>Press any key to begin</p>",
  on_finish: function () {
    negcounter = 0 //reset to 0 so that we can show them again in the memory.
    neutcounter = 0
  }
}

let if_node_nextBlockMemory = {
  timeline: [nextBlockMemory],
  conditional_function: function () {
    if (quitButtonCount == 1) {
      //here I check if they have pushed q or not.
      return false
    }
  }
}

//#####Memory Task#########
let memBlockNum = 0
let numTrialsPerMemBlock = (numMemPics * 2 + numFoilPics * 2) / numMemBlocks
let memTrialSelector = []

//need to have 28 of condition 1 (neg), 9 of condition 2 (neg foil), 28 of condition 3 (neutral) and 9 of condition 4 (neutral foils).
// now let's make an array of ones up to fours. This is clunky but nested for-loops suck in javascript
for (let i = 0; i < numMemPics; i++) {
  memTrialSelector[i] = 1
} //up to 28
for (let i = numMemPics; i < numMemPics + numFoilPics; i++) {
  memTrialSelector[i] = 2
} // up to 37
for (let i = numMemPics + numFoilPics; i < numMemPics * 2 + numFoilPics; i++) {
  memTrialSelector[i] = 3
} // up to 65
for (
  let i = numMemPics * 2 + numFoilPics;
  i < numMemPics * 2 + numFoilPics * 2;
  i++
) {
  memTrialSelector[i] = 4
} //up to 74

console.log(memTrialSelector)

// shuffle all the arrays, including the pic arrays that we've already fiddled with and reset the counters where necessary
shuffleArray(memTrialSelector)
shuffleArray(neg)
shuffleArray(neut)

let memTrialCounter = 0 // this counter does not get reset

let PressSpacebartrial = {
  type: 'html-keyboard-response',
  choices: [' '],
  stimulus:
    '<p> When you are ready: push spacebar to view the next image.</p><p> It will only show for one second</p>'
}

let memoryTaskTrials = {
  type: 'categorize-image',
  prompt:
    '<br><br> Did you see this picture within the rapidly flashed images in the first part of the experiment? <br><br> < Yes                             No >' +
    ' ' +
    ' ' +
    ' ' +
    ' ' +
    ' ' +
    ' ' +
    ' ' +
    ' ' +
    '<p style="color:#FFA500">                                                            Or press Q to quit this task </p>',
  stimulus_duration: 1000,
  stimulus: function () {
    memTrialType = memTrialSelector[memTrialCounter]

    if (memTrialType == 1) {
      memPic = neg[negcounter] //1 = neg old
      console.log(memPic)
      negcounter++
    } else if (memTrialType == 2) {
      memPic = neg_foil[neg_foilcounter] //2 = neg_foils
      console.log(memPic)
      neg_foilcounter++
    } else if (memTrialType == 3) {
      memPic = neut[neutcounter] //3 = neut old,,
      console.log(memPic)
      neutcounter++
    } else if (memTrialType == 4) {
      memPic = neut_foil[neut_foilcounter] //8 = neut foil,
      console.log(memPic)
      neut_foilcounter++
    }

    return memPic
  },
  show_stim_with_feedback: false,
  feedback_duration: 0, //we don't want feedback here
  choices: [37, 39, 81],
  key_answer: function () {
    correctKeyCode = 37 //yes
    if (memTrialType == 2 || memTrialType == 4) {
      correctKeyCode = 39
    } //if it's a new one then they should answer no.
    return correctKeyCode
  },
  on_finish: function (trial_data) {
    if (trial_data.key_press == 81) {
      quitButtonCount = 1
    } else if (trial_data.key_press == correctKeyCode) {
      trialCorrect = 1
    } else {
      trialCorrect = 0
    }
    memPic = trial_data.stimulus
    exptPhase = 2
    typeOfBlock = 'memoryTask'

    jsPsych.data.addDataToLastTrial({
      exptPhase: exptPhase,
      blockNum: memBlockNum + 1,
      blockType: typeOfBlock,
      trialNum: trialNumInBlock + 1,
      trialCond: memTrialType,
      distractID: memPic,
      correctResp: correctKeyCode,
      memTrialCorrect: trialCorrect
    })
  }
}

let memBlockBreak = {
  type: 'html-keyboard-response',
  stimulus: function () {
    let tempTextHTML =
      "<p>You're doing well!</p><p>" +
      (memBlockNum + 1) +
      ' of ' +
      numMemBlocks +
      ' blocks completed</p>'
    tempTextHTML += '<br><p>Press any key when you are ready to continue</p>'

    return tempTextHTML
  },

  post_trial_gap: initialPauseDuration
}

// ETHICS ETC

// ******************* WELCOME AND DEMOGRAPHICS ******************
let smallFontSize = '90%'
let mWidth = '16px 80px'

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

let INSTRUCTND = {
  type: 'html-button-response',
  stimulus:
    '<p style="text-align:center;"><b>IMPORTANT NOTE BEFORE YOU START THE REAL EXPERIMENT</b><br><br>' +
    '			<p style="text-align:left;line-height:120%;font-size:' +
    smallFontSize +
    ';margin:' +
    mWidth +
    ';">' +
    '			In this rapid target detection task, some pictures will appear that are of people, and some of these will be graphic or unpleasant.' +
    '			The rotated target will never contain a person, so please ignore these pictures.<br><br>' +
    '			<p style="text-align:center;"><b>PARTICIPANT CONFIRMATION</b></p>' +
    '			<p style="text-align:center;font-size:' +
    smallFontSize +
    ';margin:' +
    mWidth +
    ';">Clicking the button below indicates that you have read and understood the instruction.<br><br></p>',

  choices: [
    '<p style="font-size:130%;line-height:0%;"><b>I have read the instruction!</b></p>'
  ]
}

//check they have read the instructions [STEVE: DON'T NEED THIS SECTION ON CHECKING WHETHER THEY HAVE READ INSTRUCTIONS, BUT MAYBE KEEP IF YOU WANT TO TEST THAT THEY UNDERSTAND]

let distInstruct_Q0_answers

distInstruct_Q0_answers = [
  'Fake or staged',
  ' Real images taken from real events'
]

let distInstruct_correctstring = '{"Q0":"' + distInstruct_Q0_answers[0] + '"}'

let distInstruct_repeatInstructions = true

let distInstruct_instruction_check = {
  type: 'survey-multi-choice',
  preamble: [
    "<p style='text-align:center;'><b>Check your knowledge before you continue!</b></p>"
  ],
  questions: [
    {
      prompt:
        'To double check that you are paying attention please answer the following. All the unpleasant images you will see in this task are: (select the correct option below)',
      options: distInstruct_Q0_answers,
      required: true
    }
  ],
  post_trial_gap: 0,
  on_finish: function (data) {
    if (data.responses == distInstruct_correctstring) {
      distInstruct_repeatInstructions = false
    }

    jsPsych.data.addDataToLastTrial({
      instruct_qs: 1
    })
  }
}

let distInstruct_check_failed_display = {
  type: 'html-button-response',
  stimulus: '<p><b>Unfortunately your answer was incorrect.</b></p>',
  choices: ['<p>Click here to read the instructions again</p>'],
  button_html:
    '<button class="fancyButtonRed" style="vertical-align:middle"><span>%choice%</span></button><br><br>',
  post_trial_gap: 100
}

let distInstruct_check_failed_conditional = {
  timeline: [distInstruct_check_failed_display],
  conditional_function: function () {
    return distInstruct_repeatInstructions // If this is true, it will execute timeline (show failure screen)
  }
}
let loop_distInstruct_instructions = {
  timeline: [
    INSTRUCTD,
    distInstruct_instruction_check,
    distInstruct_check_failed_conditional
  ],
  loop_function: function () {
    return distInstruct_repeatInstructions // If distInstruct_repeatInstructions remains true, this will keep looping; if it becomes false, it will move on.
  }
}

//**************Picture graphic/arousing questions**********************

let MCHECKAoptions = ['1.', '2', '3', '4', '5', '6', '7', '8', '9.']

// please edit the preamble and the prompts. The name should just be the num of the question.
let picResponse = {
  type: 'survey-multi-choice',
  preamble:
    '<p style=";margin:10px;">During this experiment, you saw several images that were graphic and unpleasant. Please read each statement below and select the answer that best represents your OVERALL FEELING to these images. Your answers will remain anonymous and confidential so please be honest.</p>',
  questions: [
    {
      prompt:
        '1. Using the scale below where 1 is PLEASANT, 5 is NEUTRAL and 9 is UNPLEASANT - how unpleasant would you rate your emotional reaction to these images?',
      name: 'picsPleasant',
      options: MCHECKAoptions,
      required: true,
      horizontal: true
    },
    {
      prompt:
        '2. Using the scale of 1-9 below where 1 is CALM and 9 is AROUSED - how energised or aroused was your emotional reaction to these images?',
      name: 'picsArousing',
      options: MCHECKAoptions,
      required: true,
      horizontal: true
    }
  ]
}

//*************Did they follow instructions**********************
//To change to percentage of images that participants thought were fake

let percentageOptions = [
  '0%',
  '10%',
  '20%',
  '30%',
  '40%',
  '50%',
  '60%',
  '70%',
  '80%',
  '90%',
  '100%'
]

// please edit the preamble and the prompts. The name should just be the num of the question.
let percentageReal = {
  type: 'survey-multi-choice',
  preamble:
    'You are nearly finished with the experiment. We just have a few questions to ask  so please use the mouse to respod.<br><br> In this experiment you were shown some unpleasant and graphic images.',
  questions: [
    {
      prompt:
        'Roughly what percentage of the unpleasant and graphic images did you assume to be REAL (photos taken from real events)?',
      name: 'percentageReal',
      options: percentageOptions,
      required: true
    }
  ]
}

let if_node_percentReal = {
  timeline: [percentageReal],
  conditional_function: function () {
    if (quitButtonCount == 1) {
      //here I check if they have pushed q or not.
      return false
    }
  }
}

let NEURinstruction = {
  type: 'html-keyboard-response',
  stimulus:
    'We will start the experiment by asking you to complete a short questionnaire.<br><br>' +
    'Your answers will remain anonymous and confidential so please be honest.<br><br><br>' +
    ' Please press space bar to begin',
  choices: [' '],
  response_ends_trial: true
}

//**************NEUROTICISM Q***********************

//The same response key will be given for all questions right? So just carefully copy the possible responses below between the " "
// let NEURoptions = ['Yes', 'No', 'Rather Not Say']

// please edit the preamble and the prompts. The name should just be the num of the question.
// let NEUR = {
//   type: 'survey-multi-choice',
//   preamble:
//     'Please read each statement and decide how well it describes you by selecting the appropriate answer. There are no right or wrong answers. Your answers will remain anonymous and confidential so please be honest.',
//   questions: [
//     {
//       prompt: '1. Does your mood often go up and down?',
//       name: 'NEUR1',
//       options: NEURoptions,
//       required: true
//     },
//     {
//       prompt: '2. Do you ever feel ‘just miserable’ for no reason?',
//       name: 'NEUR2',
//       options: NEURoptions,
//       required: true
//     },
//     {
//       prompt: '3. Are you an irritable person?',
//       name: 'NEUR3',
//       options: NEURoptions,
//       required: true
//     },
//     {
//       prompt: '4. Are your feelings easily hurt?',
//       name: 'NEUR4',
//       options: NEURoptions,
//       required: true
//     },
//     {
//       prompt: '5. Do you often feel fed up?',
//       name: 'NEUR5',
//       options: NEURoptions,
//       required: true
//     },
//     {
//       prompt: '6. Would you call yourself a nervous person?',
//       name: 'NEUR6',
//       options: NEURoptions,
//       required: true
//     },
//     {
//       prompt: '7. Are you a worrier?',
//       name: 'NEUR7',
//       options: NEURoptions,
//       required: true
//     },
//     {
//       prompt: '8. Would you call yourself tense or highly strung?',
//       name: 'NEUR8',
//       options: NEURoptions,
//       required: true
//     },
//     {
//       prompt: '9. Do you worry too long after embarrassing experiences?',
//       name: 'NEUR9',
//       options: NEURoptions,
//       required: true
//     },
//     {
//       prompt: '10. Do you suffer from nerves?',
//       name: 'NEUR10',
//       options: NEURoptions,
//       required: true
//     },
//     {
//       prompt: '11. Do you often feel lonely?',
//       name: 'NEUR11',
//       options: NEURoptions,
//       required: true
//     },
//     {
//       prompt: '12. Are you often troubled about feelings of guilt?',
//       name: 'NEUR12',
//       options: NEURoptions,
//       required: true
//     }
//   ]
// }


// ******************* MAIN LOOPS ******************

let loop_RSVPTrials = {
  timeline: [runFixation, runRSVPtrial, runRSVPresponse],

  loop_function: function () {
    trialNumInBlock++
    if (trialNumInBlock < numTrialsPerBlock && quitButtonCount < 1) {
      return true
    } else {
      return false
    }
  }
}

let loop_RSVPBlocks = {
  timeline: [nextBlock, loop_RSVPTrials],
  loop_function: function () {
    blockNum++
    trialNumInBlock = 0
    if (blockNum < numBlocksTotal && quitButtonCount < 1) {
      return true
    } else {
      return false
    }
  }
}

let loop_memTrials = {
  timeline: [PressSpacebartrial, runFixation, memoryTaskTrials],
  loop_function: function () {
    trialNumInBlock++
    memTrialCounter++
    if (trialNumInBlock < numTrialsPerMemBlock && quitButtonCount < 1) {
      return true
    } else {
      return false
    }
  }
}

let checkBlockBreak = {
  // No block break after final memory block
  timeline: [memBlockBreak],
  conditional_function: function () {
    if (memBlockNum == 3 || quitButtonCount == 1) {
      return false
    } else {
      return true
    }
  }
}

let loop_memBlocks = {
  timeline: [loop_memTrials, checkBlockBreak],
  loop_function: function () {
    memBlockNum++
    trialNumInBlock = 0
    if (memBlockNum < numMemBlocks && quitButtonCount < 1) {
      return true
    } else {
      return false
    }
  }
}
let if_node_memBlock = {
  timeline: [loop_memBlocks],
  conditional_function: function () {
    if (quitButtonCount == 1) {
      //here I check if they have pushed q or not.
      return false
    }
  }
}
let if_node_picQDemo = {
  timeline: [picResponse, demographics],
  conditional_function: function () {
    if (quitButtonCount == 1) {
      //here I check if they have pushed q or not.
      return false
    }
  }
}

// ******************* FADES ******************

let fadeToBlack
let fadeToWhite
let fadeStep = 2

let fadeDuration = (17 * 100) / fadeStep // Assume 60 Hz refresh (so 17ms frame update)

let fadeToBlackTrial = {
  type: 'html-keyboard-response',
  stimulus: '',
  trial_duration: 1,
  response_ends_trial: false,
  post_trial_gap: fadeDuration + initialPauseDuration,
  on_finish: function () {
    lightnessVal = 100
    requestAnimationFrame(fadeToBlackFn)
  }
}

let fadeToWhiteTrial = {
  type: 'html-keyboard-response',
  stimulus: '',
  trial_duration: 1,
  response_ends_trial: false,
  post_trial_gap: fadeDuration,
  on_finish: function () {
    lightnessVal = 0
    requestAnimationFrame(fadeToWhiteFn)
  }
}

let usingComputer = true
;(function (a) {
  if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
      a
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      a.substr(0, 4)
    )
  )
    usingComputer = false
})(navigator.userAgent || navigator.vendor || window.opera)

let using_mobile_device = {
  type: 'instructions',
  pages: [
    '<p style="text-align:left;font-size:150%">You seem to be using a mobile device so you will not currently be able to complete this survey.<br><br>To complete this survey, please visit this website using a computer with a keyboard and mouse/trackpad.</p>'
  ]
}

// ******************* SET TIMELINE AND RUN EXPT ******************

let exptTimeline = []

if (usingComputer) {
  exptTimeline.push(welcome1)
  exptTimeline.push(welcome2)

  // exptTimeline.push({
  //   type: 'fullscreen',
  //   fullscreen_mode: true
  // })
  // exptTimeline.push(preExposurePreamble)
  // exptTimeline.push(imagePreExposureProcedure)
  exptTimeline.push(NEURinstruction)
  exptTimeline.push(dass21)
  // exptTimeline.push(NEUR) // STEVE: IF YOU WANT QUESTIONNAIRE AFTER EXP, MOVE IN TIMELINE
  exptTimeline.push(loop_initial_instructions)
  exptTimeline.push(ready_to_start_practice)
  exptTimeline.push(fadeToBlackTrial)
  exptTimeline.push(first_practice_trial_loop)
  exptTimeline.push(fadeToWhiteTrial)
  exptTimeline.push(instr_before_prac_loop)
  exptTimeline.push(fadeToBlackTrial)
  exptTimeline.push(loop_practice_trials)

  if (instructVersion == 0) {
    exptTimeline.push(INSTRUCTND)
  }
  if (instructVersion == 1) {
    exptTimeline.push(loop_distInstruct_instructions)
  } //[STEVE: DON'T NEED TWO SEPARATE INSTRUCTVERSIONS HERE]
  exptTimeline.push(loop_RSVPBlocks)
  exptTimeline.push(if_node_nextBlockMemory)
  exptTimeline.push(if_node_memBlock)
  if (instructVersion == 1) {
    exptTimeline.push(if_node_percentReal)
  } //[REMOVE IF STATEMENT]
  exptTimeline.push(if_node_picQDemo)
  exptTimeline.push(debrief) //save data here.
  // exptTimeline.push({
  //   type: 'fullscreen',
  //   fullscreen_mode: false
  // })
} else {
  exptTimeline.push(using_mobile_device)
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

// start the experiment with jatos wrapping
/*
      jatos.onLoad(function () {
    		jsPsych.init({
            preload_images: imageFilenames,
    		display_element: jspsychTargetMLP,
            timeline: exptTimeline     //create timeline array beforehand (not here)
    		});
    });
    */

function fadeToBlackFn () {
  lightnessVal -= fadeStep
  if (lightnessVal <= 0) {
    lightnessVal = 0
    document.getElementById('jspsychTargetMLP').style.color = 'white'
  }
  document.body.style.backgroundColor = 'hsl(0,0%,' + lightnessVal + '%)'
  if (lightnessVal > 0) {
    requestAnimationFrame(fadeToBlackFn)
  }
}

function fadeToWhiteFn () {
  lightnessVal += fadeStep
  if (lightnessVal >= 100) {
    lightnessVal = 100
    document.getElementById('jspsychTargetMLP').style.color = 'black'
  }
  document.body.style.backgroundColor = 'hsl(0,0%,' + lightnessVal + '%)'
  if (lightnessVal < 100) {
    requestAnimationFrame(fadeToWhiteFn)
  }
}

function shuffleArray (myArray) {
  let randNum, tempStore, j
  for (j = myArray.length; j; j--) {
    randNum = Math.floor(Math.random() * j)
    tempStore = myArray[j - 1]
    myArray[j - 1] = myArray[randNum]
    myArray[randNum] = tempStore
  }
}

function sampleArray (myArray) {
  return myArray[Math.floor(Math.random() * myArray.length)]
}
