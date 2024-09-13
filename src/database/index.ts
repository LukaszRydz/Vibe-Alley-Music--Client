import mongoose from 'mongoose'

import { MongoDB } from '../helpers/variables'

export const initDatabase = async () => {
    mongoose.Promise = Promise;
    mongoose.connect(MongoDB.URI)
    mongoose.connection.on('error', (e: Error) => {
        console.error(e)
        process.exit(1)
    })
    mongoose.connection.on('open', () => console.log('Connected to MongoDB ✔'))
}