let trialsPerDistractCond;
let numDistractConditions;
let trialsPerBaselineType;
let initialPauseDuration;
let itiDuration;
let fixationDuration;
let feedbackDuration;
let finalStandardDuration;
let finalDistractDuration;
let pracDurSteps;
let pracNperstep;
let firstPracTrialDur;
let numMemBlocks;
let numMemPics;
let numFoilPics;
let memConditionsTotal = 4; //1 = neg old 2 =  neg_foils, 3 = neut old, 4 = neut foils.

let realVersion = false
if (realVersion) {
    trialsPerDistractCond = 14; //PerBlock How many trials per condition (14 x neut/14 x negative) x 2 blocks [STEVE: CHANGE THIS IF WE ARE GOING TO CHANGE NUMBER OF STIMULI PER CONDITION]
    numDistractConditions = 2; // neut and negative in this experiment.
    trialsPerBaselineType = 7; // PerBlock How many baseline trials
    initialPauseDuration = 1000; // 1000
    itiDuration = 500; // 500
    fixationDuration = 500; // 500
    feedbackDuration = 1000; // 900

    finalStandardDuration = 100; // 100
    finalDistractDuration = 100; // 100

    pracDurSteps = [500, 250, 150, 100, finalStandardDuration]; //   [500, 250, 150, 100, finalStandardDuration]
    pracNperstep = 2;

    firstPracTrialDur = 750; // 750
    numMemBlocks = 4; // how many blocks should we split mem trials (with breaks) into. Note that mem trials should be divisable by 4!
    numMemPics = 28; //This is number of mem trials for each negative/neutral condition (not foils).
    numFoilPics = 9; //This is per emotion condition - so 9 negative + 9 neutral pics left over to act as foils in the memory task [STEVE: CHANGE THIS AS APPROPRIATE FOR MEMORY TEST]
    memConditionsTotal = 4; //1 = neg old 2 =  neg_foils, 3 = neut old, 4 = neut foils.
} else {
    trialsPerDistractCond = 4; //PerBlock How many trials per condition (neut/negative)
    numDistractConditions = 2; // neut and negative in this experiment
    trialsPerBaselineType = 2; // PerBlock How many baseline trials
    initialPauseDuration = 100; // 1000
    itiDuration = 500; // 500
    fixationDuration = 500; // 500
    feedbackDuration = 800; // 900

    finalStandardDuration = 100; // 100
    finalDistractDuration = 100; // 100

    pracDurSteps = [500, 250, 150, 100, finalStandardDuration]; // [10, 10, 10, 10, 10]    [500, 250, 150, 100, finalStandardDuration]
    pracNperstep = 1;

    firstPracTrialDur = 750; // 750
    numMemBlocks = 4; // how many blocks should we split mem trials (with breaks) into. Note that mem trials should be divisable by 4!
    numMemPics = 8; //so 8 each of neg/neutral x old/new
    numFoilPics = 8; // use 24 negative and 24 neutral pics as foils
    memConditionsTotal = 4; //1 = neg old 2 =  neg_foils, 3 = neut old, 4 = neut foils.
}

export {
    trialsPerDistractCond,
    numDistractConditions,
    trialsPerBaselineType,
    initialPauseDuration,
    itiDuration,
    fixationDuration,
    feedbackDuration,
    finalStandardDuration,
    finalDistractDuration,
    pracDurSteps,
    pracNperstep,
    firstPracTrialDur,
    numMemBlocks,
    numMemPics,
    numFoilPics,
    memConditionsTotal
};