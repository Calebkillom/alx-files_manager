import mongodb from 'mongodb';
import envLoader from './env_loader';

/**
 * Represents a MongoDB client.
 */
class DBClient {
  /**
   * Creates a new DBClient instance.
   */
  constructor() {
    envLoader();
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const dbURL = `mongodb://${host}:${port}`;

    this.client = new mongodb.MongoClient(dbURL, { useUnifiedTopology: true });
    this.databaseName = database;
    this.connectionPromise = this.client.connect(); // Save connection promise
  }

  /**
   * Checks if this client's connection to the MongoDB server is active.
   * @returns {Promise<boolean>}
   */
  async isAlive() {
    try {
      await this.connectionPromise; // Ensure the client is connected
      return !!this.client.topology && this.client.topology.isConnected();
    } catch (error) {
      return false;
    }
  }

  /**
   * Retrieves the number of users in the database.
   * @returns {Promise<number>}
   */
  async nbUsers() {
    await this.connectionPromise;
    return this.client.db(this.databaseName).collection('users').countDocuments();
  }

  /**
   * Retrieves the number of files in the database.
   * @returns {Promise<number>}
   */
  async nbFiles() {
    await this.connectionPromise;
    return this.client.db(this.databaseName).collection('files').countDocuments();
  }
}

// Export an instance of DBClient
export const dbClient = new DBClient();
export default dbClient;
