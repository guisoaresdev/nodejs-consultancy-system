/**
 * Classe que representa os erros de validação da Consulta
 */
class ErroConsulta {
  static get ID_PACIENTE_INVALIDO() {
    return 1;
  }

  static get DATA_INVALIDA() {
    return 2;
  }

  static get HORA_INICIAL_INVALIDA() {
    return 3;
  }

  static get HORA_FINAL_INVALIDA() {
    return 4;
  }

  static get CONFLITO_HORARIO() {
    return 5;
  }
}

export default ErroConsulta;
