
export class Cardify {
  cardify(point: number, showV: boolean) {
    if (showV){
      if (point && point === -2) { //I don't know
        return '❓';
      } else if (point === -1) { //Not voted yet
        return ' ';
      } else if (point === -3) {
        return "\u2705";
      }
      return point;
    } else {
      if (point !== -1) {
        return '✅'; // Voted, but vote is secret(to be sent a -3 by server)
      } else {
        return '❌'; //Not voted yet
      }
    }
  }
}
