import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('estado', table => {
        table.string('id', 2).primary();
        table.string('estado', 60).notNullable();
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('estado');
}