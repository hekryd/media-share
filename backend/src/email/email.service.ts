import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { User } from "@prisma/client";
import * as moment from "moment";
import * as nodemailer from "nodemailer";
import { ConfigService } from "src/config/config.service";

@Injectable()
export class EmailService {
  constructor(private config: ConfigService) {}
  private readonly logger = new Logger(EmailService.name);

  getTransporter() {
    if (!this.config.get("smtp.enabled"))
      throw new InternalServerErrorException("SMTP is disabled");

    const username = this.config.get("smtp.username");
    const password = this.config.get("smtp.password");

    return nodemailer.createTransport({
      host: this.config.get("smtp.host"),
      port: this.config.get("smtp.port"),
      secure: this.config.get("smtp.port") == 465,
      auth:
        username || password ? { user: username, pass: password } : undefined,
      tls: {
        rejectUnauthorized: !this.config.get(
          "smtp.allowUnauthorizedCertificates",
        ),
      },
    });
  }

  private async sendMail(
    email: string,
    subject: string,
    text: string,
    html?: string,
  ) {
    await this.getTransporter()
      .sendMail({
        from: `"${this.config.get("general.appName")}" <${this.config.get(
          "smtp.email",
        )}>`,
        to: email,
        subject,
        text,
        html,
      })
      .catch((e) => {
        this.logger.error(e);
        throw new InternalServerErrorException("Failed to send email");
      });
  }

  private buildBoldHtml(
    template: string,
    vars: Record<string, string>,
  ): { text: string; html: string } {
    const plain = template.replaceAll("\\n", "\n");
    let text = plain;
    for (const [k, v] of Object.entries(vars)) text = text.replaceAll(`{${k}}`, v);

    const escape = (s: string) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    let html = escape(plain);
    for (const [k, v] of Object.entries(vars)) {
      html = html.replaceAll(
        `{${k}}`,
        `<strong style="font-weight:600;">${escape(v)}</strong>`,
      );
    }
    html = html.replace(/\n/g, "<br>");
    html = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;">${html}</div>`;
    return { text, html };
  }

  async sendMailToShareRecipients(
    recipientEmail: string,
    shareId: string,
    creator?: User,
    description?: string,
    expiration?: Date,
  ) {
    if (!this.config.get("email.enableShareEmailRecipients"))
      throw new InternalServerErrorException("Email service disabled");

    const shareUrl = `${this.config.get("general.appUrl")}/s/${shareId}`;

  const template = this.config.get("email.shareRecipientsMessage");
  let subject = this.config.get("email.shareRecipientsSubject");
    const vars = {
      creator: creator?.username ?? "Someone",
      creatorEmail: creator?.email ?? "",
      shareUrl,
      desc: description ?? "No description",
      expires:
        moment(expiration).unix() != 0
          ? moment(expiration).fromNow()
          : "in: never",
    } as Record<string, string>;
    // Allow {creator} in subject too
    subject = subject.replaceAll("{creator}", vars.creator);
    const { text, html } = this.buildBoldHtml(template, vars);
    await this.sendMail(
      recipientEmail,
      subject,
      text,
      html,
    );
  }

  /**
   * Sends reverse share creator notification. Supports the same variables as regular upload email:
   * {creator}, {creatorEmail}, {shareUrl}, {desc}, {expires}
   */
  async sendMailToReverseShareCreator(
    recipientEmail: string,
    shareId: string,
    creator?: User,
    description?: string,
    expiration?: Date,
    reverseShareName?: string,
    shareName?: string,
  ) {
    const shareUrl = `${this.config.get("general.appUrl")}/s/${shareId}`;
    const creatorLabel = creator
      ? creator.username
      : reverseShareName || "Anonymous";

  const template = this.config.get("email.reverseShareMessage");
  let subject = this.config.get("email.reverseShareSubject");
    const vars = {
      shareUrl,
      creator: creatorLabel,
      creatorEmail: creator?.email ?? "",
      desc: description ?? "No description",
      expires:
        expiration && moment(expiration).unix() != 0
          ? moment(expiration).fromNow()
          : "in: never",
      shareName: shareName ?? "Unnamed share",
    } as Record<string, string>;
    // Allow {creator} in subject too
    subject = subject.replaceAll("{creator}", vars.creator);
    const { text, html } = this.buildBoldHtml(template, vars);
    await this.sendMail(
      recipientEmail,
      subject,
      text,
      html,
    );
  }

  async sendResetPasswordEmail(recipientEmail: string, token: string) {
    const resetPasswordUrl = `${this.config.get(
      "general.appUrl",
    )}/auth/resetPassword/${token}`;

    await this.sendMail(
      recipientEmail,
      this.config.get("email.resetPasswordSubject"),
      this.config
        .get("email.resetPasswordMessage")
        .replaceAll("\\n", "\n")
        .replaceAll("{url}", resetPasswordUrl),
    );
  }

  async sendInviteEmail(recipientEmail: string, password: string) {
    const loginUrl = `${this.config.get("general.appUrl")}/auth/signIn`;

    await this.sendMail(
      recipientEmail,
      this.config.get("email.inviteSubject"),
      this.config
        .get("email.inviteMessage")
        .replaceAll("{url}", loginUrl)
        .replaceAll("{password}", password)
        .replaceAll("{email}", recipientEmail),
    );
  }

  async sendTestMail(recipientEmail: string) {
    await this.getTransporter()
      .sendMail({
        from: `"${this.config.get("general.appName")}" <${this.config.get(
          "smtp.email",
        )}>`,
        to: recipientEmail,
        subject: "Test email",
        text: "This is a test email",
      })
      .catch((e) => {
        this.logger.error(e);
        throw new InternalServerErrorException(e.message);
      });
  }
}
