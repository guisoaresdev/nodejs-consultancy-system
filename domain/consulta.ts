import { Model, DataTypes, Sequelize } from "sequelize";

class Consulta extends Model {
  static initialize(sequelize: Sequelize) {
    Consulta.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        idPaciente: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        dataConsulta: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        horaInicial: {
          type: DataTypes.STRING(5),
          allowNull: false,
        },
        horaFinal: {
          type: DataTypes.STRING(5),
          allowNull: false,
        },
      },
      {
        sequelize, // Passando a instância do sequelize
        modelName: "Consulta",
        tableName: "consultas",
        indexes: [
          {
            unique: true,
            fields: ["idPaciente", "dataConsulta", "horaInicial"],
          },
        ],
      },
    );
  }
}

export default Consulta;
