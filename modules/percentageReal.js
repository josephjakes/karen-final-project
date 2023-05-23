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

let percentPicturesRealTrial = {
  timeline: [percentageReal],
  conditional_function: function () {
    if (quitButtonCount == 1) {
      //here I check if they have pushed q or not.
      return false
    }
  }
}

export { percentPicturesRealTrial as if_node_percentReal }