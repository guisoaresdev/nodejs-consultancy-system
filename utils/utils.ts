export function isCpfDuplicado(pacientes, cpf): boolean {
  let isDuplicated: boolean = false;
  for (let i = 0; i < pacientes.length; i++) {
    if (pacientes[i].getCpf() == cpf) {
      isDuplicated = true;
    }
  }
  return isDuplicated;
}

export function temAgendamentoFuturo(cpf: string, agenda: Agenda): boolean {
  for (const agendamento of agenda.getListaAgendamento()) {
    if (agendamento.paciente.getCpf() === cpf && agendamento.data_consulta > new Date()) {
      return true;
    }
  }
  return false;
}

export function cancelaConsulta(cpf: string, dataConsulta: Date, horaInicial: string, agenda: Agenda): boolean {
    const agendamentoIndex = agenda.getListaAgendamento().findIndex(
      ({ paciente, data_consulta, hora_inicial }) =>
        paciente.getCpf() === cpf &&
        data_consulta.getTime() === dataConsulta.getTime() &&
        hora_inicial === horaInicial
    );

    if (agendamentoIndex === -1) {
      console.log("Agendamento não encontrado.");
      return false;
    }

    const agendamento = agenda.getListaAgendamento()[agendamentoIndex];
    const agora = new Date();


    if (
      agendamento.data_consulta > agora ||
      (agendamento.data_consulta.getTime() === agora.getTime() && agendamento.hora_inicial > agora.toLocaleTimeString())
    ) {
      agenda.getListaAgendamento().splice(agendamentoIndex, 1);
      console.log("Agendamento cancelado com sucesso.");
      return true;
    } else {
      console.log("Não é possível cancelar um agendamento passado.");
      return false;
    }
  }

function isAgendamentoExpirado(agendamento: Agendamento): boolean {
  return agendamento.data_consulta <= new Date();
}

export function limpaConsultasExpiradas(cpf: string, agenda: Agenda): void {
  const novasConsultas: Agendamento[] = agenda.getListaAgendamento().filter(
    (agendamento) => agendamento.paciente.getCpf() !== cpf || !isAgendamentoExpirado(agendamento)
  );
  agenda.setListaAgendamento(novasConsultas);
  console.log("Agendamentos expirados removidos com sucesso.");
}

export function removeAgendamentosExpirados(indexPaciente: number, pacientes: Paciente[], agenda: Agenda): void {
  const paciente = pacientes[indexPaciente];
  
  // Filtra e remove os agendamentos expirados do paciente
  agenda.setListaAgendamento(agenda.getListaAgendamento().filter(agendamento => {
    return !(agendamento.paciente.getCpf() === paciente.getCpf() && agendamento.data_consulta < new Date());
  }));
}

export function listaPacientesComAgendamentos(pacientes: Paciente[], agenda: Agenda) {
  console.log("------------------------------------------------------------");
  console.log("Index CPF            Nome                          Dt.Nasc.   Idade");
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
    const agendamento = agenda.getListaAgendamento().find(
      (a) => a.paciente.getCpf() === paciente.getCpf()
    );

    if (agendamento) {
      console.log(`Agendado para: ${agendamento.data_consulta.toLocaleDateString("pt-BR", { timeZone: "UTC" })}`);
      console.log(`${agendamento.hora_inicial} às ${agendamento.hora_final}`);
    }
    console.log(""); // Linha em branco para separar os pacientes
  });

  console.log("------------------------------------------------------------");
}

export function isCpfValido(cpf): boolean {
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

export function formatarCpf(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function nomeTemTamanhoMinimo(nome, tamanho_minimo_nome): boolean {
  return nome.length > tamanho_minimo_nome;
}

export function validaFormatoData(data: string): boolean {
  // Regex pra validar data no formato DD/MM/ANO
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  return regex.test(data);
}

export function formataData(dataStr) {
  const [dia, mes, ano] = dataStr.split("/").map(Number);
  return new Date(ano, mes - 1, dia);
}

export function validaData(data: Date | null): boolean {
  // Verifica se a data é válida
  return data !== null && !isNaN(data.getTime());
}

export function validaIdadeMinima(data_nasc) {
  const hoje = new Date();
  let idade = hoje.getFullYear() - data_nasc.getFullYear();
  const mes = hoje.getMonth() - data_nasc.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < data_nasc.getDate())) {
    idade--;
  }
  return idade > 13;
}

export function validarHorario(horario: string): boolean {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Formato HH:mm, com horas de 00 a 23 e minutos de 00 a 59
  return regex.test(horario);
}

export function validarDisponibilidadeHorario(horario: string): boolean {
  if (!validarHorario(horario)) return false; // Primeiro, valida o formato

  const [, horas, minutos] = horario.match(/^(\d{2}):(\d{2})$/) || [];
  const minutosInt = parseInt(minutos, 10);

  // Verifica se os minutos são múltiplos de 15
  return minutosInt % 15 === 0;
}

export function validarHoraAgendamento(
  horaInicial: string,
  horaFinal: string,
): boolean {
  if (!validarHorario(horaInicial) || !validarHorario(horaFinal)) return false;

  const [horasInicial, minutosInicial] = horaInicial.split(":").map(Number);
  const [horasFinal, minutosFinal] = horaFinal.split(":").map(Number);

  const totalMinutosInicial = horasInicial * 60 + minutosInicial;
  const totalMinutosFinal = horasFinal * 60 + minutosFinal;

  return totalMinutosFinal > totalMinutosInicial;
}
