import Realm from 'realm'

export class TimeSheet extends Realm.Object<TimeSheet> {
  _id?: Realm.BSON.ObjectId
  _account?: number
  crew?: string
  data?: string
  date?: string

  static schema: Realm.ObjectSchema = {
    name: 'timesheet',
    properties: {
      _id: 'objectId?',
      _account: 'int?',
      crew: 'string?',
      data: 'string',
      date: 'string?',
    },
    primaryKey: '_id',
  }
}

export default TimeSheet
