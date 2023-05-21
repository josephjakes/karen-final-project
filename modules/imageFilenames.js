let numNegImages = 37
let imageFilenames = [];

let previewNegFilenames = []
for (let i = 0; i < 4; i++) {
  previewNegFilenames[i] = 'images/distractors/Samples/sample_' + i + '.jpg'
}
imageFilenames = imageFilenames.concat(previewNegFilenames)
console.log(previewNegFilenames)

let previewPositiveFilenames = [];
for (let i = 0; i < 4; i++) {
    previewPositiveFilenames[i] =
        'images/distractors/Samples/sample_' + i + '.jpg';
}
imageFilenames = imageFilenames.concat(previewPositiveFilenames);
console.log(previewPositiveFilenames);

let positiveFileNames = [];
for (let i = 0; i < numNegImages; i++) {
    positiveFileNames[i] = 'images/distractors/Negative/neg_' + i + '.jpg';
}

let numStandardImages = 251

imageFilenames = imageFilenames.concat(positiveFileNames);
let neutFilenames = [];
let numNeutImages = 37 
for (let i = 0; i < numNeutImages; i++) {
    neutFilenames[i] = 'images/distractors/Neutral/neut_' + i + '.jpg';
}
imageFilenames = imageFilenames.concat(neutFilenames);


// let standardFilenames = [];
// for (let i = 0; i < numStandardImages; i++) {
//     standardFilenames[i] = 'images/standards/standard' + i + '.jpg';
// }

let standardFilenames = [];
for (let i = 0; i < numStandardImages; i++) {
    standardFilenames[i] = 'images/standards/standard.jpg';
}


imageFilenames = imageFilenames.concat(standardFilenames);
let target0Filenames = [];
let numTargetImages = 120 // 120 images, each in left and right configurations
for (let i = 0; i < numTargetImages; i++) {
    target0Filenames[i] = 'images/targets/target' + i + '_0.jpg';
}
imageFilenames = imageFilenames.concat(target0Filenames);
let target1Filenames = [];
for (let i = 0; i < numTargetImages; i++) {
    target1Filenames[i] = 'images/targets/target' + i + '_1.jpg';
}
imageFilenames = imageFilenames.concat(target1Filenames);
imageFilenames = imageFilenames.concat('images/target_example_white.jpg');



export { imageFilenames, previewPositiveFilenames, positiveFileNames, neutFilenames, previewNegFilenames, standardFilenames, target0Filenames, target1Filenames }