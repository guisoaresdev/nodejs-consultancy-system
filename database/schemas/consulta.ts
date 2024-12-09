import { Sequelize, DataTypes } from "sequelize";
import Consulta from "../../domain/consulta"; // Sua classe de domínio

class ConsultaSequelize extends Consulta {}

const createModelConsulta = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes,
) => {
  ConsultaSequelize.init(
    {
      id: {
        type: dataTypes.UUID,
        defaultValue: Sequelize.fn("gen_random_uuid"),
        primaryKey: true,
      },
      id_paciente: {
        type: dataTypes.UUID,
        allowNull: false,
        references: {
          model: "pacientes",
          key: "id",
        },
      },
      data_consulta: {
        type: dataTypes.DATEONLY,
        allowNull: false,
      },
      hora_inicial: {
        type: dataTypes.TIME,
        allowNull: false,
      },
      hora_final: {
        type: dataTypes.TIME,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Consulta",
      tableName: "consultas",
    },
  );

  return ConsultaSequelize;
};

export default createModelConsulta;
