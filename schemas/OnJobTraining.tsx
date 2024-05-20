import Realm from 'realm'

export class OnJobTraining extends Realm.Object<OnJobTraining> {
  _id!: Realm.BSON.ObjectId
  _account?: number
  competence?: string
  confirm?: string
  confirmTime?: string
  date?: Date
  look?: string
  lookTime?: string
  reportType?: string
  show?: string
  showTime?: string
  talk?: string
  talkTime?: string
  trainer?: string
  user?: string

  static schema = {
    name: 'onjobTraining',
    properties: {
      _id: 'objectId',
      _account: 'int?',
      competence: 'string?',
      confirm: 'string?',
      confirmTime: 'string?',
      date: 'date?',
      look: 'string?',
      lookTime: 'string?',
      reportType: 'string?',
      show: 'string?',
      showTime: 'string?',
      talk: 'string?',
      talkTime: 'string?',
      trainer: 'string?',
      user: 'string?',
    },
    primaryKey: '_id',
  }
}
