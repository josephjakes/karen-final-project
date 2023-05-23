let mWidth = '16px 80px'
let smallFontSize = '90%'
let welcome = {
  type: 'html-keyboard-response',
  stimulus: 'Welcome to the experiment. Press any key to begin.',
  task: {
    blurb:
      '<b>"Rapid Target Search"</b> is a psychological study investigating how people process rapidly presented images, including unpleasant ones. To participate you will need to be using a computer (with keyboard and mouse/trackpad).'
  },
  ethics: {
    selection:
      'You are invited to take part in this research study. The research study aims to investigate how people process rapidly presented images, including unpleasant ones. You have been invited because you are a student taking introductory psychology at UNSW.'
  },
  description:
    'If you decide to take part in the research study, you will be asked to view rapid streams of mostly landscape or architectural images. One of these images will be rotated 90 degrees, and your goal will be to identify whether this image was rotated left or right. There will also be some images of people, some of which will be unpleasantly graphic or violent (e.g., depictions of injury, disfigurement, or death; you will have a chance to view samples prior to beginning the experiment and may withdraw at any time). These images will be presented rapidly, at a rate of 10 per second, but you will see them again for a longer duration at the end of the experiment. You will also be asked questions about your emotional style. We don’t expect this research to cause any harm. However, you may skip any or all written or verbal questions if you wish. Please let the researchers know if you need any assistance for any reason.'
}

const karen_honours_welcome_blurb = `"<b>Rapid Target Search</b>" survey is a psychological study investigating how people process rapidly presented images. To participate you will need to be using a computer (with keyboard and mouse/trackpad) and have normal, or corrected to normal, vision.`

let firstWelcomePage = {
  type: 'html-button-response',
  stimulus: function () {
    return (
      '<h1 style="text-align:center;">UNSW Sydney Cognition Lab</h1>' +
      '    <p style="text-align:left;line-height:190%;margin:' +
      mWidth +
      ';"><br>Thank you for applying to participate in this study. ' +
      karen_honours_welcome_blurb +
      'This survey involves the following steps::</p>' +
      '<ol style="text-align:left;line-height:190%;margin:' +
      mWidth +
      ';">' +
      '<li> We ask for your informed consent. Please read the consent form closely – the format of the consent form is a standard university document.<br></li>' +
      '<li>  We will then ask you a series of questions on your emotional style. This section should take about 5 minutes.<br></li>' +
      '<li> Next comes the rapid target search experiment itself. We will explain how to do the task in detail, and this section should take approximately 15 minutes to complete. <br></li>' +



      '<li> Next we will ask you some questions about your experience of the experiment<br></li>' +
      '<li> Finally you will be asked four general demographic questions.<br></li>' +
      '</ol>' +
      '<p style="text-align:left;line-height:190%;margin:' +
      mWidth +
      ';">Please <u>do not</u> use the "back" ' +
      '   button on your browser or close the window until you reach the end of the experiment.' +
      '   This is very likely to break the experiment.' +
      '   However, if something does go wrong, please contact us! When you are ready to begin, click on' +
      '   the "START" button below.<br><br></p>'
    )
  },
  choices: ['<p style="font-size:130%;line-height:0%;"><b>START!</b></p>']
}

let secondWelcomePage = {
  type: 'html-button-response',
  stimulus:
    '<p style="text-align:right;font-size:' +
    smallFontSize +
    ';margin:' +
    mWidth +
    ';margin-top:30px;">Approval No 3671</p>' +
    '		<p style="text-align:center;"><b>THE UNIVERSITY OF NEW SOUTH WALES<br>' +
    '			PARTICIPANT INFORMATION STATEMENT</b><br><br><b>Rapid Target Search</b><br></p>' +
    '			<p style="text-align:left;line-height:120%;font-size:' +
    smallFontSize +
    ';margin:' +
    mWidth +
    ';">' +
    '			<b>1. What is the research study about?</b><br>' +
    '		You are invited to take part in this research study. The research study aims to investigate factors that influence how people process rapidly presented targets. You have been invited because you are a student taking introductory psychology at UNSW and because you completed pre-screening questionnaires at the start of the year.<br><br>' +
    '			<b>2. Who is conducting this research? </b><br>' +
    '		The study is being carried out by the following researchers: Steven Most and Karen Coad, UNSW School of Psychology.<br>' +
    '		Research Funder: This research is not being funded by any outside agency. <br><br>' +
    '			<b>3. Inclusion/Exclusion Criteria </b><br>' +
    '		Before you decide to participate in this research study, you should meet the following criteria:<br>' +
    '			<ul style="text-align:left;line-height:120%;font-size:' +
    smallFontSize +
    '; margin:' +
    mWidth +
    ';">' +
    '			<li>You have normal or corrected to normal, vision</li>' +
    '      <li>Please do NOT participate if you are likely to be upset by graphic or gory images</li>' +
    '			</ul>' +
    '			<p style="text-align:left;line-height:120%;font-size:' +
    smallFontSize +
    ';margin:' +
    mWidth +
    ';">' +
    '			<b>4. Do I have to take part in this research study?</b><br>' +
    '		Participation in this research study is voluntary. If you do not want to take part, you do not have to. If you decide to take part and later change your mind, you are free to withdraw from the study at any stage (See Item 11).' +
    '			<p style="text-align:left;line-height:120%;font-size:' +
    smallFontSize +
    ';margin:' +
    mWidth +
    ';">' +
    '			<b>5. What does participation in this research require, and are there any risks involved?</b><br>' +
    '		If you decide to take part in the research study, you will be asked to view rapid streams of images, which will mostly be landscape or architectural images. In each stream of images there will be one image rotated 90 degrees and your aim will be to identify whether this image was rotated left or right. Image streams may also include images of people or animals. All images will be presented rapidly at a rate of 10 per second, and you will have opportunity to view the people and animal images for a longer duration at the end of the experiment. At the completion of the study you will be asked to answer questions related to your experience during the experiment and about your emotional style. <br><br> We do not expect this research to cause any harm. However, you may skip any or all written or verbal questions if you wish.  Please let the researchers know if you need any assistance for any reason.<br><br>' +
    '	<b>6. Total participation time </b><br>' +
    '		In total, participation in this study will require 30 minutes online. <br><br>' +
    '	<b>7. Recompense to participants </b><br>' +
    '		You will receive 0.5 SONA credits as recompense for your participation.<br><br>' +
    '	<b>8. What are the possible benefits to participation?</b><br>' +
    '		We cannot promise that you will receive any benefits from this study, but we hope to use the findings from this study to build on previous research exploring how different groups of people process visual information. <br><br>' +
    '	<b>9. What will happen to information about me?</b><br>' +
    "		The information that you give us will be kept indefinitely after the project’s completion.  We will store information about you in a non-identifiable format on a password-protected server at UNSW’s School of Psychology. <br><br>" +
    '		Researchers at UNSW are requested to store their aggregated research data in the UNSW data repository, this is a system called ResData. Once the aggregated data are deposited into this repository, they will be retained in this system permanently, but in a format where your data will not be individually identifiable. The aggregated, de-identified data may also be posted on a public repository that enables researchers from different labs to verify each other’s analyses. <br><br>' +
    '		Your information will be used for an Honours thesis. The data may also be reported at professional conferences and in journal articles. In all cases data will be de-identified and reported in aggregate form. <br><br>' +
    '	<b>10. How and when will I find out what the results of the research study are?</b><br>' +
    '		The research team intend to publish and/or report the results of the research study in a variety of ways. All information published will be done in a way that will not identify you. If you would like to receive a copy of the results you can let the research team know by contacting lead investigator A/Prof Steven Most at s.most@unsw.edu.au<br><br>' +
    '	<b>11. What if I want to withdraw from the research study?</b><br>' +
    '		If you do consent to participate, you may withdraw at any time. You can do this by closing the browser window. If you withdraw from the research, we will destroy any information that has already been collected. Once you have submitted the questionnaire however, we will not be able to withdraw your responses as the questionnaire is anonymous. <br><br>' +
    '		Your decision not to participate or to withdraw from the study will not affect your relationship with UNSW. If you decide to withdraw from the research study, the researchers will not collect additional information from you. Any identifiable information about you will be withdrawn from the research project. <br><br>' +
    '	<b>12. What should I do if I have further questions about my involvement in the study? </b><br>' +
    '		If you require further information regarding this study or if you have any problems that may be related to your involvement in the study, you can contact the following member/s of the research team:' +
    '			<ul style="text-align:left;line-height:120%;font-size:' +
    smallFontSize +
    '; margin:' +
    mWidth +
    ';">' +
    '			<li>A/Prof Steven Most (s.most@unsw.edu.au)</li></ul>' +
    '	<p style="text-align:left;line-height:120%;font-size:' +
    smallFontSize +
    ';margin:' +
    mWidth +
    ';">' +
    '	<b> Contact for feelings of distress </b><br>' +
    '	The NHS provides links and contact information for a number of free mental health resources, including 24-hour advice and support and free listening services.' +
    ' These can be found at the following webpage: <a href="https://www.nhs.uk/nhs-services/mental-health-services/"target="_blank"> NHS Support Services </a>' +
    '			<p style="text-align:left;line-height:120%;font-size:' +
    smallFontSize +
    ';margin:' +
    mWidth +
    ';">' +
    '	<b>13. What if I have a complaint or concerns about the research study?</b><br>' +
    '		If you have a complaint regarding any aspect of the study or the way it is being conducted, please contact the UNSW Human Ethics Coordinator:' +
    '	<ul style="text-align:left;line-height:120%;font-size:' +
    smallFontSize +
    '; margin:' +
    mWidth +
    ';">' +
    '			<li>Phone number: 0293856222</li>' +
    '			<li>Email: humanethics@unsw.edu.au</li>' +
    '			<li>Reference Number: 3671</li>' +
    '		</ul>' +
    '			Please keep a copy of this information sheet (you can download the pdf <a href="../resources/pdfs/consent.pdf" download>here</a>).<br>' +
    '			<br>' +
    '			<p style="text-align:center;"><b>PARTICIPANT CONSENT</b></p>' +
    '			<p style="text-align:left;font-size:' +
    smallFontSize +
    ';margin:' +
    mWidth +
    ';">By continuing, you are making a decision whether or not to participate.  Clicking the button below indicates that, having read the information provided on the participant information sheet, you have decided to participate.<br><br></p>',
  choices: ['<p style="font-size:130%;line-height:0%;"><b>I agree!</b></p>'],
  prompt:
    '<p style="text-align:left;font-size:' +
    smallFontSize +
    ';margin:' +
    mWidth +
    ';"><br>Please close the browser window if you do not wish to participate.<br><br></p>'
}

export { firstWelcomePage as welcome1, secondWelcomePage as welcome2 }
