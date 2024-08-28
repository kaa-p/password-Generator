
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const inputSlider = document.querySelector("[data-lengthSlider]"); 
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".GenerateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 4;
let checkCount = 0;
handleSlider();

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
}

function getRndInteger(min,max) {
    return Math.floor(Math.random() * (max-min)) + min ;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol() {
    const symbols = "!@#$%^&*()_+=-{}[]|\\:;\"'<>,.?/";
    const randNum = getRndInteger(0, symbols.length );
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNumber = numbersCheck.checked;
    let hasSymbol = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value || passwordDisplay.innerText);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    }, 2000);
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

function shufflePassword(array){
    for(let i = array.length - 1; i >=0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value || passwordDisplay.innerText) {
        copyContent();
    }
});

generateBtn.addEventListener('click', () => {
    if (checkCount <= 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    let funcArr = [];

    if (uppercaseCheck.checked){
        console.log("adding upper")
     funcArr.push(generateUpperCase);
    }

     if (lowercaseCheck.checked)
        {
            console.log("Adding generateLowerCase to funcArr");
            funcArr.push(generateLowerCase);
        }
        if (numbersCheck.checked) {
            console.log("Adding generateRandomNumber to funcArr");
            funcArr.push(generateRandomNumber);
        }
        if (symbolsCheck.checked){
            console.log("Adding generateSymbol to funcArr");
            funcArr.push(generateSymbol);
        }
    // Reset password
    password = "";
    
    // Compulsory addition
    console.log("funcArr after setup:", funcArr);
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        console.log("randIndex:", randIndex, "Function:", funcArr[randIndex]);
       if(typeof funcArr[randIndex] === 'function'){
        password += funcArr[randIndex]();   
    }else{
        console.error("Error: funcArr[randIndex] is not a function", funcArr[randIndex]);
        }
    }
   

    // Shuffle and display password
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;

    // Calculate password strength
    calcStrength();
});

