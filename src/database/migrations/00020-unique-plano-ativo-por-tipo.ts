import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.alterTable('plano', table => {
        table.boolean('ativo').defaultTo(null).alter();
        table.unique(['tipo_plano', 'ativo'], { indexName: 'unique_tipo_plano_ativo', deferrable: 'deferred' });
    });
}

export async function down(Knex: Knex) { }