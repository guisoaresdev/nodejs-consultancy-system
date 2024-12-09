/* TODO: Relacionamentos DB
 * 1. Agenda (1 pra N) Consultas
 * 2. Paciente (1 pra N) Consultas
 * 3. Atributos de Agenda: id
 * 4. Atributos de Consultas: id, id_agenda, id_paciente, data_consulta, hora_inicial, hora_final
 * 5. Atributos de Paciente: id, cpf, nome, data_nasc, idade.
 * */

const createModelPaciente = (Paciente, sequelize, DataTypes) => {
  Paciente.init(
    {
      id: {
        type: DataTypes.UUID,
        autoIncrement: true,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true,
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [Paciente.NOME_TAMANHO_MINIMO, 255], // Validar tamanho
        },
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
      sequelize,
      modelName: "Paciente",
      tableName: "pacientes",
      indexes: [{ unique: true, fields: ["cpf"] }],
    },
  );
};

export default createModelPaciente;
