import Paciente from "./paciente";

import { temAgendamentoFuturo } from "../utils/utils";

type Agendamento = {
  paciente: Paciente;
  data_consulta: Date;
  hora_inicial: string;
  hora_final: string;
};

export default class Agenda {
  private listaAgendamento: Agendamento[] = [];

  getListaAgendamento(): Agendamento[] {
    return this.listaAgendamento;
  }

  setListaAgendamento(lista: Agendamento[]): void {
    this.listaAgendamento = lista;
  }

  agendarConsulta(agendamento: Agendamento) {
    this.getListaAgendamento().push(agendamento);
  }

  ordenarPorData() {
    return this.getListaAgendamento().sort((a, b) => a.data_consulta.getTime() - b.data_consulta.getTime());
  }

  printAgendaFormatada() {
    console.log("------------------------------------------------------------");
    console.log("CPF Nome                                   Dt.Nasc.    Idade");
    console.log("------------------------------------------------------------");

    this.ordenarPorData().forEach(
      ({ paciente, data_consulta, hora_inicial, hora_final }) => {
        const cpfFormatado = paciente.getCpf().padStart(11, "0");
        const nomeFormatado = paciente.getNome().padEnd(30, " ");
        const dataNascFormatada = paciente.getData_nasc().toLocaleDateString();
        const idadeFormatada = paciente.getIdade().toString().padStart(3, " ");

        console.log(
          `${cpfFormatado} ${nomeFormatado} ${dataNascFormatada} ${idadeFormatada}`,
        );
        console.log(`Agendado para: ${data_consulta.toLocaleDateString()}`);
        console.log(`${hora_inicial} às ${hora_final}\n`);
      },
    );
  }
}
