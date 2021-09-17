import { MongoClient } from 'mongodb';
// const { MongoClient } = require('mongodb');

class DBClient {
    constructor() {
        this.host = process.env.DB_HOST || 'localhost';
        this.port = process.env.DB_PORT || 27017;
        this.dbName = process.env.DB_DATABASE || 'files_manager';
        this.connected = false;
        this.connectToClient();
    }

    async connectToClient() {
        MongoClient(`mongodb://${this.host}:${this.port}`, { useUnifiedTopology: true })
            .connect()
            .then(async (client) => {
                this.client = client;
                this.connected = true;
                this.db = this.client.db(this.dbName);
                this.files = await this.db.collection('files');
                this.users = await this.db.collection('users');
            })
            .catch(console.error);
    }

    isAlive() { return this.connected; }

    async nbUsers() { return this.users.countDocuments(); }

    async nbFiles() { return this.files.countDocuments(); }
}

const dbClient = new DBClient();
module.exports = dbClient;
