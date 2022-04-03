import { Message } from '@/interfaces/message'
import { v4 as uuidv4 } from 'uuid'

export class ChatService {
  private pouchdb: PouchDB.Database

  constructor (pouchdb: PouchDB.Database) {
    this.pouchdb = pouchdb

    this.pouchdb.createIndex({
      index: {
        fields: ['dateCreated', 'senderId', 'recepientId', 'type']
      }
    })
  }

  async getMessage (id: string): Promise<void> {
    const result = await this.pouchdb.get(id)
    console.log(result)
  }

  async getMessages (senderId: string, recepientId: string): Promise<Message[]> {
    const result = await this.pouchdb.find({
      selector: {
        dateCreated: { $gt: null },
        senderId: { $in: [senderId, recepientId] },
        recepientId: { $in: [recepientId, senderId] },
        type: { $eq: 'message' }
      },
      sort: ['dateCreated', 'senderId', 'recepientId', 'type']
    }) as unknown as { docs: Message[] }
    return result.docs
  }

  async getMessagesRealmTime (senderId: string, recepientId: string, callBack: (m: Message) => unknown): Promise<void> {
    this.pouchdb.changes({
      include_docs: true,
      live: true,
      since: 'now',
      filter: function (doc) {
        const { type, senderId: docSenderId, recepientId: docRecepientId } = doc
        return type === 'message' &&
          [docSenderId, docRecepientId].includes(senderId) &&
          [docSenderId, docRecepientId].includes(recepientId)
      }
    }).on('change', function (change) {
      callBack(change.doc as unknown as Message)
    })
  }

  async createMessage (message: Message): Promise<Message> {
    message._id = uuidv4()
    message.dateCreated = new Date().toISOString()
    message.type = 'message'
    return (await this.pouchdb.put(message)) as unknown as Message
  }
}
