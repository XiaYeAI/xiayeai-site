/**
 * 生成管理员强密码和 bcrypt hash 值的脚本
 * 创建日期：2024-12-19
 * 功能：生成安全的管理员密码并计算其 bcrypt hash 值
 */

const crypto = require('crypto');
const bcrypt = require('bcrypt');

/**
 * 生成强密码
 * @param {number} length - 密码长度
 * @returns {string} 生成的强密码
 */
function generateStrongPassword(length = 16) {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  // 确保密码包含每种字符类型
  let password = '';
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // 填充剩余长度
  const allChars = lowercase + uppercase + numbers + symbols;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // 打乱密码字符顺序
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * 生成 bcrypt hash
 * @param {string} password - 原始密码
 * @returns {Promise<string>} bcrypt hash 值
 */
async function generateBcryptHash(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('正在生成新的管理员密码...');
    
    // 生成强密码
    const newPassword = generateStrongPassword(16);
    console.log('\n新密码已生成：', newPassword);
    
    // 生成 bcrypt hash
    const passwordHash = await generateBcryptHash(newPassword);
    console.log('\nbcrypt hash 值：', passwordHash);
    
    // 验证 hash 是否正确
    const isValid = await bcrypt.compare(newPassword, passwordHash);
    console.log('\nhash 验证结果：', isValid ? '✓ 正确' : '✗ 错误');
    
    console.log('\n=== 管理员凭据信息 ===');
    console.log('用户名: admin@xiayeai.com');
    console.log('密码:', newPassword);
    console.log('Hash:', passwordHash);
    console.log('========================');
    
  } catch (error) {
    console.error('生成密码时发生错误:', error);
    process.exit(1);
  }
}

// 运行主函数