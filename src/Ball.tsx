// move element down by 3px, 60 times in a second
import './Ball.css';

export const Ball = () => {

  // change the top position by 3 pixels of an element that has a “circle” class value.
  const moveBall = () => {
    let start = Date.now();
    let football = document.querySelector<HTMLImageElement>(".circle");

    const animateBall = () => {
      let interval = Date.now() - start;

      if (football) {
        football.style.top = interval / 3 + 'px'; // move element down by 3px
      }

      if (interval < 1000)
        requestAnimationFrame(animateBall); // queue request for next frame

    };

    let timer = requestAnimationFrame(animateBall);
  }

  const bounce = (timeFraction: number): number => {
    for (let a = 0, b = 1; 1; a += b, b /= 2) {
      if (timeFraction >= (7 - 4 * a) / 11) { // 4 and 7 coefficient are used to control bounce and smooth y axis fall
        return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2) // Math.pow(b, 2) to keep the same x axis for bounce
        // -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) adjust the y axis up and down
      }
    }
    return 0;
  }

  const easeOut = (timing: (timeFraction: number) => number) => {
    return (timeFraction: number) => {
      return 1 - timing(1 - timeFraction);
    }
  }

  const bounceBall = () => {
    let bounceEaseOut = easeOut(bounce);
    let start = Date.now();
    let football = document.querySelector<HTMLDivElement>("#ball")
    let id = requestAnimationFrame(function animate(time) {

      const duration = 2000;

      let interval = (Date.now() - start) / duration;
      if (interval > 1) interval = 1;

      let anim = {
        x: interval * 200 + 'px',
        y: bounceEaseOut(interval) * 300 + 'px',
        rot: interval * 80 + 'deg',
        scale: 1,
      };

      if (football) {

        let translate = `translate(${anim.x}, ${anim.y})`;
        let rotate = ` rotate(${anim.rot})`;
        let scale = ` scale(${anim.scale})`;

        let transform =
          translate +
          rotate
          + scale
          ;

        football.style.transform = transform;
      }

      if (interval < 1) {
        requestAnimationFrame(animate);
      }

    })
  }

  return (
    <div className="containter">
      <div id="ball" onClick={bounceBall}>
        <img className="circle" style={{ filter: 'blur(15px) drop-shadow(0px 20px 10px blue)' }} />
        <img className="circle" />
      </div>
    </div>
  );
}