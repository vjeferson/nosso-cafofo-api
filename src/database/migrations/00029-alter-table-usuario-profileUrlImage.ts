import { Knex } from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.alterTable('usuario', table => {
        table.string('profile_url_image').defaultTo(null);
    });
}

export async function down(Knex: Knex) { }