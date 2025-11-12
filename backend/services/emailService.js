import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

class EmailService {
  // 发送欢迎邮件
  static async sendWelcomeEmail(email, username) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'REForum <onboarding@resend.dev>', // 需要替换为您的域名
        to: email,
        subject: '欢迎加入 REForum 论坛',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3498db;">欢迎加入 REForum！</h1>
            <p>亲爱的 ${username}，</p>
            <p>感谢您注册 REForum 论坛。我们很高兴您能加入我们的社区！</p>
            <p>现在您可以：</p>
            <ul>
              <li>发布和分享您的想法</li>
              <li>参与讨论和评论</li>
              <li>与其他用户互动</li>
            </ul>
            <p>祝您使用愉快！</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">此邮件由 REForum 系统自动发送，请勿回复。</p>
          </div>
        `,
      });

      if (error) {
        console.error('发送邮件失败:', error);
        return false;
      }

      console.log('欢迎邮件发送成功:', data);
      return true;
    } catch (error) {
      console.error('邮件服务错误:', error);
      return false;
    }
  }

  // 发送验证邮件（如果需要邮箱验证）
  static async sendVerificationEmail(email, username, verificationToken) {
    try {
      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${verificationToken}`;
      
      const { data, error } = await resend.emails.send({
        from: 'REForum <onboarding@resend.dev>',
        to: email,
        subject: '验证您的 REForum 邮箱',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3498db;">验证您的邮箱</h1>
            <p>亲爱的 ${username}，</p>
            <p>请点击下面的链接验证您的邮箱地址：</p>
            <p>
              <a href="${verificationUrl}" 
                 style="display: inline-block; padding: 12px 24px; background-color: #3498db; color: white; text-decoration: none; border-radius: 4px;">
                验证邮箱
              </a>
            </p>
            <p>如果按钮无法点击，请复制以下链接到浏览器：</p>
            <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
            <p style="color: #999; font-size: 12px;">此链接将在24小时后过期。</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">此邮件由 REForum 系统自动发送，请勿回复。</p>
          </div>
        `,
      });

      if (error) {
        console.error('发送验证邮件失败:', error);
        return false;
      }

      console.log('验证邮件发送成功:', data);
      return true;
    } catch (error) {
      console.error('邮件服务错误:', error);
      return false;
    }
  }

  // 发送注册验证码邮件
  static async sendVerificationCodeEmail(email, code) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'REForum <onboarding@resend.dev>', // 需要替换为您的域名
        to: email,
        subject: 'REForum 注册验证码',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">REForum 注册验证码</h1>
            <p>您好，</p>
            <p>您正在注册 REForum 论坛账号，验证码为：</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; padding: 15px 30px; background-color: #f3f4f6; border-radius: 8px; font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 5px;">
                ${code}
              </div>
            </div>
            <p>验证码有效期为 <strong>5分钟</strong>，请尽快使用。</p>
            <p style="color: #ef4444;">如果您没有注册 REForum 账号，请忽略此邮件。</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #9ca3af; font-size: 12px;">此邮件由 REForum 系统自动发送，请勿回复。</p>
          </div>
        `,
      });

      if (error) {
        console.error('发送验证码邮件失败:', error);
        return false;
      }

      console.log('验证码邮件发送成功:', data);
      return true;
    } catch (error) {
      console.error('邮件服务错误:', error);
      return false;
    }
  }

  // 发送密码重置邮件（如果需要）
  static async sendPasswordResetEmail(email, username, resetToken) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      const { data, error } = await resend.emails.send({
        from: 'REForum <onboarding@resend.dev>',
        to: email,
        subject: '重置您的 REForum 密码',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #e74c3c;">重置密码</h1>
            <p>亲爱的 ${username}，</p>
            <p>我们收到了您重置密码的请求。请点击下面的链接重置您的密码：</p>
            <p>
              <a href="${resetUrl}" 
                 style="display: inline-block; padding: 12px 24px; background-color: #e74c3c; color: white; text-decoration: none; border-radius: 4px;">
                重置密码
              </a>
            </p>
            <p>如果按钮无法点击，请复制以下链接到浏览器：</p>
            <p style="color: #666; word-break: break-all;">${resetUrl}</p>
            <p style="color: #999; font-size: 12px;">此链接将在1小时后过期。如果您没有请求重置密码，请忽略此邮件。</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">此邮件由 REForum 系统自动发送，请勿回复。</p>
          </div>
        `,
      });

      if (error) {
        console.error('发送密码重置邮件失败:', error);
        return false;
      }

      console.log('密码重置邮件发送成功:', data);
      return true;
    } catch (error) {
      console.error('邮件服务错误:', error);
      return false;
    }
  }
}

export default EmailService;

