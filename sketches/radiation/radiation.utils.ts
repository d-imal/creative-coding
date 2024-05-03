export type IPointTuple = [number, number];

export function traceEquilateralTriangle(
  context: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  sideLength: number
): void {
  const height = (sideLength * Math.sqrt(3)) / 2;
  const verticalOffset = (2 / 3) * height;

  tracePath(context, [
    [cx, cy - verticalOffset],
    [cx + sideLength / 2, cy + (1 / 3) * height],
    [cx - sideLength / 2, cy + (1 / 3) * height],
  ]);
}

export function tracePath(context: CanvasRenderingContext2D, points: IPointTuple[]) {
  context.beginPath();
  points.forEach(([x, y], index) => (index === 0 ? context.moveTo(x, y) : context.lineTo(x, y)));
  context.closePath();
}

export function drawRadiatingLines(context: CanvasRenderingContext2D, centerX, centerY) {
  const numLines = 100;
  const angleIncrement = 360 / numLines;
  const lineLength = 400;

  for (let i = 0; i < numLines; i++) {
    const angle = angleIncrement * i;
    const radians = (angle * Math.PI) / 180;
    const x = Math.cos(radians) * lineLength;
    const y = Math.sin(radians) * lineLength;

    context.beginPath();
    context.moveTo(centerX, centerY);
    context.lineTo(x, y);
    context.strokeStyle = '#fff';
    context.stroke();
  }
}
