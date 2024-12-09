import PacienteRepository from "../repositories/paciente.repository";
import ConsultaRepository from "../repositories/consulta.repository";
import Paciente from "../domain/paciente";
import Consulta from "../domain/consulta";

class ConsultorioService {
  async cadastrarPaciente(
    cpf: string,
    nome: string,
    dataNasc: Date,
  ): Promise<boolean> {
    try {
      const idade = this.calcularIdade(dataNasc);
      console.log("CPF:", cpf);
      console.log("Nome:", nome);
      console.log("Data de nascimento:", dataNasc);
      console.log("Idade:", idade);
      const result = Paciente.of(cpf, nome, dataNasc, idade);
      if (result.isSuccess) {
        const paciente = result.value; // Aqui `value` é seguro de acessar
        await PacienteRepository.salva(paciente);
        return true;
      } else {
        console.log(result.errors); // Erros da validação
        return false;
      }
    } catch (error) {
      console.error("Erro ao criar paciente: ", error);
      return false;
    }
  }

  async agendarConsulta(
    pacienteId: number,
    dataConsulta: Date,
    horaInicial: string,
    horaFinal: string,
  ): Promise<string> {
    try {
      // Usando build ao invés de new
      const consulta = Consulta.build({
        pacienteId,
        dataConsulta,
        horaInicial,
        horaFinal,
      });

      await ConsultaRepository.salva(consulta);
      return "Consulta agendada com sucesso!";
    } catch (error) {
      throw new Error("Erro ao agendar consulta: " + error.message);
    }
  }

  async cancelarConsulta(
    cpf: string,
    dataConsulta: Date,
    horaInicial: string,
  ): Promise<string> {
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

  // Método para verificar se paciente existe por CPF
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
