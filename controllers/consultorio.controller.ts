import PacienteRepository from "../repositories/paciente.repository";
import ConsultaRepository from "../repositories/consulta.repository";

export default class ConsultorioController {
  // Função para cadastrar um paciente
  async cadastrarPaciente(
    cpf: string,
    nome: string,
    dataNasc: Date,
  ): Promise<boolean> {
    try {
      const paciente = await PacienteRepository.salva({
        cpf,
        nome,
        data_nasc: dataNasc,
      });
      return paciente;
    } catch (error) {
      throw new Error("Erro ao cadastrar paciente: " + error.message);
    }
  }

  // Função para listar os pacientes
  async listarPacientes() {
    try {
      const pacientes = await PacienteRepository.buscaTodos();
      return pacientes;
    } catch (error) {
      throw new Error("Erro ao listar pacientes: " + error.message);
    }
  }

  // Função para agendar uma consulta
  async agendarConsulta(
    pacienteId: number,
    dataConsulta: Date,
    horaInicial: string,
    horaFinal: string,
  ) {
    try {
      const consulta = await ConsultaRepository.salva({
        paciente_id: pacienteId,
        data_consulta: dataConsulta,
        hora_inicial: horaInicial,
        hora_final: horaFinal,
      });
      return "Consulta agendada com sucesso!";
    } catch (error) {
      throw new Error("Erro ao agendar consulta: " + error.message);
    }
  }

  // Função para cancelar uma consulta
  async cancelarConsulta(cpf: string, dataConsulta: Date, horaInicial: string) {
    try {
      const consultas = await ConsultaRepository.buscaPorPacienteCPF(cpf);

      const agendamento = consultas.find(
        (consulta) =>
          consulta.data_consulta === dataConsulta &&
          consulta.hora_inicial === horaInicial,
      );

      if (agendamento) {
        await ConsultaRepository.remove(agendamento);
        return "Consulta cancelada com sucesso!";
      } else {
        return "Nenhum agendamento encontrado para este CPF e data.";
      }
    } catch (error) {
      throw new Error("Erro ao cancelar consulta: " + error.message);
    }
  }

  // Outras funções auxiliares para validações, como CPF, data, horário, etc.
  isCpfValido(cpf: string) {
    // Validação do CPF
  }

  validaData(data: Date) {
    // Validação de data
  }

  validaFormatoData(dataStr: string) {
    // Validação do formato de data
  }

  validarHorario(hora: string) {
    // Validação do formato de hora
  }
}
