import Realm from 'realm'

export class Hazards extends Realm.Object<Hazards> {
  _id!: Realm.BSON.ObjectId
  id!: string
  _account!: number
  title!: string
  sev!: string
  reviewDate!: string
  reviewReason!: string
  harms!: string
  cat!: string
  catIndex!: string

  static schema: Realm.ObjectSchema = {
    name: 'hazard',
    properties: {
      _id: 'objectId',
      id: 'string',
      title: 'string',
      sev: 'string',
      reviewDate: 'string',
      reviewReason: 'string',
      harms: 'string',
      cat: 'string',
      catIndex: 'int',
      _account: 'int',
    },
    primaryKey: '_id',
  }
}

export default Hazards
