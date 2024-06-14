import Realm from 'realm';
import Map_Points from './Map_Points';

class Maps extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  _account!: number;
  name!: string;
  map!: string;
  points!: Realm.List<Map_Points>; // Use Realm.List for collections
  type!: string;
  fileName!: string;

  static schema: Realm.ObjectSchema = {
    name: 'map',
    properties: {
      _id: 'objectId',
      _account: 'int',
      name: 'string',
      map: 'string',
      points: { type: 'list', objectType: 'map_points' }, // Define as a Realm List of map_points
      type: 'string',
      fileName: 'string',
    },
    primaryKey: '_id',
  };
}

export default Maps;
