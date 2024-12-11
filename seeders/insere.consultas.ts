import { faker } from "@faker-js/faker";
import ConsultaRepository from "../repositories/consulta.repository";
import PacienteRepository from "../repositories/paciente.repository";
import Consulta from "../domain/consulta";
import Paciente from "../domain/paciente"; // Importando o modelo de Paciente

function gerarCPF(): string {
  const gerarDigito = (base: number[]): number => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += base[i] * (base.length + 1 - i);
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const base = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));

  const digito1 = gerarDigito(base);
  const digito2 = gerarDigito([...base, digito1]);

  const cpf = [...base, digito1, digito2].join("");

  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export const seedConsultas = async (): Promise<void> => {
  try {
    const pacientes = [];
    const consultas: Consulta[] = [];

    // Criando 5 pacientes fictícios
    for (let i = 0; i < 5; i++) {
      const paciente = Paciente.build({
        nome: faker.person.fullName(),
        cpf: gerarCPF(),
        data_nasc: faker.date.past({ years: 18 }),
        idade: faker.number.int({ min: 18, max: 40 }),
      });
      await PacienteRepository.salva(paciente);
      pacientes.push(paciente);
    }

    // Criando 10 consultas fictícias associadas aos pacientes
    for (let i = 0; i < 10; i++) {
      const consulta = Consulta.build({
        idPaciente: faker.helpers.arrayElement(pacientes).dataValues.id,
        dataConsulta: faker.date.future(),
        horaInicial: faker.helpers.arrayElement([
          "08:00",
          "10:00",
          "14:00",
          "16:00",
        ]),
        horaFinal: faker.helpers.arrayElement([
          "17:00",
          "18:00",
          "19:00",
          "20:00",
        ]),
      });
      consultas.push(consulta);
    }

    // Salvar todas as consultas no banco
    for (const consulta of consultas) {
      await ConsultaRepository.salva(consulta);
    }

    console.log("Consultas e pacientes inseridos com sucesso!");
  } catch (error) {
    console.error("Erro ao inserir consultas e pacientes:", error);
  }
};

