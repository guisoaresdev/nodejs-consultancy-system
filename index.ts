import Application from "./setup/application";

(async () => {
  const app = new Application();
  await app.init();
})();
