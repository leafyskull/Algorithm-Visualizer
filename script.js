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

    if (stopAnimation){
        stopAnimation = false;
    }

    isSorting = false;
});

stopBtn.addEventListener("click", async () =>{
    stopAnimation = true;
});



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

            await sleep(speed * 2);

            if (!sortedIndices.has(step.i)){
                bars[step.i].style.backgroundColor = "steelblue";
            } else {
                bars[step.i].style.backgroundColor = "green";
            }

            if (!sortedIndices.has(step.j)){
                bars[step.j].style.backgroundColor = "steelblue";
            } else {
                bars[step.j].style.backgroundColor = "green";
            }
        }

        if (step.type === "swap"){
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
            bars[step.index].style.backgroundColor = "green";
        }
    }
}

async function colorSortedBars(){
    const bars = document.getElementsByClassName("bar");

    for (let i = 0; i < bars.length; i++){
        if (stopAnimation) return;

        bars[i].style.backgroundColor = "green";
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
// Initialization stuff
// ******************************

let isSorting = false;
let stopAnimation = false;
generateArray(30);
