import Application from "./setup/application.ts";

// TODO: Refatoração pós avaliação:
// 1. Encapsular os funcionalidades do consultório (Classe Consultório)
// 2. Separar a UI, do dominio, do controle
// 3. Criar funcionalidade de setup pra realizar a injeção das dependencias e afins
// 4. Consultório deve ser um singleton instanciando os objetos de armazenamento de dados

const app = new Application();
const view = app.getConsultorioView();
view.menuPrincipal();
