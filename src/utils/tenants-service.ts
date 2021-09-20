import { EnumTipoPerfil } from './enums';

export default class TenantsSerive {

    constructor() { };

    static aplicarTenantRepublica(tipoPerfil: number, query: any, valorTenant: number) {
        let setarRepublicaId: boolean = false;
        if (tipoPerfil !== EnumTipoPerfil.AdministradorNossoCafofo) {
            setarRepublicaId = true;
        }

        if (setarRepublicaId) {
            query.where('republicaId', '=', valorTenant);
        }
    }

}