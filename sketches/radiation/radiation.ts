import { curry } from 'ramda';
import {
  IPointTuple,
  addBackground,
  drawInnerRadiatingTriangle,
  drawOuterRadiatingTriangle,
  drawTriangleWithHole,
  saveAndRestore,
} from './radiation.utils';

window.addEventListener('DOMContentLoaded', () => {
  // prettier-ignore
  const contexts = Array.from(document.querySelectorAll('canvas'))
    .map((canvas) => canvas.getContext('2d'));

  render(contexts);
});

function render(contexts: CanvasRenderingContext2D[]) {
  const [mainContext, ...scratchContexts] = contexts;
  const { width, height } = mainContext.canvas;
  const center: IPointTuple = [width / 2, height / 2];

  addBackground(mainContext, width, height);

  const offset = offsetCenter(...center, height);

  saveAndRestore(mainContext, () => {
    mainContext.translate(...offset(9));
    drawInnerRadiatingTriangle(mainContext);
  });

  saveAndRestore(scratchContexts[0], (ctx) => {
    ctx.translate(...offset(9));
    drawTriangleWithHole(ctx, 0, 0, 510, 900);
  });
  saveAndRestore(scratchContexts[0], (ctx) => {
    ctx.translate(centerX, centerY);
    drawOuterRadiatingTriangle(ctx, 0);
  });

  mainContext.drawImage(scratchContexts[0].canvas, 0, 0);

  saveAndRestore(scratchContexts[1], (ctx) => {
    ctx.translate(...offset(9));
    drawTriangleWithHole(ctx, 0, 0, 910, 1200);
    drawOuterRadiatingTriangle(ctx, 0);
  });

  mainContext.drawImage(scratchContexts[1].canvas, 0, 0);
}

const offsetCenter = curry(
  (centerX: number, centerY: number, height: number, divisor: number) =>
    [centerX, centerY + height / divisor] as IPointTuple
);
