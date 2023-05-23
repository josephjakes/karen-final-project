import { smallFontSize, mWidth } from "./constants.js"

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
    INSTRUCTND,
    distInstruct_instruction_check,
    distInstruct_check_failed_conditional
  ],
  loop_function: function () {
    return distInstruct_repeatInstructions // If distInstruct_repeatInstructions remains true, this will keep looping; if it becomes false, it will move on.
  }
}

export { loop_initial_instructions, INSTRUCTND, loop_distInstruct_instructions }

