
export class Cardify {
  cardify(point: number, showV: boolean) {
    if (showV){
      if (point && point === -2) {
        return '?';
      } else if (point === -1) {
        return ' ';
      } else if (point === -3) {
        return "\u2705";
      }
      return point;
    } else {
      return '--';
    }
  }
}
