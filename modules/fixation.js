const fixationDuration = 500
let fixationTrial = {
  type: 'html-keyboard-response',
  stimulus: '<span style="font-size:60px;">+</span>',
  trial_duration: fixationDuration,
  response_ends_trial: false
}

export { fixationTrial }