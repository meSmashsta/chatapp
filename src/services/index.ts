import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import { ChatService } from './chat.service'
import { UserService } from './user.service'

PouchDB.plugin(PouchDBFind)

const localDB = new PouchDB('chatapp')

const remoteDB = new PouchDB('http://admin:password@localhost:5984/chatapp')
localDB.replicate.to(remoteDB, {
  live: true,
  retry: true
})
localDB.replicate.from(remoteDB, {
  live: true,
  retry: true
})

const chatService = new ChatService(localDB)
const userService = new UserService(localDB)

export default {
  chatService,
  userService
}
