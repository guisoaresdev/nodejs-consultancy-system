import Paciente from "../domain/paciente";
import Consulta from "../domain/consulta";

class PacienteRepository {
  /**
   * Salva um paciente no repositório (insert ou update)
   *
   * @param {Paciente} paciente
   */
  async salva(paciente: Paciente): Promise<void> {
    if (paciente !== null) await paciente.save();
  }

  /**
   * Remove um paciente do repositório
   *
   * @param {Paciente} paciente
   */
  async remove(paciente: Paciente): Promise<void> {
    if (paciente !== null) await paciente.destroy();
  }

  async removePorID(id: string): Promise<void> {
    if (id !== null) await Paciente.destroy({
      where: {
        id: id
      }
    })
  }

  async removePorCPF(cpf: string): Promise<void> {
    if (cpf !== null) await Paciente.destroy({
      where: {
        cpf: cpf
      }
    })
  }

  /**
   * Recupera um paciente pelo CPF
   *
   * @param {string} cpf
   * @returns {Promise<Paciente | null>} Paciente ou null, caso não exista
   */
  async buscaPorCPF(cpf: string): Promise<Paciente | null> {
    return await Paciente.findOne({ where: { cpf } });
  }
  
  async buscaPorID(id: string): Promise<Paciente | null> {
    return await Paciente.findOne({ where: { id }});
  }

  /**
   * Recupera todos os pacientes
   *
   * @returns {Promise<Paciente[]>} Lista de pacientes
   */
  async buscaTodos(): Promise<Paciente[]> {
    return await Paciente.findAll({
      include: [{
        model: Consulta,
        as: "consultas"
      }],
      order: [[{ model: Consulta, as: "consultas" }, 'dataConsulta', 'ASC']] // Ordena as consultas por data
    });
  }
}

const pacienteRepository = new PacienteRepository();

export default pacienteRepository;
