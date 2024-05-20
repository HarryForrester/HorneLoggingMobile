import Realm from 'realm'

export class FilledForms extends Realm.Object<FilledForms> {
  _id?: Realm.BSON.ObjectId
  _account?: number
  date!: Date
  user!: string
  crew!: string
  formId!: string
  data!: string

  static schema: Realm.ObjectSchema = {
    name: 'filledforms',
    properties: {
      _id: 'objectId?',
      _account: 'int?',
      date: 'date',
      user: 'string',
      crew: 'string',
      formId: 'string',
      data: 'string',
    },
    primaryKey: '_id',
  }
}

export default FilledForms
