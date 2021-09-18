import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('valores_mensais_morador', table => {
        table.increments('id').primary();
        table.integer('mes').notNullable();
        table.integer('ano').notNullable();
        table.integer('dia_pagamento_contas_republica').notNullable();
        table.double('valor_contas', 2, 21).notNullable();
        table.double('valor_saidas', 2, 21).notNullable().defaultTo(0);
        table.double('valor_final', 2, 21).notNullable();
        table.integer('situacao').notNullable().defaultTo(0);

        table.integer('republica_id').notNullable().unsigned();
        table.integer('morador_id').notNullable().unsigned();
        table.foreign('republica_id').references('republica.id').onDelete('RESTRICT').onUpdate('RESTRICT');
        table.foreign('morador_id').references('morador.id').onDelete('RESTRICT').onUpdate('RESTRICT');
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('valores_mensais_morador');
}