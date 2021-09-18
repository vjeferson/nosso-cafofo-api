import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('entrada_e_saida', table => {
        table.increments('id').primary();
        table.integer('tipo_movimento').notNullable();
        table.double('valor_movimentado', 2, 21).notNullable();
        table.date('data_movimento').notNullable();
        table.date('data_pagamento');
        table.integer('entrada_ou_saida_pagamento_morador').unsigned();
        table.boolean('considerar_na_soma_mensal_do_morador');
        table.string('mes_ano_cobranca', 5);

        table.integer('republica_id').notNullable().unsigned();
        table.integer('morador_id').unsigned();
        table.foreign('republica_id').references('republica.id').onDelete('RESTRICT').onUpdate('RESTRICT');
        table.foreign('morador_id').references('morador.id').onDelete('RESTRICT').onUpdate('RESTRICT');
        table.foreign('entrada_ou_saida_pagamento_morador').references('entrada_e_saida.id').onDelete('RESTRICT').onUpdate('RESTRICT');
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('entrada_e_saida');
}