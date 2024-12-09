import { Model, DataTypes } from "sequelize";
import ErroPaciente from "./erro-paciente.js";
import Result from "./result.js";

/**
 * Classe Paciente adaptada para Sequelize
 */
class Paciente extends Model {
  /**
   * Método fábrica para validação dos dados e criação do Paciente.
   *
   * @param {string} cpf
   * @param {string} nome
   * @param {Date} data_nasc
   * @returns Paciente ou uma lista de erros, em caso de erro de validação
   */
  static of(cpf, nome, data_nasc) {
    const errors = [];

    if (!Paciente.isValidCPF(cpf)) errors.push(ErroPaciente.CPF_INVALIDO);
    if (!nome || nome.length < Paciente.NOME_TAMANHO_MINIMO)
      errors.push(ErroPaciente.NOME_INVALIDO);
    if (!data_nasc || isNaN(new Date(data_nasc).getTime()))
      errors.push(ErroPaciente.DATA_NASC_INVALIDA);

    return errors.length === 0
      ? Result.success(Paciente.build({ cpf, nome, data_nasc }))
      : Result.failure(errors);
  }

  /**
   * Calcula a idade com base na data de nascimento.
   * @returns {number} Idade do paciente.
   */
  get idade() {
    const hoje = new Date();
    const nascimento = new Date(this.data_nasc);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  }

  /**
   * Valida o CPF.
   * @param {string} cpf CPF do paciente.
   * @returns {boolean} Retorna `true` se o CPF for válido.
   */
  static isValidCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf.substring(10, 11));
  }

  /**
   * Configura as associações no Sequelize.
   * @param {Sequelize} models
   */
  static associate(models) {
    // Definindo a relação "um paciente pode ter muitas consultas"
    this.hasMany(models.Consulta, {
      foreignKey: "pacienteId",
      as: "consultas",
    });
  }
}
