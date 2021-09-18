import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('fatura', table => {
        table.increments('id').primary();
        table.integer('parcela').notNullable().defaultTo(1);
        table.integer('numero_parcelas').notNullable().defaultTo(1);
        table.double('valor_parcela', 2, 21).notNullable();
        table.date('data_vencimento').notNullable();
        table.date('data_pagamento').notNullable();
        table.integer('situacao_pagamento').notNullable().defaultTo(1);
        table.double('valor_original', 2, 21).notNullable();
        table.double('valor_juros', 2, 21).notNullable().defaultTo(0);
        table.double('valor_multa', 2, 21).notNullable().defaultTo(0);

        table.integer('republica_id').notNullable().unsigned();
        table.integer('assinatura_id').notNullable().unsigned();
        table.foreign('republica_id').references('republica.id').onDelete('RESTRICT').onUpdate('RESTRICT');
        table.foreign('assinatura_id').references('assinatura.id').onDelete('RESTRICT').onUpdate('RESTRICT');
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('fatura');
}