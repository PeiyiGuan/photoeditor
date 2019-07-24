
const uploadButton = document.getElementById('browse-btn');
const realInput = document.getElementById('real-input');
const mainPage = document.getElementById('mainPage');
const selectButton = document.getElementById('selectButton');
const cropButton = document.getElementById('cropButton');
var selectionDottedLine = document.getElementById('dottedSelection')

// import Cropper from 'cropperjs';
//


const colorWheel = document.getElementById('color-wheel');
const colorBucket = document.getElementById('color-bucket');
const textButton = document.getElementById('textButton');
const editPen = document.getElementById('edit-pen');



const editLayer = document.getElementById('edit-layer');
const editEraser = document.getElementById('edit-eraser');

//


const colorChosen = document.getElementById('chosen-value');

//

let cropper;
let imageElement;
//static definition
let SELECTBUTTON = 0;
let CROPBUTTON = 1;
let COLORBUCKET = 2;
let COLORWHEEL = 3;
let buttonState = []; // array of booleans
let enableSelectionLine = true;
let enableCropLine = true;
let colorWheelEnabled = false;

let s_x1 = 0, s_y1 = 0, s_x2 = 0, s_y2 = 0;
let c_x1 = 0, c_y1 = 0, c_x2 = 0, c_y2 = 0;


let setColor;






function init() {
    uploadButton.addEventListener('click', (e) => {
        realInput.click();
    });

    realInput.addEventListener('change', () => {

        var file = document.querySelector('input[type=file]').files[0];
        var reader = new FileReader();
        reader.addEventListener("load", () => loadImage(reader), false);

        if (file) { reader.readAsDataURL(file); }

    });


}

function loadImage(rd) {
    uploadButton.style.display = "none";
    let img = constructImage(rd.result);
    img.style.width = "800px";
    img.id = "srcImage";
    mainPage.appendChild(img);
    imageElement = img;
    imageElement.addEventListener('click', () => imageClickHandler())
    buildToolbar();
    initButtonState();

}

function imageClickHandler() { }


function initButtonState() {
    buttonState[SELECTBUTTON] = false;
    buttonState[CROPBUTTON] = false;
}


function buildToolbar() {
    selectButton.style.background = "#4ec0b4"; // set to selected initialy

    selectButton.disabled = false;
    cropButton.disabled = false;
    colorWheel.disabled = false;
    colorBucket.disabled = false;
    textButton.disabled = false;
    editPen.disabled = false;
    editLayer.disabled = false;
    editEraser.disabled = false;

    selectButton.addEventListener('click', (e) => selectHandler(e))
    cropButton.addEventListener('click', (e) => cropHandler(e))
    colorBucket.addEventListener('click', (e) => colorBucketHandler(e))
    colorWheel.addEventListener('click', (e) => colorWheelHandler(e))


    setupSelection();
}

function setupSelection() {
    imageElement.addEventListener('mousedown', (e) => {

        selectionDottedLine.hidden = 0;
        s_x1 = e.clientX;
        s_y1 = e.clientY;

    });
    imageElement.addEventListener('mousemove', (e) => {


        if (enableSelectionLine) {
            s_x2 = e.clientX;
            s_y2 = e.clientY;
            reCalc(selectionDottedLine, s_x1, s_x2, s_y1, s_y2);
        }
    })
    imageElement.addEventListener('mouseup', (e) => {
        enableSelectionLine = false;

        //selectionDottedLine.hidden;
        // switchImageSrc("file:///C:/Users/peiyi/Desktop/summer%202019/eecs3461/assignement3/photoeditor/assets/image/dogie_select.jpg")
    })

}


function selectHandler(e) {
    enableLine = false;

    let img = getImageElement();
    img.style.cursor = ""
    if (!buttonState[SELECTBUTTON]) {
        if (buttonState[CROPBUTTON]) {
            buttonState[CROPBUTTON] = false;
            cropButton.style.background = '#F8F9FA';
        }

        buttonState[SELECTBUTTON] = true;
        selectButton.style.background = "#4ec0b4";
        //enable selection
        enableLine = true;

    }
    else {
        buttonState[SELECTBUTTON] = false;
        selectButton.style.background = "#F8F9FA"
        // disable 
        enableLine = false;
    }
}

function cropHandler(e) {
    selectButton.style.background = '#F8F9FA';
    buttonState[SELECTBUTTON] = false;
    if (!buttonState[CROPBUTTON]) {
        buttonState[CROPBUTTON] = true;
        cropButton.style.background = "#4ec0b4";
        //enable selection

        cropper = new Cropper(imageElement, {
            aspectRatio: 16 / 9,
            crop(event) {
                console.log(event.detail.x);
                console.log(event.detail.y);
                console.log(event.detail.width);
                console.log(event.detail.height);
                console.log(event.detail.rotate);
                console.log(event.detail.scaleX);
                console.log(event.detail.scaleY);
            },
        });


    }
    else {
        buttonState[CROPBUTTON] = false;
        cropButton.style.background = "#F8F9FA"
        imageElement.style.cursor = ""
        let src = cropper.getCroppedCanvas().toDataURL();
        cropper.destroy()
        let newImage = constructImage(src);
        imageElement.src = src;


    }
}

function colorWheelHandler(e) {
    if (!buttonState[COLORWHEEL]) {
        colorChosen.jscolor.show();
        colorChosen.jscolor.position = "right";
        buttonState[COLORWHEEL] = true;
        colorWheel.style.background = "#4ec0b4";

    } else {
        colorChosen.jscolor.hide();
        buttonState[COLORWHEEL] = false;
        colorWheel.style.background = "#F8F9FA";
    }

}




function colorBucketHandler(e) {
    //switch to colored picture
    // if(!buttonState[COLORBUCKET]){
    //     buttonState[COLORBUCKET] = true;
    //     colorBucket.style.background = "#4ec0b4";

    // }else{
    //     buttonState[COLORBUCKET] = false;
    //     colorBucket.style.background = "#F8F9FA";

    // }
    setColor = colorChosen.value;
    selectionDottedLine.style.background = "#" + setColor;
    // switchImageSrc("")
}




function getImageElement() {
    if (imageElement)
        return imageElement
    else
        return document.getElementById('srcImage')
}



function switchImageSrc(path) {
    imageElement.src = path;
}


function reCalc(dragline, x1, x2, y1, y2) {
    var x3 = Math.min(x1, x2);
    var x4 = Math.max(x1, x2);
    var y3 = Math.min(y1, y2);
    var y4 = Math.max(y1, y2);
    dragline.style.left = x3 + 'px';
    dragline.style.top = y3 + 'px';
    dragline.style.width = x4 - x3 + 'px';
    dragline.style.height = y4 - y3 + 'px';
}


function constructImage(src) {
    var imgElement = document.createElement('img');
    imgElement.src = src;
    imgElement.alt = "source image";
    return imgElement;
}


window.onload = init();