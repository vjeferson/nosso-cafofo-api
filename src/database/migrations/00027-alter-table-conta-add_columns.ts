import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.alterTable('conta', table => {
        table.renameColumn('mes_ano_conta', 'mes_ano_divisao_conta');
        table.date('data_conta').notNullable();
        table.integer('morador_id').unsigned();

        table.foreign('morador_id').references('morador.id')
            .onDelete('RESTRICT').onUpdate('RESTRICT');
    });
}

export async function down(Knex: Knex) { }