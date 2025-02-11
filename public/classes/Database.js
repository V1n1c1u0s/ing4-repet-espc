const mysql = require('mysql2');
const crypto = require('crypto');
require('dotenv').config();

//usar dotenv
class Database {
    constructor() {
        this.db = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        this.db.connect((err) => {
            if (err) {
                console.error('Erro ao conectar ao banco de dados:', err.stack);
                return;
            }
            console.log('Conectado ao banco de dados MySQL');
        });

        // Parâmetros da criptografia
        this.saltLength = 16; // Tamanho do salt (sal)
        this.ivLength = 16;   // Tamanho do vetor de inicialização (IV)
    }

    encryptPassword(password) {
        const salt = crypto.randomBytes(this.saltLength);
        const iv = crypto.randomBytes(this.ivLength);
        const key = crypto.scryptSync(process.env.AES_KEY, salt, 32); // Deriva a chave com scrypt

        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        let encrypted = cipher.update(password, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag().toString('hex');

        return {
            salt: salt.toString('hex'),
            iv: iv.toString('hex'),
            encryptedPassword: encrypted,
            authTag: authTag,
        };
    }

    decryptPassword(encryptedPassword, salt, iv, authTag) {
        const key = crypto.scryptSync(process.env.AES_KEY, Buffer.from(salt, 'hex'), 32);
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'));
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));

        let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    login(username, password, callback) {
        const query = 'SELECT * FROM users WHERE username = ?';
        this.db.execute(query, [username], (err, results) => {
            if (err) return callback(err);

            if (results.length > 0) {
                const user = results[0];
                const decryptedPassword = this.decryptPassword(
                    user.encrypted_password,
                    user.salt,
                    user.iv,
                    user.auth_tag
                );

                if (decryptedPassword === password) {
                    callback(null, user);
                } else {
                    callback(null, null);
                }
            } else {
                callback(null, null);
            }
        });
    }

    register(username, password, callback) {
        const query = 'SELECT * FROM users WHERE username = ?';
        this.db.execute(query, [username], (err, results) => {
            if (err) return callback(err);

            if (results.length > 0) {
                return callback(null, 'Usuário já existe. Escolha outro nome de usuário.');
            }

            const { salt, iv, encryptedPassword, authTag } = this.encryptPassword(password);

            const insertQuery = 'INSERT INTO users (username, salt, iv, encrypted_password, auth_tag) VALUES (?, ?, ?, ?, ?)';
            this.db.execute(insertQuery, [username, salt, iv, encryptedPassword, authTag], (err, results) => {
                if (err) return callback(err);

                callback(null, 'Cadastro realizado com sucesso.');
            });
        });
    }
}

module.exports = Database;
