import generate from "gerador-validador-cpf";
import { faker } from "@faker-js/faker";
("use strict");

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface, Sequelize) => {
  /**
   * Add seed commands here.
   *
   * Example:
   * await queryInterface.bulkInsert('People', [{
   *   name: 'John Doe',
   *   isBetaMember: false
   * }], {});
   */
  await queryInterface.bulkInsert(
    "Paciente",
    [
      {
        nome: faker.person.fullName(),
        cpf: generate({ format: true }),
        dataNasc: faker.date.past(),
        idade: 26,
      },
    ],
    {},
  );
};

export const down = async (queryInterface, Sequelize) => {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
  await queryInterface.bulkDelete("Paciente", null, {});
};
