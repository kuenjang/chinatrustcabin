#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔒 執行安全檢查...\n');

// 檢查 .env.local 是否被 gitignore
const gitignorePath = path.join(process.cwd(), '.gitignore');
const envLocalPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  if (gitignoreContent.includes('.env.local')) {
    console.log('✅ .env.local 已在 .gitignore 中');
  } else {
    console.log('❌ .env.local 未在 .gitignore 中！請立即修正！');
    process.exit(1);
  }
} else {
  console.log('❌ 找不到 .gitignore 檔案！');
  process.exit(1);
}

// 檢查是否有 .env.local 檔案
if (fs.existsSync(envLocalPath)) {
  console.log('✅ .env.local 檔案存在');
  
  // 檢查是否包含敏感資訊
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  const sensitivePatterns = [
    /TELEGRAM_BOT_TOKEN=/,
    /SUPABASE_SERVICE_ROLE_KEY=/,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY=/
  ];
  
  let hasSensitiveInfo = false;
  sensitivePatterns.forEach(pattern => {
    if (pattern.test(envContent)) {
      hasSensitiveInfo = true;
    }
  });
  
  if (hasSensitiveInfo) {
    console.log('✅ 環境變數檔案包含必要的設定');
  } else {
    console.log('⚠️  環境變數檔案可能缺少敏感資訊');
  }
} else {
  console.log('⚠️  .env.local 檔案不存在，請建立並填入必要的環境變數');
}

// 檢查是否有敏感資訊被意外提交
const gitStatus = require('child_process').execSync('git status --porcelain', { encoding: 'utf8' });
const envFiles = gitStatus.split('\n').filter(line => line.includes('.env'));

if (envFiles.length > 0) {
  console.log('❌ 發現環境變數檔案被追蹤！請立即移除：');
  envFiles.forEach(file => {
    console.log(`   ${file}`);
  });
  console.log('\n執行以下指令移除：');
  console.log('git rm --cached .env.local');
  console.log('git commit -m "remove sensitive files"');
  process.exit(1);
} else {
  console.log('✅ 沒有環境變數檔案被 Git 追蹤');
}

console.log('\n🎉 安全檢查完成！');
console.log('\n📋 下一步：');
console.log('1. 確保 .env.local 包含所有必要的環境變數');
console.log('2. 在 Vercel 中設定相同的環境變數');
console.log('3. 測試 Telegram 通知功能'); 