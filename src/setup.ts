import { Coordinator } from './coordinator';
import { libId } from './models';

export function setupPostQuecast(): void {
  const head: any = window.top;

  if (!!head[libId]) {
    console.error(`Attempting to call setupPostQuecast when it is already initialized`);
  } else {
    const coordinator = new Coordinator();

    coordinator.init();
    head[libId] = coordinator;
  }
}
