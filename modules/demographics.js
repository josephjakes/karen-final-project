let p_age = ''
let p_gender = ''

///DEMOGRAPHIC QUESTIONS
export let demographics = {
    type: 'demographic-response',
    stimulus: '            <p style="text-align:left;font-size:110%"><b>Demographic information:</b></p>' +
        '			<p style="text-align:left;">You are nearly finished! We need the following information for our records, but it ' +
        '			is kept completely separate from information about your Prolfic account.' + //[STEVE: DELETE REFERENCE TO PROLIFIC]
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

    on_finish: function (data) {
        jsPsych.data.addDataToLastTrial({
            gender: p_gender,
            age: p_age
        });
    }
};
