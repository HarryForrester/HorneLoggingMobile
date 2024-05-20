import Realm from 'realm'

// Define the Maps schema
class Maps extends Realm.Object {
  _id!: Realm.BSON.ObjectId
  _account!: number
  name!: string
  map!: string
  points!: string // Use the Point schema here
  type!: string
  fileName!: string

  static schema: Realm.ObjectSchema = {
    name: 'map',
    properties: {
      _id: 'objectId',
      _account: 'int',
      name: 'string',
      map: 'string',
      points: 'string',
      type: 'string',
      fileName: 'string',
    },
    primaryKey: '_id',
  }
}

export default Maps
