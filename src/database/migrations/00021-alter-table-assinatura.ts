import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.alterTable('assinatura', table => {
        table.date('validade_plano').alter();
    });
}

export async function down(Knex: Knex) { }