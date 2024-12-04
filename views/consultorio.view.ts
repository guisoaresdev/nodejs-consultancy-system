import PromptSync from "prompt-sync";
import Paciente from "../classes/paciente.ts";
import Consultorio from "../classes/consultorio.ts";

export default class ConsultorioView {
  private prompt: PromptSync.Prompt;
  private consultorio: Consultorio;

  constructor(prompt: PromptSync.Prompt, consultorio: Consultorio) {
    this.prompt = prompt;
    this.consultorio = consultorio;
  }

  getInput(message: string): string {
    return this.prompt(message);
  }

  menuPrincipal() {
    let option;
    do {
      console.log("\nMenu Principal");
      console.log("1 - Cadastrar um paciente");
      console.log("2 - Remover um paciente");
      console.log("3 - Listar Pacientes");
      console.log("4 - Agenda");
      console.log("5 - Sair");

      option = parseInt(this.getInput("Escolha uma opção: "));

      switch (option) {
        case 1:
          this.cadastrarPaciente();
          break;
        case 2:
          this.getConsultorio().listaPacientesComAgendamentos(
            this.getConsultorio().getPacientes(),
            this.getConsultorio().getAgenda(),
          );
          this.removerPaciente();
          break;
        case 3:
          this.getConsultorio().listaPacientesComAgendamentos(
            this.getConsultorio().getPacientes(),
            this.getConsultorio().getAgenda(),
          );
          break;
        case 4:
          this.menuAgenda();
          break;
        case 5:
          console.log("Encerrando o programa...");
          break;
        default:
          console.log("Opção inválida, tente novamente.");
      }
    } while (option !== 5);
  }

  getConsultorio() {
    return this.consultorio;
  }

  agendarConsulta(): void {
    var validaDataConsulta: boolean = false;
    var validaHorarioInicial: boolean = false;
    var validaHorarioFinal: boolean = false;
    try {
      var paciente: Paciente | null = null;
      if (this.getConsultorio().getPacientes().length != 0) {
        const pacienteExistente = this.getInput(
          "Deseja vincular um paciente já existente ao agendamento? (Y/N): ",
        );
        if (pacienteExistente == "Y") {
          this.getConsultorio().listaPacientesComAgendamentos(
            this.getConsultorio().getPacientes(),
            this.getConsultorio().getAgenda(),
          );
          const indexPaciente = parseInt(
            this.getInput(
              "Insira o index do paciente que deseja marcar a consulta: ",
            ),
          );
          if (indexPaciente <= this.getConsultorio().getPacientes().length) {
            paciente = this.getConsultorio().getPacientes()[indexPaciente];
          } else {
            console.log("Index do paciente inválido");
          }
        } else {
          paciente = this.cadastrarPaciente();
        }
      } else {
        console.log(
          "Nenhum paciente registrado no sistema, criando novo paciente.",
        );
        paciente = this.cadastrarPaciente();
      }
      if (paciente) {
        var dataConsulta: Date;
        var dataConsultaStr = this.getInput(
          "Informe a data da consulta (DD/MM/YYYY): ",
        );

        while (!validaDataConsulta) {
          if (!this.validaFormatoData(dataConsultaStr)) {
            console.log("Data deve ser no formato DD/MM/YYYY");
            dataConsultaStr = this.getInput(
              "Informe a data da consulta (DD/MM/YYYY): ",
            );
            continue;
          }

          dataConsulta = this.formataData(dataConsultaStr);
          if (!this.validaData(dataConsulta)) {
            console.log("Data da consulta inválida");
            dataConsultaStr = this.getInput(
              "Informe a data da consulta (DD/MM/YYYY): ",
            );
            continue;
          }

          if (dataConsulta < new Date()) {
            console.log(
              "Data Inválida: Consulta com dia anterior a data de hoje",
            );
            dataConsultaStr = this.getInput(
              "Informe a data da consulta (DD/MM/YYYY): ",
            );
            continue;
          }

          validaDataConsulta = true;
        }
        var horaInicial = this.getInput("Informe a hora inicial (HH:mm): ");
        while (!validaHorarioInicial) {
          if (!this.validarHorario(horaInicial)) {
            console.log("As horas devem ser no formato HH:mm");
            horaInicial = this.getInput("Informe a hora inicial (HH:mm): ");
            continue;
          }

          if (!this.validarDisponibilidadeHorario(horaInicial)) {
            console.log(
              "Os horários disponíveis são de 15 em 15 minutos. Ex: 20:00, 20:15, 20:30",
            );
            horaInicial = this.getInput("Informe a hora inicial (HH:mm): ");
            continue;
          }

          validaHorarioInicial = true;
        }

        var horaFinal = this.getInput("Informe a hora final (HH:mm): ");
        while (!validaHorarioFinal) {
          if (!this.validarHorario(horaFinal)) {
            console.log("As horas devem ser no formato HH:mm");
            horaFinal = this.getInput("Informe a hora inicial (HH:mm): ");
            continue;
          }

          if (!this.validarDisponibilidadeHorario(horaFinal)) {
            console.log(
              "Os horários disponíveis são de 15 em 15 minutos. Ex: 20:00, 20:15, 20:30",
            );
            horaFinal = this.getInput("Informe a hora inicial (HH:mm): ");
            continue;
          }

          if (!this.validarHoraAgendamento(horaInicial, horaFinal)) {
            console.log("O horário final é anterior ao horário inicial");
            horaFinal = this.getInput("Informe a hora inicial (HH:mm): ");
            continue;
          }
          validaHorarioFinal = true;
        }

        this.getConsultorio().getAgenda().agendarConsulta({
          paciente: paciente,
          data_consulta: dataConsulta,
          hora_inicial: horaInicial,
          hora_final: horaFinal,
        });
        console.log("Consulta agendada com sucesso!");
      } else {
        console.log(
          "Paciente está null, impossível finalizar o agendamento. Retornando para o menu: ",
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  cancelarConsulta() {
    let cpfValido: boolean = false;
    let validaDataConsulta: boolean = false;
    let validaHorarioInicial: boolean = false;
    var cpf = this.getInput("Informe um CPF válido: ");
    while (!cpfValido) {
      cpf = this.formatarCpf(cpf);

      if (!this.isCpfDuplicado(this.getConsultorio().getPacientes(), cpf)) {
        console.log("CPF não encontrado");
        cpf = this.getInput("Informe um CPF válido: ");
        continue;
      }

      cpfValido = true;
    }

    var dataConsultaIn: Date;

    var dataConsultaInput = this.getInput(
      "Digite a data da consulta (dd/mm/yyyy): ",
    );
    while (!validaDataConsulta) {
      if (!this.validaFormatoData(dataConsultaInput)) {
        console.log("Data deve ser no formato DD/MM/YYYY");
        dataConsultaInput = this.getInput(
          "Digite a data da consulta (dd/mm/yyyy): ",
        );
        continue;
      }

      dataConsultaIn = this.formataData(dataConsultaInput);
      if (!this.validaData(dataConsultaIn)) {
        console.log("Data da consulta inválida");
        dataConsultaInput = this.getInput(
          "Digite a data da consulta (dd/mm/yyyy): ",
        );
        continue;
      }

      if (this.dataConsultaIn < new Date()) {
        console.log("Data Inválida: Consulta com dia anterior a data de hoje");
        dataConsultaInput = this.getInput(
          "Digite a data da consulta (dd/mm/yyyy): ",
        );
        continue;
      }

      validaDataConsulta = true;
    }

    var horaInicial = this.getInput(
      "Digite a hora inicial da consulta (hh:mm): ",
    );
    while (!validaHorarioInicial) {
      if (!this.validarHorario(horaInicial)) {
        console.log("As horas devem ser no formato HH:mm");
        horaInicial = this.getInput("Informe a hora inicial (HH:mm): ");
        continue;
      }

      if (!this.validarDisponibilidadeHorario(horaInicial)) {
        console.log(
          "Os horários disponíveis são de 15 em 15 minutos. Ex: 20:00, 20:15, 20:30",
        );
        horaInicial = this.getInput("Informe a hora inicial (HH:mm): ");
        continue;
      }

      validaHorarioInicial = true;
    }

    const [dia, mes, ano] = dataConsultaInput.split("/").map(Number);
    const dataConsulta = new Date(ano, mes - 1, dia);

    const sucesso = this.getConsultorio().cancelaConsulta(
      cpf,
      dataConsulta,
      horaInicial,
      this.getConsultorio().getAgenda(),
    );

    if (!sucesso) {
      console.log("Falha no cancelamento do agendamento.");
    }
  }

  cadastrarPaciente() {
    try {
      let cpfValido: boolean = false;
      let nomeValido: boolean = false;
      let dataValida: boolean = false;
      let IdadeValida: boolean = false;

      let cpf = this.getInput("Informe um CPF válido: ");
      while (!cpfValido) {
        cpf = this.formatarCpf(cpf);

        if (!this.isCpfValido(cpf)) {
          console.log("CPF não é válido");
          cpf = this.getInput("Informe um CPF válido: ");
          continue;
        }

        if (this.isCpfDuplicado(this.getConsultorio().getPacientes(), cpf)) {
          console.log("CPF já cadastrado");
          cpf = this.getInput("Informe um CPF válido: ");
          continue;
        }

        cpfValido = true;
      }

      let nome = this.getInput("Informe o nome: ");
      while (!nomeValido) {
        if (!this.nomeTemTamanhoMinimo(nome, Paciente.NOME_TAMANHO_MINIMO)) {
          console.log(
            `Nome deve ter no mínimo ${Paciente.NOME_TAMANHO_MINIMO} caracteres `,
          );
          nome = this.getInput("Informe o nome: ");
          continue;
        }

        nomeValido = true;
      }

      const dataAtual = new Date();
      var dataNasc = new Date();

      var dataNascStr = this.getInput(
        "Informe a data de nascimento (DD/MM/YYYY): ",
      );
      while (!dataValida) {
        if (!this.validaFormatoData(dataNascStr)) {
          console.log("Data deve ser no formato DD/MM/YYYY");
          dataNascStr = this.getInput(
            "Informe a data de nascimento (DD/MM/YYYY): ",
          );
          continue;
        }

        dataNasc = this.formataData(dataNascStr);
        if (!this.validaData(dataNasc)) {
          console.log("Data de Nascimento inválida");
          dataNascStr = this.getInput(
            "Informe a data de nascimento (DD/MM/YYYY): ",
          );
          continue;
        }

        if (!this.validaIdadeMinima(dataNasc)) {
          console.log("Paciente deve ter no mínimo 13 anos de idade");
          dataNascStr = this.getInput(
            "Informe a data de nascimento (DD/MM/YYYY): ",
          );
          continue;
        }

        if (dataNasc > dataAtual) {
          console.log("Data de Nascimento não pode ser após a data presente.");
          dataNascStr = this.getInput(
            "Informe a data de nascimento (DD/MM/YYYY): ",
          );
          continue;
        }

        dataValida = true;
      }

      const paciente = new Paciente(cpf, nome, dataNasc);
      if (paciente) {
        this.getConsultorio().getPacientes().push(paciente);
        console.log("Paciente criado com sucesso!");
        return paciente;
      } else {
        return null;
      }
    } catch (error) {
      console.log(
        "Erro ao cadastrar paciente: " +
          (error instanceof Error ? error.message : error),
      );
      return null;
    }
  }

  removerPaciente() {
    try {
      let possuiAgendamento: boolean = true;
      let cpfRemoverPaciente: string;

      while (possuiAgendamento) {
        cpfRemoverPaciente = this.getInput(
          "Insira o CPF do paciente que deseja remover: ",
        );
        const cpf = this.formatarCpf(cpfRemoverPaciente);
        const pacienteIndex = this.getConsultorio()
          .getPacientes()
          .findIndex((paciente) => paciente.getCpf() === cpf);
        if (pacienteIndex === -1) {
          console.log("CPF não encontrado no sistema");
          continue;
        }

        if (this.temAgendamentoFuturo(cpf, this.getConsultorio().getAgenda())) {
          console.log("Paciente possui agendamentos ainda válidos");
          continue;
        }

        this.getConsultorio().limpaConsultasExpiradas(
          cpf,
          this.getConsultorio().getAgenda(),
        );

        this.getConsultorio().getPacientes().splice(pacienteIndex, 1);
        possuiAgendamento = false; // Sai do loop
        console.log("Paciente removido com sucesso");
      }
    } catch (error) {
      console.log(
        "Erro ao remover um paciente: " +
          (error instanceof Error ? error.message : error),
      );
    }
  }

  menuAgenda() {
    let option;
    do {
      console.log("\nAgenda");
      console.log("1 - Agendar consulta");
      console.log("2 - Cancelar consulta");
      console.log("3 - Listar agenda");
      console.log("4 - Voltar para o menu principal");

      option = parseInt(this.getInput("Escolha uma opção: "));

      switch (option) {
        case 1:
          this.agendarConsulta();
          break;
        case 2:
          this.cancelarConsulta();
          break;
        case 3:
          console.log("Listando agenda...");
          this.getConsultorio().getAgenda().printAgendaFormatada();
          break;
        case 4:
          console.log("Voltando ao menu principal...");
          break;
        default:
          console.log("Opção inválida, tente novamente.");
      }
    } while (option !== 4);
  }

  isCpfValido(cpf): boolean {
    let newCpf = cpf.replace(/[^\d]+/g, "");
    if (newCpf.length !== 11 || /^(\d)\1+$/.test(newCpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(newCpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(newCpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(newCpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(newCpf.substring(10, 11));
  }

  formatarCpf(cpf) {
    cpf = cpf.replace(/[^\d]+/g, "");
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  nomeTemTamanhoMinimo(nome, tamanho_minimo_nome): boolean {
    return nome.length > tamanho_minimo_nome;
  }

  validaFormatoData(data: string): boolean {
    // Regex pra validar data no formato DD/MM/ANO
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

    return regex.test(data);
  }

  formataData(dataStr) {
    const [dia, mes, ano] = dataStr.split("/").map(Number);
    return new Date(ano, mes - 1, dia);
  }

  validaData(data: Date | null): boolean {
    // Verifica se a data é válida
    return data !== null && !isNaN(data.getTime());
  }

  validaIdadeMinima(data_nasc) {
    const hoje = new Date();
    let idade = hoje.getFullYear() - data_nasc.getFullYear();
    const mes = hoje.getMonth() - data_nasc.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < data_nasc.getDate())) {
      idade--;
    }
    return idade > 13;
  }

  validarHorario(horario: string): boolean {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Formato HH:mm, com horas de 00 a 23 e minutos de 00 a 59
    return regex.test(horario);
  }

  validarDisponibilidadeHorario(horario: string): boolean {
    if (!this.validarHorario(horario)) return false; // Primeiro, valida o formato

    const [, horas, minutos] = horario.match(/^(\d{2}):(\d{2})$/) || [];
    const minutosInt = parseInt(minutos, 10);

    // Verifica se os minutos são múltiplos de 15
    return minutosInt % 15 === 0;
  }

  validarHoraAgendamento(horaInicial: string, horaFinal: string): boolean {
    if (!this.validarHorario(horaInicial) || !this.validarHorario(horaFinal))
      return false;

    const [horasInicial, minutosInicial] = horaInicial.split(":").map(Number);
    const [horasFinal, minutosFinal] = horaFinal.split(":").map(Number);

    const totalMinutosInicial = horasInicial * 60 + minutosInicial;
    const totalMinutosFinal = horasFinal * 60 + minutosFinal;

    return totalMinutosFinal > totalMinutosInicial;
  }

  isCpfDuplicado(pacientes, cpf): boolean {
    let isDuplicated: boolean = false;
    for (let i = 0; i < pacientes.length; i++) {
      if (pacientes[i].getCpf() == cpf) {
        isDuplicated = true;
      }
    }
    return isDuplicated;
  }

  temAgendamentoFuturo(cpf: string, agenda: Agenda): boolean {
    for (const agendamento of agenda.getListaAgendamento()) {
      if (
        agendamento.paciente.getCpf() === cpf &&
        agendamento.data_consulta > new Date()
      ) {
        return true;
      }
    }
    return false;
  }
}
