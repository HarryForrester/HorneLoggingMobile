import Realm from 'realm';
import Map_Point_Info from './Map_Point_Info';
import Map_Points_Point from './Map_Points_Point';

class Map_Points extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  info!: Map_Point_Info;
  point!: Map_Points_Point;

  static schema: Realm.ObjectSchema = {
    name: 'map_points',
    embedded: true,
    properties: {
      _id: 'objectId?',
      info: 'map_point_info',
      point: 'map_points_point',
    },
  };
}

export default Map_Points;
