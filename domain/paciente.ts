import { Model, DataTypes, Sequelize } from "sequelize";

class Paciente extends Model {
  static initialize(sequelize: Sequelize) {
    Paciente.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        cpf: {
          type: DataTypes.STRING(14),
          allowNull: false,
          unique: true,
        },
        nome: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        data_nasc: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        idade: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize, // Passando a instância do Sequelize
        modelName: "Paciente",
        tableName: "pacientes",
        indexes: [{ unique: true, fields: ["cpf"] }],
      },
    );
  }
}

export default Paciente;
