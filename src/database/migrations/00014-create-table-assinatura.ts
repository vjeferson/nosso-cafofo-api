import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('assinatura', table => {
        table.increments('id').primary();

        table.date('validade_plano').notNullable();
        table.date('data_assinatura').notNullable();
        table.boolean('ativa').notNullable().defaultTo('false');

        table.integer('republica_id').notNullable().unsigned();
        table.integer('plano_id').notNullable().unsigned();

        table.foreign('republica_id').references('republica.id').onDelete('RESTRICT').onUpdate('RESTRICT');
        table.foreign('plano_id').references('plano.id').onDelete('RESTRICT').onUpdate('RESTRICT');
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('assinatura');
}