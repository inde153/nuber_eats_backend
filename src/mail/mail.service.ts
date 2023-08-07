import got from 'got';
import * as FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVars, MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  async sendEmail(
    subject: string,
    to: string = 'inde456@naver.com',
    templateName: string = 'verify_email',
    emailVars: EmailVars[],
  ) {
    const formData = new FormData();
    formData.append('from', `Nuber eats<mailgun@${this.options.domain}`);
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('template', templateName);
    emailVars.forEach((ele) => formData.append(`v:${ele.key}`, ele.value));
    try {
      await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        method: 'POST',
        body: formData,
      });
    } catch (err) {
      return {
        ok: false,
        error: "can't send mail",
      };
    }
    return true;
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Verify Your Email', 'inde456@naver.com', 'verify_email', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}
