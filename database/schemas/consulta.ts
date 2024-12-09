const createModelConsulta = (Consulta, sequelize, DataTypes) => {
  Consulta.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_paciente: {
        type: DataTypes.INTEGER,
        references: {
          model: Paciente,
          key: "id",
        },
        allowNull: false,
      },
      data_consulta: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      hora_inicial: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      hora_final: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Consulta",
      tableName: "consultas",
    },
  );
};

export default createModelConsulta;
