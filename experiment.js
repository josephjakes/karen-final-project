document.body.style.backgroundColor = "hsl(0,0%,"+lightnessVal+"%)";

Math.seedrandom();
rSeed = Math.floor(Math.random()*9999999);
Math.seedrandom(rSeed);

//Following consent, participants see 2 negative and 2 neutral items to ensure informed consent
//Twelve-item neuroticism scale
//Half the participants informed that negative images are from special effects galleries (show screenshots of webpages)
//Emotion-induced blindness, with 28 negative, 28 neutral, and 14 baseline trials (all lag 2)
//Memory test for distractors + 9 negative foils and 9 neutral foils
//Retrospectively rate the emotional items overall for valence and arousal
//Debriefed, with a re-statement of #3 (this will be the first time the other half of the participants see this)
//If participants hit a “terminate experiment” at any point during 1-6, they will be brought to #7.

//*** declare some global variables


var today = new Date(); //helpful to have in the data file
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;

var realVersion = true;
var jatosVersion = false;
var instructVersion= Math.round(Math.random());  // 0 = no instructions and 1 = given fake/staged instructions
console.log(instructVersion)

var subject_id = jsPsych.randomization.randomID(5); // generate a random subject ID with 5 characters


var resultsID = 0;

var winWidth = 800;   //800

var actualLagTypes = [2, 4 ]; //Actually only lag 2 [Steve: change this later]

var focusCheckInterval = 1000;

var itemsPerStream = 16;

var earliestDistractPosition = 2;   // Arrays are zero-indexed, so these are the 3rd and 10th positions - BECAUSE WE ARE ONLY DOING LAG 2! Reduce last position if including longer lags
var latestDistractPosition = 9

// This next bit gets the results ID, which will be passed in the parameters in the URL
// It uses code from https://www.xul.fr/javascript/parameters.php
if (location.search.substring(1)) {	//USEFUL_BIT
    var parameters = location.search.substring(1).split("&");	//USEFUL_BIT
    var temp = parameters[0].split("=");	//USEFUL_BIT
    if (temp[1]) {resultsID = unescape(temp[1])};	//USEFUL_BIT
};	//USEFUL_BIT


	var numBlocksTotal = 2; //in this experiment we only want to show the 28 neg + 28 neutral pics once so we only have two blocks (normally you'd have more).
  var quitButtonCount = 0; // in this variation of the task, if the pp pushes q a anytime it will skip to the debrief.
  var quitPlease;

if (realVersion) {

	var trialsPerDistractCond = 14 //PerBlock How many trials per condition (14 x neut/14 x negative) x 2 blocks [STEVE: CHANGE THIS IF WE ARE GOING TO CHANGE NUMBER OF STIMULI PER CONDITION]
	var numDistractConditions = 2 // neut and negative in this experiment.
	var	trialsPerBaselineType = 7 // PerBlock How many baseline trials
    var initialPauseDuration = 1000;     // 1000
    var itiDuration = 500;      // 500
    var fixationDuration = 500; // 500
    var feedbackDuration = 1000;     // 900

    var finalStandardDuration = 100;     // 100
    var finalDistractDuration = 100;    // 100

    var pracDurSteps = [500, 250, 150, 100, finalStandardDuration];  //   [500, 250, 150, 100, finalStandardDuration]
    var pracNperstep = 2;

    var firstPracTrialDur = 750;    // 750
    var numMemBlocks = 4 // how many blocks should we split mem trials (with breaks) into. Note that mem trials should be divisable by 4!
    var numMemPics = 28; //This is number of mem trials for each negative/neutral condition (not foils).
	  var numFoilPics = 9; //This is per emotion condition - so 9 negative + 9 neutral pics left over to act as foils in the memory task [STEVE: CHANGE THIS AS APPROPRIATE FOR MEMORY TEST]
    var memConditionsTotal = 4; //1 = neg old 2 =  neg_foils, 3 = neut old, 4 = neut foils.

} else {

    var trialsPerDistractCond = 4 //PerBlock How many trials per condition (neut/negative)
	var numDistractConditions = 2 // neut and negative in this experiment
	var	trialsPerBaselineType = 2 // PerBlock How many baseline trials
    var initialPauseDuration = 100;     // 1000
    var itiDuration = 500;      // 500
    var fixationDuration = 500; // 500
    var feedbackDuration = 800;     // 900

    var finalStandardDuration = 100;     // 100
    var finalDistractDuration = 100;    // 100

    var pracDurSteps = [500, 250, 150, 100, finalStandardDuration];  // [10, 10, 10, 10, 10]    [500, 250, 150, 100, finalStandardDuration]
    var pracNperstep = 1;

    var firstPracTrialDur = 750;    // 750
    var numMemBlocks = 4 // how many blocks should we split mem trials (with breaks) into. Note that mem trials should be divisable by 4!
    var numMemPics = 8; //so 8 each of neg/neutral x old/new
    var numFoilPics = 8; // use 24 negative and 24 neutral pics as foils
    var memConditionsTotal = 4; //1 = neg old 2 =  neg_foils, 3 = neut old, 4 = neut foils.

}


var pracStdDur = [];
var pracDisDur = [];

var numPracticeTrials = pracDurSteps.length * pracNperstep;
var numPracticeTrialsDigits = 6;

var tempCounter = 0;

for (ii = 0; ii < pracDurSteps.length; ii++) {
    for (jj = 0; jj < pracNperstep; jj++) {
        pracStdDur[tempCounter] = pracDurSteps[ii];
        pracDisDur[tempCounter] = pracDurSteps[ii];
        if (ii == pracDurSteps.length - 1) {pracDisDur[tempCounter] = finalDistractDuration};
        tempCounter++;
    };
};


// ******************* COLLATE FILENAMES FOR PRELOADING ******************
var numStandardImages = 251;
var numTargetImages = 120;  // 120 images, each in left and right configurations
var numNegImages = 37;
 //  28 will be used for the RSVP task and 9 will be used as foils in the memory task, an additional 2 will be shown at beginning with ethics,
var numNeutImages = 37;//  24 will be used for the RSVP task and 12 will be used as foils in the memory task,


var typeOfBlock = "";

var imageFilenames = [];

var previewNegFilenames = [];
for (ii = 0; ii < 4; ii++) {
    previewNegFilenames [ii] = "images/distractors/Samples/sample_"+ii+".jpg";
}
imageFilenames = imageFilenames.concat(previewNegFilenames);
 console.log(previewNegFilenames)

var negFilenames = []; //[STEVE: CHANGE TO POSFILENAMES AS APPROPRIATE FOR KAREN, THROUGHOUT SCRIPT]
for (ii = 0; ii < numNegImages; ii++) {
    negFilenames[ii] = "images/distractors/Negative/neg_"+ii+".jpg";
}
imageFilenames = imageFilenames.concat(negFilenames);

var neutFilenames = [];
for (ii = 0; ii < numNeutImages; ii++) {
    neutFilenames[ii] = "images/distractors/Neutral/neut_"+ii+".jpg";
}
imageFilenames = imageFilenames.concat(neutFilenames);

var standardFilenames = [];
for (ii = 0; ii < numStandardImages; ii++) {
    standardFilenames[ii] = "images/standards/standard"+ii+".jpg";
}
imageFilenames = imageFilenames.concat(standardFilenames);

var target0Filenames = [];
for (ii = 0; ii < numTargetImages; ii++) {
    target0Filenames[ii] = "images/targets/target"+ii+"_0.jpg";
}
imageFilenames = imageFilenames.concat(target0Filenames);

var target1Filenames = [];
for (ii = 0; ii < numTargetImages; ii++) {
    target1Filenames[ii] = "images/targets/target"+ii+"_1.jpg";
}
imageFilenames = imageFilenames.concat(target1Filenames);

imageFilenames = imageFilenames.concat("images/target_example_white.jpg");

console.log(imageFilenames)

// ******************* CREATE AND SET VARIOUS USEFUL VARIABLES ******************

var trialDistractType = 3;      //  Initialize as 3 so that all practice trials recorded as baseline type.
var trialDistractPos;
var trialLag;
var trialStandardDuration;
var trialDistractDuration;


var fbStrCorrect = 'correct';
var fbStrIncorrect = 'incorrect';
var trialCorrect = 0; //RSVP correct

var stimArray = []

var distractID = "none";    // Initialize as 'none' so that it records no distractor during practice
var targetID = "";

var exptPhase = 0;      // 0 = practice, 1 = ACTUAL; 2 = Memory
var blockNum = 0;
var trialNum = 0;
var trialNumInBlock = 0;

var p_age = '';
var p_gender = '';
var p_language = '';
var p_country = '';


// fixation

var runFixation = {
    type: 'image-keyboard-response',
    stimulus: 'images/fixation.png',
    trial_duration: fixationDuration,
    response_ends_trial: false
};


// ******************* RSVP TASK TRIALS ******************

// ******************* SET TRIAL TYPES RSVP******************

lagType =2; //it's always 2 in this experiment

// first let's split our negative and neutral distractor pics into two different piles (24 to be used in RSVP and 12 to be used later in the memory task).
// We want to make sure we have just the right amount of pics in these arrays (then we can sample without replacement and know that they will all be seen).
// first we calculate how many trials we need of each condition for the distractorID selection (which should be 12 trials per distractor condition, per block for the two distractor conditions).
var numTrialsPerBlock=(trialsPerDistractCond * numDistractConditions) + trialsPerBaselineType; // 12 x 2 = 24 + 6 in this experiment

//then we calculate how many pics we need to have in each of the two piles. We'll then copy them from the (shuffled) pic arrays.

var maxPicsPerRSVPcond = trialsPerDistractCond * numBlocksTotal; //12 x 2 = 24 pics per pile


shuffleArray(negFilenames);
shuffleArray(neutFilenames);

//console.log(negFilenames);

var neg = [];
var neut = [];
var neg_foil = [];
var neut_foil = [];


for (ii = 0; ii < maxPicsPerRSVPcond; ii++) { //copy the first 24 pics to the 0-23 slots of the relevant arrays
	neg[ii] = negFilenames[ii];
	neut[ii] = neutFilenames[ii];
	};

for (kk = 0; kk < numFoilPics; kk++) { //copy the next 12 pics to the foil arrays
	neg_foil[kk] = negFilenames[kk+maxPicsPerRSVPcond];
	neut_foil[kk] = neutFilenames[kk+maxPicsPerRSVPcond];
	};

//unfortunately if we want to have break blocks during memory task we are going to need to have counters for all of these stim arrays
var negcounter = 0;
var neutcounter = 0;
var neg_foilcounter = 0;
var neut_foilcounter = 0;

// now let's make an array of ones, twos and threes which is used to select the trialtype on each RSVP trial (shuffled before each block)
var trialSelector = [];
for (ii = 0; ii < trialsPerDistractCond; ii++) {trialSelector[ii] = 1};
for (ii = trialsPerDistractCond; ii < trialsPerDistractCond*2; ii++) {trialSelector[ii] = 2};
for (ii = trialsPerDistractCond*2; ii < numTrialsPerBlock; ii++) {trialSelector[ii] = 3};

shuffleArray(trialSelector);


var last_rsvp_time = 0;


var runRSVPtrial = {
    type: 'rsvp-sequence',
    stimuli: function() {

        shuffleArray(standardFilenames);

        var stimArray = []
        for (ii = 0; ii < itemsPerStream + 2; ii++) {       // Extra 2 elements in array hold distractor and target stimuli; these will be moved into position later
            stimArray[ii] = standardFilenames[ii];
        };

        trialDistractType = trialSelector[trialNumInBlock]; // so 1 = negative, 2 = neutral, 3 = baseline.


        if (trialDistractType == 1) {
				distractID = neg[negcounter];
				negcounter++;
        } else if (trialDistractType == 2) {
				distractID = neut[neutcounter];
				neutcounter++;
		} else if  (trialDistractType == 3) {
            distractID = standardFilenames[itemsPerStream]};

        stimArray[itemsPerStream] = distractID;

        trialTargetType = Math.floor(Math.random() * 2);
        if (trialTargetType == 0) {
            targetID = sampleArray(target0Filenames);
        } else {
            targetID = sampleArray(target1Filenames);
        };

        stimArray[itemsPerStream + 1] = targetID;
        return stimArray
    },

    standardDuration: finalStandardDuration,
    distractorDuration: finalDistractDuration,
    distractorPosition: function() {return trialDistractPos = earliestDistractPosition + Math.floor(Math.random() * (latestDistractPosition + 1 - earliestDistractPosition))},
    //lag_type: function () {return trialLag = actualLagTypes[lagType[trialSelector[trialNumInBlock]]]},
    lag_type: 2,
    post_trial_gap: 0,
    on_finish: function(trial_data) {
        last_rsvp_time = trial_data.rsvp_time;
    }

};

//here we add 81 (q) as keycode in case they want to quit.
var correctKeyCode;

var runRSVPresponse = {
    type: 'categorize-image',
    stimulus: 'images/response_prompt.png',
    choices: [37, 39, 81],

    key_answer: function () {
        correctKeyCode = 37;
        if (trialTargetType == 1) {correctKeyCode = 39};
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

    on_finish: function(trial_data) {

      RSVPresp=trial_data.key_press;
      if (trial_data.key_press == 81) {
           quitButtonCount=1;
           quitPlease = true;
           console.log(quitButtonCount);
    } else if (trial_data.key_press == 39 && trialTargetType == 1) {
            trialCorrect = 1;
		} else if (trial_data.key_press == 37 && trialTargetType == 0) {
			trialCorrect = 1;
        } else {
            trialCorrect = 0;
        };

       	jsPsych.data.addDataToLastTrial({
            exptPhase: exptPhase,
            blockNum: blockNum+1,
            blockType: typeOfBlock,
            trialNum: trialNumInBlock+1,
            trialDistractType: trialDistractType,
            trialDistractPos: trialDistractPos,
            trialLag: trialLag,
            RSVPtrialResp:RSVPresp,
            RSVPTrialCorrect: trialCorrect,
            trialTargetType: trialTargetType,
            distractID: distractID,
            targetID: targetID,
            rsvp_time: last_rsvp_time,
        	});

    }
};


var runRSVPtrialPractice = {
    type: 'rsvp-sequence',
    stimuli: function() {
        shuffleArray(standardFilenames);
        stimArray = [];
        for (ii = 0; ii < itemsPerStream + 2; ii++) {       // Extra 2 elements in array hold distractor and target stimuli; these will be moved into position later
            stimArray[ii] = standardFilenames[ii];
        };
        trialTargetType = Math.floor(Math.random() * 2);
        if (trialTargetType == 0) {
            targetID = sampleArray(target0Filenames);
        } else {
            targetID = sampleArray(target1Filenames);
        };
        stimArray[itemsPerStream + 1] = targetID;
        return stimArray
    },
    standardDuration: function() {return pracStdDur[trialNumInBlock]},
    distractorDuration: function() {return pracDisDur[trialNumInBlock]},
    distractorPosition: function() {return trialDistractPos = earliestDistractPosition + Math.floor(Math.random() * (latestDistractPosition + 1 - earliestDistractPosition))},
    lag_type: 2,
};

var runRSVPresponsePractice = {
    type: 'categorize-image',
    stimulus: 'images/response_prompt_noQuit.png',
    choices: [37, 39],

    key_answer: function () {
        correctKeyCode = 37;
        if (trialTargetType == 1) {correctKeyCode = 39};
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

    on_finish: function(trial_data) {

      RSVPresp=trial_data.key_press;
      if (trial_data.key_press == 39 && trialTargetType == 1) {
            trialCorrect = 1;
		} else if (trial_data.key_press == 37 && trialTargetType == 0) {
			trialCorrect = 1;
        } else {
            trialCorrect = 0;
        };

       	jsPsych.data.addDataToLastTrial({
            exptPhase: exptPhase,
            blockNum: blockNum+1,
            blockType: typeOfBlock,
            trialNum: trialNumInBlock+1,
            trialDistractType: trialDistractType,
            trialDistractPos: trialDistractPos,
            trialLag: trialLag,
            RSVPtrialResp:RSVPresp,
            RSVPTrialCorrect: trialCorrect,
            trialTargetType: trialTargetType,
            distractID: distractID,
            targetID: targetID,
            rsvp_time: last_rsvp_time,
        	});

    }
};

// ******************* INITIAL INSTRUCTIONS ******************


 var tempInstrStr = '<p style="text-align:left">Thanks for agreeing to take part in this study!<br><br>In this study, you will be asked to complete a <b>target detection</b> task.<br><br>Each trial will start with a cross appearing - this tells you that the trial is about to begin. You will then see a stream of pictures flash up rapidly in the center of the screen, one after another.<br><br></p>';


var target_example = '<p style="text-align:center"><img src="images/target_example_white.jpg" /><br></p>';
var initial_instructions = {
    type: "instructions",
    pages: [
        tempInstrStr,
        '<p style="text-align:left">Most of the pictures will be shown upright. However, one of the pictures in the stream will be rotated, either to the left or to the right. This rotated picture is the <b>TARGET</b>.<br><br>Some examples are shown below....<br><br></p>' + target_example,
        '<p style="text-align:left">Your task is to identify whether the target in each stream of pictures is rotated to the left or the right.<br><br>You should wait until the stream of pictures finishes, and then press the <b>LEFT OR RIGHT ARROW KEY</b> (on the keyboard) to identify the direction in which you thought the target was rotated.<br><br></p>' + target_example,
    ],
    show_clickable_nav: true,
    post_trial_gap: 0
};


var initial_Q0_answers;
var initial_Q1_answers;
var initial_Q2_answers;

initial_Q0_answers = [" A picture of a tree.", " A picture that has been rotated to the left or right.", " A picture that is upside-down."];
initial_Q1_answers = [" I should press the left arrow key if the target picture was rotated to the left, and the right arrow key if it was rotated to the right.", " I should press one of the number keys to indicate how much I liked the target picture."];
initial_Q2_answers = [" As soon as I see the target picture.", " At the end of the stream of pictures."];

var initial_correctstring = '{"Q0":"' + initial_Q0_answers[1] + '","Q1":"' + initial_Q1_answers[0] + '","Q2":"' + initial_Q2_answers[1] + '"}';

var initial_repeatInstructions = true;

var initial_instruction_check = {
    type: "survey-multi-choice",
    preamble: ["<p style='text-align:center;'><b>Check your knowledge before you continue!</b></p>"],
    questions: [{prompt: 'On each trial of this task, the stream of pictures will contain one target. This target will be:', options: initial_Q0_answers, required: true}, {prompt: 'How should you respond to the target picture on each trial?', options: initial_Q1_answers, required: true}, {prompt: 'When should you make your response?', options: initial_Q2_answers, required: true}],
    post_trial_gap: 0,
    on_finish: function(data) {
        if( data.responses == initial_correctstring) {
            initial_repeatInstructions = false;
        };

        jsPsych.data.addDataToLastTrial({
            instruct_qs: 1
        });
    }
};

var initial_check_failed_display = {
    type: "html-button-response",
    stimulus: '<p><b>Unfortunately, at least one of your answers was incorrect.</b></p>',
    choices: ['<p>Click here to read the instructions again</p>'],
    button_html: '<button class="fancyButtonRed" style="vertical-align:middle"><span>%choice%</span></button><br><br>',
    post_trial_gap: 100
};


var initial_check_failed_conditional = {
    timeline: [initial_check_failed_display],
    conditional_function: function(){
        return initial_repeatInstructions;      // If this is true, it will execute timeline (show failure screen)
    }
};


var loop_initial_instructions = {
    timeline: [initial_instructions, initial_instruction_check, initial_check_failed_conditional],
    loop_function: function() {
        return initial_repeatInstructions;  // If initial_repeatInstructions remains true, this will keep looping; if it becomes false, it will move on.
    }
};


// ******************* FIRST PRACTICE TRIAL ******************

var ready_to_start_practice = {
    type: "html-keyboard-response",
    stimulus: "<p><b>Well done - all your answers were correct!</b></p><p>You\'ll now have a chance to practice the task. We\'ll go through the first trial very slowly.</p><p style='font-size:90%;'><br>Press any key to continue</p>"
};

var firstRSVPtrialPractice = {
    type: 'rsvp-sequence',
    stimuli: function() {
        shuffleArray(standardFilenames);
        stimArray = [];
        for (ii = 0; ii < 5; ii++) {       // All elements hold standard stimuli
            stimArray[ii] = standardFilenames[ii];
        };
        return stimArray
    },
    standardDuration: firstPracTrialDur,
    distractorDuration: firstPracTrialDur,
    distractorPosition: 0,
    lag_type: 2
};


var firstRSVPtrialTarget = {
    type: 'html-keyboard-response',
    stimulus: '<p style="color:black">This is the TARGET picture. On this trial, it is rotated to the right.<br>So at the end of the stream of pictures, you should press the <b>right arrow key</b>.<br><br>Press any key to continue with the stream.</p><p><img src="images/targets/target0_1.jpg"></img></p><p>This is the TARGET picture. On this trial, it is rotated to the right.<br>So at the end of the stream of pictures, you should press the <b>right arrow key</b>.<br><br>Press any key to continue with the stream.</p>',   // The white bit at the start of this line is just so the image appears in the centre of the screen
    post_trial_gap: 100
};


var firstPracCorrect = false;
var firstRSVPtrialresponse = {
    type: 'html-keyboard-response',
    stimulus: '<p style="color:black">You should now make your response to the target that you saw earlier.<br><br>On this trial, the target was rotated to the right so you should<br>press the right arrow key on the keyboard now.</p><p><img src="images/response_prompt_noQuit.png"></img></p><p>You should now make your response to the target that you saw earlier.<br><br>On this trial, the target was rotated to the right so you should<br>press the right arrow key now.</p>',   // The white bit at the start of this line is just so the image appears in the centre of the screen
    choices: [37, 39],
    on_finish: function(trial_data) {
        if(trial_data.key_press == 39) {
            firstPracCorrect = true;
        };

        jsPsych.data.addDataToLastTrial({
            firstPracCorrect: firstPracCorrect,
        });

    }
};
style='color:#FF0000'

var firstRSVPtrialFB = {
    type: 'html-keyboard-response',
    stimulus: function() {
        if (firstPracCorrect) {
            return "<p style='font-size:120%;'>correct</p>";
        } else {
            return "<p style='color:#FF0000;font-size:150%;'><b>Incorrect</b></p><p style='color:#black;font-size:120%;'>The target on this trial was this picture:<br><br><img src='images/targets/target0_1.jpg'></img><br><br>This target was rotated to the right, so you should have<br>pressed the right arrow key.</p>";
        };

    },
    trial_duration: function() {
        if (firstPracCorrect) {
            return 1500;
        } else {
            return 8000;
        };
    },
    response_ends_trial: false
};


var first_practice_trial_loop = {
    timeline: [runFixation, firstRSVPtrialPractice, firstRSVPtrialTarget, firstRSVPtrialPractice, firstRSVPtrialresponse, firstRSVPtrialFB],
    loop_function: function() {
        return false;  // This means it will 'loop' only once
    }
};


var instr_before_prac_loop = {
    type: "html-keyboard-response",
    stimulus: function() {
	        typeOfBlock = "Prac";
	        return  "<p><b>Now it's time to practice the task. These practice trials will start off slowly, but the streams will gradually get faster - up to the speed of the main experiment.</b></p><p style='font-size:90%;'><br>Press any key to continue</p>";
	        },
};


var loop_practice_trials = {
    timeline: [runFixation, runRSVPtrialPractice, runRSVPresponsePractice],

    loop_function: function() {
        trialNumInBlock++;
        if (trialNumInBlock < numPracticeTrials) {
            return true;
        } else {
            exptPhase = 1;
            trialNumInBlock = 0;
            return false;
        };
    }
};




var nextBlock= {
    type: "html-keyboard-response",
    stimulus: function() {
	    typeOfBlock = "EIB";
        var tempTextHTML = " ";
		var reminderText = " ";
		if (instructVersion ==0) reminderText ="<p>Don't forget that the rotated target will never be of a person so you can ignore those images.</p>"; //[STEVE: DON'T NEED INSTRUCTVERSION B/C EVERYONE GETS SAME INSTRUCTIONS]
		if (instructVersion ==1) reminderText ="<p>Don't forget that the graphic images you see are staged or fake.</p>";
        if (blockNum> 0) {tempTextHTML +="<p>You\'re doing well!</p><p>" + (blockNum) +" of " + numBlocksTotal + " blocks completed</p>"; //[STEVE: HERE IS WHERE YOU SAY THAT IMAGES ARE FAKE (FOR ALICE)]
		tempTextHTML+=reminderText;} //[DON'T NEED THIS, DELETE]
        else if (blockNum==0) {tempTextHTML +="<p>You\'re now ready to start the main experiment. Good luck! </p>";}
        tempTextHTML += "<br><p>Press any key when you are ready to begin</p>"

        return tempTextHTML;
    },
    post_trial_gap: initialPauseDuration,
};


var nextBlockMemory = {
    type: "html-keyboard-response",
    stimulus: "<p>You're finished with the rotation task. <br><br> Now you will complete a slightly different task. <br><br> On each trial you will be shown an image for 3 seconds. <br><br> Please indicate within 3 seconds whether or not you have seen the image in the previous task by pressing the LEFT arrow key (<) if you have seen the image before or the RIGHT arrow key (>) if you have not seen the image before.<br><br>Press any key to begin</p>",
    	on_finish: function(){
	    negcounter = 0; //reset to 0 so that we can show them again in the memory.
		neutcounter = 0;
		}
};

var if_node_nextBlockMemory = {
    timeline: [nextBlockMemory],
    conditional_function: function(){
      if (quitButtonCount == 1) { //here I check if they have pushed q or not.
        return false
      }
    }
  }



//#####Memory Task#########
var memBlockNum=0;
var numTrialsPerMemBlock = ((numMemPics*2) + (numFoilPics*2))/numMemBlocks;
var memTrialSelector = [];


//need to have 28 of condition 1 (neg), 9 of condition 2 (neg foil), 28 of condition 3 (neutral) and 9 of condition 4 (neutral foils).
// now let's make an array of ones up to fours. This is clunky but nested for-loops suck in javascript
for (ii = 0; ii < numMemPics; ii++) {memTrialSelector[ii] = 1}; //up to 28
for (ii = numMemPics; ii < numMemPics+numFoilPics; ii++) {memTrialSelector[ii] = 2}; // up to 37
for (ii = numMemPics+numFoilPics; ii < (numMemPics*2)+numFoilPics; ii++) {memTrialSelector[ii] = 3}; // up to 65
for (ii = (numMemPics*2)+numFoilPics; ii < (numMemPics*2) + (numFoilPics*2); ii++) {memTrialSelector[ii] = 4};  //up to 74

console.log(memTrialSelector)

// shuffle all the arrays, including the pic arrays that we've already fiddled with and reset the counters where necessary
shuffleArray(memTrialSelector);
shuffleArray(neg);
shuffleArray(neut);


var memTrialCounter = 0; // this counter does not get reset

var PressSpacebartrial = {
	type: 'html-keyboard-response',
	choices: [' '],
	stimulus: "<p> When you are ready: push spacebar to view the next image.</p><p> It will only show for one second</p>"
	};


	 var memoryTaskTrials = {
		type: 'categorize-image',
		prompt: '<br><br> Did you see this picture within the rapidly flashed images in the first part of the experiment? <br><br> < Yes                             No >' +
    ' '+
    ' '+
      ' '+
        ' '+
          ' '+
            ' '+
              ' '+
                ' '+
                '<p style="color:#FFA500">                                                            Or press Q to quit this task </p>',
    stimulus_duration: 1000,
    stimulus: function() {

        memTrialType = memTrialSelector[memTrialCounter];

        if (memTrialType == 1) {
		    memPic = neg[negcounter]; //1 = neg old
		    console.log(memPic);
		    negcounter++;
		 	} else if (memTrialType == 2) {
		    memPic = neg_foil[neg_foilcounter]; //2 = neg_foils
		    console.log(memPic);
		    neg_foilcounter++;
		    } else if (memTrialType == 3) {
		   	memPic = neut[neutcounter]; //3 = neut old,,
		   	console.log(memPic);
		   	neutcounter++;
		     } else if (memTrialType == 4) {
		    memPic = neut_foil[neut_foilcounter]; //8 = neut foil,
		    console.log(memPic);
		    neut_foilcounter++;
		    };

        return memPic


   		},
   		show_stim_with_feedback: false,
    	feedback_duration: 0, //we don't want feedback here
		choices:[37, 39, 81],
		key_answer: function () {
       		correctKeyCode = 37; //yes
			if (memTrialType== 2||memTrialType== 4) {correctKeyCode = 39}; //if it's a new one then they should answer no.
			return correctKeyCode
    	},
	 	on_finish: function(trial_data){

		 	if (trial_data.key_press == 81) {quitButtonCount=1

    } else if (trial_data.key_press == correctKeyCode) {
            trialCorrect = 1;

       		} else {
            trialCorrect = 0;

       		 };
		memPic = trial_data.stimulus;
		exptPhase=2;
		typeOfBlock = "memoryTask";

		jsPsych.data.addDataToLastTrial({
          exptPhase: exptPhase,
          blockNum: memBlockNum+1,
          blockType: typeOfBlock,
          trialNum: trialNumInBlock+1,
          trialCond: memTrialType,
          distractID: memPic,
          correctResp: correctKeyCode,
          memTrialCorrect: trialCorrect,
			})


			}
 		};

 		var memBlockBreak= {
    	type: "html-keyboard-response",
    	stimulus: function() {
        var tempTextHTML = "<p>You\'re doing well!</p><p>" + (memBlockNum+1) +" of " + numMemBlocks + " blocks completed</p>"
        tempTextHTML += "<br><p>Press any key when you are ready to continue</p>"

        return tempTextHTML;
        },

  		post_trial_gap: initialPauseDuration,
};



// ETHICS ETC

	    // ******************* WELCOME AND DEMOGRAPHICS ******************
   var smallFontSize = '90%';
	var mWidth = '16px 80px';

	// ETHICS ETC

	     // ******************* WELCOME AND CONSENT ******************

    /* define welcome message trial */
    var welcome = {
      type: "html-keyboard-response",
      stimulus: "Welcome to the experiment. Press any key to begin."
    };

	welcome.task = {};
    welcome.task.blurb = '<b>"Rapid Search & Appraisal"</b> is a psychological study investigating how people process rapidly presented images, including unpleasant ones. To participate you will need to be using a computer (with keyboard and mouse/trackpad).';



    var welcome1 = {
        type: "html-button-response",
        stimulus: function() {

            return '<h1 style="text-align:center;">UNSW Sydney</h1>' +
            '    <p style="text-align:left;line-height:190%;margin:'+mWidth+';"><br>Thank you for applying to participate in this study. ' + welcome.task.blurb + ' It involves the following steps:</p>' +
            '<ol style="text-align:left;line-height:190%;margin:'+mWidth+';">' +
            '<li>  We ask for your informed consent. Please read the consent form closely. <br></li>' +
            '<li>  We will then explain how to do the task in detail. <br></li>' +
            '<li>  Next comes the experiment itself. <br></li>' +
            '<li>  Finally you will be asked some questions.<br></li>' +


            '</ol>' +
            '<p style="text-align:left;line-height:190%;margin:'+mWidth+';">Please <u>do not</u> use the "back" ' +
            '   button on your browser or close the window until you reach the end of the experiment.' +
            '   This is very likely to break the experiment.' +
            '   However, if something does go wrong, please contact us! When you are ready to begin, click on' +
            '   the "START" button below.<br><br></p>'
        },
        choices: ['<p style="font-size:130%;line-height:0%;"><b>START!</b></p>']
    };


    welcome.ethics = {};
    welcome.ethics.selection = 'You are invited to take part in this research study. The research study aims to investigate how people process rapidly presented images, including unpleasant ones. You have been invited because you are a student taking introductory psychology at UNSW.';
    welcome.ethics.description = 'If you decide to take part in the research study, you will be asked to view rapid streams of mostly landscape or architectural images. One of these images will be rotated 90 degrees, and your goal will be to identify whether this image was rotated left or right. There will also be some images of people, some of which will be unpleasantly graphic or violent (e.g., depictions of injury, disfigurement, or death; you will have a chance to view samples prior to'+ 'beginning the experiment and may withdraw at any time). These images will be presented rapidly, at a rate of 10 per second, but you will see them again for a longer duration at the end of the experiment. You will also be asked questions about your emotional style. We don’t expect this research to cause any harm. However, you may skip any or all written or verbal questions if you wish. Please var the researchers know if you need any assistance for any reason.';


    var welcome2 = {
        type: "html-button-response",
        stimulus:'<p style="text-align:right;font-size:'+smallFontSize+';margin:'+mWidth+';margin-top:30px;">Approval No 3670</p>' +
       	'		<p style="text-align:center;"><b>THE UNIVERSITY OF NEW SOUTH WALES<br>' +
        '			PARTICIPANT INFORMATION STATEMENT</b><br><br><b>Rapid Search & Appraisal</b><br></p>' +
        '			<p style="text-align:left;line-height:120%;font-size:'+smallFontSize+';margin:'+mWidth+';">' +
	'			<b>1. What is the research study about?</b><br>' +
	'		You are invited to take part in this research study. The research study investigates how people process rapidly presented images, including unpleasant ones. You have been invited because you are a registered user of Prolific.<br><br>' +
	'			<b>2. Who is conducting this research? </b><br>' +
	'		The study is being carried out by the following researchers: Associate Professor Steven B. Most and Rayan Premaratna, UNSW Sydney School of Psychology.<br>' +
	'		Research Funder: This research is not funded by any outside agency. <br><br>' +
	'			<b>3. Inclusion/Exclusion Criteria </b><br>' +
	'		Before you decide to participate in this research study, you should meet the following criteria:<br>' +
	'			<ul style="text-align:left;line-height:120%;font-size:'+smallFontSize+'; margin:'+mWidth+';">' +
	'			<li>You have normal or corrected to normal, vision</li>' +
  '      <li>Please do NOT participate if you are likely to be upset by graphic or gory images</li>' +
	'			</ul>' +
	'			<p style="text-align:left;line-height:120%;font-size:'+smallFontSize+';margin:'+mWidth+';">' +
	'			<b>4. Do I have to take part in this research study?</b><br>' +
	'		Participation in this research study is voluntary. If you do not want to take part, you do not have to. If you decide to take part and later change your mind, you are free to withdraw from the study at any stage (See Item 11).' +
	 '			<p style="text-align:left;line-height:120%;font-size:'+smallFontSize+';margin:'+mWidth+';">' +
	'			<b>5. What does participation in this research require, and are there any risks involved?</b><br>' +
	'		If you decide to take part in the research study, we will ask you to view rapid streams of mostly landscape or architectural images.' +
  ' One of these images will be rotated 90 degrees, and your goal will be to identify whether this image was rotated left or right. There will also be some images of people, some of which will be unpleasantly graphic or violent (e.g., depictions of injury, disfigurement, or death; you will have a chance to view samples prior to beginning the experiment and may withdraw at any time).'+
  ' These images will be presented rapidly, at a rate of 10 per second, but you will see them again for a longer duration at the end of the experiment. You will also be asked questions about your emotional style.<br><br>' +
	'	We don’t expect this research to cause any harm. However, if you do not wish to answer a question, you may skip it and go to the next question, or you may stop immediately. If you become upset or distressed by this research project, free contactable support services are included at section 12. These services are provided by qualified staff who are not members of the research team. Please var the researchers know if you need any assistance for any reason. <br><br>' +
	'	<b>6. Total participation time </b><br>' +
	'		In total, participation in this study will require 30 minutes. <br><br>' +
	'	<b>7. Recompense to participants </b><br>' +
	'		You will be compensated at a rate of GBP £12/hr for your participation. As this experiment should be completed within 30 minutes, you will receive GBP £6. <br><br>' +
	'	<b>8. What are the possible benefits to participation?</b><br>' +
	'		We cannot promise that you will receive any benefits from this study, but we hope to use the findings from this study to build upon research about the impact of emotional stimuli on perception and cognition. <br><br>' +
	'	<b>9. What will happen to information about me?</b><br>' +
	"		The information that you provide us will be kept indefinitely after the project’s completion.  We will store information about you in a non-identifiable format on a password-protected server at UNSW's School of Psychology (Kensington Campus) Non-identifiable data from the experiment may also be placed in a publically accessible repository. <br><br>" +
	'		Researchers at UNSW are requested to store their aggregated research data in the UNSW data repository, this is a system called ResData. Once the aggregated data are deposited into this repository, they will be retained in this system permanently, but in a format where your data will not be individually identifiable.<br><br>' +
	'		Your information will be used for an honours thesis paper. The data may also be reported at professional conferences and journal articles. However, in all cases, data will be de-identified and reported in aggregate form. <br><br>' +
	'	<b>10. How and when will I find out what the results of the research study are?</b><br>' +
	'		The research team intend to publish and/ report the results of the research study in a variety of ways. All information published will be done in a way that will not identify you. If you would like to receive a copy of the results you can var the research team know by contacting lead investigator A/Prof Steven Most at s.most@unsw.edu.au <br><br>' +
	'	<b>11. What if I want to withdraw from the research study?</b><br>' +
	'		If you do consent to participate, you may withdraw at any time. If you withdraw before starting the experiment, you can do this by closing the browser window. If you withdraw in the middle of the experiment, you can do so by clicking on a Quit button that will be visible. If you withdraw from the research, we will destroy any information that has already been collected. Once you have completed the experiment, however, we will not be able to withdraw your responses as the questionnaire is anonymous. <br><br>' +
	'		Your decision not to participate or to withdraw from the study will not affect your relationship with UNSW. If you decide to withdraw from the research study, the researchers will not collect additional information from you. Any identifiable information about you will be withdrawn from the research project. <br><br>' +
	'	<b>12. What should I do if I have further questions about my involvement in the study? </b><br>' +
	'		If you require further information regarding this study or if you have any problems that may be related to your involvement in the study, you can contact the following member/s of the research team:' +
	'			<ul style="text-align:left;line-height:120%;font-size:'+smallFontSize+'; margin:'+mWidth+';">' +
	'			<li>A/Prof Steven Most (s.most@unsw.edu.au)</li></ul>' +
  '	<p style="text-align:left;line-height:120%;font-size:'+smallFontSize+';margin:'+mWidth+';">' +
  '	<b> Contact for feelings of distress </b><br>' +
  '	The NHS provides links and contact information for a number of free mental health resources, including 24-hour advice and support and free listening services.' +
  ' These can be found at the following webpage: <a href="https://www.nhs.uk/nhs-services/mental-health-services/"target="_blank"> NHS Support Services </a>'+
	'			<p style="text-align:left;line-height:120%;font-size:'+smallFontSize+';margin:'+mWidth+';">' +
	'	<b>13. What if I have a complaint or concerns about the research study?</b><br>' +
	'		If you have a complaint regarding any aspect of the study or the way it is being conducted, please contact the UNSW Human Ethics Coordinator:' +
	'	<ul style="text-align:left;line-height:120%;font-size:'+smallFontSize+'; margin:'+mWidth+';">' +
	'			<li>Phone number: 0293856222</li>' +
	'			<li>Email: humanethics@unsw.edu.au</li>' +
	'			<li>Reference Number: 3670</li>' +
	'		</ul>'+
	   '			Please keep a copy of this information sheet (you can download the pdf <a href="InformedConsent_3670.pdf" target="_blank">here</a>).<br>' +
        '			<br>' +
        '			<p style="text-align:center;"><b>PARTICIPANT CONSENT</b></p>' +
        '			<p style="text-align:left;font-size:'+smallFontSize+';margin:'+mWidth+';">By continuing, you are making a decision whether or not to participate.  Clicking the button below indicates that, having read the information provided on the participant information sheet, you have decided to participate.<br><br></p>',
        choices: ['<p style="font-size:130%;line-height:0%;"><b>I agree!</b></p>'],
        prompt: '<p style="text-align:left;font-size:'+smallFontSize+';margin:'+mWidth+';"><br>Please close the browser window if you do not wish to participate.<br><br></p>',
    };

		//******Debriefing*****
	 var debrief = {
        type: "html-button-response",
        stimulus:'<p style="text-align:right;font-size:'+smallFontSize+';margin:'+mWidth+';margin-top:30px;">Approval No 3670</p>' +
        '			<p style="text-align:center;"><b>THE UNIVERSITY OF NEW SOUTH WALES<br>' +
        '			Additional Study (Debriefing) Information</b><br><br><b>Rapid Search & Appraisal</b><br></p>' +
        '<b>THANK YOU FOR PARTICIPATING. REST ASSURED THAT ALL UNPLEASANT IMAGES USED IN THIS STUDY WERE STAGED USING SPECIAL EFFECTS AND MAKEUP.</b><br>'+
        '			<p style="text-align:left;line-height:120%;font-size:'+smallFontSize+';margin:'+mWidth+';"><b>(a) What are the research questions?</b><br>' +
		'			The study investigates whether knowing that emotional averse stimuli are fake changes their impact on perception, impact on memory and how people subjectively rate their intensity<br><br>' +
		'			<b>(b)	How does this study extend previous research on this topic?</b><br>' +
        '			Previous research has consistently demonstrated an effect known as emotion-induced blindness, where emotional images embedded in a rapid stream impair the ability to see a subsequent target. Emotional stimuli also tend to be remembered better. The current study aims to investigate whether these effects are driven purely by the content of the images or can be modulated by how people think about the pictures (e.g., knowing that they are fake). In this experiment, half of the participants were told that the pictures were fake at the start of the experiment and half were not told this until the end.<br><br>' +
        '			<b>(c)	What are some potential real-world implications of this research?</b><br>' +
		"			Cognitive appraisal is the assessment of an emotional situation, where a person evaluates how that situation will affect them by interpreting different aspects of that situation. The appraisal of a stimulus as threatening or disturbing often leads to responses such as stress and fear. This study aims to examine whether influencing the cognitive appraisal of threatening or disturbing stimuli will lower the extent to which they impair awareness and response to target stimuli. This may help researchers better understand strategies for reducing the trauma of witnessing upsetting scenes in the real world. <br><br>" +
        '			<b>(d)	What is a potential issue or limitation of the study?</b><br>' +
        '			A limitation with the design of the study is the reliance on participant ability to report how emotional they find a stimulus to be. Not everyone has equal insight into their emotional reactions. A more objective measure of emotional response could include the galvanic skin response, a measure of physiological arousal. However, as this study will be run online, this is not feasible. <br><br>' +
        '			<b>(e)	What is the methodology of this study?</b><br>' +
        '			The experiment is a 2 x 2 between-subjects design. The first independent variable is whether participants are told that the aversive stimuli are fake at the start of the experiment. The second independent variable is the emotional valence of the critical pictures (negative vs. neutral). There are three dependent variables. The first is the mean percentage accuracy in reporting the correct target orientation in the emotion-induced blindness task. The second is the subjective rating of unpleasantness (1=pleasant, 9 = unpleasant) and arousal (1=calm, 9= highly arousing) for emotional distractors. The third is how well participants remembered the critical distractors in a surprise memory test. <br><br>' +
        '			<b>(f)	Is there any further reading I can do if I am interested in this topic?</b><br>' +
        '			For more information about the phenomenon of emotion-induced blindness, see:<br>' +
	'		<ul style="text-align:left;line-height:120%;font-size:'+smallFontSize+'; margin:'+mWidth+';">' +
	'			<li>Most, S. B., Chun, M. M., Widders, D. M., & Zald, D. H. (2005). Attentional rubbernecking: Cognitive control and personality in emotion-induced blindness. Psychonomic Bulletin & Review, 12(4), 654-661. https://doi.org/10.3758/BF03196754</li>' +
	'			<li>Wang, L., Kennedy, B. L., & Most, S. B. (2012). When emotion blinds: A spatiotemporal competition account of emotion-induced blindness. Frontiers in Psychology, 3, 438. https://doi.org/10.3389/fpsyg.2012.00438</li>' +
	'			</ul>' +
	'			<p style="text-align:left;line-height:120%;font-size:'+smallFontSize+';margin:'+mWidth+';">' +

        '			Please keep a copy of this information sheet (you can download the pdf <a href="Writtendebrief_3670.pdf" target="_blank">here</a>).<br>' +
        '			<br>' +
        '			<p style="text-align:center;"><b>PARTICIPANT CONFIRMATION</b></p>' +
        '			<p style="text-align:center;font-size:'+smallFontSize+';margin:'+mWidth+';">Clicking the button below indicates that you have read and understood this debrief information.<br><br></p>',

        choices: ['<p style="font-size:130%;line-height:0%;"><b>I have read the information!</b></p>'],
		prompt: '<br>Clicking here will finish the experiment and redirect you back to Prolific to receive your payment. Thank you for participating.'

    };

    //SHOW THREE IMAGES TO MAKE SURE THAT THEY DO REALLY WANT TO CONTINUE


    	var preExposurePreamble = {
    		type: "html-keyboard-response",
    		stimulus: "Thank you for agreeing to participate in our study. As mentioned in the informed consent document, this study will involve viewing unpleasant (in addition to neutral) images. <br><br> In order to 		give you an idea of what to expect, we will briefly show you four of these images now, with a pause in between each one. <br><br> If at any stage you decide that you do not in fact 		wish to participate, you can simply close this browser window. When you are ready to see the first image, press any key.",
    		}


    		var okToContinue = {
    		type: "html-keyboard-response",
    		stimulus: "Do you wish to continue? <br><br> Press any key to continue or simply close this browser window if you wish to withdraw from the study.",
    		}


    		var PreExposureIAPS = {
    		type: "image-keyboard-response",
    		stimulus: jsPsych.timelineVariable('stimulus'),
    		trial_duration: 1000,
    		choices: jsPsych.NO_KEYS,
    		}

    		var IAPS_preview = [
      		{ stimulus: previewNegFilenames[0]},
     		{ stimulus: previewNegFilenames[1]},
     		{ stimulus: previewNegFilenames[2]},
        { stimulus: previewNegFilenames[3]},
    		];

    		var imagePreExposureProcedure = {
      		 timeline: [PreExposureIAPS, okToContinue],
     		 timeline_variables: IAPS_preview
    		};

		// *******************INSTRUCTION-D******************
    //Note: edited first INSTRUCT set to contain statement that stimuli are fake
    var INSTRUCTD = { //[STEVE: DON'T NEED INSTRUCTD OR INSTRUCTND]
            type: "html-button-response",
            stimulus:'<p style="text-align:center;"><b>IMPORTANT NOTE BEFORE YOU START THE REAL EXPERIMENT</b><br><br>' +
      '			<p style="text-align:left;line-height:120%;font-size:150; color:#FFA500; margin:'+mWidth+';">' +
      '			ALL UNPLEASANT IMAGES ARE <b>FAKE</b> OR <b>STAGED</b>, AND WERE CREATED USING SPECIAL EFFECTS OR MAKEUP.<br><br><br></p>' +
      '			In this rapid target detection task, some pictures will appear that are of people, and some of these will be graphic or unpleasant.' +
      '			The rotated target will never contain a person, so please ignore these pictures.<br><br>' +



      '			<p style="text-align:center;"><b>PARTICIPANT CONFIRMATION</b></p>' +
      '			<p style="text-align:center;font-size:'+smallFontSize+';margin:'+mWidth+';">Clicking the button below indicates that you have read and understood the instruction.<br><br></p>',

    	choices: ['<p style="font-size:130%;line-height:0%;"><b>I have read the instructions!</b></p>'],

       };


   var INSTRUCTND = {
        type: "html-button-response",
        stimulus:'<p style="text-align:center;"><b>IMPORTANT NOTE BEFORE YOU START THE REAL EXPERIMENT</b><br><br>' +
  '			<p style="text-align:left;line-height:120%;font-size:'+smallFontSize+';margin:'+mWidth+';">' +
  '			In this rapid target detection task, some pictures will appear that are of people, and some of these will be graphic or unpleasant.' +
  '			The rotated target will never contain a person, so please ignore these pictures.<br><br>' +

  '			<p style="text-align:center;"><b>PARTICIPANT CONFIRMATION</b></p>' +
  '			<p style="text-align:center;font-size:'+smallFontSize+';margin:'+mWidth+';">Clicking the button below indicates that you have read and understood the instruction.<br><br></p>',

	choices: ['<p style="font-size:130%;line-height:0%;"><b>I have read the instruction!</b></p>'],

   };


//check they have read the instructions [STEVE: DON'T NEED THIS SECTION ON CHECKING WHETHER THEY HAVE READ INSTRUCTIONS, BUT MAYBE KEEP IF YOU WANT TO TEST THAT THEY UNDERSTAND]

var distInstruct_Q0_answers;


distInstruct_Q0_answers = ["Fake or staged", " Real images taken from real events"];

var distInstruct_correctstring = '{"Q0":"' + distInstruct_Q0_answers[0] + '"}';

var distInstruct_repeatInstructions = true;

var distInstruct_instruction_check = {
    type: "survey-multi-choice",
    preamble: ["<p style='text-align:center;'><b>Check your knowledge before you continue!</b></p>"],
    questions: [{prompt: 'To double check that you are paying attention please answer the following. All the unpleasant images you will see in this task are: (select the correct option below)', options: distInstruct_Q0_answers, required: true}],
    post_trial_gap: 0,
    on_finish: function(data) {
        if( data.responses == distInstruct_correctstring) {
            distInstruct_repeatInstructions = false;
        };

        jsPsych.data.addDataToLastTrial({
            instruct_qs: 1
        });
    }
};

var distInstruct_check_failed_display = {
    type: "html-button-response",
    stimulus: '<p><b>Unfortunately your answer was incorrect.</b></p>',
    choices: ['<p>Click here to read the instructions again</p>'],
    button_html: '<button class="fancyButtonRed" style="vertical-align:middle"><span>%choice%</span></button><br><br>',
    post_trial_gap: 100
};

var distInstruct_check_failed_conditional = {
    timeline: [distInstruct_check_failed_display],
    conditional_function: function(){
        return distInstruct_repeatInstructions;      // If this is true, it will execute timeline (show failure screen)
    }
};
var loop_distInstruct_instructions = {
    timeline: [INSTRUCTD, distInstruct_instruction_check, distInstruct_check_failed_conditional],
    loop_function: function() {
        return distInstruct_repeatInstructions;  // If distInstruct_repeatInstructions remains true, this will keep looping; if it becomes false, it will move on.
    }
};

//**************Picture graphic/arousing questions**********************

var MCHECKAoptions = ["1.", "2", "3", "4", "5", "6", "7", "8", "9."];

// please edit the preamble and the prompts. The name should just be the num of the question.
var picResponse = {
  type: 'survey-multi-choice',
  preamble: '<p style=";margin:10px;">During this experiment, you saw several images that were graphic and unpleasant. Please read each statement below and select the answer that best represents your OVERALL FEELING to these images. Your answers will remain anonymous and confidential so please be honest.</p>',
    questions: [
      {prompt: "1. Using the scale below where 1 is PLEASANT, 5 is NEUTRAL and 9 is UNPLEASANT - how unpleasant would you rate your emotional reaction to these images?", name: 'picsPleasant', options: MCHECKAoptions, required:true, horizontal: true},
    {prompt: "2. Using the scale of 1-9 below where 1 is CALM and 9 is AROUSED - how energised or aroused was your emotional reaction to these images?", name: 'picsArousing', options: MCHECKAoptions, required:true, horizontal: true},
    ],
};

	//*************Did they follow instructions**********************
//To change to percentage of images that participants thought were fake

var percentageOptions = ["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"];

// please edit the preamble and the prompts. The name should just be the num of the question.
 var percentageReal = {
		type: 'survey-multi-choice',
	 	preamble: 'You are nearly finished with the experiment. We just have a few questions to ask  so please use the mouse to respod.<br><br> In this experiment you were shown some unpleasant and graphic images.',
	    questions: [
    		{prompt: "Roughly what percentage of the unpleasant and graphic images did you assume to be REAL (photos taken from real events)?", name: 'percentageReal', options: percentageOptions, required:true},]
	};

  var if_node_percentReal = {
      timeline: [percentageReal],
      conditional_function: function(){
        if (quitButtonCount == 1) { //here I check if they have pushed q or not.
          return false
        }
      }
    }

var NEURinstruction= {
	type: 'html-keyboard-response',
	stimulus: 'We will start the experiment by asking you to complete a short questionnaire.<br><br>' +
	'Your answers will remain anonymous and confidential so please be honest.<br><br><br>' +
	' Please press space bar to begin',
	choices: [" " ],
	response_ends_trial: true,
	};


	//**************NEUROTICISM Q***********************

 		//The same response key will be given for all questions right? So just carefully copy the possible responses below between the " "
 var NEURoptions = ["Yes", "No", "Rather Not Say"];

 // please edit the preamble and the prompts. The name should just be the num of the question.
  var NEUR = {
 		type: 'survey-multi-choice',
 	 	preamble: 'Please read each statement and decide how well it describes you by selecting the appropriate answer. There are no right or wrong answers. Your answers will remain anonymous and confidential so please be honest.',
 	    questions: [
     		{prompt: "1. Does your mood often go up and down?", name: 'NEUR1', options: NEURoptions, required:true},
 		{prompt: "2. Do you ever feel ‘just miserable’ for no reason?", name: 'NEUR2', options: NEURoptions, required:true},
 		{prompt: "3. Are you an irritable person?", name: 'NEUR3', options: NEURoptions, required:true},
 		{prompt: "4. Are your feelings easily hurt?", name: 'NEUR4', options: NEURoptions, required:true},
 		{prompt: "5. Do you often feel fed up?", name: 'NEUR5', options: NEURoptions, required:true},
 		{prompt: "6. Would you call yourself a nervous person?", name: 'NEUR6', options: NEURoptions, required:true},
     		{prompt: "7. Are you a worrier?", name: 'NEUR7', options: NEURoptions, required:true},
     		{prompt: "8. Would you call yourself tense or highly strung?", name: 'NEUR8', options: NEURoptions, required:true},
     		{prompt: "9. Do you worry too long after embarrassing experiences?", name: 'NEUR9', options: NEURoptions, required:true},
    		{prompt: "10. Do you suffer from nerves?", name: 'NEUR10', options: NEURoptions, required:true},
     		{prompt: "11. Do you often feel lonely?", name: 'NEUR11', options: NEURoptions, required:true},
     		{prompt: "12. Are you often troubled about feelings of guilt?", name: 'NEUR12', options: NEURoptions, required:true},

 		],
   };


///DEMOGRAPHIC QUESTIONS
var demographics = {
    type: "demographic-response",
    stimulus:     '            <p style="text-align:left;font-size:110%"><b>Demographic information:</b></p>' +
    '			<p style="text-align:left;">You are nearly finished! We need the following information for our records, but it ' +
    '			is kept completely separate from information about your Prolfic account.'  + //[STEVE: DELETE REFERENCE TO PROLIFIC]
    '           As long as you finish the experiment you will get paid no matter what you put here,' +
    '           so please be honest.<br><br>' +
    '			<!-- Gender -->' +
    '           <label for="gender"><b>Gender: &nbsp;</b></label>' +
    '           <input type="radio" name="gender" value="male" /> Male &nbsp; ' +
    '           <input type="radio" name="gender" value="female" /> Female &nbsp;' +
    '           <input type="radio" name="gender" value="other" /> Other<br /><br />' +
    '			<!-- Age -->' +
    '           <label for="age (in years)"><b>Age: &nbsp;</b></label><input id="age" name="age" /><br /><br />' +
    '			<br><br><br>',

    choices: ['<p style="font-size:130%;line-height:0%;"><b>Next ></b></p>'],

    on_finish: function(data) {
        jsPsych.data.addDataToLastTrial({
            gender: p_gender,
            age: p_age
        });
    }
};


    // ******************* MAIN LOOPS ******************


    var loop_RSVPTrials = {
        timeline: [runFixation, runRSVPtrial, runRSVPresponse],

        loop_function: function() {
            trialNumInBlock++;
            if (trialNumInBlock < numTrialsPerBlock && quitButtonCount<1) {
                return true;
            } else {
                return false;
            };
        }
    };



    var loop_RSVPBlocks = {
        timeline: [nextBlock, loop_RSVPTrials],
        loop_function: function() {
            blockNum++;
            trialNumInBlock = 0;
            if (blockNum < numBlocksTotal && quitButtonCount<1) {
                return true;
            } else {
                return false;
            };
        }
    };




    var loop_memTrials = {
        timeline: [PressSpacebartrial, runFixation, memoryTaskTrials],
        loop_function: function() {
            trialNumInBlock++;
            memTrialCounter++;
            if (trialNumInBlock < numTrialsPerMemBlock && quitButtonCount<1) {
                return true;

            } else {
                return false;

            };
        }
    };

    var checkBlockBreak = {     // No block break after final memory block
        timeline: [memBlockBreak],
        conditional_function: function(){
            if (memBlockNum == 3 || quitButtonCount==1) {
                return false;
            } else {
                return true;
            };
        }
    };

    var loop_memBlocks = {
        timeline: [loop_memTrials, checkBlockBreak],
        loop_function: function() {
            memBlockNum++;
            trialNumInBlock=0;
            if (memBlockNum < numMemBlocks && quitButtonCount<1) {
                return true;
            } else {
                return false;
            };
        }
    };
    var if_node_memBlock = {
        timeline: [loop_memBlocks],
        conditional_function: function(){
          if (quitButtonCount == 1) { //here I check if they have pushed q or not.
            return false
          }
        }
      }
    var if_node_picQDemo = {
        timeline: [picResponse, demographics],
        conditional_function: function(){
          if (quitButtonCount == 1) { //here I check if they have pushed q or not.
            return false
          }
        }
      }

    // ******************* FADES ******************

    var fadeToBlack;
    var fadeToWhite;
    var fadeStep = 2;
    var lightnessVal;

    var fadeDuration = 17 * 100 / fadeStep;  // Assume 60 Hz refresh (so 17ms frame update)


    var fadeToBlackTrial = {
        type: "html-keyboard-response",
        stimulus: "",
        trial_duration: 1,
        response_ends_trial: false,
        post_trial_gap: fadeDuration + initialPauseDuration,
        on_finish: function() {
            lightnessVal = 100;
            requestAnimationFrame(fadeToBlackFn);
        }
    };

    var fadeToWhiteTrial = {
        type: "html-keyboard-response",
        stimulus: "",
        trial_duration: 1,
        response_ends_trial: false,
        post_trial_gap: fadeDuration,
        on_finish: function() {
            lightnessVal = 0;
            requestAnimationFrame(fadeToWhiteFn);
        }
    };



    var usingComputer = true;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) usingComputer = false;})(navigator.userAgent||navigator.vendor||window.opera);


    var using_mobile_device = {
        type: "instructions",
        pages: [
            '<p style="text-align:left;font-size:150%">You seem to be using a mobile device so you will not currently be able to complete this survey.<br><br>To complete this survey, please visit this website using a computer with a keyboard and mouse/trackpad.</p>'
        ]
    };



    // ******************* SET TIMELINE AND RUN EXPT ******************

    var exptTimeline = [];

    if (usingComputer) {

          exptTimeline.push(welcome1);
          exptTimeline.push(welcome2);

            exptTimeline.push({
                type: 'fullscreen',
                fullscreen_mode: true
            });
           exptTimeline.push(preExposurePreamble)
           exptTimeline.push(imagePreExposureProcedure);
           exptTimeline.push(NEURinstruction);
           exptTimeline.push(NEUR); // STEVE: IF YOU WANT QUESTIONNAIRE AFTER EXP, MOVE IN TIMELINE
      		 exptTimeline.push(loop_initial_instructions);
      	 	 exptTimeline.push(ready_to_start_practice);
      	 	 exptTimeline.push(fadeToBlackTrial);
      	 	 exptTimeline.push(first_practice_trial_loop);
      	 	 exptTimeline.push(fadeToWhiteTrial);
      	 	 exptTimeline.push(instr_before_prac_loop);
           exptTimeline.push(fadeToBlackTrial);
      	 	 exptTimeline.push(loop_practice_trials);

    	if (instructVersion ==0) {exptTimeline.push(INSTRUCTND)};
    	if (instructVersion ==1) {exptTimeline.push(loop_distInstruct_instructions)}; //[STEVE: DON'T NEED TWO SEPARATE INSTRUCTVERSIONS HERE]
    	exptTimeline.push(loop_RSVPBlocks);
    	exptTimeline.push(if_node_nextBlockMemory);
      exptTimeline.push(if_node_memBlock);
    	if (instructVersion==1) {exptTimeline.push(if_node_percentReal)}; //[REMOVE IF STATEMENT]
      exptTimeline.push(if_node_picQDemo);
    	exptTimeline.push(debrief); //save data here.
        exptTimeline.push({
            type: 'fullscreen',
            fullscreen_mode: false
        });



    } else {

        exptTimeline.push(using_mobile_device);
    };

    // record the subject Num and the counterbalance condition in the jsPsych data object (adds property to every trial)
    jsPsych.data.addProperties({
        subNum: subject_id,
    	  DateTime: dateTime,
    	  toldFakeGroup1Yes0No: instructVersion,
    	});


    if (jatosVersion== false) {
    	//start the experiment without jatos wrapping
    	jsPsych.init({
    		preload_images: imageFilenames,
    		display_element: jspsychTargetMLP,
    		experiment_width: 900,
    		timeline: exptTimeline,
    		on_finish: function() {
    		jsPsych.data.get().ignore(['internal_node_id',]).localSave('csv','.myData.csv');  /* This is just to store it locally!! Don't do this over  the internet or it will store on their computer!*/
    		}
    	});
    } else {jatos.onLoad(function() {
    /* start the experiment with jatos wrapping AND set up the Prolific talk back*/
            // ---------- subject info ----------
            var prolific_id =  jatos.urlQueryParameters.PROLIFIC_PID;//
            var completion_url = "https://app.prolific.co/submissions/complete?cc=CDUKJ5BN";
            var finish_msg = 'All done! Please click <a href="' + completion_url + '">here</a> to be returned to Prolific and receive your completion code notification.';
            // record the subject Num in the jsPsych data (adds property to every trial)
           jsPsych.data.addProperties({
           prolificID: prolific_id,
           });

            jsPsych.init({
          	  		preload_images: imageFilenames,
    				display_element: jspsychTargetMLP,
    				timeline: exptTimeline,
                    on_finish: function() {
                 		var results = jsPsych.data.get().ignore(['internal_node_id','button_pressed']).csv();
    					jatos.submitResultData(results);
                    	document.write('<div id="endscreen" class="endscreen" style="width:1000px"><div class="endscreen" style="text-align:center; border:0px solid; padding:10px; font-size:120%; 						width:800px; float:right"><p><br><br><br>' +finish_msg +'</p></div></div>')
                  		}
            	  });
            	 });
    };


    // start the experiment with jatos wrapping
    /*
      jatos.onLoad(function () {
    		jsPsych.init({
            preload_images: imageFilenames,
    		display_element: jspsychTargetMLP,
            timeline: exptTimeline     //create timeline array beforehand (not here)
    		});
    });
    */


    function fadeToBlackFn() {
        lightnessVal -= fadeStep;
        if (lightnessVal <= 0) {
            lightnessVal = 0;
            document.getElementById("jspsychTargetMLP").style.color = "white";
        };
        document.body.style.backgroundColor = "hsl(0,0%,"+lightnessVal+"%)";
        if (lightnessVal > 0) {
            requestAnimationFrame(fadeToBlackFn);
        };
    };

    function fadeToWhiteFn() {
        lightnessVal += fadeStep;
        if (lightnessVal >= 100) {
            lightnessVal = 100;
            document.getElementById("jspsychTargetMLP").style.color = "black";
        };
        document.body.style.backgroundColor = "hsl(0,0%,"+lightnessVal+"%)";
        if (lightnessVal < 100) {
            requestAnimationFrame(fadeToWhiteFn);
        };
    };


    function shuffleArray(myArray) {
        var randNum, tempStore, j;
        for (j = myArray.length; j; j--) {
            randNum = Math.floor(Math.random() * j);
            tempStore = myArray[j - 1];
            myArray[j - 1] = myArray[randNum];
            myArray[randNum] = tempStore;
        }
    };

    function sampleArray(myArray) {
        return myArray[Math.floor(Math.random() * myArray.length)];
    };