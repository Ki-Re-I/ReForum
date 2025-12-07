import React, { useState, useMemo } from 'react'
import { format } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'
import enUS from 'date-fns/locale/en-US'
import ja from 'date-fns/locale/ja'
import { useLanguage } from '../context/LanguageContext'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import './Fixes.css'

export const fixes = [
  {
    date: '2025-12-08',
    version: '1.9.4',
    issue: 38,
    translations: {
      zh: {
        title: 'VITE_ENABLE_TEST_LOGIN 环境变量逻辑不正确',
        description:
          '修复测试登录环境变量的逻辑，确保只在开发/测试环境中生效，且必须明确设置为 true 才能启用。',
        details: [
          '修改逻辑：只有在开发/测试环境中，且 VITE_ENABLE_TEST_LOGIN 明确设置为 true 时才启用测试登录',
          '在生产环境中，无论设置什么值都禁用测试登录',
          '更新 AuthContext 和 Header 组件中的测试登录检查逻辑',
          '添加调试信息帮助诊断问题',
        ],
      },
      en: {
        title: 'VITE_ENABLE_TEST_LOGIN Environment Variable Logic Incorrect',
        description:
          'Fixed the logic for test login environment variable, ensuring it only works in development/test environments and must be explicitly set to true to enable.',
        details: [
          'Modified logic: Only enable test login in development/test environments when VITE_ENABLE_TEST_LOGIN is explicitly set to true',
          'In production environment, disable test login regardless of the value set',
          'Updated test login check logic in AuthContext and Header components',
          'Added debug information to help diagnose issues',
        ],
      },
      ja: {
        title: 'VITE_ENABLE_TEST_LOGIN 環境変数のロジックが正しくない',
        description:
          'テストログイン環境変数のロジックを修正し、開発/テスト環境でのみ有効になり、明示的に true に設定する必要があることを確認しました。',
        details: [
          'ロジックを変更：開発/テスト環境でのみ、VITE_ENABLE_TEST_LOGIN が明示的に true に設定されている場合にテストログインを有効化',
          '本番環境では、設定された値に関係なくテストログインを無効化',
          'AuthContext と Header コンポーネントのテストログインチェックロジックを更新',
          '問題の診断を支援するデバッグ情報を追加',
        ],
      },
    },
  },
  {
    date: '2025-12-08',
    version: '1.9.4',
    issue: 37,
    translations: {
      zh: {
        title: '响应式设备上用户名、称号和编辑按钮间距冲突',
        description:
          '修复移动端用户资料页面中用户名、称号和编辑资料按钮之间的间距问题，确保布局清晰易读。',
        details: [
          '增加 profile-username-row 的 gap 从 0.75rem 到 1rem',
          '为 profile-username-wrapper 添加底部间距',
          '为 edit-profile-button 添加顶部间距',
          '确保在 768px 和 480px 断点都应用这些修复',
        ],
      },
      en: {
        title: 'Username, Tag and Edit Button Spacing Conflict on Responsive Devices',
        description:
          'Fixed spacing issues between username, tag and edit profile button on mobile user profile page, ensuring clear and readable layout.',
        details: [
          'Increased profile-username-row gap from 0.75rem to 1rem',
          'Added bottom margin to profile-username-wrapper',
          'Added top margin to edit-profile-button',
          'Applied these fixes at both 768px and 480px breakpoints',
        ],
      },
      ja: {
        title: 'レスポンシブデバイスでのユーザー名、称号、編集ボタンの間隔の競合',
        description:
          'モバイルユーザープロフィールページでユーザー名、称号、プロフィール編集ボタン間の間隔の問題を修正し、明確で読みやすいレイアウトを確保しました。',
        details: [
          'profile-username-row の gap を 0.75rem から 1rem に増加',
          'profile-username-wrapper に下部マージンを追加',
          'edit-profile-button に上部マージンを追加',
          '768px と 480px の両方のブレークポイントでこれらの修正を適用',
        ],
      },
    },
  },
  {
    date: '2025-12-08',
    version: '1.9.4',
    issue: 36,
    translations: {
      zh: {
        title: '编辑资料时请求参数验证失败',
        description:
          '修复点击编辑资料保存按钮后报错"请求参数验证失败"的问题，确保可以正常保存资料修改。',
        details: [
          '后端：修改 validateUpdateProfile 验证规则，使用自定义验证函数，允许空值字段',
          '前端：只发送有变化的字段，空值转换为 null，避免发送未修改的数据',
          '如果没有字段被修改，直接关闭弹窗，不发送请求',
          '确保空值字段可以正常处理',
        ],
      },
      en: {
        title: 'Request Parameter Validation Failed When Editing Profile',
        description:
          'Fixed the "Request parameter validation failed" error when clicking save button in edit profile, ensuring profile modifications can be saved normally.',
        details: [
          'Backend: Modified validateUpdateProfile validation rules, using custom validation functions to allow null value fields',
          'Frontend: Only send changed fields, convert empty values to null, avoid sending unmodified data',
          'If no fields are modified, close modal directly without sending request',
          'Ensure null value fields can be processed normally',
        ],
      },
      ja: {
        title: 'プロフィール編集時のリクエストパラメータ検証エラー',
        description:
          'プロフィール編集で保存ボタンをクリックした際の「リクエストパラメータ検証エラー」を修正し、プロフィールの変更を正常に保存できるようにしました。',
        details: [
          'バックエンド：validateUpdateProfile 検証ルールを修正し、カスタム検証関数を使用して null 値フィールドを許可',
          'フロントエンド：変更されたフィールドのみを送信し、空の値を null に変換して未変更のデータを送信しない',
          'フィールドが変更されていない場合、リクエストを送信せずにモーダルを直接閉じる',
          'null 値フィールドが正常に処理されることを保証',
        ],
      },
    },
  },
  {
    date: '2025-12-08',
    version: '1.9.3',
    issue: 35,
    translations: {
      zh: {
        title: 'startsWith 方法调用错误',
        description:
          '修复用户界面报错 "s.startsWith is not a function" 的问题，确保所有字符串方法调用前都进行类型转换。',
        details: [
          '在所有调用 startsWith 方法前，使用 String() 将值转换为字符串',
          '修复 AuthContext、LoginModal、RegisterModal 等组件中的类型转换问题',
          '修复 UserProfile、dailyTasks、api、EditProfileModal 中的 startsWith 调用',
          '确保所有字符串方法调用前都进行类型转换，防止类似错误',
        ],
      },
      en: {
        title: 'startsWith Method Call Error',
        description:
          'Fixed the "s.startsWith is not a function" error in user interface, ensuring all string method calls perform type conversion before execution.',
        details: [
          'Use String() to convert values to strings before calling startsWith method',
          'Fixed type conversion issues in AuthContext, LoginModal, RegisterModal components',
          'Fixed startsWith calls in UserProfile, dailyTasks, api, EditProfileModal',
          'Ensure all string method calls perform type conversion to prevent similar errors',
        ],
      },
      ja: {
        title: 'startsWith メソッド呼び出しエラー',
        description:
          'ユーザーインターフェースで発生する "s.startsWith is not a function" エラーを修正し、すべての文字列メソッド呼び出し前に型変換を実行するようにしました。',
        details: [
          'startsWith メソッドを呼び出す前に、String() を使用して値を文字列に変換',
          'AuthContext、LoginModal、RegisterModal などのコンポーネントの型変換問題を修正',
          'UserProfile、dailyTasks、api、EditProfileModal の startsWith 呼び出しを修正',
          'すべての文字列メソッド呼び出し前に型変換を実行し、類似のエラーを防止',
        ],
      },
    },
  },
  {
    date: '2025-12-08',
    version: '1.9.2',
    issue: 34,
    translations: {
      zh: {
        title: '经验值条显示不正确',
        description:
          '修复当数据库修改用户等级后，用户资料页面的经验值条仍然显示旧经验值的问题，确保经验值从服务器实时获取。',
        details: [
          '修改 getUserExp 函数优先使用用户对象中的 exp，而不是从 localStorage 读取',
          '修复 UserProfile 组件中的经验值获取逻辑，确保正确显示用户等级和经验值',
          '70级用户现在正确显示满级状态（100%进度条）',
          '经验值从服务器实时获取，不再使用本地缓存',
        ],
      },
      en: {
        title: 'Experience Progress Bar Display Incorrect',
        description:
          'Fixed the issue where the experience progress bar still displayed old experience values after modifying user level in database, ensuring experience values are fetched in real-time from server.',
        details: [
          'Modified getUserExp function to prioritize exp from user object instead of reading from localStorage',
          'Fixed experience value retrieval logic in UserProfile component to correctly display user level and exp',
          'Level 70 users now correctly display max level status (100% progress bar)',
          'Experience values are fetched in real-time from server, no longer using local cache',
        ],
      },
      ja: {
        title: '経験値プログレスバーの表示が正しくない',
        description:
          'データベースでユーザーレベルを変更した後、ユーザープロフィールページの経験値プログレスバーが古い経験値を表示し続ける問題を修正し、経験値をサーバーからリアルタイムで取得するようにしました。',
        details: [
          'getUserExp 関数を修正し、localStorage から読み取るのではなく、ユーザーオブジェクトの exp を優先的に使用',
          'UserProfile コンポーネントの経験値取得ロジックを修正し、ユーザーレベルと経験値を正しく表示',
          '70レベルのユーザーは、満レベル状態（100%プログレスバー）を正しく表示',
          '経験値はサーバーからリアルタイムで取得され、ローカルキャッシュを使用しない',
        ],
      },
    },
  },
  {
    date: '2025-12-08',
    version: '1.9.2',
    issue: 33,
    translations: {
      zh: {
        title: '帖子中作者等级不更新',
        description:
          '修复当数据库修改用户等级后，已发布帖子中显示的作者等级没有更新的问题，确保帖子中的作者信息实时更新。',
        details: [
          '后端 Post 模型在查询帖子时包含作者的 exp 和 tag 字段',
          '添加向后兼容性处理，数据库迁移未执行时自动回退到基本查询',
          '修复 PostCard 和 PostDetail 组件，确保正确显示作者等级',
          '使用帖子作者的经验值，而不是当前登录用户的经验值',
        ],
      },
      en: {
        title: 'Author Level Not Updating in Posts',
        description:
          'Fixed the issue where author level displayed in published posts did not update after modifying user level in database, ensuring author information in posts updates in real-time.',
        details: [
          'Backend Post model now includes author exp and tag fields when querying posts',
          'Added backward compatibility handling, automatically fallback to basic queries when database migration not executed',
          'Fixed PostCard and PostDetail components to correctly display author level',
          'Use post author experience value instead of current logged-in user experience value',
        ],
      },
      ja: {
        title: '投稿内の作成者レベルが更新されない',
        description:
          'データベースでユーザーレベルを変更した後、公開された投稿に表示される作成者レベルが更新されない問題を修正し、投稿内の作成者情報がリアルタイムで更新されるようにしました。',
        details: [
          'バックエンド Post モデルが投稿をクエリする際に、作成者の exp と tag フィールドを含める',
          '後方互換性処理を追加し、データベース移行が実行されていない場合に基本クエリに自動的にフォールバック',
          'PostCard と PostDetail コンポーネントを修正し、作成者レベルを正しく表示',
          '現在ログインしているユーザーの経験値ではなく、投稿作成者の経験値を使用',
        ],
      },
    },
  },
  {
    date: '2025-12-07',
    version: '1.9.1',
    issue: 32,
    translations: {
      zh: {
        title: '编辑资料弹窗中访问 null 对象的 daysRemaining 属性导致错误',
        description:
          '修复点击编辑资料按钮时出现的 "Cannot read properties of null (reading \'daysRemaining\')" 错误。',
        details: [
          '在访问 daysRemaining 属性前添加对象存在性检查',
          '在 useEffect 中添加错误处理，确保计算失败时设置默认值',
          '当用户数据为 null 时，重置状态为 null',
          '确保编辑资料弹窗正常显示和功能正常',
        ],
      },
      en: {
        title: 'Error Accessing daysRemaining Property of Null Object in Edit Profile Modal',
        description:
          'Fixed the "Cannot read properties of null (reading \'daysRemaining\')" error when clicking the edit profile button.',
        details: [
          'Added object existence check before accessing daysRemaining property',
          'Added error handling in useEffect to set default values when calculation fails',
          'Reset state to null when user data is null',
          'Ensured edit profile modal displays and functions correctly',
        ],
      },
      ja: {
        title: 'プロフィール編集モーダルで null オブジェクトの daysRemaining プロパティにアクセスする際のエラー',
        description:
          'プロフィール編集ボタンをクリックした際に発生する "Cannot read properties of null (reading \'daysRemaining\')" エラーを修正しました。',
        details: [
          'daysRemaining プロパティにアクセスする前にオブジェクトの存在チェックを追加',
          'useEffect にエラーハンドリングを追加し、計算が失敗した場合にデフォルト値を設定',
          'ユーザーデータが null の場合、状態を null にリセット',
          'プロフィール編集モーダルが正常に表示され、機能することを保証',
        ],
      },
    },
  },
  {
    date: '2025-12-07',
    version: '1.9.1',
    issue: 31,
    translations: {
      zh: {
        title: '登录后刷新页面自动退出登录和用户资料显示"用户不存在"',
        description:
          '修复登录后刷新页面自动退出登录的问题，以及登录后点击"我的资料"显示"用户不存在"的错误。',
        details: [
          '修复 startsWith 方法调用错误，确保 id 和 token 在调用前转换为字符串',
          '修改错误处理逻辑，只有 401/403 错误才清除登录状态，500 错误不清除',
          '后端添加向后兼容性，数据库迁移未执行时自动回退到基本查询',
          '修复用户资料查询失败的问题，确保即使数据库迁移未执行也能正常显示',
        ],
      },
      en: {
        title: 'Auto Logout After Page Refresh and "User Not Found" Error',
        description:
          'Fixed the issue where users are automatically logged out after page refresh, and the "User not found" error when accessing profile page.',
        details: [
          'Fixed startsWith method call error by converting id and token to strings before calling',
          'Modified error handling logic to only clear login state on 401/403 errors, not on 500 errors',
          'Added backward compatibility to backend, automatically fallback to basic queries when database migration not executed',
          'Fixed user profile query failure, ensuring normal display even when database migration not executed',
        ],
      },
      ja: {
        title: 'ページリフレッシュ後の自動ログアウトと「ユーザーが見つかりません」エラー',
        description:
          'ページリフレッシュ後に自動的にログアウトされる問題と、プロフィールページにアクセスした際の「ユーザーが見つかりません」エラーを修正しました。',
        details: [
          'startsWith メソッド呼び出しエラーを修正し、呼び出し前に id と token を文字列に変換',
          'エラー処理ロジックを変更し、401/403 エラーのみでログイン状態をクリア、500 エラーではクリアしない',
          'バックエンドに後方互換性を追加し、データベース移行が実行されていない場合に基本クエリに自動的にフォールバック',
          'ユーザープロフィールクエリの失敗を修正し、データベース移行が実行されていなくても正常に表示されることを保証',
        ],
      },
    },
  },
  {
    date: '2025-12-07',
    version: '1.9.0',
    issue: 30,
    translations: {
      zh: {
        title: '问题修复页面日期标签渐变背景样式',
        description:
          '优化问题修复页面"最新修复"旁边日期标签的背景样式，将渐变背景改为淡红色纯色背景。',
        details: [
          '日期标签背景从渐变改为淡红色纯色背景，视觉效果更简洁统一',
          '保持其他样式不变，仅优化背景颜色',
        ],
      },
      en: {
        title: 'Fixes Page Date Label Gradient Background Style',
        description:
          'Optimized the background style of the date label next to "Latest Fixes" on the fixes page, changed from gradient to light red solid background.',
        details: [
          'Date label background changed from gradient to light red solid background for cleaner, more unified visual effect',
          'Other styles remain unchanged, only background color optimized',
        ],
      },
      ja: {
        title: '問題修正ページの日付ラベルのグラデーション背景スタイル',
        description:
          '問題修正ページの「最新修正」の横の日付ラベルの背景スタイルを最適化し、グラデーション背景を淡い赤の単色背景に変更しました。',
        details: [
          '日付ラベルの背景をグラデーションから淡い赤の単色背景に変更し、視覚効果をよりシンプルで統一されたものに',
          '他のスタイルは変更せず、背景色のみを最適化',
        ],
      },
    },
  },
  {
    date: '2025-12-07',
    version: '1.9.0',
    issue: 28,
    translations: {
      zh: {
        title: '用户资料页面在特定语言下排版错乱',
        description:
          '修复用户资料页面在不同语言（中文、英文、日文）下由于文本长度差异导致的排版错乱问题。',
        details: [
          '统计标签文本在长文本语言下不再换行或溢出，使用网格布局自适应',
          '用户名和称号区域在所有语言下对齐一致',
          '经验进度条状态文本添加最大宽度限制，防止溢出容器',
          '所有文本元素支持自动换行，确保在不同语言下都能正确显示',
        ],
      },
      en: {
        title: 'User Profile Layout Issues in Specific Languages',
        description:
          'Fixed layout issues on user profile page caused by text length differences in different languages (Chinese, English, Japanese).',
        details: [
          'Statistics labels no longer wrap or overflow in long-text languages, using grid layout for adaptation',
          'Username and tag areas align consistently across all languages',
          'Experience progress bar status text has max-width limit to prevent container overflow',
          'All text elements support automatic line breaks, ensuring correct display in all languages',
        ],
      },
      ja: {
        title: '特定言語でのユーザープロフィールページのレイアウトの乱れ',
        description:
          '異なる言語（中国語、英語、日本語）でのテキスト長の違いによるユーザープロフィールページのレイアウトの問題を修正しました。',
        details: [
          '統計ラベルのテキストが長文言語で折り返したり溢れたりしなくなり、グリッドレイアウトで適応',
          'ユーザー名とタグエリアがすべての言語で一貫して整列',
          '経験値プログレスバーのステータステキストに最大幅制限を追加し、コンテナの溢れを防止',
          'すべてのテキスト要素が自動改行をサポートし、すべての言語で正しく表示されることを保証',
        ],
      },
    },
  },
  {
    date: '2025-12-07',
    version: '1.9.0',
    issue: 29,
    translations: {
      zh: {
        title: '70级等级徽章彩虹渐变动画方向错误',
        description:
          '修复70级等级徽章的彩虹渐变动画在两个方向交替变化的问题，改为单向流动。',
        details: [
          '彩虹渐变动画现在单向流动，颜色变化流畅自然',
          '使用 filter: hue-rotate() 实现单向颜色旋转',
          '动画持续时间调整为18秒，使颜色变化更平滑',
          '更新彩虹渐变生成函数，使用时间计算单向色相变化',
        ],
      },
      en: {
        title: 'Level 70 Badge Rainbow Gradient Animation Direction Error',
        description:
          'Fixed rainbow gradient animation on level 70 badge alternating in two directions, changed to unidirectional flow.',
        details: [
          'Rainbow gradient animation now flows in one direction with smooth, natural color changes',
          'Using filter: hue-rotate() to achieve unidirectional color rotation',
          'Animation duration adjusted to 18 seconds for smoother color transitions',
          'Updated rainbow gradient generation function to calculate unidirectional hue changes using time',
        ],
      },
      ja: {
        title: '70レベルバッジの虹グラデーションアニメーションの方向エラー',
        description:
          '70レベルバッジの虹グラデーションアニメーションが2方向に交互に変化する問題を修正し、一方向の流れに変更しました。',
        details: [
          '虹グラデーションアニメーションは一方向に流れ、色の変化が滑らかで自然',
          'filter: hue-rotate() を使用して一方向の色回転を実現',
          'アニメーション継続時間を18秒に調整し、色の変化をより滑らかに',
          '虹グラデーション生成関数を更新し、時間を使用して一方向の色相変化を計算',
        ],
      },
    },
  },
  {
    date: '2025-12-05',
    version: '1.8.0',
    issue: 27,
    translations: {
      zh: {
        title: '登录注册弹窗定位、用户协议弹窗闪烁与侧边栏动画卡顿',
        description:
          '修复登录和注册弹窗位置不正确、用户协议弹窗闪烁、侧边栏动画卡顿等问题。',
        details: [
          '登录和注册弹窗现在固定在屏幕中央，不会跟随页面滚动，所有设备上都能完整显示',
          '弹窗在所有设备上都能正确居中，不会被屏幕边缘遮挡',
          '修复用户协议和隐私政策弹窗的闪烁问题，现在可以稳定显示',
          '用户协议和隐私政策现在显示完整内容，不再只显示摘要，支持多语言',
          'Cookie 提示中的隐私政策链接改为弹窗显示，与登录注册中的协议弹窗一致',
          '侧边栏菜单的关闭动画更加流畅，不再卡顿',
        ],
      },
      en: {
        title: 'Login/Register Modal Positioning, Terms Modal Flickering & Sidebar Animation Stutter',
        description:
          'Fixed issues with login/register modal positioning, terms modal flickering, and sidebar animation stuttering.',
        details: [
          'Login and register modals now stay fixed in the center of the screen and no longer scroll with the page',
          'Modals are properly centered on all devices and no longer get cut off by screen edges',
          'Fixed flickering issue with terms and privacy modals, they now display stably',
          'Terms and privacy modals now show full content instead of summaries, with multi-language support',
          'Privacy policy link in cookie consent banner now opens in a modal, consistent with terms modals',
          'Sidebar menu close animation is now smoother without stuttering',
        ],
      },
      ja: {
        title: 'ログイン/登録モーダルの位置・利用規約モーダルのちらつき・サイドバーアニメーションのカクつき',
        description:
          'ログイン/登録モーダルの位置の問題、利用規約モーダルのちらつき、サイドバーアニメーションのカクつきを修正しました。',
        details: [
          'ログインと登録モーダルは画面中央に固定され、ページと一緒にスクロールしなくなりました',
          'モーダルはすべてのデバイスで正しく中央に配置され、画面端で切り取られなくなりました',
          '利用規約とプライバシーポリシーモーダルのちらつきを修正し、安定して表示されるようになりました',
          '利用規約とプライバシーポリシーは要約ではなく完全な内容を表示し、多言語に対応',
          'Cookie 同意バナー内のプライバシーポリシーリンクはモーダルで開くように変更し、利用規約モーダルと一致',
          'サイドバーメニューの閉じるアニメーションがよりスムーズになり、カクつきがなくなりました',
        ],
      },
    },
  },
  {
    date: '2025-12-03',
    version: '1.7.2',
    issue: 26,
    translations: {
      zh: {
        title: '移动端日历头部对齐、Cookie 提示遮挡与通知列表不同步',
        description:
          '修复手机上日历头部按钮位置不对、Cookie 提示被底部按钮遮挡、通知数量显示不正确的问题。',
        details: [
          '手机上日历的上一周、下一周、月份切换等按钮现在在一行上居中显示，不再挤在右侧',
          'Cookie 提示在手机上改为显示在顶部，避免被底部工具按钮遮挡',
          '修复手机上打开通知列表时无法获取最新通知的问题，现在每次打开都会刷新',
          '通知图标显示的未读数量现在与列表内容一致，不再出现"有未读但列表为空"的情况',
        ],
      },
      en: {
        title: 'Mobile Calendar Header Alignment, Cookie Banner Overlap & Inbox Desync',
        description:
          'Fixed calendar header button alignment on phones, cookie banner being hidden by bottom buttons, and notification count mismatch issues.',
        details: [
          'Calendar navigation buttons (previous/next week, month switcher) now center properly on one line on phones instead of being pushed to the right',
          'Cookie consent banner now appears at the top on mobile to avoid being hidden by bottom tool buttons',
          'Fixed issue where opening notification list on mobile didn\'t fetch latest notifications, now refreshes every time',
          'Notification badge count now matches the actual list contents, no more "1 unread" with empty list',
        ],
      },
      ja: {
        title: 'モバイル版カレンダーヘッダーのずれ・Cookie バナーの遮蔽・通知一覧の非同期',
        description:
          'スマホでのカレンダーヘッダーボタンの位置ずれ、Cookie バナーが下部ボタンに隠れる問題、通知数の不一致を修正しました。',
        details: [
          'スマホでカレンダーの「前週/次週」「月切替」ボタンが一列で中央揃えに表示されるようになりました',
          'Cookie 同意バナーをスマホでは上部に表示するように変更し、下部ツールボタンに隠れなくなりました',
          'スマホで通知一覧を開いたときに最新の通知が取得されない問題を修正し、毎回更新されるようになりました',
          '通知バッジの未読数が一覧の内容と一致するようになり、「未読1件」なのに一覧が空という問題がなくなりました',
        ],
      },
    },
  },
  {
    date: '2025-12-03',
    version: '1.7.1',
    issue: 25,
    translations: {
      zh: {
        title: '日历按日期筛选与帖子数量徽章在真实数据下失效',
        description:
          '修复日历点击日期无法筛选帖子，以及日期上的帖子数量显示不正确的问题。',
        details: [
          '点击日历日期现在可以正确筛选出当天的帖子',
          '日期右上角的帖子数量现在使用真实数据，不再只显示测试数据',
          '选择日期后使用"热门"排序，会在当天的帖子中按热门度排序',
          '通过日历或地址栏修改日期时，会自动刷新显示对应日期的帖子',
        ],
      },
      en: {
        title: 'Calendar Date Filter & Daily Post Count with Real Backend',
        description:
          'Fixed calendar date filtering and post count badge display when using real backend data.',
        details: [
          'Clicking a calendar date now correctly filters posts for that day',
          'Post count badges now use real backend data instead of mock data',
          'Using "Hot" sort with a selected date now sorts posts by popularity within that day',
          'Changing the date via calendar or URL automatically refreshes posts for that date',
        ],
      },
      ja: {
        title: '本番バックエンドでのカレンダー日付フィルタと投稿数バッジの修正',
        description:
          '本番環境でカレンダーの日付クリックと投稿数バッジが正しく動作するように修正しました。',
        details: [
          'カレンダーの日付をクリックすると、その日の投稿だけが正しく表示されるようになりました',
          '日付右上の投稿数バッジが実際のデータを表示するようになりました',
          '日付を選択して「人気順」を使うと、その日の投稿だけを人気度でソートします',
          'カレンダー操作や URL の日付変更時に、自動でデータが更新されるようになりました',
        ],
      },
    },
  },
  {
    date: '2025-12-03',
    version: '1.7.0',
    issue: 24,
    translations: {
      zh: {
        title: '移动端工具集中的头像菜单被底部按钮遮挡',
        description:
          '修复手机上工具集弹窗中头像菜单被底部按钮遮挡的问题。',
        details: [
          '手机上工具集弹窗中的头像菜单现在向上展开，不会被底部按钮遮挡',
          '桌面端右上角的头像菜单保持原有行为不变',
          '现在可以正常查看和点击"个人资料"和"退出登录"等选项',
        ],
      },
      en: {
        title: 'Avatar Menu Hidden Behind Mobile Toolset Button',
        description:
          'Fixed avatar menu being hidden behind bottom buttons in mobile toolset panel.',
        details: [
          'Avatar menu in mobile toolset panel now opens upward instead of downward',
          'Desktop header avatar menu behavior remains unchanged',
          'Profile and logout options are now fully visible and tappable on phones',
        ],
      },
      ja: {
        title: 'モバイルツール集ボタンの背後に隠れていたアバターメニュー',
        description:
          'スマホのツール集パネルでアバターメニューが下部ボタンに隠れる問題を修正しました。',
        details: [
          'スマホのツール集パネル内では、アバターメニューが上方向に展開されるようになりました',
          'デスクトップ右上のアバターメニューは従来どおり下向きに開きます',
          '「プロフィール」と「ログアウト」などの項目が完全に表示され、タップしやすくなりました',
        ],
      },
    },
  },
  {
    date: '2025-12-03',
    version: '1.7.0',
    issue: 23,
    translations: {
      zh: {
        title: '移动端工具集按钮与工具列表排版统一',
        description:
          '修复手机上工具集按钮位置不对、工具列表排版混乱的问题。',
        details: [
          '工具集按钮现在固定在屏幕底部中央，不会跟随页面滚动',
          '工具集弹窗从底部滑出，关闭时平滑收起',
          '工具列表按钮统一为左侧文字、右侧图标布局，行间距一致',
          '手机上的主题颜色选择和通知列表改为居中弹窗，不会被屏幕边缘遮挡',
          '工具集窗口的关闭按钮位置调整，不会被其他按钮遮挡',
        ],
      },
      en: {
        title: 'Mobile Toolset Button & Tools List Layout Cleanup',
        description:
          'Fixed toolset button positioning and tool list layout issues on mobile.',
        details: [
          'Toolset button now fixed at bottom center of screen and no longer scrolls with page',
          'Toolset panel slides up from bottom and closes smoothly',
          'All tool buttons use consistent left-text, right-icon layout with even spacing',
          'Theme color picker and notifications open as centered modals on mobile, no content clipping',
          'Close button position adjusted to avoid being hidden by other buttons',
        ],
      },
      ja: {
        title: 'モバイル版ツール集ボタンとツール一覧レイアウトの整理',
        description:
          'スマホでのツール集ボタンの位置とツール一覧のレイアウトの問題を修正しました。',
        details: [
          'ツール集ボタンが画面下中央に固定され、ページと一緒にスクロールしなくなりました',
          'ツール集パネルが下からスライドインし、閉じる際もスムーズに動作します',
          'すべてのツールボタンが「左テキスト、右アイコン」の統一レイアウトになり、行間も揃いました',
          'テーマカラー選択と通知を中央モーダル化し、小さな画面でも内容が切れなくなりました',
          '閉じるボタンの位置を調整し、他のボタンに隠れなくなりました',
        ],
      },
    },
  },
  {
    date: '2025-12-03',
    version: '1.6.1',
    issue: 22,
    translations: {
      zh: {
        title: '加载动画主题适配与灰色方块残影问题',
        description:
          '修复加载动画颜色不跟随主题变化，以及进度条周围出现灰色方块的问题。',
        details: [
          '加载页面背景现在会跟随主题色变化',
          '进度条和文字颜色现在会跟随主题色',
          '移除进度条周围的灰色阴影，视觉效果更干净',
        ],
      },
      en: {
        title: 'Loading Overlay Theme Sync & Gray Box Artifact',
        description:
          'Fixed loading animation not following theme colors and gray box around progress ring.',
        details: [
          'Loading screen background now follows theme color changes',
          'Progress ring and text colors now follow theme colors',
          'Removed gray shadow around progress ring for cleaner visuals',
        ],
      },
      ja: {
        title: 'ロードアニメーションのテーマ連動とグレーボックス残像の修正',
        description:
          'ロードアニメーションの色がテーマに追従せず、進捗リングの周りにグレーの四角い残像が出る問題を修正しました。',
        details: [
          'ロード画面の背景がテーマ色の変更に追従するようになりました',
          '進捗リングとテキストの色がテーマ色に追従するようになりました',
          '進捗リング周辺のグレーの影を削除し、視覚的にすっきりしました',
        ],
      },
    },
  },
  {
    date: '2025-12-03',
    version: '1.6.1',
    issue: 21,
    translations: {
      zh: {
        title: '更新日志最新条目日期缺失与徽章对比度低',
        description: '修复更新日志页面没有显示发布日期，以及"更新"徽章在浅色背景下看不清的问题。',
        details: [
          '在"最新更新"标题旁显示发布日期',
          '"更新"徽章改为更醒目的样式，在任何主题下都能看清',
          '日期标签样式重新设计，更美观',
        ],
      },
      en: {
        title: 'Changelog Latest Block Date & Badge Contrast',
        description:
          'Fixed missing release date in changelog and low contrast Update badge.',
        details: [
          'Release date now shown next to the heading',
          'Update badge redesigned for better visibility in all themes',
          'Date label styling refreshed for better appearance',
        ],
      },
      ja: {
        title: '更新履歴の最新セクションでの日付表示とバッジ視認性',
        description:
          '更新履歴ページに日付が表示されず、アップデートバッジが見づらい問題を修正しました。',
        details: [
          '見出し横に公開日を表示するようになりました',
          '「更新」バッジをより見やすいデザインに変更し、すべてのテーマで読みやすくなりました',
          '日付ラベルのスタイルを再設計し、より美しくなりました',
        ],
      },
    },
  },
  {
    date: '2025-12-03',
    version: '1.5.10',
    issue: 20,
    translations: {
      zh: {
        title: '通知和用户资料页面文本多语言支持',
        description: '修复通知消息、用户资料页面和帖子卡片中文本未支持多语言的问题。',
        details: [
          '通知列表里的文字会随着语言切换而改变',
          '个人资料页和帖子卡片的固定文案都补全了翻译',
        ],
      },
      en: {
        title: 'Notification & User Profile Text Multilingual Support',
        description: 'Fixed issue where notification messages, user profile pages, and post card texts were not multilingual.',
        details: [
          'Notification items now translate together with the rest of the site',
          'Profile pages and post cards have complete language coverage',
        ],
      },
      ja: {
        title: '通知とユーザープロフィールテキストの多言語サポート',
        description: '通知メッセージ、ユーザープロフィールページ、投稿カードのテキストが多言語に対応していなかった問題を修正しました。',
        details: [
          '通知一覧の文言が選択中の言語に合わせて切り替わるようになりました',
          'プロフィールや投稿カードの固定テキストもすべて翻訳を追加しました',
        ],
      },
    },
  },
  {
    date: '2025-12-03',
    version: '1.5.8',
    issue: 19,
    translations: {
      zh: {
        title: '错误提示信息多语言支持',
        description: '修复错误提示信息未支持多语言的问题。',
        details: [
          '所有错误提示都能按语言显示，不再只出现中文',
          '板块分类名称也会自动翻译，界面更加统一',
        ],
      },
      en: {
        title: 'Error Message Multilingual Support',
        description: 'Fixed issue where error messages were not multilingual.',
        details: [
          'Error messages now appear in the language you select',
          'Category names match the current language across the site',
        ],
      },
      ja: {
        title: 'エラーメッセージの多言語サポート',
        description: 'エラーメッセージが多言語に対応していなかった問題を修正しました。',
        details: [
          'エラーメッセージが選択中の言語で表示されるようになりました',
          'カテゴリ名もすべてのページで同じ言語に揃いました',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.7',
    issue: [17, 18],
    translations: {
      zh: {
        title: '语言切换菜单与移动端通知显示问题',
        description: '修复桌面端语言切换菜单难以点击，以及移动端通知列表显示不全的问题。',
        details: [
          '语言切换菜单改为点击开关',
          '优化移动端通知列表布局',
        ],
      },
      en: {
        title: 'Language Menu Clickability & Mobile Notification Visibility',
        description: 'Fixed issues where the language switcher menu was hard to click on desktop and notification lists were partially hidden on mobile devices.',
        details: [
          'Language switcher menu uses click toggle',
          'Optimized mobile notification list layout',
        ],
      },
      ja: {
        title: '言語メニューのクリック性とモバイル通知の表示改善',
        description: 'デスクトップで言語切替メニューがクリックしづらい問題と、モバイル端末で通知リストが完全に表示されない問題を修正しました。',
        details: [
          '言語切替メニューをクリック切り替えに変更',
          'モバイル通知リストのレイアウトを最適化',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.5',
    issue: 16,
    translations: {
      zh: {
        title: '标签系统物理效果和交互性增强',
        description: '集成Matter.js物理引擎，实现标签的真实物理效果和拖拽交互功能。',
        details: [
          '标签会像真物一样漂浮、堆叠，互动更有趣',
          '支持鼠标或触屏拖拽，松开后会自然弹回',
          '外观改成简洁文字，保留更多空间展示内容',
          '在手机端也能流畅显示，不会遮挡其他模块',
        ],
      },
      en: {
        title: 'Tag System Physics Effects and Interactivity Enhancement',
        description: 'Integrated Matter.js physics engine to implement real physics effects and drag interaction for tags.',
        details: [
          'Tags now float and stack with playful physics, making the area feel alive',
          'You can drag tags with mouse or touch and watch them bounce back',
          'Visuals switch to clean text badges so more tags fit in view',
          'Mobile layout stays smooth and doesn’t cover other content',
        ],
      },
      ja: {
        title: 'タグシステムの物理効果とインタラクティブ性の強化',
        description: 'Matter.js物理エンジンを統合し、タグのリアルな物理効果とドラッグインタラクション機能を実装しました。',
        details: [
          'タグがふわふわ動いて積み重なるようになり、眺めていて楽しくなりました',
          'マウスやタッチでタグをドラッグでき、放すと自然に戻ります',
          '色ブロックをなくし、テキスト中心のスッキリした見た目に変更',
          'モバイルでも他の内容を邪魔せず、滑らかに表示されます',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.4',
    issue: 15,
    translations: {
      zh: {
        title: 'Header左右边距不对称问题',
        description: '修复Header中左侧Logo与左侧边缘的距离和右侧按钮组合与右侧边缘的距离不一致的历史遗留问题。',
        details: [
          '重新校准左右两侧的间距，让 Logo 与按钮距离边缘一样宽',
          '清理多余留白，顶栏在所有尺寸下都保持对称',
        ],
      },
      en: {
        title: 'Header Left-Right Margin Asymmetry',
        description: 'Fixed historical issue where the distance from left logo to left edge and right button group to right edge were inconsistent.',
        details: [
          'Rebalanced the spacing so the logo and buttons sit the same distance from each edge',
          'Cleaned up stray padding so the header stays symmetric on every screen size',
        ],
      },
      ja: {
        title: 'ヘッダーの左右マージンの非対称性',
        description: '左側のロゴと左端の距離、右側のボタングループと右端の距離が一致しない歴史的な問題を修正しました。',
        details: [
          '左右の余白を揃え、ロゴとボタンが同じ距離で並ぶように調整',
          '不要な余白を削除し、どの画面サイズでも対称に表示されるようにしました',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.3',
    issue: 14,
    translations: {
      zh: {
        title: '响应式设备上Header按钮排版错乱',
        description: '修复语言切换按钮移到右上角后，在响应式设备上出现的按钮排版错乱问题。',
        details: [
          '在不同屏幕宽度下重新安排按钮顺序和换行，避免堆叠',
          '缩放按钮与图标，让小屏也能看清并方便点击',
          '语言菜单和搜索框在手机上不会再跑出屏幕',
        ],
      },
      en: {
        title: 'Header Button Layout Issues on Responsive Devices',
        description: 'Fixed button layout issues on responsive devices after moving language switcher to top-right corner.',
        details: [
          'Buttons reorder gracefully across desktop, tablet, and phone widths',
          'Sizes and spacing were tuned so icons stay readable on small screens',
          'Language menu and search bar stay within the viewport on mobile',
        ],
      },
      ja: {
        title: 'レスポンシブデバイスでのヘッダーボタンのレイアウト問題',
        description: '言語切替ボタンを右上に移動した後、レスポンシブデバイスで発生したボタンのレイアウト問題を修正しました。',
        details: [
          '画面サイズごとにボタンの並びと折り返しを調整し、重ならないようにしました',
          '小さな画面でも文字とアイコンが読みやすい大きさに統一',
          '言語メニューや検索バーがスマホ画面からはみ出さないように調整',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.2',
    issue: 13,
    translations: {
      zh: {
        title: '路由切换时标签位置重置',
        description: '修复切换页面（如更新日志、问题修复等）时，右侧标签浮动位置和动画参数被重置的问题。',
        details: [
          '切换页面后标签不再瞬间换位置，浮动效果保持连贯',
          '只有在标签内容真的更新时才会重新排列，视觉更稳定',
        ],
      },
      en: {
        title: 'Tag Position Reset on Route Change',
        description: 'Fixed issue where tag positions and animation parameters were reset when navigating between pages (e.g., changelog, fixes).',
        details: [
          'Switching between pages no longer causes the floating tags to jump around',
          'Tags only reshuffle when their data truly changes, keeping the motion smooth',
        ],
      },
      ja: {
        title: 'ルート切替時のタグ位置リセット',
        description: 'ページを切り替える際（更新履歴、問題修正など）に、右側のタグの浮遊位置とアニメーションパラメータがリセットされる問題を修正しました。',
        details: [
          'ページを移動してもタグの配置がリセットされず、動きが途切れなくなりました',
          'タグ内容が変わったときだけ並び替わるので、見た目が安定しています',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.1',
    issue: 12,
    translations: {
      zh: {
        title: '移动端通知下拉菜单显示不全',
        description: '修复移动设备上通知下拉菜单被截断或显示不完整的问题。',
        details: [
          '通知列表会根据屏幕自动调节高度，不会被截断',
          '在手机上阅读通知时字体和间距更加合适',
          '列表始终完整显示，不再被底部区域遮住',
        ],
      },
      en: {
        title: 'Mobile Notification Dropdown Truncation',
        description: 'Fixed notification dropdown being cut off or incompletely displayed on mobile devices.',
        details: [
          'Notification drawer now fits the screen and stays fully visible',
          'Text sizes and spacing were tuned for easy reading on phones',
          'Long lists scroll naturally without being hidden behind the bottom bar',
        ],
      },
      ja: {
        title: 'モバイル通知ドロップダウンの表示不全',
        description: 'モバイルデバイスで通知ドロップダウンが切り詰められたり不完全に表示される問題を修正しました。',
        details: [
          '通知ドロップダウンが画面サイズに合わせて表示され、途中で切れなくなりました',
          'スマホでも読みやすい文字サイズと余白に調整',
          '長いリストでも下部に隠れず最後までスクロールできます',
        ],
      },
    },
  },
  {
    date: '2025-12-01',
    version: '1.3.2',
    issue: 3,
    translations: {
      zh: {
        title: '移动端响应式布局问题',
        description: '修复移动端和小屏幕设备上的布局显示问题，优化标题、间距和元素排列。',
        details: [
          '帖子详情页标题在小屏幕上过大，已调整为响应式字体大小',
          '首页和帖子卡片的间距在移动端优化，避免内容拥挤',
          '错误状态提示在窄屏上显示更合理，文字大小和间距适配',
          '按钮和操作元素在移动端支持换行，避免横向溢出',
          '优化统计信息和操作按钮在小屏幕上的排列方式',
        ],
      },
      en: {
        title: 'Mobile Responsive Layout Issues',
        description: 'Fixed layout display issues on mobile and small-screen devices, optimized titles, spacing, and element arrangement.',
        details: [
          'Post detail page titles were too large on small screens, now responsive font sizes',
          'Home page and post card spacing optimized on mobile to prevent crowding',
          'Error state messages display more reasonably on narrow screens with adapted text sizes',
          'Buttons and action elements support wrapping on mobile to prevent horizontal overflow',
          'Optimized arrangement of stats and action buttons on small screens',
        ],
      },
      ja: {
        title: 'モバイルレスポンシブレイアウトの問題',
        description: 'モバイルと小画面デバイスでのレイアウト表示の問題を修正し、タイトル、余白、要素の配置を最適化しました。',
        details: [
          '投稿詳細ページのタイトルが小画面で大きすぎたため、レスポンシブフォントサイズに調整',
          'ホームページと投稿カードの余白をモバイルで最適化し、内容の詰まりを防止',
          'エラー状態メッセージを狭い画面で適切に表示し、文字サイズと余白を調整',
          'ボタンと操作要素をモバイルで折り返し対応し、横方向のオーバーフローを防止',
          '小画面での統計情報と操作ボタンの配置を最適化',
        ],
      },
    },
  },
  {
    date: '2025-12-01',
    version: '1.3.1',
    issue: 2,
    translations: {
      zh: {
        title: '频繁请求导致数据加载失败',
        description: '修复用户快速操作（切换排序、搜索、切换分类等）时，数据加载不出来的问题。',
        details: [
          '提高系统可处理的请求数量，减少请求限制',
          '优化快速操作时的请求处理，避免重复请求',
          '延长请求等待时间，提高成功率',
          '改进错误提示，更清楚地告知用户问题原因',
        ],
      },
      en: {
        title: 'Rapid Requests Causing Data Loading Failures',
        description: 'Fixed an issue where rapid user actions (sorting, searching, category switching) caused data loading failures.',
        details: [
          'Increased system request capacity to reduce limitations',
          'Optimized request handling for rapid operations to avoid duplicate requests',
          'Extended request timeout for better success rate',
          'Improved error messages for clearer user feedback',
        ],
      },
      ja: {
        title: '頻繁なリクエストによるデータ読み込み失敗',
        description: 'ユーザーが素早く操作（並び替え、検索、カテゴリー切替など）した際、データが読み込めなくなる問題を修正しました。',
        details: [
          'システムが処理できるリクエスト数を増やし、制限を緩和',
          '素早い操作時のリクエスト処理を最適化し、重複リクエストを防止',
          'リクエストの待機時間を延長し、成功率を向上',
          'エラーメッセージを改善し、ユーザーに問題の原因をより明確に伝達',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.4.0',
    issue: 4,
    translations: {
      zh: {
        title: '问题修复列表排版统一',
        description: '针对不同屏幕宽度统一卡片间距与内容对齐。',
        details: [
          '列表改用响应式网格，桌面与移动端保持整齐排列',
          '梳理标题、描述、要点之间的行高与留白',
        ],
      },
      en: {
        title: 'Fixes Page Layout Alignment',
        description: 'Standardized spacing and alignment across all screen sizes.',
        details: [
          'Cards display neatly on desktop and mobile',
          'Improved spacing and typography for headings and content',
        ],
      },
      ja: {
        title: '修正一覧のレイアウト統一',
        description: '画面幅ごとのカード間隔と整列を統一しました。',
        details: [
          'レスポンシブグリッドでデスクトップとモバイルの整列を維持',
          '見出し・本文・箇条書きの行間と余白を調整',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.4.0',
    issue: 5,
    translations: {
      zh: {
        title: '夜间模式下修复页和下拉菜单不可见',
        description: '提升夜间主题下卡片及发帖页下拉框的对比度。',
        details: [
          '修复卡片、标签等采用主题变量，暗色下仍清晰',
          '发帖页板块下拉继承正确的文字颜色',
        ],
      },
      en: {
        title: 'Dark Mode Contrast',
        description: 'Improved readability for Fixes cards and post dropdowns.',
        details: [
          'Cards and helper texts use theme-aware tokens',
          'Category dropdown inherits the dark-appropriate color',
        ],
      },
      ja: {
        title: 'ダークモードのコントラスト改善',
        description: '修正カードと投稿ページのドロップダウンを読みやすくしました。',
        details: [
          'カードや補助テキストがテーマカラーを継承',
          'カテゴリー選択の文字色を暗色テーマ用に統一',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.4.0',
    issue: 6,
    translations: {
      zh: {
        title: '夜间模式表单文字发灰',
        description: '发帖页输入框和提示文字在夜间模式下更清晰。',
        details: [
          '标题、内容、标签输入统一使用夜间主色/次色',
          '下拉选择器前景色同步更新，避免暗底暗字',
        ],
      },
      en: {
        title: 'Dark Theme Form Contrast',
        description: 'Ensured inputs remain legible in dark mode.',
        details: [
          'Primary/secondary text colors applied to all inputs',
          'Select components adopt the same contrast rules',
        ],
      },
      ja: {
        title: 'ダークテーマのフォーム視認性',
        description: '夜間モードでも入力内容とプレースホルダーが判読できます。',
        details: [
          'タイトル/本文/タグ入力の色をダークテーマ基準に変更',
          'セレクトの前景色も統一し暗背景で読みやすく調整',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.4.0',
    issue: 7,
    translations: {
      zh: {
        title: '导航按钮在小屏挤成竖排',
        description: '修复移动端顶部按钮拥挤与换行异常。',
        details: [
          '夜间模式和发布按钮增加外边距控制，防止竖排',
          '中小屏允许按钮换行并居中，极窄屏仅显示图标',
        ],
      },
      en: {
        title: 'Navigation Button Overflow',
        description: 'Prevented header buttons from stacking awkwardly on phones.',
        details: [
          'Added whitespace rules so labels stay horizontal',
          'Buttons wrap and center gracefully; tiny screens show icons only',
        ],
      },
      ja: {
        title: 'ナビゲーションボタンの詰まりを解消',
        description: 'モバイルでボタンが縦並びになる問題を修正しました。',
        details: [
          '夜間モードと投稿ボタンに余白を追加し縦並びを防止',
          '中小画面では自動折り返し＆中央揃え、極小画面はアイコンのみ表示',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.4.0',
    issue: 8,
    translations: {
      zh: {
        title: '移动端资料页排版错乱',
        description: '资料页在窄屏设备上重新布局。',
        details: [
          '头像与统计信息支持换行并自动居中',
          '删除按钮位置调整，避免遮挡帖子',
        ],
      },
      en: {
        title: 'Profile Layout on Mobile',
        description: 'Reflowed the profile header and stats for narrow screens.',
        details: [
          'Avatar blocks and stats wrap into stacked rows',
          'Delete action moved to a safe, unobtrusive spot',
        ],
      },
      ja: {
        title: 'プロフィールのモバイルレイアウト',
        description: '狭い画面でプロフィール情報が崩れる問題を修正。',
        details: [
          'アバターと統計情報が折り返し中央揃えで表示されるように調整',
          '削除ボタンの位置を変更して投稿内容を遮らないように改善',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.4.0',
    issue: 9,
    translations: {
      zh: {
        title: '搜索结果无法匹配关键词',
        description: '补齐搜索统计缺失的用户表关联。',
        details: [
          '统一列表查询与统计的 JOIN/WHERE 语句',
          '仍支持标题、内容、作者用户名的模糊匹配',
        ],
      },
      en: {
        title: 'Search Counter Join Fix',
        description: 'Search results no longer return empty when users exist.',
        details: [
          'Listing and count queries now share the same JOIN',
          'Title/body/author fuzzy filters stay intact',
        ],
      },
      ja: {
        title: '検索結果が常にゼロになる不具合',
        description: '統計クエリにユーザーテーブルを再結合しました。',
        details: [
          '一覧と件数取得で同じ JOIN/WHERE を使用',
          'タイトル・本文・ユーザー名のあいまい検索を維持',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.4.0',
    issue: 10,
    translations: {
      zh: {
        title: '图片跨域策略导致无法显示',
        description: '修复安全策略过严造成的图片加载失败。',
        details: [
          '调整后端安全头，允许跨源资源加载',
          'Nginx 转发路径统一使用带尾斜杠的 proxy_pass',
        ],
      },
      en: {
        title: 'Cross-Origin Images',
        description: 'Relaxed headers so uploaded images load reliably.',
        details: [
          'Set crossOriginResourcePolicy to cross-origin and disabled COEP',
          'Normalized Nginx proxy_pass endings for / and /uploads/',
        ],
      },
      ja: {
        title: '画像のクロスオリジン制限',
        description: 'セキュリティヘッダーの調整で画像が表示されるようになりました。',
        details: [
          'crossOriginResourcePolicy を cross-origin に設定し COEP を無効化',
          'Nginx の proxy_pass を末尾スラッシュ付きに統一',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.4.0',
    issue: 11,
    translations: {
      zh: {
        title: '图片地址拼接成 https://uploads/',
        description: '修复生产环境下图片 URL 拼接错误。',
        details: [
          '统一使用后端域名 origin 来拼接图片路径',
          '区分开发代理与生产 API 基址',
        ],
      },
      en: {
        title: 'Broken Image URLs',
        description: 'Fixed production links that started with https://uploads/.',
        details: [
          'Always join image paths with the backend origin',
          'Separated dev proxy logic from production base URLs',
        ],
      },
      ja: {
        title: '画像URLが https://uploads/ になる',
        description: '本番環境での URL 組み立て不具合を修正しました。',
        details: [
          'バックエンドのオリジンを用いて画像パスを結合',
          '開発用プロキシと本番APIベースURLを切り分け',
        ],
      },
    },
  },
  {
    date: '2025-12-01',
    version: '1.3.0',
    issue: 1,
    translations: {
      zh: {
        title: '删除帖子后标签仍显示',
        description: '删除帖子会主动刷新标签列表，过滤无帖子标签。',
        details: [
          '删除帖子后分发 postDeleted 事件',
          '右侧栏监听事件并重新拉取标签数据',
        ],
      },
      en: {
        title: 'Stale Tags After Deletion',
        description: 'Tags refresh instantly once a post is removed.',
        details: [
          'Profile deletion emits a postDeleted event',
          'Right sidebar refetches tags and drops zero-count ones',
        ],
      },
      ja: {
        title: '投稿削除後もタグが残る問題',
        description: '投稿を削除するとタグ一覧が自動更新されるようになりました。',
        details: [
          'プロフィールで削除すると postDeleted イベントを発火',
          '右サイドバーが再取得し、0件になったタグを除外',
        ],
      },
    },
  },
]

export function FixesPage() {
  const { language } = useLanguage()

  const locale = useMemo(() => {
    if (language === 'zh') return zhCN
    if (language === 'ja') return ja
    return enUS
  }, [language])

  const latestFix = fixes[0]

  const latestDateLabel = useMemo(() => {
    if (!latestFix?.date) return ''
    try {
      return format(new Date(latestFix.date), 'PPP', { locale })
    } catch {
      return latestFix.date
    }
  }, [latestFix, locale])

  const copy = {
    zh: {
      title: '问题修复',
      subtitle: '这里记录了每一次对 REForum 的问题修复与质量提升。',
      latestHeading: '最新修复',
    },
    en: {
      title: 'Fixes',
      subtitle: 'Every bug fix and quality improvement to REForum is tracked here.',
      latestHeading: 'Latest fixes',
    },
    ja: {
      title: '問題修正',
      subtitle: 'REForum に対する不具合修正や品質改善の履歴をまとめています。',
      latestHeading: '最新の修正',
    },
  }[language] || copy.en

  return (
    <div className="fixes-page">
      <h1 className="fixes-title">{copy.title}</h1>
      <p className="fixes-subtitle">{copy.subtitle}</p>

      <section className="fixes-latest">
        <div className="fixes-latest-header">
          <h2 className="fixes-latest-title">{copy.latestHeading}</h2>
          {latestDateLabel && <span className="fixes-latest-date">{latestDateLabel}</span>}
        </div>
        {/* 其余内容沿用原有结构，这里假设已有使用 fixes 数据渲染的逻辑 */}
      </section>
    </div>
  )
}

const pageCopy = {
  zh: {
    title: '问题修复',
    subtitle: '这里记录近期的缺陷修复，便于快速了解背景与处理方式。',
  },
  en: {
    title: 'Fixes',
    subtitle: 'Recent bug fixes with short context and remediation notes.',
  },
  ja: {
    title: '問題修正',
    subtitle: '直近の修正内容と背景を簡潔にまとめています。',
  },
}

const formatLocale = {
  zh: zhCN,
  en: enUS,
  ja,
}

const formatPattern = {
  zh: 'yyyy年MM月dd日',
  en: 'MMM dd, yyyy',
  ja: 'yyyy年MM月dd日',
}

const monthFormatPattern = {
  zh: 'yyyy年MM月',
  en: 'MMMM yyyy',
  ja: 'yyyy年MM月',
}

const Fixes = () => {
  const { language } = useLanguage()
  const copy = pageCopy[language] || pageCopy.zh
  const [expandedMonths, setExpandedMonths] = useState(new Set())
  const [expandedVersions, setExpandedVersions] = useState(new Set())
  const [expandedDates, setExpandedDates] = useState(new Set())

  const locale = formatLocale[language] || zhCN
  const datePattern = formatPattern[language] || formatPattern.zh
  const monthPattern = monthFormatPattern[language] || monthFormatPattern.zh

  const localizedFixes = fixes.map((item) => {
    const translation = item.translations[language] || item.translations.zh
    return {
      date: item.date,
      version: item.version,
      issue: item.issue,
      ...translation,
    }
  })

  // 按月份、版本和日期分组
  const groupedByMonth = useMemo(() => {
    const grouped = {}

    localizedFixes.forEach((fix) => {
      const date = new Date(fix.date)
      const monthKey = format(date, 'yyyy-MM', { locale })
      const monthLabel = format(date, monthPattern, { locale })

      // 版本号保持完整（如 1.5.10）
      const versionKey = fix.version || 'unknown'
      const dateKey = fix.date

      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          monthKey,
          monthLabel,
          versions: {},
        }
      }

      if (!grouped[monthKey].versions[versionKey]) {
        grouped[monthKey].versions[versionKey] = {
          version: versionKey,
          dates: {},
        }
      }

      if (!grouped[monthKey].versions[versionKey].dates[dateKey]) {
        grouped[monthKey].versions[versionKey].dates[dateKey] = {
          date: dateKey,
          items: [],
        }
      }

      grouped[monthKey].versions[versionKey].dates[dateKey].items.push(fix)
    })

    // 在每个版本内按日期排序（最新的在前）
    Object.keys(grouped).forEach((monthKey) => {
      Object.keys(grouped[monthKey].versions).forEach((versionKey) => {
        const version = grouped[monthKey].versions[versionKey]
        version.dateList = Object.values(version.dates).sort((a, b) => {
          return new Date(b.date) - new Date(a.date)
        })
      })

      // 将版本对象转换为数组并按版本号排序（最新的在前）
      grouped[monthKey].versionList = Object.values(grouped[monthKey].versions).sort((a, b) => {
        const aParts = a.version.split('.').map(Number)
        const bParts = b.version.split('.').map(Number)
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const aPart = aParts[i] || 0
          const bPart = bParts[i] || 0
          if (bPart !== aPart) {
            return bPart - aPart
          }
        }
        return 0
      })
    })

    // 返回排序后的月份数组
    return Object.values(grouped).sort((a, b) => {
      return b.monthKey.localeCompare(a.monthKey)
    })
  }, [localizedFixes, monthPattern, locale])

  // 默认手风琴关闭状态，不自动展开

  const toggleMonth = (monthKey) => {
    setExpandedMonths((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(monthKey)) {
        newSet.delete(monthKey)
      } else {
        newSet.add(monthKey)
      }
      return newSet
    })
  }

  const toggleVersion = (monthKey, version) => {
    const versionKey = `${monthKey}-${version}`
    setExpandedVersions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(versionKey)) {
        newSet.delete(versionKey)
      } else {
        newSet.add(versionKey)
      }
      return newSet
    })
  }

  const toggleDate = (monthKey, version, date) => {
    const dateKey = `${monthKey}-${version}-${date}`
    setExpandedDates((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(dateKey)) {
        newSet.delete(dateKey)
      } else {
        newSet.add(dateKey)
      }
      return newSet
    })
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), datePattern, { locale })
    } catch {
      return dateString
    }
  }

  const monthLabels = {
    zh: { items: '项' },
    en: { items: 'items' },
    ja: { items: '件' },
  }
  const monthLabel = monthLabels[language] || monthLabels.zh

  // 获取最新的修复项（只取第一个）
  const latestFix = useMemo(() => {
    if (groupedByMonth.length === 0) return null
    const firstMonth = groupedByMonth[0]
    if (!firstMonth.versionList || firstMonth.versionList.length === 0) return null
    const firstVersion = firstMonth.versionList[0]
    if (!firstVersion.dateList || firstVersion.dateList.length === 0) return null
    const firstDate = firstVersion.dateList[0]
    if (!firstDate.items || firstDate.items.length === 0) return null
    return firstDate.items[0] || null
  }, [groupedByMonth])

  // 顶部“最新修复”区域右侧的日期徽章，使用最新修复的日期
  const latestHeaderDateLabel = useMemo(() => {
    if (!latestFix?.date) return ''
    try {
      return format(new Date(latestFix.date), datePattern, { locale })
    } catch {
      return latestFix.date
    }
  }, [latestFix, datePattern, locale])

  const latestLabels = {
    zh: { title: '最新修复' },
    en: { title: 'Latest Fixes' },
    ja: { title: '最新の修正' },
  }
  const latestLabel = latestLabels[language] || latestLabels.zh

  return (
    <div className="fixes-page">
      <h1 className="fixes-title">{copy.title}</h1>
      <p className="fixes-subtitle">{copy.subtitle}</p>

      {latestFix && (
        <div className="fixes-latest">
          <div className="fixes-latest-header">
            <h2 className="fixes-latest-title">{latestLabel.title}</h2>
            {latestHeaderDateLabel && (
              <span className="fixes-latest-date">{latestHeaderDateLabel}</span>
            )}
          </div>
          <div className="fixes-latest-items">
            <article className="fix-card">
              <div className="fix-header">
                <div className="fix-meta">
                  {latestFix.version && (
                    <span className="fix-version">
                      v{latestFix.version}
                    </span>
                  )}
                  {latestFix.issue && (
                    <span className="fix-issue">
                      Issue {Array.isArray(latestFix.issue) ? latestFix.issue.map(i => `#${i}`).join(', ') : `#${latestFix.issue}`}
                    </span>
                  )}
                </div>
                <h2 className="fix-name">{latestFix.title}</h2>
              </div>
              <p className="fix-desc">{latestFix.description}</p>
              {latestFix.details?.length > 0 && (
                <ul className="fix-details">
                  {latestFix.details.map((detail, detailIndex) => (
                    <li key={detailIndex}>{detail}</li>
                  ))}
                </ul>
              )}
            </article>
          </div>
        </div>
      )}

      <div className="fixes-months">
        {groupedByMonth.map((monthGroup) => {
          const isExpanded = expandedMonths.has(monthGroup.monthKey)
          return (
            <div key={monthGroup.monthKey} className="fixes-month-group">
              <button
                type="button"
                className="fixes-month-header"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleMonth(monthGroup.monthKey)
                }}
              >
                <span className="fixes-month-title">{monthGroup.monthLabel}</span>
                <span className="fixes-month-count">
                  ({monthGroup.versionList ? monthGroup.versionList.reduce((sum, v) => sum + (v.dateList ? v.dateList.reduce((dSum, d) => dSum + d.items.length, 0) : 0), 0) : 0} {monthLabel.items})
                </span>
                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {isExpanded && (
                <div className="fixes-list">
                  {monthGroup.versionList.map((versionGroup) => {
                    const versionKey = `${monthGroup.monthKey}-${versionGroup.version}`
                    const isVersionExpanded = expandedVersions.has(versionKey)
                    return (
                      <div key={`${monthGroup.monthKey}-${versionGroup.version}`} className="fixes-version-group">
                        <button
                          type="button"
                          className="fixes-version-header"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleVersion(monthGroup.monthKey, versionGroup.version)
                          }}
                        >
                          <span className="fixes-version-title">v{versionGroup.version}</span>
                          <span className="fixes-version-count">
                            ({versionGroup.dateList ? versionGroup.dateList.reduce((sum, d) => sum + d.items.length, 0) : 0} {monthLabel.items})
                          </span>
                          {isVersionExpanded ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        {isVersionExpanded && (
                          <div className="fixes-version-items">
                            {versionGroup.dateList?.map((dateGroup) => {
                              const dateKey = `${monthGroup.monthKey}-${versionGroup.version}-${dateGroup.date}`
                              const isDateExpanded = expandedDates.has(dateKey)
                              return (
                                <div key={dateKey} className="fixes-date-group">
                                  <button
                                    type="button"
                                    className="fixes-date-header"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      toggleDate(monthGroup.monthKey, versionGroup.version, dateGroup.date)
                                    }}
                                  >
                                    <span className="fixes-date-title">{formatDate(dateGroup.date)}</span>
                                    <span className="fixes-date-count">
                                      ({dateGroup.items.length} {monthLabel.items})
                                    </span>
                                    {isDateExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                  </button>
                                  {isDateExpanded && (
                                    <div className="fixes-date-items">
                                      {dateGroup.items.map((fix, index) => (
                                        <article className="fix-card" key={`${fix.date}-${fix.title}-${index}`}>
                                          <div className="fix-header">
                                            <div className="fix-meta">
                                              {fix.version && (
                                                <span className="fix-version">
                                                  v{fix.version}
                                                </span>
                                              )}
                                              {fix.issue && (
                                                <span className="fix-issue">
                                                  Issue {Array.isArray(fix.issue) ? fix.issue.map(i => `#${i}`).join(', ') : `#${fix.issue}`}
                                                </span>
                                              )}
                                            </div>
                                            <h2 className="fix-name">{fix.title}</h2>
                                          </div>
                                          <p className="fix-desc">{fix.description}</p>
                                          {fix.details?.length > 0 && (
                                            <ul className="fix-details">
                                              {fix.details.map((detail, detailIndex) => (
                                                <li key={detailIndex}>{detail}</li>
                                              ))}
                                            </ul>
                                          )}
                                        </article>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Fixes


