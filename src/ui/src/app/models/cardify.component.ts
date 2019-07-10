
export class Cardify {
  cardify(point: number, showV: boolean) {
    if (showV){
      if (point && point === -2) {
        return '?';
      } else if (point === -1) {
        return ' ';
      }
      return point;
    } else {
      return '--';
    }
  }
}
