import { welcome1, welcome2 } from './welcomeV2.js';
import { debrief } from './debrief.js';
import { dass21 } from './dass21.js';
import { usingComputer, using_mobile_device } from './usingComputer.js';
import { loop_RSVPBlocks, loop_practice_trials, first_practice_trial_loop, instr_before_prac_loop, ready_to_start_practice_trial } from './rsvp.js'
import { fadeToBlackTrial, fadeToWhiteTrial } from './fadeTrials.js'
import { preTestSurveyIntroduction } from './preSurveyTrial.js';
import { loop_initial_instructions, loop_distInstruct_instructions } from './initial_instructions.js';
import { instructVersion } from './constants.js'
import { if_node_nextBlockMemory, if_node_memBlock, if_node_picQDemo} from './memory.js';
import { neurosisSurveyTrial } from './neurosisMeasure.js';

// still fixing
import { if_node_percentReal, } from './percentageReal.js';


// ******************* SET TIMELINE AND RUN EXPT ******************
export let exptTimeline = [];
if (usingComputer) {
  exptTimeline.push(welcome1);
  exptTimeline.push(welcome2);

  // exptTimeline.push({
  //   type: 'fullscreen',
  //   fullscreen_mode: true
  // })
  // exptTimeline.push(preExposurePreamble)
  // exptTimeline.push(imagePreExposureProcedure)
  exptTimeline.push(preTestSurveyIntroduction);
  exptTimeline.push(dass21);
  // exptTimeline.push(neurosisSurveyTrial) // STEVE: IF YOU WANT QUESTIONNAIRE AFTER EXP, MOVE IN TIMELINE
  exptTimeline.push(loop_initial_instructions);
  exptTimeline.push(ready_to_start_practice_trial);
  exptTimeline.push(fadeToBlackTrial);
  exptTimeline.push(first_practice_trial_loop);
  exptTimeline.push(fadeToWhiteTrial);
  exptTimeline.push(instr_before_prac_loop);
  exptTimeline.push(fadeToBlackTrial);
  exptTimeline.push(loop_practice_trials);

  // if (instructVersion == 0) {
  //   exptTimeline.push(INSTRUCTND);
  // }
  // if (instructVersion == 1) {
  exptTimeline.push(loop_distInstruct_instructions);
  // } //[STEVE: DON'T NEED TWO SEPARATE INSTRUCTVERSIONS HERE]
  


  exptTimeline.push(loop_RSVPBlocks);
  exptTimeline.push(if_node_nextBlockMemory);
  exptTimeline.push(if_node_memBlock);
  if (instructVersion == 1) {
    exptTimeline.push(if_node_percentReal);
  } //[REMOVE IF STATEMENT]
  exptTimeline.push(if_node_picQDemo);
  exptTimeline.push(debrief); //save data here.




  // exptTimeline.push({
  //   type: 'fullscreen',
  //   fullscreen_mode: false
  // })
} else {
  exptTimeline.push(using_mobile_device);
}
