var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var dragging = false;
var pos = { x: 0, y: 0 };

canvas.addEventListener("mousedown", appgage);
canvas.addEventListener("mousedown", setPlace);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", disappgage);

canvas.addEventListener("touchstart", appgagegage);
canvas.addEventListener("touchmove", setPlace);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", disappgage);

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

function appgage() {
  dragging = true;
}

function disappgage() {
  dragging = false;
}
function setPlace(e) {
  if (isTouchDevice()) {
    var touch = e.touches[0];
    pos.x = touch.clientX - ctx.canvas.offsetLeft;
    pos.y = touch.clientY - ctx.canvas.offsetTop;
  } else {
    pos.x = e.clientX - ctx.canvas.offsetLeft;
    pos.y = e.clientY - ctx.canvas.offsetTop;
  }
}

function draw(e) {
  e.preventDefault();
  e.stopPropagation();

  if (dragging) {
    ctx.beginPath();

    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";

    ctx.moveTo(pos.x, pos.y);
    setPlace(e);
    ctx.lineTo(pos.x, pos.y);

    ctx.stroke();
  }
}
function erase() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

async function loadModel() {
  model = await tf.loadLayersModel(
    "https://raw.githubusercontent.com/mgresik/model/main/mnst.json"
  );

  model.predict(tf.zeros([1, 28, 28, 1]));

  return model;
}

function getData() {
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

async function predictModel() {
  imageData = getData();

  image = tf.browser.fromPixels(imageData);

  image = tf.image
    .resizeBilinear(image, [28, 28])
    .sum(2)
    .expandDims(0)
    .expandDims(-1);
  y = model.predict(image);

  document.getElementById("result").innerHTML = y.argMax(1).dataSync();
}

var model = loadModel();
