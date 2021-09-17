import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('participantes_festa', table => {
        table.increments('id').primary();
        table.string('nome', 50).notNullable();
        table.double('valor', 2).notNullable().defaultTo(0);
        table.integer('lote').notNullable();
        table.integer('situacao').notNullable();

        table.integer('republica_id').notNullable().unsigned();
        table.integer('festa_id').notNullable().unsigned();
        
        table.foreign('republica_id').references('republica.id').onDelete('RESTRICT').onUpdate('RESTRICT');
        table.foreign('festa_id').references('festa.id').onDelete('RESTRICT').onUpdate('RESTRICT');
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('participantes_festa');
}