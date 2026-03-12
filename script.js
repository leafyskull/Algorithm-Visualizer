const arrayContainer = document.getElementById("arrayContainer");
const generateBtn = document.getElementById("generateBtn");
const startBtn = document.getElementById("startBtn");
const sizeSlider = document.getElementById("sizeSlider");
const speedSlider = document.getElementById("speedSlider");
const algorithmSelect = document.getElementById("algorithmSelect");

let array = [];

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

generateBtn.addEventListener("click", () =>{
    if (isSorting) return;
    generateArray(Number(sizeSlider.value));
});

sizeSlider.addEventListener("input", () => {
    if (isSorting) return;
    generateArray(Number(sizeSlider.value));
});

generateArray(30);




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
    }

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
    }

    return animations;
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function playAnimations(animations){
    const bars = document.getElementsByClassName("bar");
    const speed = 101 - Number(speedSlider.value);

    for (let step of animations){
        if (step.type === "compare"){
            bars[step.i].style.backgroundColor = "red";
            bars[step.j].style.backgroundColor = "red";

            await sleep(speed * 2);

            bars[step.i].style.backgroundColor = "steelBlue";
            bars[step.j].style.backgroundColor = "steelBlue";
        }

        if (step.type === "swap"){
            const tempHeight = bars[step.i].style.height;
            bars[step.i].style.height = bars[step.j].style.height;
            bars[step.j].style.height = tempHeight;

            await sleep(speed * 2);
        }
    }
}

async function colorSortedBars(){
    const bars = document.getElementsByClassName("bar");

    for (let i = 0; i < bars.length; i++){
        bars[i].style.backgroundColor = "green";
        await sleep(10);
    }
}

startBtn.addEventListener("click", async () => {
    if (isSorting) return;

    isSorting = true;

    const algorithm = algorithmSelect.value;
    let animations = [];

    if (algorithm === "bubble"){
        animations = getBubbleSortAnimations(array);
    }

    if (algorithm === "selection"){
        animations = getSelectionSortAnimations(array);
    }

    await playAnimations(animations);
    array.sort((a, b) => a - b);

    colorSortedBars();
    isSorting = false;
});

let isSorting = false;

