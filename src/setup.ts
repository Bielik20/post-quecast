import { Coordinator } from './coordinator';
import { libId } from './models';

export function setupPostQuecast(): void {
  const head: any = window.top;

  if (window !== head) {
    throw Error(`You can only setup Post Quecast on top level window.`);
  }

  if (!!head[libId]) {
    throw Error(`You can only setup Post Quecast once.`);
  }

  const coordinator = new Coordinator();

  coordinator.init();
  head[libId] = coordinator;
}
