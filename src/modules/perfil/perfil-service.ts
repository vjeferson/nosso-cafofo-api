import database from '../../database/connection';
import { IFiltroPerfil } from './perfil-filter-interface';

export default class PerfilService {
    constructor() { };

    async find(filters: IFiltroPerfil) {
        try {
            const tipoPerfil = !isNaN(+(filters.tipoPerfil as any)) && filters.tipoPerfil !== null && filters.tipoPerfil !== undefined ?
                +(filters.tipoPerfil as any) : null;
            const descricao: string = filters.descricao as string;

            const perfis = await database('perfil')
                .select('perfil.*')
                .where((builder) => {
                    if (tipoPerfil) {
                        builder.where('perfil.tipo_perfil', tipoPerfil);
                    }
                    if (descricao) {
                        builder.where('perfil.descricao', 'like', `%${descricao}%`);
                    }
                });
            return perfis;
        } catch (error) {
            throw error;
        }
    }

    async findOne(perfilId: number) {
        try {
            const perfil = await database('perfil')
                .select('perfil.*')
                .where('perfil.id', perfilId);
            return perfil;
        } catch (error) {
            throw error;
        }
    }

}