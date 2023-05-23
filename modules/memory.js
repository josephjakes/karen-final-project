import { fixationTrial } from './fixation.js'
import {
  initialPauseDuration,
  numMemBlocks,
  numMemPics,
  numFoilPics
} from './constants.js'
import { shuffleArray } from './arrayManipulations.js'
import { demographics } from './demographics.js'

let memTrialCounter = 0 // this counter does not get reset

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

shuffleArray(memTrialSelector)

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

let loop_memTrials = {
  timeline: [PressSpacebartrial, fixationTrial, memoryTaskTrials],
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

export { if_node_nextBlockMemory, if_node_memBlock, if_node_picQDemo }
