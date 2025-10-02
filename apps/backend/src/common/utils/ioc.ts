import { IocContainer } from '@tsoa/runtime';
import { container } from '../container';

export const iocContainer: IocContainer = {
  get: <T>(controller: { new (...args: any[]): T }): T => {
    return container.resolve<T>(controller);
  },
};

