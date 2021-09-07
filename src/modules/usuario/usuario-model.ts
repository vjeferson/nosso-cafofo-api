export interface IUsuario {
    id?: number;
    nome: string;
    email: string;
    senha?: string;
    create_time?: Date;
    update_time?: Date;
    perfil_id: number;
    republica_id?: number;
    morador_id?: number;
}