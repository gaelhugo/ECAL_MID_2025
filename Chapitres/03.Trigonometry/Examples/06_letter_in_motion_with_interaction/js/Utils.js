class Utils {
  constructor() {}

  loadSVG(localSVGfile) {
    return new Promise((resolve, reject) => {
      fetch(localSVGfile)
        .then((response) => response.text())
        .then((svgData) => {
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgData, "image/svg+xml");
          const paths = svgDoc.querySelectorAll("path");
          const pathPoints = [];

          paths.forEach((path) => {
            const pathLength = path.getTotalLength();
            const points = [];
            // Increase the number of points for better accuracy
            const numPoints = Math.max(100, Math.ceil(pathLength));
            for (let i = 0; i <= numPoints; i++) {
              const point = path.getPointAtLength((i * pathLength) / numPoints);
              points.push({ x: point.x, y: point.y });
            }
            pathPoints.push(points);
          });

          resolve(pathPoints);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  calculateBounds(paths) {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    paths.forEach((path) => {
      path.forEach((point) => {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
      });
    });
    return {
      width: maxX - minX,
      height: maxY - minY,
      minX,
      minY,
    };
  }
}

export default new Utils();
