let NEURoptions = ['Yes', 'No', 'Rather Not Say']

export let NEUR = {
  type: 'survey-multi-choice',
  preamble:
    'Please read each statement and decide how well it describes you by selecting the appropriate answer. There are no right or wrong answers. Your answers will remain anonymous and confidential so please be honest.',
  questions: [
    {
      prompt: '1. Does your mood often go up and down?',
      name: 'NEUR1',
      options: NEURoptions,
      required: true
    },
    {
      prompt: '2. Do you ever feel ‘just miserable’ for no reason?',
      name: 'NEUR2',
      options: NEURoptions,
      required: true
    },
    {
      prompt: '3. Are you an irritable person?',
      name: 'NEUR3',
      options: NEURoptions,
      required: true
    },
    {
      prompt: '4. Are your feelings easily hurt?',
      name: 'NEUR4',
      options: NEURoptions,
      required: true
    },
    {
      prompt: '5. Do you often feel fed up?',
      name: 'NEUR5',
      options: NEURoptions,
      required: true
    },
    {
      prompt: '6. Would you call yourself a nervous person?',
      name: 'NEUR6',
      options: NEURoptions,
      required: true
    },
    {
      prompt: '7. Are you a worrier?',
      name: 'NEUR7',
      options: NEURoptions,
      required: true
    },
    {
      prompt: '8. Would you call yourself tense or highly strung?',
      name: 'NEUR8',
      options: NEURoptions,
      required: true
    },
    {
      prompt: '9. Do you worry too long after embarrassing experiences?',
      name: 'NEUR9',
      options: NEURoptions,
      required: true
    },
    {
      prompt: '10. Do you suffer from nerves?',
      name: 'NEUR10',
      options: NEURoptions,
      required: true
    },
    {
      prompt: '11. Do you often feel lonely?',
      name: 'NEUR11',
      options: NEURoptions,
      required: true
    },
    {
      prompt: '12. Are you often troubled about feelings of guilt?',
      name: 'NEUR12',
      options: NEURoptions,
      required: true
    }
  ]
}

export { NEURinstruction, NEUR }
