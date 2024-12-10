import Consulta from "../domain/consulta";
import Paciente from "../domain/paciente";

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

  /**
   * Recupera uma consulta pelo ID
   *
   * @param {DataTypes.UUID} id
   * @returns {Promise<Consulta | null>} Consulta ou null, caso não exista
   */
  async buscaPorID(id: DataTypes.UUID): Promise<Consulta | null> {
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
    return await Consulta.findAll();
  }
}

const consultaRepository = new ConsultaRepository();

export default consultaRepository;
