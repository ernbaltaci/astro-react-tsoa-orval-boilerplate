import { container } from '../container';

export function getController<T>(controller: { new (...args: any[]): T }): T {
  return container.resolve<T>(controller);
}

