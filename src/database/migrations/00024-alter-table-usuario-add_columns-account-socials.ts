import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.alterTable('usuario', table => {
        table.string('facebook_id', 64);
        table.string('google_id', 64);
    });
}

export async function down(Knex: Knex) { }