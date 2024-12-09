import ConsultorioController from "./controllers/consultorio.controller";
import db from "./database/database";
import ConsultorioView from "./views/consultorio.view";
import PromptSync from "prompt-sync";

// TODO:
// 1. Separar a logica de inicialização
// 2. Corrigir a chamada do controllador na view
// 3. Adaptar o repository pra fornecer melhores logs em caso de erro
// 4. Adaptar o controllador pro novo repository
// 5. Validar todas as funcionalidades do sistema
//
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
  const consultorioController = new ConsultorioController();
  const consultorioView = new ConsultorioView(prompt, consultorioController);

  // Exibe o menu principal
  try {
    await consultorioView.menuPrincipal();
  } catch (error) {
    console.error("Erro inesperado durante a execução:", error);
    process.exit(1);
  }
})();
