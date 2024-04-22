import { range, getInteger, createPRNG, IPointTuple, tracePath, applyColorMatrix, createCanvas } from './utils.js';

// const prng = createPRNG(40502);
const prng = Math.random;

document.body.onload = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const context = canvas.getContext('2d');

  render(context);
};

function render(context: CanvasRenderingContext2D) {
  const { width, height } = context.canvas;
  const center: IPointTuple = [width / 2, height / 2];

  const formHue = getInteger(prng, 0, 270);
  const backgroundHue = formHue + 180;

  const backgroundColor = `lch(95% 40% ${backgroundHue})`;
  const fillColor = `lch(40% 50% ${formHue})`;

  const BLUR = 30;
  const ALPHA_TRANSFORM = 300;
  const CELL_SIZE = 250;
  const CIRCLE_OFFSET = 80;
  const RADIUS = 70;

  // prettier-ignore
  const grid = createGrid(width, height, CELL_SIZE)
    .map((point) => randomOffset(point, CIRCLE_OFFSET));

  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, width, height);

  const blobContext = createCanvas(width, height);

  applyBlur(blobContext, BLUR);

  drawGrid(blobContext, grid, RADIUS, fillColor);

  console.log('before matrix', performance.now());

  // prettier-ignore
  flattenColors(blobContext, ALPHA_TRANSFORM, );
  console.log('after matrix', performance.now());

  context.drawImage(blobContext.canvas, 0, 0);
}

function flattenColors(context: CanvasRenderingContext2D, ALPHA_TRANSFORM: number) {
  const flattenMatrix = [
    [1, 0, 0, 0, 0], // R
    [0, 1, 0, 0, 0], // G
    [0, 0, 1, 0, 0], // B
    [0, 0, 0, ALPHA_TRANSFORM, -15], // A
  ];

  applyColorMatrix(context, flattenMatrix);
}

function applyBlur(context: CanvasRenderingContext2D, BLUR: number) {
  context.filter = `blur(${BLUR}px)`;
}

function createGrid(width: number, height: number, size: number): IPointTuple[] {
  // prettier-ignore
  return range(0, width, size)
    .flatMap((x) => range(0, height, size)
    .map((y) => [x, y] as IPointTuple));
}

function drawGrid(context: CanvasRenderingContext2D, grid: IPointTuple[], radius: number, fillColor: string) {
  grid.forEach((point: IPointTuple) => {
    context.beginPath();
    context.arc(...point, radius, 0, 2 * Math.PI);
    context.fillStyle = fillColor;
    context.fill();
  });
}

function randomOffset([x, y]: IPointTuple, offset: number): IPointTuple {
  const offsetRange = [-offset, offset];
  return [x + getInteger(Math.random, ...offsetRange), y + getInteger(Math.random, ...offsetRange)];
}
