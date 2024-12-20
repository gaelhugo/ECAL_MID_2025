class Utils {
  loadSVG(svgFile) {
    return new Promise((resolve, reject) => {
      fetch(svgFile)
        .then((response) => response.text())
        .then((svgData) => {
          console.log("Raw SVG data:", svgData);

          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgData, "image/svg+xml");
          const paths = svgDoc.querySelectorAll("path");

          console.log("Number of paths found:", paths.length);

          const pathPoints = [];

          paths.forEach((path) => {
            const points = [];
            const pathLength = path.getTotalLength();
            const numPoints = 100;

            for (let i = 0; i <= numPoints; i++) {
              const point = path.getPointAtLength((i * pathLength) / numPoints);
              points.push({ x: point.x, y: point.y });
            }

            pathPoints.push(points);
          });

          resolve(pathPoints);
        })
        .catch((error) => {
          console.error("Error loading SVG:", error);
          reject(error);
        });
    });
  }
}

export default new Utils();
