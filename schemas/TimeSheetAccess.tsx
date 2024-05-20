import Realm from 'realm'

// Define the Maps schema
class TimeSheetAccess extends Realm.Object {
  _id!: Realm.BSON.ObjectId
  _account!: number
  availableOnDevie!: string
  title!: string

  static schema: Realm.ObjectSchema = {
    name: 'timesheetAccess',
    properties: {
      _id: 'objectId',
      _account: 'int',
      availableOnDevice: 'string',
      title: 'string',
    },
    primaryKey: '_id',
  }
}

export default TimeSheetAccess
