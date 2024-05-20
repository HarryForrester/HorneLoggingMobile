import Realm from 'realm'

// Define your object model
export class Crew extends Realm.Object<Crew> {
  _id!: Realm.BSON.ObjectId
  _account!: number
  _name!: string

  static schema = {
    name: 'crew',
    properties: {
      _id: 'objectId',
      _account: 'int',
      name: 'string',
    },
    primaryKey: '_id',
  }
}
