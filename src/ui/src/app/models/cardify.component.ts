
export class Cardify {
    cardify (point: number) {
        if (point && point === -2 ) {
        return '?';
        } else if (point === -1) {
        return ' ';
        }
        return point;
    }
}