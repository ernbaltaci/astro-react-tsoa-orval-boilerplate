export const serviceStore: any[] = [];
export const controllerStore: any[] = [];
export const singletonStore: any[] = [];

export function registerService(service: any) {
  serviceStore.push(service);
}

export function registerController(controller: any) {
  controllerStore.push(controller);
}

export function registerSingleton(singleton: any) {
  singletonStore.push(singleton);
}
