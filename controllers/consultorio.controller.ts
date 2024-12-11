import ConsultorioService from "../services/consultorio.service";
import Paciente from "../domain/paciente";

export default class ConsultorioController {

  async cadastrarPaciente(cpf: string, nome: string, dataNasc: Date): Promise<string> {
    try {
      const idPaciente = await ConsultorioService.cadastrarPaciente(cpf, nome, dataNasc);
      return idPaciente;
    } catch (error) {
      throw new Error("Erro ao cadastrar paciente: " + error.message);
    }
  }

  async listarPacientes(): Promise<Paciente[]> {
    try {
      const pacientes = await ConsultorioService.buscarPacientes();
      return pacientes;
    } catch (error) {
      throw new Error("Erro ao listar pacientes: " + error.message);
    }
  }

  async listarConsultas(): Promise<any[]> {
    try {
      const consultas = await ConsultorioService.buscarConsultas();
      return consultas;
    } catch (error) {
      throw new Error("Erro ao listar consultas: " + error.message);
    }
  }

  async agendarConsulta(pacienteId: string, dataConsulta: Date, horaInicial: string, horaFinal: string): Promise<boolean> {
    try {
      const resultado = await ConsultorioService.agendarConsulta(pacienteId, dataConsulta, horaInicial, horaFinal);
      return resultado;
    } catch (error) {
      throw new Error("Erro ao agendar consulta: " + error.message);
    }
  }

  async cancelarConsulta(cpf: string, dataConsulta: Date, horaInicial: string): Promise<boolean> {
    try {
      const resultado = await ConsultorioService.cancelarConsulta(cpf, dataConsulta, horaInicial);
      return resultado;
    } catch (error) {
      throw new Error("Erro ao cancelar consulta: " + error.message);
    }
  }

  async limparConsultasInvalidas(): Promise<boolean> {
    try {
      const consultas = await ConsultorioService.limparConsultasInvalidas();
      return consultas;
    } catch (error) {
      throw new Error("Erro ao listar consultas: " + error.message);
    }
  }

  async buscarConsultasValidasPorCPF(cpf: string): Promise<boolean> {
    try {
      const validas = await ConsultorioService.buscaConsultasValidasPorCPF(cpf);
      return validas;
    } catch (error) {
      throw new Error("Erro ao buscar consultas válidas por cpf: ", error.message);
    }
  }

  async removerPacientePorCPF(cpf: string): Promise<boolean> {
    try {
      const resultado = await ConsultorioService.removerPacientePorCPF(cpf);
      return resultado;
    } catch (error) {
      throw new Error("Erro ao cancelar consulta: " + error.message);
    }
  }

  async buscaPacientePorCPF(cpf: string): Promise<Paciente | null> {
    try {
      const pacienteExiste = await ConsultorioService.buscaPacientePorCPF(cpf);
      return pacienteExiste;
    } catch (error) {
      console.log("Erro ao buscar por CPF: ", error.message);
      return null;
    }
  }

  async buscaPacientePorId(id: string): Promise<Paciente | null> {
    try {
      const pacienteExiste = await ConsultorioService.buscaPacientePorID(id);
      return pacienteExiste;
    } catch (error) {
      console.log("Erro ao buscar por ID: ", error.message);
      return null;
    }
  }

  isCpfValido(cpf: string) {
  }

  validaData(data: Date) {
  }

  validaFormatoData(dataStr: string) {
  }

  validarHorario(hora: string) {
  }
}
