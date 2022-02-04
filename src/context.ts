import { createContext } from 'react';

import { Child } from './utils/api';

export interface IUpdaterContext {
  onUpdatedChild(childId: string, value: Partial<Child>): void;
  onSetError(value: string): void;
}

export const UpdaterContext = createContext<IUpdaterContext>({
  onUpdatedChild: () => {},
  onSetError: () => {},
});
