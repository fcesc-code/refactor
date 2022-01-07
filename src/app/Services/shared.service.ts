import { Injectable } from '@angular/core';

export interface ResponseError {
  statusCode: number;
  message: string;
  messageDetail: string;
  code: string;
  timestamp: string;
  path: string;
  method: string;
}

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  async managementToast(
    element: string,
    validRequest: boolean,
    error?: ResponseError
  ): Promise<void> {
    const toastMsg = document.getElementById(element);
    if (toastMsg) {
      if (validRequest) {
        toastMsg.className = 'show requestOk';
        toastMsg.textContent = 'Form submitted successfully.';
        await this.wait(2500);
        toastMsg.className = toastMsg.className.replace('show', '');
      } else {
        toastMsg.className = 'show requestKo';
        if (error?.messageDetail) {
          toastMsg.textContent =
            'Error on form submitted, show logs. Message: ' +
            error?.message +
            '. Message detail: ' +
            error?.messageDetail +
            '. Status code: ' +
            error?.statusCode;
        } else {
          toastMsg.textContent =
            'Error on form submitted, show logs. Message: ' +
            error?.message +
            '. Status code: ' +
            error?.statusCode;
        }

        await this.wait(2500);
        toastMsg.className = toastMsg.className.replace('show', '');
      }
    }
  }

  errorLog(error: ResponseError): void {
    console.error('path:', error.path);
    console.error('timestamp:', error.timestamp);
    console.error('message:', error.message);
    console.error('messageDetail:', error.messageDetail);
    console.error('statusCode:', error.statusCode);
  }

  async wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
