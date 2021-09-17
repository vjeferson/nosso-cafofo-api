import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('morador', table => {
        table.increments('id').primary();
        table.string('nome', 50).notNullable();
        table.integer('ano_entrada').notNullable();
        table.boolean('ativo').notNullable().defaultTo(true);

        table.integer('republica_id').notNullable().unsigned();
        table.foreign('republica_id').references('republica.id').onDelete('RESTRICT').onUpdate('RESTRICT');
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('morador');
}