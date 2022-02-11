import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.alterTable('usuario', table => {
        table.boolean('ativo').defaultTo(true);
    });
}

export async function down(Knex: Knex) { }