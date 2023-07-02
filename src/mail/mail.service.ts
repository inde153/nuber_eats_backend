import got from 'got';
import * as FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    this.sendEmail('testing', 'test');
  }

  private async sendEmail(
    subject: string,
    content: string,
    to: string = 'inde456@naver.com',
  ) {
    const formData = new FormData();
    formData.append('from', `Excited User <mailgun@${this.options.domain}`);
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('template', 'verify email');
    formData.append('v:code', 'asas');
    formData.append('v:username', 'inde');
    const response = await got(
      `https://api.mailgun.net/v3/${this.options.domain}/messages`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        method: 'POST',
        body: formData,
      },
    );
    console.log(response.body);
    console.log(`to : ${to}`);
  }
}
