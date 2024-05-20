import Realm from 'realm'

// Define the Maps schema
class GeneralHazards extends Realm.Object {
  _id!: Realm.BSON.ObjectId
  _account!: number
  hazards!: string

  static schema: Realm.ObjectSchema = {
    name: 'generalHazards',
    properties: {
      _id: 'objectId',
      _account: 'int',
      hazards: 'string',
    },
    primaryKey: '_id',
  }
}

export default GeneralHazards
