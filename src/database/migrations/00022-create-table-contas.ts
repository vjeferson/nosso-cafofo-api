import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('conta', table => {
        table.increments('id').primary();
        table.string('descricao', 70).notNullable();
        table.integer('situacao').notNullable();
        table.double('valor', 2, 21).notNullable();
        table.string('mes_ano_conta', 6).notNullable();
        table.boolean('divisao_por_igual_entre_moradores').defaultTo(true);
        table.integer('republica_id').notNullable().unsigned();

        table.foreign('republica_id').references('republica.id').onDelete('RESTRICT').onUpdate('RESTRICT');
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('conta');
}