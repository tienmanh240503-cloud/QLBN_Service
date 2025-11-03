import { 
    getAll, getById, create, updateById, deleteById, 
    findOne, find 
} from './data.model.js';
import { DB_CONFID } from '../configs/db.config.js';

class GenericModel {
    constructor(tableName, primaryKey) {
        this.table = tableName;
        this.primaryKey = primaryKey;
    }

    async getAll(sortField = this.primaryKey, sortOrder = 'ASC') {
        return await getAll(this.table, sortField, sortOrder);
    }

    async getById(id) {
        return await getById(this.table, this.primaryKey, id);
    }

    async create(newData) {
        return await create(this.table, newData);
    }

    async update(updateData, id) {
        return await updateById(this.table, updateData, this.primaryKey, id);
    }

    async delete(id) {
        return await deleteById(this.table, this.primaryKey, id);
    }
    async deleteMany(conditions) {
        return await deleteMany(this.table, conditions);
    }
    async findOne(finds) {
        return await findOne(this.table, finds);
    }

    async findAll(finds) {
        return await find(this.table, finds);
    }
}

export default GenericModel;
