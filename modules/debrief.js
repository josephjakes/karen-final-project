let mWidth = '16px 80px'
let smallFontSize = '90%'
let debrief = {
  type: 'html-button-response',
  stimulus:
    '<p style="text-align:right;font-size:' +
    smallFontSize +
    ';margin:' +
    mWidth +
    ';margin-top:30px;">Approval No 3670</p>' +
    '			<p style="text-align:center;"><b>THE UNIVERSITY OF NEW SOUTH WALES<br>' +
    '			Additional Study (Debriefing) Information</b><br><br><b>Rapid Search & Appraisal</b><br></p>' +
    '<b>THANK YOU FOR PARTICIPATING. REST ASSURED THAT ALL UNPLEASANT IMAGES USED IN THIS STUDY WERE STAGED USING SPECIAL EFFECTS AND MAKEUP.</b><br>' +
    '			<p style="text-align:left;line-height:120%;font-size:' +
    smallFontSize +
    ';margin:' +
    mWidth +
    ';"><b>(a) What are the research questions?</b><br>' +
    '			The study investigates whether knowing that emotional averse stimuli are fake changes their impact on perception, impact on memory and how people subjectively rate their intensity<br><br>' +
    '			<b>(b)	How does this study extend previous research on this topic?</b><br>' +
    '			Previous research has consistently demonstrated an effect known as emotion-induced blindness, where emotional images embedded in a rapid stream impair the ability to see a subsequent target. Emotional stimuli also tend to be remembered better. The current study aims to investigate whether these effects are driven purely by the content of the images or can be modulated by how people think about the pictures (e.g., knowing that they are fake). In this experiment, half of the participants were told that the pictures were fake at the start of the experiment and half were not told this until the end.<br><br>' +
    '			<b>(c)	What are some potential real-world implications of this research?</b><br>' +
    '			Cognitive appraisal is the assessment of an emotional situation, where a person evaluates how that situation will affect them by interpreting different aspects of that situation. The appraisal of a stimulus as threatening or disturbing often leads to responses such as stress and fear. This study aims to examine whether influencing the cognitive appraisal of threatening or disturbing stimuli will lower the extent to which they impair awareness and response to target stimuli. This may help researchers better understand strategies for reducing the trauma of witnessing upsetting scenes in the real world. <br><br>' +
    '			<b>(d)	What is a potential issue or limitation of the study?</b><br>' +
    '			A limitation with the design of the study is the reliance on participant ability to report how emotional they find a stimulus to be. Not everyone has equal insight into their emotional reactions. A more objective measure of emotional response could include the galvanic skin response, a measure of physiological arousal. However, as this study will be run online, this is not feasible. <br><br>' +
    '			<b>(e)	What is the methodology of this study?</b><br>' +
    '			The experiment is a 2 x 2 between-subjects design. The first independent variable is whether participants are told that the aversive stimuli are fake at the start of the experiment. The second independent variable is the emotional valence of the critical pictures (negative vs. neutral). There are three dependent variables. The first is the mean percentage accuracy in reporting the correct target orientation in the emotion-induced blindness task. The second is the subjective rating of unpleasantness (1=pleasant, 9 = unpleasant) and arousal (1=calm, 9= highly arousing) for emotional distractors. The third is how well participants remembered the critical distractors in a surprise memory test. <br><br>' +
    '			<b>(f)	Is there any further reading I can do if I am interested in this topic?</b><br>' +
    '			For more information about the phenomenon of emotion-induced blindness, see:<br>' +
    '		<ul style="text-align:left;line-height:120%;font-size:' +
    smallFontSize +
    '; margin:' +
    mWidth +
    ';">' +
    '			<li>Most, S. B., Chun, M. M., Widders, D. M., & Zald, D. H. (2005). Attentional rubbernecking: Cognitive control and personality in emotion-induced blindness. Psychonomic Bulletin & Review, 12(4), 654-661. https://doi.org/10.3758/BF03196754</li>' +
    '			<li>Wang, L., Kennedy, B. L., & Most, S. B. (2012). When emotion blinds: A spatiotemporal competition account of emotion-induced blindness. Frontiers in Psychology, 3, 438. https://doi.org/10.3389/fpsyg.2012.00438</li>' +
    '			</ul>' +
    '			<p style="text-align:left;line-height:120%;font-size:' +
    smallFontSize +
    ';margin:' +
    mWidth +
    ';">' +
    '			Please keep a copy of this information sheet (you can download the pdf <a href="Writtendebrief_3670.pdf" target="_blank">here</a>).<br>' +
    '			<br>' +
    '			<p style="text-align:center;"><b>PARTICIPANT CONFIRMATION</b></p>' +
    '			<p style="text-align:center;font-size:' +
    smallFontSize +
    ';margin:' +
    mWidth +
    ';">Clicking the button below indicates that you have read and understood this debrief information.<br><br></p>',

  choices: [
    '<p style="font-size:130%;line-height:0%;"><b>I have read the information!</b></p>'
  ],
  prompt:
    '<br>Clicking here will finish the experiment and redirect you back to Prolific to receive your payment. Thank you for participating.'
}


export { debrief }