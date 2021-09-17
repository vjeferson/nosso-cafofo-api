import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('reuniao', table => {
        table.increments('id').primary();
        table.string('descricao', 50).notNullable();
        table.text('anotacoes');
        table.dateTime('data').notNullable();

        table.integer('republica_id').notNullable().unsigned();
        table.foreign('republica_id').references('republica.id').onDelete('RESTRICT').onUpdate('RESTRICT');
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('reuniao');
}