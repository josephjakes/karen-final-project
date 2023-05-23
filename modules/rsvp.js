import { fixationTrial } from './fixation.js'
import { shuffleArray, sampleArray } from './arrayManipulations.js'
import {
  itiDuration,
  feedbackDuration,
  finalStandardDuration,
  finalDistractDuration,
  firstPracticeTrialDuration,
  initialPauseDuration,
} from './constants.js'

let ready_to_start_practice_trial = {
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
  standardDuration: firstPracticeTrialDuration,
  distractorDuration: firstPracticeTrialDuration,
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
    fixationTrial,
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

let runRSVPtrial = {
  type: 'rsvp-sequence',
  trial_target_type: (window.trial_target_type = Math.floor(Math.random() * 2)),
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

const rsvpTimeline = [fixationTrial, runRSVPtrial, runRSVPresponse]
const rsvpPracticeTimeline = [
  fixationTrial,
  runRSVPtrialPractice,
  runRSVPresponsePractice
]

let loop_RSVPTrials = {
  timeline: rsvpTimeline,

  loop_function: function () {
    trialNumInBlock++
    if (trialNumInBlock < numTrialsPerBlock && quitButtonCount < 1) {
      return true
    } else {
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
    if (instructVersion == 0) {
      reminderText =
        "<p>Don't forget that the rotated target will never be of a person so you can ignore those images.</p>" //[STEVE: DON'T NEED INSTRUCTVERSION B/C EVERYONE GETS SAME INSTRUCTIONS]
    }
    if (instructVersion == 1) {
      reminderText =
        "<p>Don't forget that the graphic images you see are staged or fake.</p>"
    }
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

let loop_practice_trials = {
  timeline: rsvpPracticeTimeline,

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

let instr_before_prac_loop = {
  type: 'html-keyboard-response',
  stimulus: function () {
    typeOfBlock = 'Prac'
    return "<p><b>Now it's time to practice the task. These practice trials will start off slowly, but the streams will gradually get faster - up to the speed of the main experiment.</b></p><p style='font-size:90%;'><br>Press any key to continue</p>"
  }
}

export { loop_RSVPBlocks, loop_practice_trials, first_practice_trial_loop, instr_before_prac_loop, ready_to_start_practice_trial }
