export enum EnumTipoPerfil {
    AdministradorNossoCafofo = 0,
    MoradorAdministrador,
    Morador
}

export enum EnumTipoPlano {
    Mensal = 1,
    Semestral,
    Anual,
    PromocionalAnual,
    Free = 99
}

export enum EnumTipoMovimentoEntradaSaida {
    Entrada,
    Saida
}

export enum EnumSituacaoValoresMensaisMorador {
    EmAberto,
    Pago,
    Atrasado
}

export enum EnumSituacaoFesta {
    EmAberto,
    Finalizada,
    Cancelada = 99
}

export enum EnumSituacaoPagamentoParticipanteFesta {
    EmAberto,
    Pago,
    Devolvido
}

export enum EnumLoteFesta {
    Promocional,
    Primeiro,
    Segundo,
    Terceiro,
    Quarto,
    Quinto,
    Extra
}

export enum EnumSituacaoConta {
    EmAberto,
    PagamentoParcial,
    Pago
}