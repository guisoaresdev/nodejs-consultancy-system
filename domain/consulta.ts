import { Model, DataTypes } from "sequelize";
import ErroConsulta from "./erro.consulta";
import Result from "./result";

/**
 * Classe Consulta
 */
class Consulta extends Model {
  /**
   * Método fábrica para validação dos dados e criação da Consulta.
   *
   * @param {number} idPaciente
   * @param {Date} dataConsulta
   * @param {string} horaInicial
   * @param {string} horaFinal
   * @returns Consulta ou uma lista de erros, em caso de erro de validação
   */
  static of(idPaciente, dataConsulta, horaInicial, horaFinal) {
    const errors = [];

    if (!idPaciente || typeof idPaciente !== "number")
      errors.push(ErroConsulta.ID_PACIENTE_INVALIDO);

    if (!dataConsulta || isNaN(new Date(dataConsulta).getTime()))
      errors.push(ErroConsulta.DATA_INVALIDA);

    if (!horaInicial || !/^\d{2}:\d{2}$/.test(horaInicial))
      errors.push(ErroConsulta.HORA_INICIAL_INVALIDA);

    if (!horaFinal || !/^\d{2}:\d{2}$/.test(horaFinal))
      errors.push(ErroConsulta.HORA_FINAL_INVALIDA);

    if (errors.length > 0) {
      return Result.failure(errors);
    }

    return Result.success(
      Consulta.build({ idPaciente, dataConsulta, horaInicial, horaFinal }),
    );
  }

  /**
   * Verifica se a consulta está em conflito com outra no mesmo horário para o mesmo paciente.
   *
   * @param {Date} dataConsulta
   * @param {string} horaInicial
   * @param {string} horaFinal
   * @returns {boolean} True se houver conflito, false caso contrário.
   */
  async temConflito(dataConsulta, horaInicial, horaFinal) {
    const consultas = await Consulta.findAll({
      where: { idPaciente: this.idPaciente, dataConsulta },
    });

    return consultas.some(
      (consulta) =>
        (horaInicial >= consulta.horaInicial &&
          horaInicial < consulta.horaFinal) ||
        (horaFinal > consulta.horaInicial && horaFinal <= consulta.horaFinal),
    );
  }

  /**
   * Cancela a consulta.
   *
   * @returns {boolean} True se cancelada com sucesso.
   */
  async cancelar() {
    if (new Date(this.dataConsulta) > new Date()) {
      await this.destroy();
      return true;
    }
    return false;
  }
}

export default Consulta;
