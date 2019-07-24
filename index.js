
const uploadButton = document.getElementById('browse-btn');
const realInput = document.getElementById('real-input');
const mainPage = document.getElementById('mainPage');
const selectButton = document.getElementById('selectButton');
const cropButton = document.getElementById('cropButton');
var selectionDottedLine = document.getElementById('dottedSelection')

const fontEditor = document.getElementById('toolbar-container');
const fontSelected = document.getElementById('fontVal');
const fontSize = document.getElementById('fontSize');
const penSize = document.getElementById('penSize');
const layers = document.getElementById('layers');
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

const textBlock = document.getElementById('text-block');
const textContent = document.getElementById('text-content')

//
// var canvas = document.getElementById('mycanvas');
// var ctx = canvas.getContext("2d")


// Add fonts to whitelist
var Font = Quill.import('formats/font');
// We do not add Aref Ruqaa since it is the default
Font.whitelist = ['mirza', 'roboto'];
Quill.register(Font, true);


let cropper, quill;
let canvas;
let imageElement;
let context;
//static definition
let SELECTBUTTON = 0;
let CROPBUTTON = 1;
let COLORBUCKET = 2;
let COLORWHEEL = 3;
let TEXTBUTTON = 4;
let EDITPEN = 5;
let ERASER = 6;
let buttonState = []; // array of booleans
let enableSelectionLine = false;
let enableCropLine = true;
let colorWheelEnabled = false;
let drawingModeEnabled = false;
let eraseModeEnabled = false;

let s_x1 = 0, s_y1 = 0, s_x2 = 0, s_y2 = 0;
let c_x1 = 0, c_y1 = 0, c_x2 = 0, c_y2 = 0;


let setColor;

let strokeColor;


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
    imgChange(rd.result);
    buildToolbar();
    initButtonState();

}

function imageClickHandler() { }


function initButtonState() {
    buttonState[SELECTBUTTON] = false;
    buttonState[CROPBUTTON] = false;
    buttonState[TEXTBUTTON] = false;
    buttonState[EDITPEN] = false;
    buttonState[ERASER] = false;
}


function buildToolbar() {
    //  selectButton.style.background = "#4ec0b4"; // set to selected initialy

    selectButton.disabled = false;
    cropButton.disabled = false;
    colorWheel.disabled = false;
    colorBucket.disabled = false;
    textButton.disabled = false;
    editPen.disabled = false;
    editLayer.disabled = false;
    editEraser.disabled = false;
    penSize.disabled = false;
    layers.disabled = false;
    selectButton.addEventListener('click', (e) => selectHandler(e))
    cropButton.addEventListener('click', (e) => cropHandler(e))
    colorBucket.addEventListener('click', (e) => colorBucketHandler(e))
    colorWheel.addEventListener('click', (e) => colorWheelHandler(e))
    textButton.addEventListener('click', (e) => textButtonHanlder(e))
    imageElement.addEventListener('click', (e) => imageClickHandler(e))
    imageElement.addEventListener('dblclick', (e) => imagedbClickHandler(e))
    fontSelected.addEventListener('change', (e) => {
        textContent.style.fontStyle = `${fontSelected.value}`;
    })
    fontSize.addEventListener('change', (e) => {
        textContent.style.fontSize = `${fontSize.value}pt`;
    })
    editPen.addEventListener('click', editPenHandler)
    editEraser.addEventListener('click', editEraserHandler)
    layers.addEventListener('change',layerHandler);
    setupDrag();
}

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function setupDrag() {
    imageElement.addEventListener('mousedown', (e) => {
        if (enableSelectionLine) {
            selectionDottedLine.hidden = 0;
            s_x1 = e.clientX;
            s_y1 = e.clientY;
        }

        if (drawingModeEnabled || eraseModeEnabled) {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
        }

    });
    imageElement.addEventListener('mousemove', (e) => {
        if (enableSelectionLine) {
            s_x2 = e.clientX;
            s_y2 = e.clientY;
            reCalc(selectionDottedLine, s_x1, s_x2, s_y1, s_y2);
        }
        if (drawingModeEnabled)
            draw(e, false);
        if(eraseModeEnabled)
            draw(e,true)
    })
    imageElement.addEventListener('mouseup', (e) => {
        enableSelectionLine = false;
        isDrawing = false;
    })

    imageElement.addEventListener('mouseout', (e) => {
        enableSelectionLine = false;
        isDrawing = false;
    })


}


let str = "";
function logKey(e) {

    if (e.code == "Enter") {
        document.removeEventListener("keypress", logKey);
        console.log("enter pressed");
    } else {
        str += ` ${e.code}`;
        textContent.innerHTML += `${e.key}`;
    }

}

function imagedbClickHandler(e) {
    //double click write text in

    textBlock.style.left = `${e.clientX}px`;
    textBlock.style.top = `${e.clientY}px`;
    document.addEventListener('keypress', logKey);

}



function selectHandler(e) {
    buttonState[CROPBUTTON] = false;
    buttonState[EDITPEN] = false;
    buttonState[ERASER] = false;

    drawingModeEnabled = false;
    eraseModeEnabled = false;

    editEraser.style.background = '#F8F9FA';
    cropButton.style.background = '#F8F9FA';
    editPen.style.background = '#F8F9FA';

    if (!buttonState[SELECTBUTTON]) {

        buttonState[SELECTBUTTON] = true;
        selectButton.style.background = "#4ec0b4";
        //enable selection
        enableSelectionLine = true;

    }
    else {
        buttonState[SELECTBUTTON] = false;
        selectButton.style.background = "#F8F9FA"
        // disable 
        enableSelectionLine = false;
    }
}

function cropHandler(e) {
    selectButton.style.background = '#F8F9FA';
    buttonState[SELECTBUTTON] = false;
    editPen.style.background = '#F8F9FA';
    editEraser.style.background = '#F8F9FA';
    buttonState[EDITPEN] = false;
    buttonState[ERASER] = false;

    eraseModeEnabled = false;
    drawingModeEnabled = false;
    enableSelectionLine = false;

    if (!buttonState[CROPBUTTON]) {
        buttonState[CROPBUTTON] = true;
        cropButton.style.background = "#4ec0b4";
        //enable selection

        cropper = new Cropper(imageElement, {
            aspectRatio: 16 / 9,
            crop(event) {
                // console.log(event.detail.x);
                // console.log(event.detail.y);
                // console.log(event.detail.width);
                // console.log(event.detail.height);
                // console.log(event.detail.rotate);
                // console.log(event.detail.scaleX);
                // console.log(event.detail.scaleY);
            },
        });


    }
    else {
        buttonState[CROPBUTTON] = false;
        cropButton.style.background = "#F8F9FA"
        imageElement.style.cursor = ""
        let src = cropper.getCroppedCanvas().toDataURL();
        cropper.destroy()
        imgChange(src)


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

function textButtonHanlder(e) {

    if (!buttonState[TEXTBUTTON]) {
        buttonState[TEXTBUTTON] = true;
        textButton.style.background = "#4ec0b4";
        fontEditor.style.display = "block";


    } else {
        buttonState[TEXTBUTTON] = false;
        textButton.style.background = "#F8F9FA";
        fontEditor.style.display = "none";
    }

}


function colorBucketHandler(e) {

    setColor = colorChosen.value;
    selectionDottedLine.style.background = "#" + setColor;

}

function editPenHandler(e) {
    buttonState[CROPBUTTON] = false;
    buttonState[SELECTBUTTON] = false;
    buttonState[ERASER] = false;
    enableSelectionLine = false;
    eraseModeEnabled = false;

    cropButton.style.background = '#F8F9FA';
    selectButton.style.background = '#F8F9FA';
    editEraser.style.background = '#F8F9FA';

    if (!buttonState[EDITPEN]) {
        buttonState[EDITPEN] = true;
        editPen.style.background = '#4ec0b4';
        imageElement.style.cursor = "url('./assets/icon/pen.png')"  // change to pen cursor
        drawingModeEnabled = true;

    } else {
        buttonState[EDITPEN] = false;
        editPen.style.background = '#F8F9FA';
        imageElement.style.cursor = "";// change back to normal cursor
        drawingModeEnabled = false;
    }
}

function editEraserHandler(e) {
    buttonState[CROPBUTTON] = false;
    buttonState[SELECTBUTTON] = false;
    buttonState[EDITPEN] = false;
    enableSelectionLine = false;
    drawingModeEnabled = false;
    cropButton.style.background = '#F8F9FA';
    selectButton.style.background = '#F8F9FA';
    editPen.style.background = '#F8F9FA';

    if (!buttonState[ERASER]) {
        buttonState[ERASER] = true;
        eraseModeEnabled = true;
        editEraser.style.background = '#4ec0b4';

    }else{
        buttonState[ERASER] = false;
        eraseModeEnabled = false;
        editEraser.style.background = '#F8F9FA';
    }

}

function layerHandler(e){
    var c = document.getElementById("mycanvas");
    c.style.opacity = layers.value / 4
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

function imgChange(imagePath) {
    var c = document.getElementById("mycanvas");
    imageElement = c;
    var ctx = c.getContext("2d");
    context = ctx;
    var img = new Image();
    img.onload = function () {
        c.width = img.width * 0.4;
        c.height = img.height * 0.4;
        ctx.drawImage(img, 0, 0, c.width, c.height);
    };
    img.src = imagePath;
}

function draw(e, eraser) {
    // stop the function if they are not mouse down
    if (!isDrawing) return;
    //listen for mouse move event

    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.lineWidth = `${penSize.value}`;
    if (!eraser)
        context.strokeStyle = `#${colorChosen.value}`;
    else
        context.strokeStyle = `#ffffff`;

    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(e.offsetX, e.offsetY);
    context.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}


window.onload = init();

