import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('republica', table => {
        table.increments('id').primary();
        table.string('nome', 50).notNullable();
        table.integer('ano_criacao');
        table.integer('data_pagamento_contas').notNullable();
        table.string('numero', 10).notNullable();
        table.string('logradouro', 70).notNullable();
        table.string('complemento', 45);
        table.string('estado_id', 2).notNullable().unsigned();
        table.integer('cidade_id').notNullable().unsigned();

        table.foreign('estado_id').references('estado.id').onDelete('RESTRICT').onUpdate('RESTRICT');
        table.foreign('cidade_id').references('cidade.id').onDelete('RESTRICT').onUpdate('RESTRICT');
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('republica');
}