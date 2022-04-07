import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.alterTable('usuario', table => {
        table.string('recovery_password_code', 70).defaultTo(null);
    });
}

export async function down(Knex: Knex) { }