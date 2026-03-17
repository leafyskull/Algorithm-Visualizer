// Script.js: This holds the logic for sorting and animations.



// ******************************
// References / setup
// ******************************

const arrayContainer = document.getElementById("arrayContainer");
const generateBtn = document.getElementById("generateBtn");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const sizeSlider = document.getElementById("sizeSlider");
const speedSlider = document.getElementById("speedSlider");
const algorithmSelect = document.getElementById("algorithmSelect");

let array = [];

let audioCtx = null;

let isFirstRun = true;

async function initAudio(){
    if (!audioCtx){
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === "suspended") {
        await audioCtx.resume();
    }
}

// ******************************
// Array handlers
// ******************************

function generateArray(size){
    array = [];

    for (let i = 0; i < size; i++){
        const randomValue = Math.floor((Math.random() * 350) + 20);
        array.push(randomValue);
    }

    renderArray();
}

function renderArray(){
    arrayContainer.innerHTML = "";

    const barWidth = Math.max(4, Math.floor(800 / array.length));

    for (let value of array){
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value}px`;
        bar.style.width = `${barWidth}px`;
        arrayContainer.appendChild(bar);
    }
}



// ******************************
// Button Event Listeners
// ******************************

generateBtn.addEventListener("click", () =>{
    if (isSorting) return;
    generateArray(Number(sizeSlider.value));
});

sizeSlider.addEventListener("input", () => {
    if (isSorting) return;
    generateArray(Number(sizeSlider.value));
});

startBtn.addEventListener("click", async () => {
    if (isSorting) return;

    await initAudio();
    isSorting = true;
    stopAnimation = false;

    const algorithm = algorithmSelect.value;
    let animations = [];

    if (algorithm === "bubble"){
        animations = getBubbleSortAnimations(array);
    }

    if (algorithm === "selection"){
        animations = getSelectionSortAnimations(array);
    }

    if (algorithm === "insertion"){
        animations = getInsertionSortAnimations(array);
    }

    await playAnimations(animations);

    if (stopAnimation){
        isSorting = false;
        stopAnimation = false;
        return;
    }

    await colorSortedBars();

    if (!stopAnimation){
        await playFinalSweep();
    }

    if (stopAnimation){
        stopAnimation = false;
    }

    isSorting = false;
});

stopBtn.addEventListener("click", async () =>{
    stopAnimation = true;
    isFirstRun = false;
});

// if (audioUpload) {
//     audioUpload.addEventListener("change", (event) => {
//         const file = event.target.files[0];
//         if (!file) return;

//         if (soundURL) {
//             URL.revokeObjectURL(soundURL);
//         }

//         soundURL = URL.createObjectURL(file);
//         soundEffect = new Audio(soundURL);
//         soundEffect.volume = 0.2;
//         soundEffect.load();
//     });
// }



// ******************************
// Sorting algorithms
// ******************************

function getBubbleSortAnimations(arr){
    const animations = [];
    const copy = [...arr];

    for (let i = 0; i < copy.length - 1; i++){
        for (let j = 0; j < copy.length - i - 1; j++){
            animations.push({ type: "compare", i: j, j: j + 1});

            if (copy[j] > copy[j + 1]){
                animations.push({ type: "swap", i: j, j: j + 1});

                let temp = copy[j];
                copy[j] = copy[j+1];
                copy[j+1] = temp;
            }
        }

        animations.push({ type: "sorted", index: copy.length - i - 1});
    }

    animations.push({ type: "sorted", index: 0});
    return animations;
}

function getSelectionSortAnimations(arr){
    const animations = [];
    const copy = [...arr];

    for (let i = 0; i < copy.length - 1; i++){
        let min_index = i;

        for (let j = i + 1; j < copy.length; j++){
            animations.push({ type: "compare", i: min_index, j: j});

            if (copy[j] < copy[min_index]){
                min_index = j;
            }
        }

        if (min_index !== i){
            animations.push({ type: "swap", i: i, j: min_index});
            let temp = copy[i];
            copy[i] = copy[min_index];
            copy[min_index] = temp;
        }

        animations.push({ type: "sorted", index: i});
    }

    animations.push({ type: "sorted", index: copy.length - 1});
    return animations;
}

// ******************************
// getInsertionSortAnimations(): This will generate the animations
// for the insertion sort algorithm.
//
// arr: Array of 
// ******************************
function getInsertionSortAnimations(arr){
    const animations = [];
    const copy = [...arr];

    for (let i = 1; i < copy.length; i++){
        let j = i;

        while (j > 0){
            animations.push({ type: "compare", i: j - 1, j: j});

            if (copy[j-1] > copy[j]){
                animations.push({ type: "swap", i: j - 1, j: j});

                let temp = copy[j];
                copy[j] = copy[j-1];
                copy[j-1] = temp;

                j--;
            } else {
                break;
            }
        }

        animations.push({ type: "sorted", index: i});
    }

    return animations;
}



// ******************************
// Animation stuff
// ******************************

// ******************************
// playAnimations(): Will handle comparing, sorting, and swapping
// animations for a given sort.
//
// animations: The animations to do, decided by the sorting type.
// ******************************
async function playAnimations(animations){
    const bars = document.getElementsByClassName("bar");
    let speed = 101 - Number(speedSlider.value);
    const sortedIndices = new Set();

    for (let bar of bars){
        bar.style.backgroundColor = "steelblue";
    }

    for (let step of animations){

        if (stopAnimation){
            return;
        }

        speed = 101 - Number(speedSlider.value);

        if (step.type === "compare"){
            bars[step.i].style.backgroundColor = "red";
            bars[step.j].style.backgroundColor = "red";

            // if (soundEffect === null){
            playTone(array[step.i]);
            playTone(array[step.j]);
            // } else{
            //     playUploadedSound();
            // }

            await sleep(speed * 2);

            if (!sortedIndices.has(step.i)){
                bars[step.i].style.backgroundColor = "steelblue";
            } else {
                bars[step.i].style.backgroundColor = "#89eb34";
            }

            if (!sortedIndices.has(step.j)){
                bars[step.j].style.backgroundColor = "steelblue";
            } else {
                bars[step.j].style.backgroundColor = "#89eb34";
            }
        }

        if (step.type === "swap"){

            // if (soundEffect === null){
            playTone(array[step.i]);
            // } else{
            //     playUploadedSound();
            // }

            // Swap visual heights
            const tempHeight = bars[step.i].style.height;
            bars[step.i].style.height = bars[step.j].style.height;
            bars[step.j].style.height = tempHeight;

            // Swap actual values in array
            const temp = array[step.i];
            array[step.i] = array[step.j];
            array[step.j] = temp;

            await sleep(speed * 2);
        }

        if (step.type === "sorted"){
            sortedIndices.add(step.index);
            bars[step.index].style.backgroundColor = "#89eb34";
        }
    }
}

async function playFinalSweep() {
    const bars = document.getElementsByClassName("bar");
    const highlightColor = "#facc15"; // yellow
    const sortedColor = "#89eb34";

    for (let i = 0; i < bars.length; i++) {
        if (stopAnimation) return;

        bars[i].style.backgroundColor = highlightColor;

        // if (soundEffect === null) {
        playTone(array[i]);
        // } else {
        //     playUploadedSound(array[i]);
        // }

        await sleep(20);

        bars[i].style.backgroundColor = sortedColor;
    }
}

// ******************************
// ColorSortedBars(): This will color the bars green after
// they have all been sorted.
// ******************************
async function colorSortedBars(){
    const bars = document.getElementsByClassName("bar");

    for (let i = 0; i < bars.length; i++){
        if (stopAnimation) return;

        bars[i].style.backgroundColor = "#89eb34";
        await sleep(10);
    }
}



// ******************************
// Misc
// ******************************

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}



// ******************************
// Audio
// ******************************

function playTone(value) {
    if (!audioCtx) return;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine";

    // Map bar height to pitch
    oscillator.frequency.value = 100 + value * 2;

    gainNode.gain.value = 0.05;

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.02);
}

// function playUploadedSound() {
//     if (!soundEffect) return;

//     const sfx = soundEffect.cloneNode();
//     sfx.volume = 0.2;

//     // Optional: speed up sound when animation speed increases
//     sfx.playbackRate = 0.5 + (Number(speedSlider.value) / 100) * 2;

//     sfx.play().catch(() => {});
// }




// ******************************
// Initialization stuff
// ******************************

let isSorting = false;
let stopAnimation = false;
generateArray(30);
