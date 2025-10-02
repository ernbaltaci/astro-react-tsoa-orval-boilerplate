import { EventEmitter } from 'eventemitter3';

interface AppEvents {
  user_created: (payload: {
    userId: string;
    email: string;
    name: string;
  }) => void;
  premium_expiration_check: () => void;
}

const appEmitter = new EventEmitter<AppEvents>();

export default appEmitter;

