import type { IRemoteOption } from '@/types';

const maskStatus = { queueLength: 0, working: false };
const dom = window.document.getElementById('loading') as HTMLElement;

export const beforeSend = (option: IRemoteOption) => {
  maskStatus.queueLength++;
  option.start = Date.now();
  if (!maskStatus.working && import.meta.env.VITE_APP_LOADING === 'true') {
    dom.style.display = 'block';
    maskStatus.working = true;
  }
};

export const afterSend = (_option?: IRemoteOption) => {
  maskStatus.queueLength--;
  if (maskStatus.queueLength === 0 && maskStatus.working && import.meta.env.VITE_APP_LOADING === 'true') {
    dom.style.display = 'none';
    maskStatus.working = false;
  }
  return maskStatus.queueLength;
};
