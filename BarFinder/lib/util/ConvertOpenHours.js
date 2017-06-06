
module.exports.ConvertOpenHours = function (hours) {

  let openHours = '';


  if (hours.mon_1_open) {
    openHours += 'Monday: ';
    openHours += hours.mon_1_open + ' - ' hours.mon_1_close;
  }
  if (hours.mon_2_open)
    openHours += hours.mon_2_open + ' - ' hours.mon_2_close;

  if (hours.tue_1_open) {
    openHours += 'Tuesday: ';
    openHours += hours.tue_1_open + ' - ' hours.tue_1_close;
  }
  if (hours.tue_2_open)
    openHours += hours.tue_2_open + ' - ' hours.tue_2_close;

  if (hours.wed_1_open) {
    openHours += 'Wednesday: ';
    openHours += hours.wed_1_open + ' - ' hours.wed_1_close;
  }
  if (hours.wed_2_open)
    openHours += hours.wed_2_open + ' - ' hours.wed_2_close;

  if (hours.thy_1_open) {
    openHours += 'Thursday: ';
    openHours += hours.thu_1_open + ' - ' hours.thu_1_close;
  }
  if (hours.thu_2_open)
    openHours += hours.thu_2_open + ' - ' hours.thu_2_close;

  if (hours.fri_1_open) {
    openHours += 'Friday: ';
    openHours += hours.fri_1_open + ' - ' hours.fri_1_close;
  }
  if (hours.fri_2_open)
    openHours += hours.fri_2_open + ' - ' hours.fri_2_close;

  if (hours.sat_1_open) {
    openHours += 'Saturday: ';
    openHours += hours.sat_1_open + ' - ' hours.sat_1_close;
  }
  if (hours.sat_2_open)
    openHours += hours.sat_2_open + ' - ' hours.sat_2_close;

  if (hours.sun_1_open) {
    openHours += 'Sunday: ';
    openHours += hours.sun_1_open + ' - ' hours.sun_1_close;
  }
  if (hours.sun_2_open)
    openHours += hours.sun_2_open + ' - ' hours.sun_2_close;

  return openHours;
}
