import { EnumTipoPerfil } from './enums';

export default class TenantsSerive {

    constructor() { };

    static aplicarTenantRepublica(tipoPerfil: number, query: any, valorTenant: number, especificarTabelaNaRelacao: string = '') {
        let setarRepublicaId: boolean = false;
        if (tipoPerfil !== EnumTipoPerfil.AdministradorNossoCafofo) {
            setarRepublicaId = true;
        }

        if (setarRepublicaId) {
            query.where(`${especificarTabelaNaRelacao || especificarTabelaNaRelacao !== '' ? especificarTabelaNaRelacao + '.' : ''}republicaId`, '=', valorTenant);
        }
    }

}