import database from '../../database/connection';
import { IFiltroPerfil } from './perfil-filter-model';

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

    // async create(data: any) {
    //     const {
    //         name,
    //         avatar,
    //         whatsapp,
    //         bio,
    //         subject,
    //         cost,
    //         schedule
    //     } = data;

    //     const transaction = await database.transaction();

    //     try {
    //         const insertedUsersIds = await transaction('users').insert({
    //             name,
    //             avatar,
    //             whatsapp,
    //             bio
    //         });
    //         const user_id = insertedUsersIds[0];

    //         const insertedClassesIds = await transaction('classes').insert({
    //             subject,
    //             cost,
    //             user_id
    //         });
    //         const class_id = insertedClassesIds[0];

    //         const classSchedule = schedule.map((element: ScheduleItem) => {
    //             return {
    //                 class_id,
    //                 week_day: element.week_day,
    //                 from: converteHourToMinutes(element.from),
    //                 to: converteHourToMinutes(element.to)
    //             }
    //         });

    //         await transaction('class_schedule').insert(classSchedule);
    //         await transaction.commit();
    //     } catch (error) {
    //         await transaction.rollback();
    //         throw error;
    //     }
    // }
}