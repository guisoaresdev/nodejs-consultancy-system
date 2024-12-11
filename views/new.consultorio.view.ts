import PromptSync from "prompt-sync";
import ConsultorioController from "../controllers/consultorio.controller";

export default class NewConsultorioView {
  private prompt: PromptSync.Prompt;
  private consultorioController: ConsultorioController;

  constructor(
    prompt: PromptSync.Prompt,
    consultorioController: ConsultorioController,
  ) {
    this.prompt = prompt;
    this.consultorioController = consultorioController;
  }

  getInput(message: string): string {
    return this.prompt(message);
  }

  getController(): ConsultorioController {
    return this.consultorioController;
  }

  async menuPrincipal() {
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
          await this.cadastrarPaciente();
          break;
        case 2:
          await this.removerPaciente();
          break;
        case 3:
          await this.listarPacientes();
          break;
        case 4:
          await this.menuAgenda();
          break;
        case 5:
          console.log("Encerrando o programa...");
          break;
        default:
          console.log("Opção inválida, tente novamente.");
          break;
      }
    } while (option !== 5);
  }

  async menuAgenda() {
    let option;
    do {
      console.log("\nAgenda");
      console.log("1 - Agendar consulta");
      console.log("2 - Listar agenda");
      console.log("3 - Voltar para o menu principal");

      option = parseInt(this.getInput("Escolha uma opção: "));

      switch (option) {
        case 1:
          await this.agendarConsulta();
          break;
        case 2:
          console.log("Listando agenda...");
          await this.listarConsultas();
          break;
        case 3:
          console.log("Voltando ao menu principal...");
          break;
        default:
          console.log("Opção inválida, tente novamente.");
          break;
      }
    } while (option !== 3);
  }

  async listarConsultas() {
    try {
      const consultas = await this.getController().listarConsultas();

      if (consultas.length === 0) {
        console.log("Nenhuma consulta encontrada.");
      } else {
        consultas.forEach((consulta) => {
          const data: Date = new Date(consulta.dataConsulta);
          const dataFormatada = `${String(data.getDate() + 1).padStart(2, "0")}/${String(data.getMonth() + 1).padStart(2, "0")}/${data.getFullYear()}`;
          const paciente = consulta.paciente;
          console.log(
            `Paciente: ${paciente.nome} | CPF: ${paciente.cpf} | Data da consulta: ${dataFormatada} | Hora Inicial: ${consulta.horaInicial} | Hora Final: ${consulta.horaFinal}`,
          );
        });
      }
    } catch (error) {
      console.log("Erro ao listar as consultas: " + error.message);
    }
  }

  async cadastrarPaciente() {
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

      const pacienteExistente =
        await this.getController().buscaPacientePorCPF(cpf);
      if (pacienteExistente) {
        console.log("CPF já cadastrado");
        cpf = this.getInput("Informe um CPF válido: ");
        continue;
      }

      cpfValido = true;
    }

    let nome = this.getInput("Informe o nome: ");
    while (!nomeValido) {
      if (!this.nomeTemTamanhoMinimo(nome, 5)) {
        console.log(`Nome deve ter no mínimo 5 caracteres `);
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
    try {
      const idPaciente = await this.getController().cadastrarPaciente(
        cpf,
        nome,
        dataNasc,
      );
      console.log("Paciente criado com sucesso!");
      return idPaciente;
    } catch (error) {
      console.log(
        "Erro ao cadastrar paciente: " +
          (error instanceof Error ? error.message : error),
      );
      return null;
    }
  }

  async removerPaciente() {
    try {
      let naoValido: boolean = true;
      let cpfRemoverPaciente: string;

      while (naoValido) {
        cpfRemoverPaciente = this.getInput( "Insira o CPF do paciente que deseja remover: ");
        const cpf = this.formatarCpf(cpfRemoverPaciente);
        const isPacienteCadastrado = await this.getController().buscaPacientePorCPF(cpf);
        if (!isPacienteCadastrado) {
          console.log("CPF não encontrado no sistema");
          continue;
        }

        const temConsultasValidas = await this.getController().buscarConsultasValidasPorCPF(cpf); // Método para pegar agendamentos relacionados
        console.log(temConsultasValidas);
        if (temConsultasValidas == true) {
          console.log("Paciente possui consultas ainda válidas");
          continue;
        }

        await this.getController().removerPacientePorCPF(cpf);
        console.log("Paciente removido com sucesso");

        naoValido = false;
      }
    } catch (error) {
      console.log(
        "Erro ao remover um paciente: " +
          (error instanceof Error ? error.message : error),
      );
    }
  }

  async agendarConsulta(): Promise<void> {
    try {
      let paciente: any;
      let idPaciente: string | null = "0";
      // Buscar todos os pacientes no banco de dados
      const pacientes = await this.getController().listarPacientes();

      if (pacientes.length !== 0) {
        const pacienteExistente = this.getInput(
          "Deseja vincular um paciente já existente ao agendamento? (Y/N): ",
        );

        if (pacienteExistente === "Y") {
          await this.listarPacientes();
          const indexPaciente = parseInt(
            this.getInput(
              "Insira o ID do paciente que deseja marcar a consulta: ",
            ),
          );

          if (indexPaciente >= 0 && indexPaciente < pacientes.length) {
            paciente = pacientes[indexPaciente];
            idPaciente = paciente.dataValues.id;
          } else {
            console.log("Index do paciente inválido");
            return; // Retorna caso o índice seja inválido
          }
        } else {
          idPaciente = await this.cadastrarPaciente();
          paciente = await this.getController().buscaPacientePorId(idPaciente);
        }
      } else {
        console.log(
          "Nenhum paciente registrado no sistema, criando novo paciente.",
        );
        idPaciente = await this.cadastrarPaciente();
        paciente = await this.getController().buscaPacientePorId(idPaciente);
      }

      if (idPaciente == null) {
        console.log("idPaciente nulo");
        return;
      }

      if (paciente) {
        let validaDataConsulta = false;
        let validaHorarioInicial = false;
        let validaHorarioFinal = false;

        let dataConsultaStr = this.getInput(
          "Informe a data da consulta (DD/MM/YYYY): ",
        );
        let dataConsulta: Date;

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

        let horaInicial = this.getInput("Informe a hora inicial (HH:mm): ");
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

        let horaFinal = this.getInput("Informe a hora final (HH:mm): ");
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

        // Criação do agendamento no banco
        await this.getController().agendarConsulta(
          idPaciente,
          dataConsulta,
          horaInicial,
          horaFinal,
        );
        console.log("Consulta agendada com sucesso!");
      } else {
        console.log("Paciente está null, impossível finalizar o agendamento.");
      }
    } catch (err) {
      console.log("Erro ao agendar consulta: " + err.message);
    }
  }

  async listarPacientes() {
    try {
      const pacientes = await this.getController().listarPacientes();

      if (pacientes.length === 0) {
        console.log("Nenhum paciente encontrado.");
      } else {
        pacientes.forEach((paciente, index) => {
          console.log(
            `${index + 1}. Nome: ${paciente.nome} CPF: ${paciente.cpf} Idade: ${paciente.idade}`,
          );

          if (paciente.consultas && paciente.consultas.length > 0) {
            paciente.consultas.forEach((consulta) => {
              const data: Date = new Date(consulta.dataConsulta);
              const dataFormatada = `${String(data.getDate() + 1).padStart(2, "0")}/${String(data.getMonth() + 1).padStart(2, "0")}/${data.getFullYear()}`;
              console.log(
                `  - Consulta para ${dataFormatada} as ${consulta.horaInicial} até ${consulta.horaFinal}`,
              );
            });
          } else {
            console.log("  Nenhuma consulta encontrada para este paciente.");
          }
        });
      }
    } catch (error) {
      console.log("Erro ao listar pacientes: " + error.message);
    }
  }

  formatarCpf(cpf) {
    if (!cpf) {
      console.log("CPF inválido");
      return "";
    }
    cpf = cpf.replace(/[^\d]+/g, "");
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  nomeTemTamanhoMinimo(nome, tamanho_minimo_nome): boolean {
    return nome.length > tamanho_minimo_nome;
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
}
