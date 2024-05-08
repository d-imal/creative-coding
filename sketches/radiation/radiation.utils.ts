export type IPointTuple = [number, number];

export function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  return canvas.getContext('2d', { willReadFrequently: true });
}

export function addBackground(context: CanvasRenderingContext2D, width: number, height: number) {
  context.fillStyle = `#000`;
  context.fillRect(0, 0, width, height);
}

export function saveAndRestore(
  context: CanvasRenderingContext2D,
  callback: (context: CanvasRenderingContext2D) => void
) {
  context.save();
  callback(context);
  context.restore();
  return context;
}

export const box = <T>(x: T) => ({
  map: (f: (arg0: T) => typeof box<T>) => box(f(x)),
  fold: (f: Function) => f(x),
});

export function tracePath(context: CanvasRenderingContext2D, points: IPointTuple[]) {
  // prettier-ignore
  points.forEach((point, index) => 
    (index === 0 
        ? context.moveTo(...point) 
        : context.lineTo(...point)));
}

export function traceEquilateralTriangle(
  context: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  sideLength: number
): void {
  const height = (sideLength * Math.sqrt(3)) / 2;
  const verticalOffset = (2 / 3) * height;

  context.beginPath();
  tracePath(context, [
    [cx, cy - verticalOffset],
    [cx + sideLength / 2, cy + (1 / 3) * height],
    [cx - sideLength / 2, cy + (1 / 3) * height],
  ]);
  context.closePath();
}

export function drawInnerRadiatingTriangle(context: CanvasRenderingContext2D, sideLength: number) {
  traceEquilateralTriangle(context, 0, 0, sideLength);
  context.clip();
  drawRadiatingLines(context, 600, 30, -0.7);
}

export function drawOuterRadiatingTriangle(context: CanvasRenderingContext2D, lineLength = 1000) {
  context.globalCompositeOperation = 'source-atop';
  drawRadiatingLines(context, lineLength, 190);
  context.globalCompositeOperation = 'source-over';
}

export function drawTriangleWithHole(
  innerSideLength: number,
  outerSideLength: number,
  cx: number,
  cy: number,
  context: CanvasRenderingContext2D
): void {
  traceEquilateralTriangle(context, cx, cy, outerSideLength);
  context.fillStyle = 'black';
  context.fill();

  traceEquilateralTriangle(context, cx, cy, innerSideLength);

  context.globalCompositeOperation = 'xor';
  context.fill();
}

export function drawRadiatingLines(
  context: CanvasRenderingContext2D,
  lineLength: number,
  innerRadius = 30,
  angleOffset = 0
) {
  const numLines = 100;
  const angleIncrement = 360 / numLines;

  for (let i = 0; i < numLines; i++) {
    const angle = angleIncrement * i;
    const radians = (angle * Math.PI) / 180;

    const startX = Math.cos(radians) * innerRadius;
    const startY = Math.sin(radians) * innerRadius;
    const x = Math.cos(radians + angleOffset) * lineLength;
    const y = Math.sin(radians + angleOffset) * lineLength;

    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(x, y);
    context.strokeStyle = '#fff';
    context.stroke();
  }
}
