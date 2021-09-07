import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('perfil', table => {
        table.increments('id').primary();
        table.string('descricao', 50).notNullable();
        table.integer('tipo_perfil').notNullable();
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('perfil');
}