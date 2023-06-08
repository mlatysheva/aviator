function pad(num: number) { 
  //Add a leading 0 if the number is less than 10
  return ((num<10)?"0":"")+num.toString();
}

export function generateRandomTime() {
  const hour = Math.floor(Math.random() * (21 - 5 + 1) + 5);
  const HH = pad(hour);
  const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  const MM = minutes[Math.floor(Math.random() * minutes.length)];
  return HH + ":" + MM;
}