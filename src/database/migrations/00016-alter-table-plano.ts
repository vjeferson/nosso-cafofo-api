import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.alterTable('plano', table => {
        table.dropColumn('plano');
        table.renameColumn('numero_parcelas', 'numero_maximo_parcelas_pagamento');
        table.string('recorrencia', 40).notNullable().alter();
    });
}

export async function down(Knex: Knex) { }