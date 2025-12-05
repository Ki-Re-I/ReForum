import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

class EmailService {
  // 发送欢迎邮件
  static async sendWelcomeEmail(email, username) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'REForum <noreply@reforum.space>',
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
        from: 'REForum <noreply@reforum.space>',
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
      // 检查 API Key 是否配置
      if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY 未配置');
        return false;
      }

      const { data, error } = await resend.emails.send({
        from: 'REForum <noreply@reforum.space>',
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
        console.error('Resend API 错误详情:', JSON.stringify(error, null, 2));
        console.error('错误类型:', error.name);
        console.error('错误消息:', error.message);
        return false;
      }

      console.log('验证码邮件发送成功:', data);
      return true;
    } catch (error) {
      console.error('邮件服务错误:', error);
      console.error('错误堆栈:', error.stack);
      console.error('错误类型:', error.name);
      console.error('错误消息:', error.message);
      return false;
    }
  }

  // 发送密码重置邮件（如果需要）
  static async sendPasswordResetEmail(email, username, resetToken) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      const { data, error } = await resend.emails.send({
        from: 'REForum <noreply@reforum.space>',
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

  // 站外新帖通知邮件
  static async sendNewPostNotificationEmails({ recipients, postTitle, postId, authorUsername, excerpt }) {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY 未配置，跳过邮件发送');
        return { successCount: 0, failureCount: recipients?.length || 0 };
      }

      if (!Array.isArray(recipients) || recipients.length === 0) {
        console.log('没有需要发送的邮件收件人，跳过邮件发送');
        return { successCount: 0, failureCount: 0 };
      }

      const postUrlBase = process.env.FRONTEND_URL || process.env.APP_URL || '';
      const postUrl = `${postUrlBase}/post/${postId}`;
      const previewText = excerpt ? excerpt.slice(0, 160) : '点击查看详情';

      const results = await Promise.allSettled(
        recipients.map(async ({ email, username }) => {
          const displayName = username || 'REForum 用户';
          const { error } = await resend.emails.send({
            from: 'REForum <noreply@reforum.space>',
            to: email,
            subject: `${authorUsername} 发布了新帖子：${postTitle}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px;">
                <p style="color: #6b7280; font-size: 12px; margin: 0 0 12px;">${previewText}</p>
                <h1 style="color: #111827; font-size: 22px; margin: 0 0 16px;">${postTitle}</h1>
                <p style="color: #374151; margin: 0 0 16px;">您好，${displayName}！</p>
                <p style="color: #374151; margin: 0 0 16px;">${authorUsername} 刚刚发布了新的帖子，快来看看：</p>
                <div style="margin: 12px 0 20px;">
                  <a href="${postUrl}" style="display: inline-block; padding: 12px 20px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 6px;">查看帖子</a>
                </div>
                ${excerpt ? `<p style="color: #4b5563; margin: 0 0 12px;">${excerpt}</p>` : ''}
                <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">如果按钮无法点击，请复制链接到浏览器：<br /><span style="word-break: break-all;">${postUrl}</span></p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                <p style="color: #9ca3af; font-size: 12px;">此邮件由 REForum 系统自动发送，请勿回复。</p>
              </div>
            `,
          });

          if (error) {
            throw new Error(error.message || '发送失败');
          }
        })
      );

      const successCount = results.filter(r => r.status === 'fulfilled').length;
      const failureCount = results.length - successCount;

      if (failureCount > 0) {
        const errors = results
          .filter(r => r.status === 'rejected')
          .map(r => r.reason?.message || '未知错误');
        console.error('部分新帖通知邮件发送失败:', errors);
      }

      console.log(`新帖通知邮件发送完成，成功 ${successCount}，失败 ${failureCount}`);
      return { successCount, failureCount };
    } catch (error) {
      console.error('发送新帖通知邮件出现异常:', error);
      return { successCount: 0, failureCount: recipients?.length || 0 };
    }
  }
}

export default EmailService;

