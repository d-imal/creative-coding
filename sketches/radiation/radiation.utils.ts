export type IPointTuple = [number, number];

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

export function tracePath(context: CanvasRenderingContext2D, points: IPointTuple[]) {
  // prettier-ignore
  points.forEach((point, index) => 
    (index === 0 
        ? context.moveTo(...point) 
        : context.lineTo(...point)));
}

export function drawTriangleWithHole(
  context: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerSideLength: number,
  scale: number
): void {
  traceEquilateralTriangle(context, cx, cy, outerSideLength);

  const innerSideLength = outerSideLength * scale;

  traceEquilateralTriangle(context, cx, cy, innerSideLength);

  context.fillStyle = 'white';
  context.fill('evenodd');
  context.closePath();
}

export function drawRadiatingLines(context: CanvasRenderingContext2D, centerX, centerY, lineLength) {
  const numLines = 100;
  const angleIncrement = 360 / numLines;

  for (let i = 0; i < numLines; i++) {
    const angle = angleIncrement * i;
    const radians = (angle * Math.PI) / 180;

    const startX = Math.cos(radians) * 30;
    const startY = Math.sin(radians) * 30;
    const x = Math.cos(radians) * lineLength;
    const y = Math.sin(radians) * lineLength;

    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(x, y);
    context.strokeStyle = '#fff';
    context.stroke();
  }
}
