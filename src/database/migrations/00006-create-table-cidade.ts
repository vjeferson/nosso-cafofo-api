import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('cidade', table => {
        table.increments('id').primary();
        table.string('cidade', 60).notNullable();
        table.string('estado_id', 2).notNullable().unsigned();

        table.foreign('estado_id').references('estado.id').onDelete('RESTRICT').onUpdate('RESTRICT');
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('cidade');
}