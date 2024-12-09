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
      console.log("2 - Sair");

      option = parseInt(this.getInput("Escolha uma opção: "));

      switch (option) {
        case 1:
          await this.cadastrarPaciente();
          break;
        case 2:
          console.log("Encerrando o programa...");
          break;
        default:
          console.log("Opção inválida, tente novamente.");
      }
    } while (option !== 2);
  }

  async cadastrarPaciente() {
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

      const paciente = await this.getController().cadastrarPaciente(
        cpf,
        nome,
        dataNasc,
      );
      if (paciente) {
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

  formatarCpf(cpf) {
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
}
