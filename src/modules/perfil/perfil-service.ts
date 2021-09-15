import database from '../../database/connection';
import { IFiltroPerfil } from '../../interfaces/perfil-filter-interface';
import { IPerfil } from '../../interfaces/perfil-interface';

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

    async findOne(perfilId: number): Promise<IPerfil | null> {
        try {
            const perfil = await database('perfil')
                .select('perfil.*')
                .where('perfil.id', perfilId)
                .limit(1)
                .offset(0);

            if (Array.isArray(perfil) && perfil.length > 0) {
                return {
                    id: perfil[0].id,
                    descricao: perfil[0].descricao,
                    tipoPerfil: perfil[0].tipo_perfil
                } as IPerfil;
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

}