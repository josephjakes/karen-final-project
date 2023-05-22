'use_strict'

const dass21Questions = [
  'I found it hard to wind down.',
  'I was aware of dryness of my mouth.',
  "I couldn't seem to experience any positive feeling at all.",
  'I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion).',
  'I found it difficult to work up the initiative to do things.',
  'I tended to over-react to situations.',
  'I experienced trembling (e.g., in the hands).',
  'I felt that I was using a lot of nervous energy.',
  'I was worried about situations in which I might panic and make a fool of myself.',
  'I felt that I had nothing to look forward to.',
  'I found myself getting agitated.',
  'I found it difficult to relax.',
  'I felt down-hearted and blue.',
  'I was intolerant of anything that kept me from getting on with what I was doing.',
  'I felt I was close to panic.',
  'I was unable to become enthusiastic about anything.',
  "I felt I wasn't worth much as a person.",
  'I felt that I was rather touchy.',
  'I was aware of the action of my heart in the absence of physical exertion (e.g., sense of heart rate increase, heart missing a beat).',
  'I felt scared without any good reason.',
  'I felt that life was meaningless.',
]

// - 1 because psychologists don't 0 index their measures
const subscaleStress = [1, 6, 8, 11, 12, 14, 18].map(i => `Q${i - 1}`)
const subscaleAnxiety = [2, 4, 7, 9, 15, 19, 20].map(i => `Q${i - 1}`)
const subscaleDepression = [3, 5, 10, 13, 16, 17, 21].map(i => `Q${i - 1}`)

function calculateSubscaleScore (subscale) {
  let subscaleScore = 0
  for (const question_key of subscale) {
    const responses_object = JSON.parse(jsPsych.data.get().last().values()[0][
      'responses'
    ])
    const target_question_response = responses_object[question_key]
    subscaleScore += target_question_response
  }
  return subscaleScore
}

const item_1_preamble = `Please read each statement and select the answer which indicates how much the statement
  applied to you over the past week. There are no right or wrong answers. Do not spend too much
  time on any statement.`

const agreementLabels = [
  '<div class="agreement-labels">Did not apply to me at all</div>',
  '<div class="agreement-labels">Applied to me to some degree, or some of the time</div>',
  '<div class="agreement-labels">Applied to me to a considerable degree or a good part of time</div>',
  '<div class="agreement-labels">Applied to me very much or most of the time</div>',
]

let item_1_questions = dass21Questions.map(question => {
  return { prompt: question, labels: agreementLabels }
})

const dass21 = {
  type: 'survey-likert',
  preamble: item_1_preamble,
  questions: item_1_questions,
  on_finish: function (data) {
    data.anxiety = calculateSubscaleScore(subscaleAnxiety)
    data.depression = calculateSubscaleScore(subscaleDepression)
    data.stress = calculateSubscaleScore(subscaleStress)
  },
}

export { dass21 }
