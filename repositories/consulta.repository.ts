import Consulta from "../domain/consulta";
import Paciente from "../domain/paciente";
import { Op } from "sequelize";

class ConsultaRepository {
  /**
   * Salva uma consulta no repositório (insert ou update)
   *
   * @param {Consulta} consulta
   */
  async salva(consulta: Consulta): Promise<void> {
    if (consulta !== null) await consulta.save();
  }

  /**
   * Remove uma consulta do repositório
   *
   * @param {Consulta} consulta
   */
  async remove(consulta: Consulta): Promise<void> {
    if (consulta !== null) await consulta.destroy();
  }

  async buscaConsultasValidasPorCPF(cpf: string): Promise<Consulta[]> {
    const paciente = await Paciente.findOne({where: { cpf }});
    if (!paciente) {
      return [];
    }

    const consultasValidas = await Consulta.findAll({
      where: {
        idPaciente: paciente.dataValues.id,
        dataConsulta: {
          [Op.gt]: new Date(),
        },
      },
    });

    return consultasValidas;
  }

  /**
    * Remove uma consulta com base em dataConsulta, horaInicial e horaFinal
    *
    * @param {string} cpf - CPF do Paciente
    * @param {Date} dataConsulta - Data da consulta
    * @param {string} horaInicial - Hora inicial da consulta (formato "HH:mm")
    * @returns {Promise<number>} Número de consultas removidas
    */
  async removePorDataEHorario(cpf: string, dataConsulta: Date, horaInicial: string): Promise<number> {
    const paciente = await Paciente.findOne({where: { cpf }});
    if (!paciente) {
      return 0;
    }

    const consultasRemovidas = await Consulta.destroy({
      where: {
        idPaciente: paciente.dataValues.id,
        dataConsulta: {
          [Op.eq]: dataConsulta,
        },
        horaInicial: {
          [Op.eq]: horaInicial,
        },
      },
    });

    return consultasRemovidas;
  }

  /**
   * Remove todas as consultas inválidas (data anterior à data atual)
   *
   * @returns {Promise<number>} Número de consultas removidas
   */
  async removeConsultasInvalidas(): Promise<number> {
    const hoje = new Date();
    const consultasRemovidas = await Consulta.destroy({
      where: {
        dataConsulta: {
          [Op.lt]: hoje, // Condição: dataConsulta < hoje
        },
      },
    });
    return consultasRemovidas;
  }

  /**
   * Recupera uma consulta pelo ID
   *
   * @param {DataTypes.UUID} id
   * @returns {Promise<Consulta | null>} Consulta ou null, caso não exista
   */
  async buscaPorID(id: string): Promise<Consulta | null> {
    return await Consulta.findByPk(id);
  }

  /**
   * Recupera todas as consultas de um paciente pelo CPF do paciente
   *
   * @param {string} cpf
   * @returns {Promise<Consulta[]>} Lista de consultas
   */
  async buscaPorPacienteCPF(cpf: string): Promise<Consulta[]> {
    return await Consulta.findAll({
      include: {
        model: Paciente,
        as: "paciente",
        where: { cpf },
      },
    });
  }

  /**
   * Recupera todas as consultas
   *
   * @returns {Promise<Consulta[]>} Lista de consultas
   */
  async buscaTodas(): Promise<Consulta[]> {
    return await Consulta.findAll({
      include: [
        {
          model: Paciente, // Modelo do paciente
          as: "paciente", // Alias usado no relacionamento
          attributes: ["nome", "cpf"], // Apenas os atributos necessários
        },
      ],
      order: [['dataConsulta', 'ASC']]
    });
  }
}

const consultaRepository = new ConsultaRepository();

export default consultaRepository;
