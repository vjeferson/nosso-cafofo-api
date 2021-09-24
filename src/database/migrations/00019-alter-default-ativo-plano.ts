import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.alterTable('plano', table => {
        table.boolean('ativo').notNullable().defaultTo('false').alter();
    });
}

export async function down(Knex: Knex) { }