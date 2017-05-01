
Math.radians = function (degrees) {

  return degrees * Math.PI / 180;
};

module.exports.CoverBoundingBox = class CoverBoundingBox {

  constructor(area, circleRadiusInMeters) {

    this.area = area;
    this.circleRadiusInMeters = circleRadiusInMeters;
  }

  metersToLatitudeDegrees(meters) {

    return meters / 110574;
  }

  metersToLongitudeDegrees(meters, latitude) {

    return meters / (111320 * Math.cos(Math.radians(latitude)));
  }

  distanceFromCenter() {

    return this.area.radius / Math.sqrt(2);
  }

  boundingBoxUpperLeftCorner() {

    let latitude = this.area.latitude + this.metersToLatitudeDegrees(this.distanceFromCenter());
    let longitude = this.area.longitude - this.metersToLongitudeDegrees(this.distanceFromCenter(), this.area.latitude);

    let upperLeftCorner = {
      'latitude': latitude,
      'longitude': longitude,
    };

    return upperLeftCorner;
  }

  boundingBoxBottomRightCorner() {

    let latitude = this.area.latitude - this.metersToLatitudeDegrees(this.distanceFromCenter());
    let longitude = this.area.longitude + this.metersToLongitudeDegrees(this.distanceFromCenter(), latitude);

    let bottomRightCorner = {
      'latitude': latitude,
      'longitude': longitude,
    };

    return bottomRightCorner;
  }

  getLatDistanceBetweenCircles() {

    return 3 * this.circleRadiusInMeters / 2;
  }

  getLongDistanceBetweenCircles() {

    return Math.sqrt(3) * this.circleRadiusInMeters;
  }

  getAllCircleCenters() {

    /* Description: Cover all the bounding box area with circles.
    * More info: http://stackoverflow.com/questions/7716460/fully-cover-a-rectangle-with-minimum-amount-of-fixed-radius-circles.
    */

    let upperLeftCorner = this.boundingBoxUpperLeftCorner();
    let bottomRightCorner = this.boundingBoxBottomRightCorner();

    let circleCenters = [];
    for (let x = upperLeftCorner.latitude; x > bottomRightCorner.latitude; x -= this.metersToLatitudeDegrees(this.getLatDistanceBetweenCircles())) {
      for (let y = upperLeftCorner.longitude; y < bottomRightCorner.longitude; y += this.metersToLongitudeDegrees(this.getLongDistanceBetweenCircles(), x)) {
        circleCenters.push({
          'latitude': x,
          'longitude': y,
          'radius': this.circleRadiusInMeters,
        });
      }
    }

    return circleCenters;
  }
}
