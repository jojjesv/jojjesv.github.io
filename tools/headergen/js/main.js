/**
 * @type {CanvasImageSource}
 */
let backgroundImage;
/**
 * @type {CanvasImageSource}
 */
let logoImage;

let logoMaxWidth = 240;
let logoMaxHeight = logoMaxWidth;
let logoPadding = 36;

function updateCanvas(gradientTop, gradientBottom, background, logo) {
  /**
   * @type {HTMLCanvasElement}
   */
  let canvas = document.getElementById('result');
  let context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  let imageMaxWidth = canvas.width;
  let imageMaxHeight = canvas.height;

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

  if (background) {
    let imgWidth = background.width;
    let imgHeight = background.height;
    let imgRatio = imgWidth / imgHeight;

    if (imgHeight > imgWidth && imgHeight < imageMaxHeight) {
      imgHeight = imageMaxHeight;
      imgWidth = imageMaxHeight * imgRatio;
    } else {
      imgWidth = imageMaxWidth;
      imgHeight = imageMaxWidth / imgRatio;
    }
    context.globalAlpha = 0.35;
    context.drawImage(
      background,
      (canvas.width - imgWidth) / 2,
      (canvas.height - imgHeight) / 2,
      imgWidth, imgHeight
    );

    stackBlurCanvasRGBA("result", 0, 0, canvas.width, canvas.height, 36);
  }
  context.globalAlpha = 1;

  if (logo) {
    let imgWidth = logo.width;
    let imgHeight = logo.height;
    let imgRatio = imgWidth / imgHeight;

    if (imgHeight > imgWidth && imgHeight > logoMaxHeight) {
      imgHeight = logoMaxHeight;
      imgWidth = logoMaxHeight * imgRatio;
    } else {
      imgWidth = logoMaxWidth;
      imgHeight = logoMaxWidth / imgRatio;
    }
    context.drawImage(
      logo,
      (canvas.width - imgWidth) - logoPadding,
      (canvas.height - imgHeight) - logoPadding,
      imgWidth, imgHeight
    );
  } 

  document.getElementById('save-img').href = canvas.toDataURL();
}

function onInputChanged() {
  let gradientTop = document.getElementById('input-gradient-top').value;
  let gradientBottom = document.getElementById('input-gradient-bottom').value;

  //  Wait for image layout
  setTimeout(() => {
    updateCanvas(gradientTop, gradientBottom, backgroundImage, logoImage);
  }, 150)
}

/**
 * @returns Resulting image 
 */
function updateImageFromFile(file) {
  let img = new Image();
  img.src = URL.createObjectURL(file);
  return img;
}

function registerListeners() {
  document.getElementById('input-file-background').onchange = function (snapshot) {
    let file = snapshot.srcElement.files[0];
    if (file) {
      backgroundImage = updateImageFromFile(file);
    } else {
      backgroundImage = null;
    }
    onInputChanged();
  }

  document.getElementById('input-file-logo').onchange = function (snapshot) {
    let file = snapshot.srcElement.files[0];
    if (file) {
      logoImage = updateImageFromFile(file);
    } else {
      logoImage = null;
    }
    onInputChanged();
  }

  document.getElementById('input-gradient-top').onchange = onInputChanged;
  document.getElementById('input-gradient-bottom').onchange = onInputChanged;
}

window.onload = function () {
  registerListeners();
}