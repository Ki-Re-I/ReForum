// 验证码存储（内存存储，生产环境建议使用 Redis）
const verificationCodes = new Map();
const lastSentTimes = new Map(); // 记录每个邮箱最后发送时间

// 验证码有效期（5分钟）
const CODE_EXPIRY = 5 * 60 * 1000; // 5分钟

class VerificationCodeService {
  // 生成6位数字验证码
  static generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // 存储验证码
  static storeCode(email, code) {
    const expiryTime = Date.now() + CODE_EXPIRY;
    verificationCodes.set(email, {
      code,
      expiryTime,
      attempts: 0, // 验证尝试次数
    });
    
    // 记录发送时间
    lastSentTimes.set(email, Date.now());
    
    // 清理过期验证码（每10分钟清理一次）
    setTimeout(() => {
      this.cleanExpiredCodes();
    }, 10 * 60 * 1000);
  }

  // 验证验证码
  static verifyCode(email, code) {
    const stored = verificationCodes.get(email);
    
    if (!stored) {
      return {
        valid: false,
        message: '验证码不存在或已过期，请重新获取',
      };
    }

    // 检查是否过期
    if (Date.now() > stored.expiryTime) {
      verificationCodes.delete(email);
      return {
        valid: false,
        message: '验证码已过期，请重新获取',
      };
    }

    // 检查尝试次数（最多5次）
    if (stored.attempts >= 5) {
      verificationCodes.delete(email);
      return {
        valid: false,
        message: '验证码验证次数过多，请重新获取',
      };
    }

    // 增加尝试次数
    stored.attempts++;

    // 验证码匹配
    if (stored.code === code) {
      // 验证成功后删除验证码
      verificationCodes.delete(email);
      return {
        valid: true,
        message: '验证码正确',
      };
    }

    return {
      valid: false,
      message: '验证码错误',
    };
  }

  // 清理过期验证码
  static cleanExpiredCodes() {
    const now = Date.now();
    for (const [email, data] of verificationCodes.entries()) {
      if (now > data.expiryTime) {
        verificationCodes.delete(email);
      }
    }
  }

  // 检查邮箱是否已有验证码（用于限制发送频率）
  static hasActiveCode(email) {
    const stored = verificationCodes.get(email);
    if (!stored) return false;
    
    // 如果验证码未过期，返回 true
    return Date.now() < stored.expiryTime;
  }

  // 获取剩余时间（秒）
  static getRemainingTime(email) {
    const stored = verificationCodes.get(email);
    if (!stored) return 0;
    
    const remaining = Math.max(0, Math.floor((stored.expiryTime - Date.now()) / 1000));
    return remaining;
  }

  // 获取最后发送时间（毫秒时间戳）
  static getLastSentTime(email) {
    return lastSentTimes.get(email) || null;
  }

  // 删除验证码（发送失败时使用）
  static deleteCode(email) {
    verificationCodes.delete(email);
    lastSentTimes.delete(email);
  }
}

export default VerificationCodeService;

