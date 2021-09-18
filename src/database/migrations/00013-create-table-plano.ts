import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('plano', table => {
        table.increments('id').primary();
        table.integer('tipo_plano').notNullable();
        table.string('plano', 40).notNullable();
        table.string('descricao', 70).notNullable();
        table.integer('numero_parcelas').notNullable();
        table.integer('recorrencia').notNullable();
        table.double('valor_plano', 2, 21).notNullable().defaultTo(0);
        table.boolean('ativo').notNullable().defaultTo('true');
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('plano');
}