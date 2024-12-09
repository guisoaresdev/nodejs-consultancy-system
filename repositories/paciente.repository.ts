import Paciente from "../domain/paciente";

class RepositorioPaciente {
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

  /**
   * Recupera um paciente pelo CPF
   *
   * @param {string} cpf
   * @returns {Promise<Paciente | null>} Paciente ou null, caso não exista
   */
  async buscaPorCPF(cpf: string): Promise<Paciente | null> {
    return await Paciente.findOne({ where: { cpf } });
  }

  /**
   * Recupera todos os pacientes
   *
   * @returns {Promise<Paciente[]>} Lista de pacientes
   */
  async buscaTodos(): Promise<Paciente[]> {
    return await Paciente.findAll();
  }
}

const repositorioPaciente = new RepositorioPaciente();

export default repositorioPaciente;
