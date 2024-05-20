import Realm from 'realm'

export class People extends Realm.Object<People> {
  _id!: Realm.BSON.ObjectId
  _account!: number
  name!: string
  crew?: string
  imgUrl?: string
  address?: string
  contact?: string
  contactphone?: string
  dob?: string
  doctor?: string
  medical?: string
  phone?: string
  role?: string
  startDate?: string
  device?: string
  email?: string

  static schema: Realm.ObjectSchema = {
    name: 'person',
    properties: {
      _id: 'objectId',
      _account: 'int',
      name: 'string?',
      crew: 'string?',
      imgUrl: 'string?',
      address: 'string?',
      contact: 'string?',
      contactphone: 'string?',
      dob: 'string?',
      doctor: 'string?',
      medical: 'string?',
      phone: 'string?',
      role: 'string?',
      startDate: 'string?',
      device: 'string?',
      email: 'string?',
    },
    primaryKey: '_id',
  }
}

export default People
