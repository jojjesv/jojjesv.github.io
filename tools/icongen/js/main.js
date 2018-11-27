/**
 * @type {CanvasImageSource}
 */
let image;

let imageMaxWidth = 860;
let imageMaxHeight = imageMaxWidth;

function updateCanvas(gradientTop, gradientBottom, image, insetPercent = 100) {
  /**
   * @type {HTMLCanvasElement}
   */
  let canvas = document.getElementById('result');
  let context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (gradientTop && gradientBottom) {
    let x = canvas.width * 0.15;
    let y = canvas.height * 0.15;
    let r = canvas.width;
    let gradient = context.createRadialGradient(
      x,
      y,
      0,
      x,
      y,
      r
    );
    gradient.addColorStop(0, gradientTop);
    gradient.addColorStop(1, gradientBottom);
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (image) {
    let imgWidth = image.width;
    let imgHeight = image.height;
    let imgRatio = imgWidth / imgHeight;

    let insetF = parseInt(insetPercent);
    if (isNaN(insetF)) {
      insetF = 100;
    }
    insetF /= 100;
    let imageMaxWidthF = canvas.width - (canvas.width - imageMaxWidth) * insetF;
    let imageMaxHeightF = canvas.height - (canvas.height - imageMaxHeight) * insetF;

    if (imgHeight > imgWidth && imgHeight > imageMaxHeightF) {
      imgHeight = imageMaxHeightF;
      imgWidth = imageMaxHeightF * imgRatio;
    } else {
      imgWidth = imageMaxWidthF;
      imgHeight = imageMaxWidthF / imgRatio;
    }
    context.drawImage(
      image,
      (canvas.width - imgWidth) / 2,
      (canvas.height - imgHeight) / 2,
      imgWidth, imgHeight
    );
  }

  document.getElementById('save-img').href = canvas.toDataURL();
}

function onInputChanged() {
  let gradientTop = document.getElementById('input-gradient-top').value;
  let gradientBottom = document.getElementById('input-gradient-bottom').value;
  let insetPercent = parseInt(document.getElementById('input-inset').value);

  //  Wait for image layout
  setTimeout(() => {
    updateCanvas(gradientTop, gradientBottom, image, insetPercent);
  }, 150)
}

function updateImageFromFile(file) {
  let img = new Image();
  img.src = URL.createObjectURL(file);
  image = img;
}

function registerListeners() {
  document.getElementById('input-image').onchange = function (snapshot) {
    let file = snapshot.srcElement.files[0];
    if (file) {
      updateImageFromFile(file);
    } else {
      image = null;
    }
    onInputChanged();
  }

  document.getElementById('input-gradient-top').onchange = onInputChanged;
  document.getElementById('input-gradient-bottom').onchange = onInputChanged;
  document.getElementById('input-inset').onchange = onInputChanged;
}

window.onload = function () {
  registerListeners();
}