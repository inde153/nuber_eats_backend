import got from 'got';
import * as FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVars, MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    this.sendEmail('testing', 'test', [
      { key: 'code', value: 'gmdskg' },
      { key: 'username', value: 'gmdsdsakg' },
    ]);
  }

  private async sendEmail(
    subject: string,
    templateName: string = 'verify email',
    emailVars: EmailVars[],
    to: string = 'inde456@naver.com',
  ) {
    try {
      const formData = new FormData();
      formData.append('from', `Nuber eats <mailgun@${this.options.domain}`);
      formData.append('to', to);
      formData.append('subject', subject);
      formData.append('template', templateName);
      formData.append('v:code', 'asas');
      formData.append('v:username', 'inde');
      emailVars.forEach((ele) => formData.append(ele.key, ele.value));
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
    } catch (err) {
      console.log(err);
    }
  }
}
