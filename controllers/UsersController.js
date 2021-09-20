import sha1 from 'sha1';
import Queue from 'bull';
import dbClient from '../utils/db';

const userQueue = new Queue('userQueue');

class UsersController {
    /**
     * Creates a user using email and password
     */
    static async postNew(request, response) {
        const { email, password } = request.body;

        // check for email and password
        if (!email) 
            return response.status(400).send({ error: 'Missing email' });
        if (!password)
            return response.status(400).send({ error: 'Missing password' });

        // check if the email already exists in DB
        const emailExists = await dbClient.users.findOne({ email });
        if (emailExists)
            return response.status(400).send({ error: 'Already exist' });

        // Insert new user
        const sha1Password = sha1(password);
        let result;
        try {
            result = await dbClient.users.insertOne({
            email, password: sha1Password,
        });
        } catch (err) {
            await userQueue.add({});
            return response.status(500).send({ error: 'Error creating user' });
        }

        const user = {
            id: result.insertedId,
            email,
        };

        await userQueue.add({
            userId: result.insertedId.toString(),
        });

        return response.status(201).send(user);
    }
}

module.exports = UsersController;
