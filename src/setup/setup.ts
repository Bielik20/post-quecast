import { LIB_ID } from '../utils/constants';
import { Coordinator } from './coordinator';

export function setupPostQuecast(): void {
  const head: any = window.top;

  if (window !== head) {
    throw Error(`You can only setup Post Quecast on top level window.`);
  }

  if (!!head[LIB_ID]) {
    throw Error(`You can only setup Post Quecast once.`);
  }

  const coordinator = new Coordinator();

  coordinator.init();
  head[LIB_ID] = coordinator;
}
