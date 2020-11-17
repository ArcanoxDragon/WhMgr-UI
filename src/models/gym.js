'use strict';

const config = require('../config.json');
const MySQLConnector = require('../services/mysql.js');
const db = new MySQLConnector(config.db.brock);

class Gym {
    constructor(subscriptionId, guildId, userId, name) {
        this.subscriptionId = subscriptionId;
        this.guildId = guildId;
        this.userId = userId;
        this.name = name;
    }

    async create() {
        const sql = `
        INSERT INTO gyms (subscription_id, guild_id, user_id, name)
        VALUES (?, ?, ?, ?)
        `;
        const args = [
            this.subscriptionId,
            this.guildId, this.userId,
            this.name
        ];
        const result = await db.query(sql, args);
        return result.affectedRows === 1;
    }

    static async getAll(guildId, userId) {
        const sql = `
        SELECT subscription_id, guild_id, user_id, name
        FROM gyms
        WHERE guild_id = ? AND user_id = ?
        `;
        const args = [guildId, userId];
        const results = await db.query(sql, args);
        if (results && results.length > 0) {
            const list = [];
            results.forEach(result => {
                list.push(new Gym(
                    result.subscription_id,
                    result.guild_id,
                    result.user_id,
                    result.name
                ));
            });
            return list;
        }
        return null;
    }

    static async getByName(guildId, userId, name) {
        const sql = `
        SELECT subscription_id, guild_id, user_id, name
        FROM gyms
        WHERE guild_id = ? AND user_id = ? AND name = ?
        `;
        const args = [guildId, userId, name];
        const results = await db.query(sql, args);
        if (results && results.length > 0) {
            const result = results[0];
            return new Gym(
                result.subscription_id,
                result.guild_id,
                result.user_id,
                result.name
            );
        }
        return null;
    }
    
    static async getById(id) {
        const sql = `
        SELECT subscription_id, guild_id, user_id, name
        FROM gyms
        WHERE id = ?
        `;
        const args = [id];
        const results = await db.query(sql, args);
        if (results && results.length > 0) {
            const result = results[0];
            return new Gym(
                result.subscription_id,
                result.guild_id,
                result.user_id,
                result.name
            );
        }
        return null;
    }

    static async delete(guildId, userId, name) {
        const sql = `
        DELETE FROM gyms
        WHERE guild_id = ? AND user_id = ? AND name = ?
        `;
        const args = [guildId, userId, name];
        const result = await db.query(sql, args);
        return result.affectedRows === 1;
    }

    static async deleteById(id) {
        const sql = `
        DELETE FROM gyms
        WHERE id = ?
        `;
        const args = [id];
        const result = await db.query(sql, args);
        return result.affectedRows === 1;
    }

    static async deleteAll(guildId, userId) {
        const sql = `
        DELETE FROM gyms
        WHERE guild_id = ? AND user_id = ?
        `;
        const args = [guildId, userId];
        const result = await db.query(sql, args);
        return result.affectedRows > 0;
    }

    async save() {
        const sql = `
        UPDATE gyms
        SET name = ?
        WHERE guild_id = ? AND user_id = ? AND id = ?
        `;
        const args = [
            this.name,
            this.guildId,
            this.userId,
            this.id
        ];
        const result = await db.query(sql, args);
        return result.affectedRows === 1;
    }
}

module.exports = Gym;
