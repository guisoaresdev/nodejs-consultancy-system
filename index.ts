import db from "./database/database";
import ConsultorioView from "./views/consultorio.view";
import PromptSync from "prompt-sync";

(async () => {
  console.log("Inicializando o sistema...");

  // Inicializa o banco de dados
  const dbInitialized = await db.init();
  if (!dbInitialized) {
    console.error(
      "Erro ao inicializar o banco de dados. Encerrando a aplicação.",
    );
    process.exit(1);
  }

  // Configurações da interface do usuário
  const prompt = PromptSync();
  const consultorioView = new ConsultorioView(prompt);

  // Exibe o menu principal
  try {
    await consultorioView.menuPrincipal();
  } catch (error) {
    console.error("Erro inesperado durante a execução:", error);
    process.exit(1);
  }
})();
