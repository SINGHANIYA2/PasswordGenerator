const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercasecheck = document.querySelector("#uppercase");
const lowercasecheck = document.querySelector("#lowercase");
const numberscheck = document.querySelector("#Numbers");
const symbolscheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");
const generatbtn = document.querySelector("[Generate-Password]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]")
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = ""
let passwordlength = 10
let checkcount = 1
// initial indicator - gray

handleSlider();


// handling slider -> set password length
function handleSlider(){
    inputSlider.value = passwordlength;
    lengthDisplay.innerText = passwordlength;

    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = ((passwordlength - min)*100/(max-min)) + "% 100%";

}

function setindicator(color){
    indicator.style.backgroundColor = color
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}

function getRdnInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}
function generateRandomNumber(){
    return getRdnInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRdnInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRdnInteger(65,91));
}

function generateSymbol(){
    const randNum = getRdnInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function Calculatestrength(){
    let hasUppercase = false;
    let hasLowercase = false;
    let hasSymbol = false;
    let hasNumber = false;
    
    if(uppercasecheck.checked) hasUppercase = true;
    if(lowercasecheck.checked) hasLowercase = true;
    if(numberscheck.checked) hasNumber = true;
    if(symbolscheck.checked) hasSymbol = true;
    
     if (hasUppercase && hasLowercase && (hasNumber || hasSymbol) && passwordlength >= 8) {
        setindicator("#0f0");
    } 
    else if ((hasLowercase || hasUppercase) && (hasNumber || hasSymbol) && passwordlength >= 6) {
        setindicator("#ff0");
    } 
    else {
        setindicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }catch(e){
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active");
    
    setTimeout(() =>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    // Fisher yates method
    for(let i = array.length-1;i > 0;i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((ele) => (str += ele));
    return str;

}

function handlecheckbox() {
    checkcount = 0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked) checkcount++;
    })
    if(passwordlength < checkcount){
        passwordlength = checkcount;
        handleSlider();
    }
}

let chars = [];
function generate(){
    let index = Math.floor(getRdnInteger(0,chars.length));
    let ind = chars[index];
    if(ind == 1){
        return generateLowerCase();
    }
    else if(ind == 0) return generateUpperCase();
    else if(ind == 3) return generateSymbol();
    return generateRandomNumber();
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handlecheckbox);
})

inputSlider.addEventListener('input',(e)=>{
    passwordlength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',() =>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generatbtn.addEventListener('click',() =>{
    if(checkcount == 0) {
        alert("Tick the minimum of 1 checkbox");
        handleSlider();
    }

    if(passwordlength < checkcount){
        passwordlength = checkcount;
        handleSlider();
    }

    // remove old password
    password = "";

    let functArr = [];
    if(uppercasecheck.checked){
        functArr.push(generateUpperCase());
        chars.push(0);
    }
    if(lowercasecheck.checked){
        functArr.push(generateLowerCase());
        chars.push(1);
    }
    if(numberscheck.checked){
        functArr.push(generateRandomNumber());
        chars.push(2);
    }
    if(symbolscheck.checked){
        functArr.push(generateSymbol());
        chars.push(2);
    }

    console.log('creating password');
    // compulsory addition
    for(let i = 0;i < functArr.length;i++) {
        password += functArr[i];
    }

    for(let i = 0;i < passwordlength - checkcount;i++){
        password += generate();
    }

    // shuffle
    console.log('shuffling password');
    password = shufflePassword(Array.from(password));
    // display in ui
    console.log('displaying password');
    
    passwordDisplay.value = password;

    // calculate strength
    Calculatestrength();
})
