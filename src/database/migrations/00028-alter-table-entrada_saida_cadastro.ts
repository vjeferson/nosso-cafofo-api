import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.alterTable('entrada_e_saida', table => {
        table.string('descricao', 50).notNullable();
    });
}

export async function down(Knex: Knex) { }