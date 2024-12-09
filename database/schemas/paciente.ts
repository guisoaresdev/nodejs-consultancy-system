import { Sequelize, DataTypes, DataTypes } from "sequelize";
import Paciente from "../../domain/paciente";

class PacienteSequelize extends Paciente {}

const createModelPaciente = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes,
) => {
  PacienteSequelize.init(
    {
      id: {
        type: dataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.fn("gen_random_uuid"),
      },
      cpf: {
        type: dataTypes.STRING(11),
        allowNull: false,
        unique: true,
      },
      nome: {
        type: dataTypes.STRING,
        allowNull: false,
        validate: {
          len: [Paciente.NOME_TAMANHO_MINIMO, 255], // Validar tamanho
        },
      },
      data_nasc: {
        type: dataTypes.DATEONLY,
        allowNull: false,
      },
      idade: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Paciente",
      tableName: "pacientes",
      indexes: [{ unique: true, fields: ["cpf"] }],
    },
  );
  return PacienteSequelize;
};

export default createModelPaciente;
