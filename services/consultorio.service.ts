import PacienteRepository from "../repositories/paciente.repository";
import ConsultaRepository from "../repositories/consulta.repository";
import Paciente from "../domain/paciente";
import Consulta from "../domain/consulta";

class ConsultorioService { 
  async cadastrarPaciente(cpf: string, nome: string, dataNasc: Date): Promise<boolean> {
    try {
      const idade = this.calcularIdade(dataNasc);
      const paciente = Paciente.build({ cpf: cpf, nome: nome, data_nasc: dataNasc, idade: idade });
      await PacienteRepository.salva(paciente);
    } catch (error) {
      console.error(error);
    }
  }

  async agendarConsulta(pacienteId: number, dataConsulta: Date, horaInicial: string, horaFinal: string): Promise<string> {
    try {
      const consulta = Consulta.build({ pacienteId, dataConsulta, horaInicial, horaFinal });
      await ConsultaRepository.salva(consulta);
      return "Consulta agendada com sucesso!";
    } catch (error) {
      throw new Error("Erro ao agendar consulta: " + error.message);
    }
  }

  async cancelarConsulta(cpf: string, dataConsulta: Date, horaInicial: string): Promise<string> {
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

  async buscarPacientes(): Promise<Paciente[]> {
    try {
      return await PacienteRepository.buscaTodos();
    } catch (error) {
      throw new Error("Erro ao buscar pacientes: " + error.message);
    }
  }

  async buscaPacientePorCPF(cpf: string): Promise<boolean> {
    try {
      const paciente = await PacienteRepository.buscaPorCPF(cpf);
      return paciente !== null;
    } catch (error) {
      throw new Error("Erro ao buscar paciente por CPF: " + error.message);
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
