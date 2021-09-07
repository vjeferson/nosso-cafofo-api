import { Knex } from 'knex';
import { EnumTipoPerfil } from '../../utils/enums';

export async function up(Knex: Knex) {
    const rows = [
        {
            descricao: 'Administrador',
            tipo_perfil: EnumTipoPerfil.AdministradorNossoCafofo
        }, {
            descricao: 'Administrador',
            tipo_perfil: EnumTipoPerfil.MoradorAdministrador
        }, {
            descricao: 'Morador',
            tipo_perfil: EnumTipoPerfil.Morador
        },
    ];

    Knex.transaction(transaction => {
        return Knex.batchInsert('perfil', rows)
            .transacting(transaction)
    }).then(() => {
        console.log('Perfis inseridos!')
    }).catch((error) => {
        console.log(`Erro ao inserir perfis: ${error.message}`)
    });
}

export async function down(Knex: Knex) { }