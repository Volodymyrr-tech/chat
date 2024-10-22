"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const private_messages_entity_1 = require("../modules/messages/entities/private-messages.entity");
const group_messages_entity_1 = require("../modules/messages/entities/group-messages.entity");
const users_entity_1 = require("../modules/users/users.entity");
const groups_entity_1 = require("../modules/groups/groups.entity");
exports.typeOrmConfig = {
    type: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "password",
    database: process.env.POSTGRES_DB || "chat",
    entities: [users_entity_1.User, groups_entity_1.Group, private_messages_entity_1.PrivateMessage, group_messages_entity_1.GroupMessage],
    synchronize: true,
    autoLoadEntities: true,
};
//# sourceMappingURL=ormconfig.js.map