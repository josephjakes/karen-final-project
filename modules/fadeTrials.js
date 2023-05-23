import { initialPauseDuration } from "./constants.js"

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

export { fadeToBlackTrial, fadeToWhiteTrial }