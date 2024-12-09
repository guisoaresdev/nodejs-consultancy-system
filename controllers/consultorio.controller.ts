import ConsultorioService from "../services/consultorio.service";

export default class ConsultorioController {

  // Função para cadastrar um paciente
  async cadastrarPaciente(cpf: string, nome: string, dataNasc: Date): Promise<string> {
    try {
      const resultado = await ConsultorioService.cadastrarPaciente(cpf, nome, dataNasc);
      if (resultado) {
        return "Paciente cadastrado com sucesso!";
      } else {
        return "Erro ao cadastrar paciente.";
      }
    } catch (error) {
      throw new Error("Erro ao cadastrar paciente: " + error.message);
    }
  }

  async listarPacientes(): Promise<any[]> {
    try {
      const pacientes = await ConsultorioService.buscarPacientes();
      return pacientes;
    } catch (error) {
      throw new Error("Erro ao listar pacientes: " + error.message);
    }
  }

  async agendarConsulta(pacienteId: number, dataConsulta: Date, horaInicial: string, horaFinal: string): Promise<string> {
    try {
      const resultado = await ConsultorioService.agendarConsulta(pacienteId, dataConsulta, horaInicial, horaFinal);
      return resultado;
    } catch (error) {
      throw new Error("Erro ao agendar consulta: " + error.message);
    }
  }

  async cancelarConsulta(cpf: string, dataConsulta: Date, horaInicial: string): Promise<string> {
    try {
      const resultado = await ConsultorioService.cancelarConsulta(cpf, dataConsulta, horaInicial);
      return resultado;
    } catch (error) {
      throw new Error("Erro ao cancelar consulta: " + error.message);
    }
  }

  async buscaPacientePorCPF(cpf: string): Promise<boolean> {
    try {
      const pacienteExiste = await ConsultorioService.buscaPacientePorCPF(cpf);
      return pacienteExiste;
    } catch (error) {
      console.log("Erro ao buscar por CPF: ", error.message);
      return false;
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
