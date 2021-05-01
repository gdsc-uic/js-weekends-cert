// SAVIOR! https://stackoverflow.com/questions/58864177/animating-a-wobbly-canvas-like-in-discords-login-page

// array of xy coords, closed boolean
export function bezierSkin(c, bez, closed = true) {
  const avg = calcAvgs(bez);
  const leng = bez.length;

  if (closed) {
    c.moveTo(avg[0], avg[1]);
    for (let i = 2; i < leng; i += 2) {
      let n = i + 1;
      c.quadraticCurveTo(bez[i], bez[n], avg[i], avg[n]);
    }
    c.quadraticCurveTo(bez[0], bez[1], avg[0], avg[1]);
  } else {
    c.moveTo(bez[0], bez[1]);
    c.lineTo(avg[0], avg[1]);
    for (let i = 2; i < leng - 2; i += 2) {
      let n = i + 1;
      c.quadraticCurveTo(bez[i], bez[n], avg[i], avg[n]);
    }
    c.lineTo(bez[leng - 2], bez[leng - 1]);
  }
}

// create anchor points by averaging the control points
function calcAvgs(p) {
  const avg = [];
  const leng = p.length;
  let prev;

  for (let i = 2; i < leng; i++) {
    prev = i - 2;
    avg.push((p[prev] + p[i]) / 2);
  }
  // close
  avg.push((p[0] + p[leng - 2]) / 2, (p[1] + p[leng - 1]) / 2);
  return avg;
}
