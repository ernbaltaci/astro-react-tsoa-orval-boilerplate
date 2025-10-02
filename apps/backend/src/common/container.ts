import { container } from 'tsyringe';
import { logger } from '../common/utils/logger';
import { serviceStore, controllerStore, singletonStore } from './di.store';
// Make scheduler optional for boilerplate
let startCron: ((c: typeof container) => void) | undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  startCron = require('../scheduler/cron').startCron as typeof startCron;
} catch (_) {
  // no scheduler in boilerplate
}
import { loadAllModules } from './module-loader';

// Load modules (services/controllers will self-register via decorators/register* calls)
loadAllModules();

let count = { services: 0, controllers: 0, singletons: 0 };

for (const service of serviceStore) {
  container.register(service, { useClass: service });
  logger.info(`🚀 ${service.name} (service) registered`);
  count.services++;
}

for (const controller of controllerStore) {
  container.register(controller, { useClass: controller });
  logger.info(`🚀 ${controller.name} (controller) registered`);
  count.controllers++;
}

for (const singleton of singletonStore) {
  container.registerSingleton(singleton);
  logger.info(`🚀 ${singleton.name} (singleton) registered`);
  count.singletons++;
}

logger.info(
  `✅ ${count.services} services, ${count.controllers} controllers, ${count.singletons} singletons registered`
);

// Start cron tasks after DI is ready (if available)
if (startCron) {
  startCron(container);
}

export { container };

