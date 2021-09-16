import { Knex } from 'knex';

export async function up(Knex: Knex) {
    const rows = [
        {
            nome: 'Adm Nosso Cafofo',
            perfil_id: 1,
            email: 'valdecijpr@gmail.com',
            senha: 'c698e48cd9f5dcc2ff451beea2008df073ceeb3a7cd90a49c46dd16f05458e95',
            create_time: new Date(),
            update_time: new Date()
        }
    ];

    Knex.transaction(transaction => {
        return Knex.batchInsert('usuario', rows)
            .transacting(transaction)
    }).then(() => {
        console.log('Usuário Adm Nosso Cafofo inserido!')
    }).catch((error) => {
        console.log(`Erro ao inserir usuário Adm Nosso Cafofo: ${error.message}`)
    });
}

export async function down(Knex: Knex) { }