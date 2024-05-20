import Realm from 'realm'

export class Forms extends Realm.Object<Forms> {
  _id!: Realm.BSON.ObjectId
  _account!: number
  sectionsSerialized!: string // Define sections as a list of mixed types
  availableOnDeviceSerialized!: string // Define availableOnDevice as a dictionary with mixed values
  title!: string
  position!: number

  static schema: Realm.ObjectSchema = {
    name: 'forms',
    properties: {
      _id: 'objectId',
      _account: 'int',
      sectionsSerialized: 'string',
      availableOnDeviceSerialized: 'string',
      title: 'string',
      position: 'int',
    },
    primaryKey: '_id',
  }
}

export default Forms
