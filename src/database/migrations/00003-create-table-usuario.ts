import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('usuario', table => {
        table.increments('id').primary();
        table.string('nome', 50).notNullable();
        table.string('email', 70).notNullable();
        table.string('senha', 70);
        table.timestamp('create_time').defaultTo(Knex.fn.now())
        table.timestamp('update_time').defaultTo(Knex.fn.now())
        table.integer('perfil_id').notNullable().unsigned();
        table.integer('republica_id');
        table.integer('morador_id');

        table.foreign('perfil_id').references('perfil.id').onDelete('RESTRICT').onUpdate('RESTRICT');
        table.unique(['email'], { indexName: 'unique_email_usuarios', deferrable: 'deferred' });
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('usuario');
}