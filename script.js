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
    generateArray(Number(sizeSlider.value));
});

sizeSlider.addEventListener("input", () => {
    generateArray(Number(sizeSlider.value));
});

generateArray(30);