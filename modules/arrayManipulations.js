function shuffleArray (myArray) {
  let randNum, tempStore, j
  for (j = myArray.length; j; j--) {
    randNum = Math.floor(Math.random() * j)
    tempStore = myArray[j - 1]
    myArray[j - 1] = myArray[randNum]
    myArray[randNum] = tempStore
  }
}

function sampleArray (myArray) {
  return myArray[Math.floor(Math.random() * myArray.length)]
}

export { shuffleArray, sampleArray }