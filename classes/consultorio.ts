import Agenda from "./agenda.ts";
import Paciente from "./paciente.ts";

export default class Consultorio {
  private agenda: Agenda;
  private pacientes: Paciente[];

  constructor(agenda: Agenda, pacientes: Paciente[]) {
    this.agenda = agenda;
    this.pacientes = pacientes;
  }

  getAgenda() {
    return this.agenda;
  }

  getPacientes() {
    return this.pacientes;
  }

  cancelaConsulta(
    cpf: string,
    dataConsulta: Date,
    horaInicial: string,
    agenda: Agenda,
  ): boolean {
    const agendamentoIndex = agenda
      .getListaAgendamento()
      .findIndex(
        ({ paciente, data_consulta, hora_inicial }) =>
          paciente.getCpf() === cpf &&
          data_consulta.getTime() === dataConsulta.getTime() &&
          hora_inicial === horaInicial,
      );

    if (agendamentoIndex === -1) {
      console.log("Agendamento não encontrado.");
      return false;
    }

    const agendamento = this.agenda.getListaAgendamento()[agendamentoIndex];
    const agora = new Date();

    if (
      agendamento.data_consulta > agora ||
      (agendamento.data_consulta.getTime() === agora.getTime() &&
        agendamento.hora_inicial > agora.toLocaleTimeString())
    ) {
      this.agenda.getListaAgendamento().splice(agendamentoIndex, 1);
      console.log("Agendamento cancelado com sucesso.");
      return true;
    } else {
      console.log("Não é possível cancelar um agendamento passado.");
      return false;
    }
  }

  limpaConsultasExpiradas(cpf: string, agenda: Agenda): void {
    const novasConsultas: Agendamento[] = agenda
      .getListaAgendamento()
      .filter(
        (agendamento) =>
          agendamento.paciente.getCpf() !== cpf ||
          !isAgendamentoExpirado(agendamento),
      );
    agenda.setListaAgendamento(novasConsultas);
    console.log("Agendamentos expirados removidos com sucesso.");
  }

  removeAgendamentosExpirados(
    indexPaciente: number,
    pacientes: Paciente[],
    agenda: Agenda,
  ): void {
    const paciente = pacientes[indexPaciente];

    // Filtra e remove os agendamentos expirados do paciente
    agenda.setListaAgendamento(
      agenda.getListaAgendamento().filter((agendamento) => {
        return !(
          agendamento.paciente.getCpf() === paciente.getCpf() &&
          agendamento.data_consulta < new Date()
        );
      }),
    );
  }

  isAgendamentoExpirado(agendamento: Agendamento): boolean {
    return agendamento.data_consulta <= new Date();
  }

  listaPacientesComAgendamentos(pacientes: Paciente[], agenda: Agenda) {
    console.log("------------------------------------------------------------");
    console.log(
      "Index CPF            Nome                          Dt.Nasc.   Idade",
    );
    console.log("------------------------------------------------------------");

    pacientes.forEach((paciente, index) => {
      const cpf = paciente.getCpf().padEnd(12, " ");
      const nome = paciente.getNome().padEnd(30, " ");
      const dataNasc = paciente
        .getData_nasc()
        .toLocaleDateString("pt-BR", { timeZone: "UTC" });
      const idade = paciente.getIdade().toString().padStart(3, " ");
      console.log(`${index}    ${cpf} ${nome} ${dataNasc} ${idade}`);

      // Busca agendamento para o paciente
      const agendamento = agenda
        .getListaAgendamento()
        .find((a) => a.paciente.getCpf() === paciente.getCpf());

      if (agendamento) {
        console.log(
          `Agendado para: ${agendamento.data_consulta.toLocaleDateString("pt-BR", { timeZone: "UTC" })}`,
        );
        console.log(`${agendamento.hora_inicial} às ${agendamento.hora_final}`);
      }
      console.log(""); // Linha em branco para separar os pacientes
    });

    console.log("------------------------------------------------------------");
  }
}
