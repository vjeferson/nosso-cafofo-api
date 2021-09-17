import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.alterTable('usuario', table => {
        table.foreign('republica_id').references('republica.id').onDelete('RESTRICT').onUpdate('RESTRICT');
        table.foreign('morador_id').references('morador.id').onDelete('RESTRICT').onUpdate('RESTRICT');
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.table('morador', table => {
        table.dropForeign('usuario_republica_id_foreign');
        table.dropForeign('usuario_morador_id_foreign ');
    });
}