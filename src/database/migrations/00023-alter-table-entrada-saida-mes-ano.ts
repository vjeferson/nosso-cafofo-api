import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.alterTable('entrada_e_saida', table => {
        table.string('mes_ano_cobranca', 6).alter();
    });
}

export async function down(Knex: Knex) { }