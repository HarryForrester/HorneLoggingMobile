import Realm from 'realm';

class Map_Points_Point extends Realm.Object {
  originalHeight!: number;
  originalWidth!: number;
  x!: number;
  y!: number;

  static schema: Realm.ObjectSchema = {
    name: 'map_points_point',
    embedded: true,
    properties: {
      originalHeight: 'double?',
      originalWidth: 'double?',
      x: 'double?',
      y: 'double?',
    },
  };
}

export default Map_Points_Point;
