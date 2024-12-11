import PacienteRepository from "../repositories/paciente.repository";
import ConsultaRepository from "../repositories/consulta.repository";
import Paciente from "../domain/paciente";
import Consulta from "../domain/consulta";

// TODO: Remover todos os returns com console.log

class ConsultorioService { 
  async cadastrarPaciente(cpf: string, nome: string, dataNasc: Date): Promise<string> {
    try {
      const idade = this.calcularIdade(dataNasc);
      const paciente = Paciente.build({ cpf: cpf, nome: nome, data_nasc: dataNasc, idade: idade });
      await PacienteRepository.salva(paciente);
      const idPaciente = paciente.dataValues.id;
      return idPaciente;
    } catch (error) {
      console.error(error);
      return "";
    }
  }

  async agendarConsulta(idPaciente: string, dataConsulta: Date, horaInicial: string, horaFinal: string): Promise<boolean> {
    try {
      const consulta = Consulta.build({ idPaciente, dataConsulta, horaInicial, horaFinal });
      await ConsultaRepository.salva(consulta);
      return true;
    } catch (error) {
      return false;
    }
  }

  async cancelarConsulta(cpf: string, dataConsulta: Date, horaInicial: string): Promise<boolean> {
    try {
      const consultasRemovidas = await ConsultaRepository.removePorDataEHorario(cpf, dataConsulta, horaInicial);
      if (consultasRemovidas > 0) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error("Erro ao cancelar consulta: " + error.message);
    }
  }

  async limparConsultasInvalidas(): Promise<boolean> {
    try {
      const consultasRemovidas = await ConsultaRepository.removeConsultasInvalidas();
      if (consultasRemovidas > 0) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error("Erro ao cancelar consulta: " + error.message);
    }
  }

  async buscaConsultasValidasPorCPF(cpf: string): Promise<boolean> {
    try {
      const consultasValidas = await ConsultaRepository.buscaConsultasValidasPorCPF(cpf);
      if (consultasValidas.length !== 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error("Erro ao buscar consultas validas por CPF:");
    }

  }


  async removerPacientePorCPF(cpf: string): Promise<boolean> {
    try {
      const consultasRemovidas = await PacienteRepository.removePorCPF(cpf);
      return true;
    } catch (error) {
      throw new Error("Erro ao cancelar consulta: " + error.message);
    }
  }

  async buscarPacientes(): Promise<Paciente[]> {
    try {
      return await PacienteRepository.buscaTodos();
    } catch (error) {
      throw new Error("Erro ao buscar pacientes: " + error.message);
    }
  }

  async buscarConsultas(): Promise<Consulta[]> {
    try {
      return await ConsultaRepository.buscaTodas();
    } catch (error) {
      throw new Error("Erro ao buscar consultas: " + error.message);
    }
  }

  async buscaPacientePorCPF(cpf: string): Promise<Paciente | null> {
    try {
      const paciente = await PacienteRepository.buscaPorCPF(cpf);
      if (paciente !== null) {
        return paciente;
      }
      return null;
    } catch (error) {
      throw new Error("Erro ao buscar paciente por CPF: " + error.message);
    }
  }

  async buscaPacientePorID(id: string): Promise <Paciente | null> {
    try {
      const paciente = await PacienteRepository.buscaPorID(id);
      return paciente;
    } catch (error) {
      throw new Error("Erro ao buscar paciente por ID: " + error.message);
    }
  }

  calcularIdade(dataNasc: Date): number {
    const hoje = new Date();
    const nascimento = new Date(dataNasc);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  }
}

const consultorioService = new ConsultorioService();
export default consultorioService;
