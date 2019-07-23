
const uploadButton = document.getElementById('browse-btn');
const realInput = document.getElementById('real-input');
const mainPage = document.getElementById('mainPage');
const selectButton = document.getElementById('selectButton');
const cropButton = document.getElementById('cropButton');



let imageElement;
//static definition
let SELECTBUTTON = 0;
let CROPBUTTON = 1;
let buttonState = []; // array of booleans

uploadButton.addEventListener('click', (e) => {
    realInput.click();
});

realInput.addEventListener('change', () => {

    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();
    reader.addEventListener("load", () => loadImage(reader), false);

    if (file) { reader.readAsDataURL(file); }

});

function hideButton() {
    uploadButton.style.display = "none";
}
function constructImage(src) {
    var imgElement = document.createElement('img');
    imgElement.src = src;
    imgElement.alt = "source image";
    return imgElement;
}

function initButtonState() {
    buttonState[SELECTBUTTON] = false;
    buttonState[CROPBUTTON] = false;
}


function initToolbar() {



    selectButton.style.background = "#4ec0b4"; // set to selected initialy
    buttonState[SELECTBUTTON] = true;
    selectButton.disabled = false;
    cropButton.disabled = false;
  
    selectButton.addEventListener('click', (e) => selectHandler(e))
    cropButton.addEventListener('click', (e) => cropHandler(e))
}
function loadImage(rd) {
    hideButton();
    let img = constructImage(rd.result);
    img.style.width = "800px";
    img.id = "srcImage";
    mainPage.appendChild(img);
    imageElement = img;
    imageElement.addEventListener('click',() => imageClickHandler())
    initToolbar();

}

function selectHandler(e){
    if (!buttonState[SELECTBUTTON]) {
        if(buttonState[CROPBUTTON]){
            buttonState[CROPBUTTON]= false; 
            cropButton.style.background = '#F8F9FA';
        }
            
        buttonState[SELECTBUTTON] = true;
        selectButton.style.background = "#4ec0b4";
    }
    else {
        buttonState[SELECTBUTTON] = false;
        selectButton.style.background = "#F8F9FA"
    }
}

function cropHandler(e){
    let img = getImageElement();
    if (!buttonState[CROPBUTTON]) {
        if(buttonState[SELECTBUTTON]){
            buttonState[SELECTBUTTON]= false; 
            selectButton.style.background = '#ffffff';
        }
            
        buttonState[CROPBUTTON] = true;
        cropButton.style.background = "#4ec0b4";
        
        img.style.cursor = "crosshair"
    }
    else {
        buttonState[CROPBUTTON] = false;
        cropButton.style.background = "#ffffff"
        img.style.cursor = ""
    }
}

function imageClickHandler(){
    
}

function getImageElement(){
    if(imageElement)
        return imageElement
    else
        return document.getElementById('srcImage')
}
