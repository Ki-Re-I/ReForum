import React, { useState, useMemo } from 'react'
import { format } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'
import enUS from 'date-fns/locale/en-US'
import ja from 'date-fns/locale/ja'
import { useLanguage } from '../context/LanguageContext'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { fixes } from './Fixes'
import './Changelog.css'
import './Fixes.css'

const changelogCopy = {
  zh: {
    title: '更新日志',
    intro: '这里记录了 REForum 每一次迭代。我们会持续改进社区体验，欢迎关注。',
    footer: '感谢使用 REForum！如有建议，欢迎通过“联系我们”页面反馈。',
  },
  en: {
    title: 'Changelog',
    intro:
      'Every notable change in REForum is documented here. Thanks for following our progress.',
    footer: 'Thanks for being here! Reach out via Contact if you spot issues or have ideas.',
  },
  ja: {
    title: '更新履歴',
    intro: 'REForum のアップデート内容をここにまとめています。これからも改善を続けます。',
    footer: 'いつもご利用ありがとうございます。ご意見は「お問い合わせ」からお寄せください。',
  },
}

const updates = [
  {
    date: '2025-12-08',
    version: '1.9.4',
    type: 'fix',
    translations: {
      zh: {
        title: '编辑资料验证和响应式布局修复',
        description:
          '修复编辑资料时请求参数验证失败、响应式设备上布局间距冲突以及测试登录环境变量逻辑问题。',
        details: [
          '修复编辑资料时请求参数验证失败问题：优化后端验证规则，允许空值字段',
          '前端只发送有变化的字段，空值转换为 null，避免发送未修改的数据',
          '修复响应式设备上用户名、称号和编辑按钮间距冲突问题',
          '修复 VITE_ENABLE_TEST_LOGIN 环境变量逻辑，确保只在测试环境中生效',
          '添加调试信息帮助诊断测试登录问题',
        ],
      },
      en: {
        title: 'Edit Profile Validation and Responsive Layout Fix',
        description:
          'Fixed request parameter validation failure when editing profile, layout spacing conflicts on responsive devices, and test login environment variable logic issues.',
        details: [
          'Fixed request parameter validation failure when editing profile: Optimized backend validation rules to allow null value fields',
          'Frontend only sends changed fields, converts empty values to null, avoids sending unmodified data',
          'Fixed spacing conflicts between username, tag and edit button on responsive devices',
          'Fixed VITE_ENABLE_TEST_LOGIN environment variable logic to ensure it only works in test environments',
          'Added debug information to help diagnose test login issues',
        ],
      },
      ja: {
        title: 'プロフィール編集検証とレスポンシブレイアウトの修正',
        description:
          'プロフィール編集時のリクエストパラメータ検証エラー、レスポンシブデバイスでのレイアウト間隔の競合、テストログイン環境変数のロジックの問題を修正しました。',
        details: [
          'プロフィール編集時のリクエストパラメータ検証エラーを修正：バックエンド検証ルールを最適化し、null 値フィールドを許可',
          'フロントエンドは変更されたフィールドのみを送信し、空の値を null に変換して未変更のデータを送信しない',
          'レスポンシブデバイスでのユーザー名、称号、編集ボタン間の間隔の競合を修正',
          'VITE_ENABLE_TEST_LOGIN 環境変数のロジックを修正し、テスト環境でのみ機能することを保証',
          'テストログインの問題を診断するためのデバッグ情報を追加',
        ],
      },
    },
  },
  {
    date: '2025-12-08',
    version: '1.9.3',
    type: 'fix',
    translations: {
      zh: {
        title: 'startsWith 方法调用错误修复',
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
        title: 'startsWith Method Call Error Fix',
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
        title: 'startsWith メソッド呼び出しエラーの修正',
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
    type: 'fix',
    translations: {
      zh: {
        title: '帖子作者等级和经验值显示修复',
        description:
          '修复帖子中作者等级不更新和经验值条显示不正确的问题，确保用户等级和经验值从服务器实时获取并正确显示。',
        details: [
          '修复帖子中作者等级不更新问题：后端Post模型在查询帖子时包含作者的exp和tag字段',
          '添加向后兼容性处理，数据库迁移未执行时自动回退到基本查询',
          '修复经验值条显示不正确问题：修改getUserExp函数优先使用用户对象中的exp',
          '修复PostCard和PostDetail组件，确保正确显示作者等级和经验值',
          '70级用户现在正确显示满级状态（100%进度条）',
        ],
      },
      en: {
        title: 'Post Author Level and Experience Display Fix',
        description:
          'Fixed issues where author level in posts did not update and experience progress bar displayed incorrectly, ensuring user level and experience values are fetched in real-time from server and displayed correctly.',
        details: [
          'Fixed author level not updating in posts: Backend Post model now includes author exp and tag fields when querying posts',
          'Added backward compatibility handling, automatically fallback to basic queries when database migration not executed',
          'Fixed experience progress bar display issue: Modified getUserExp function to prioritize exp from user object',
          'Fixed PostCard and PostDetail components to correctly display author level and experience values',
          'Level 70 users now correctly display max level status (100% progress bar)',
        ],
      },
      ja: {
        title: '投稿作成者レベルと経験値表示の修正',
        description:
          '投稿内の作成者レベルが更新されない問題と経験値プログレスバーの表示が正しくない問題を修正し、ユーザーレベルと経験値がサーバーからリアルタイムで取得され、正しく表示されるようにしました。',
        details: [
          '投稿内の作成者レベルが更新されない問題を修正：バックエンドPostモデルが投稿をクエリする際に作成者のexpとtagフィールドを含める',
          '後方互換性処理を追加し、データベース移行が実行されていない場合に基本クエリに自動的にフォールバック',
          '経験値プログレスバーの表示が正しくない問題を修正：getUserExp関数を修正し、ユーザーオブジェクトのexpを優先的に使用',
          'PostCardとPostDetailコンポーネントを修正し、作成者レベルと経験値を正しく表示',
          '70レベルのユーザーは、満レベル状態（100%プログレスバー）を正しく表示',
        ],
      },
    },
  },
  {
    date: '2025-12-07',
    version: '1.9.0',
    type: 'update',
    translations: {
      zh: {
        title: 'PWA支持、用户资料页面重新设计、等级系统与经验值功能',
        description:
          '完整实现PWA功能，重新设计用户资料页面布局，新增用户等级系统、经验值系统、用户标签功能、每日任务系统和获赞数统计。',
        details: [
          '完整实现PWA（渐进式Web应用）功能，支持安装到主屏幕、离线访问、自动更新',
          '新增PWA安装提示组件，智能提示用户安装，支持多语言，用户可选择安装或稍后提醒',
          '配置Service Worker自动更新和离线缓存策略，提升用户体验',
          '用户资料页面采用左右分栏布局，左侧显示头像、等级和经验进度条，右侧显示用户名、称号、简介和统计数据',
          '新增1-70级等级系统，每10级一个颜色区间，70级显示彩虹渐变动画',
          '实现经验值系统，用户通过每日任务获得经验值，经验进度条实时显示升级进度',
          '新增用户标签/称号功能，用户可以自定义标签，支持特殊"官方"标签样式',
          '经验进度条在桌面端从左侧延伸到右侧，显示当前经验进度和到下一级所需经验',
          '新增每日任务系统（发布帖子、点赞、评论），每个任务完成获得5经验值',
          '统计数据通过手风琴组件展示，默认收起，点击展开查看',
          '新增获赞数统计，统计用户所有帖子收到的点赞总数',
          '完善头像上传和用户简介编辑功能',
          '后端API新增经验值和获赞数字段，创建数据库迁移脚本',
        ],
      },
      en: {
        title: 'PWA Support, User Profile Redesign, Level System & Experience Points',
        description:
          'Full PWA implementation, redesigned user profile layout, added level system, experience points, user tags, daily tasks, and received likes statistics.',
        details: [
          'Full PWA (Progressive Web App) implementation with install to home screen, offline access, and auto-update support',
          'Added PWA install prompt component with smart prompting, multi-language support, user can choose to install or dismiss',
          'Configured Service Worker auto-update and offline caching strategies for better user experience',
          'User profile page uses left-right column layout: avatar, level, and exp progress on left; username, tag, bio, and stats on right',
          'Added 1-70 level system with color ranges every 10 levels, level 70 displays rainbow gradient animation',
          'Implemented experience point system: users gain exp through daily tasks, progress bar shows upgrade progress',
          'Added user tag/title feature: users can customize tags with special "official" tag styling',
          'Experience progress bar extends from left to right on desktop, showing current progress and exp needed for next level',
          'Added daily task system (post, like, comment), each task completion grants 5 exp',
          'Statistics displayed in accordion component, collapsed by default, click to expand',
          'Added received likes statistics, counting total likes received on all user posts',
          'Enhanced avatar upload and bio editing functionality',
          'Backend API added exp and receivedLikes fields, created database migration script',
        ],
      },
      ja: {
        title: 'PWAサポート・ユーザープロフィールページの再設計・レベルシステム・経験値機能',
        description:
          'PWA機能を完全実装し、ユーザープロフィールページのレイアウトを再設計し、レベルシステム、経験値システム、ユーザータグ機能、デイリータスクシステム、受信いいね統計を追加しました。',
        details: [
          'PWA（プログレッシブWebアプリ）機能を完全実装、ホーム画面へのインストール、オフラインアクセス、自動更新をサポート',
          'PWAインストールプロンプトコンポーネントを追加、スマートなプロンプト、多言語対応、ユーザーはインストールまたは後でを選択可能',
          'Service Workerの自動更新とオフラインキャッシュ戦略を設定し、ユーザー体験を向上',
          'ユーザープロフィールページは左右カラムレイアウト：左側にアバター、レベル、経験値プログレスバー、右側にユーザー名、タグ、自己紹介、統計データ',
          '1-70レベルのレベルシステムを追加、10レベルごとに色の範囲があり、70レベルは虹グラデーションアニメーションを表示',
          '経験値システムを実装：ユーザーはデイリータスクで経験値を獲得、プログレスバーがアップグレード進捗を表示',
          'ユーザータグ/称号機能を追加：ユーザーはタグをカスタマイズでき、特別な「公式」タグスタイルをサポート',
          '経験値プログレスバーはデスクトップで左から右に延び、現在の進捗と次のレベルに必要な経験値を表示',
          'デイリータスクシステム（投稿、いいね、コメント）を追加、各タスク完了で5経験値を獲得',
          '統計データはアコーディオンコンポーネントで表示、デフォルトで折りたたみ、クリックで展開',
          '受信いいね統計を追加、ユーザーのすべての投稿で受け取ったいいねの合計をカウント',
          'アバターアップロードと自己紹介編集機能を強化',
          'バックエンドAPIに経験値と受信いいねフィールドを追加、データベース移行スクリプトを作成',
        ],
      },
    },
  },
  {
    date: '2025-12-05',
    version: '1.8.0',
    type: 'update',
    translations: {
      zh: {
        title: '登录注册弹窗优化、合规提示完善、侧边栏动画优化与站外邮箱通知功能',
        description:
          '优化登录和注册弹窗显示效果，完善用户协议和隐私政策查看方式，改进年龄提示和 Cookie 提示功能，优化侧边栏动画，新增邮件通知功能。',
        details: [
          '登录和注册弹窗现在固定在屏幕中央，不会跟随页面滚动，在任何设备上都能完整显示',
          '用户协议和隐私政策可以在弹窗中直接查看完整内容，不再闪烁，支持多语言',
          'Cookie 提示中的隐私政策链接现在在弹窗中打开，无需跳转页面',
          '年龄提示新增"我没满 18 岁"选项，内容更详细，手机上可以展开或收起查看',
          '年龄提示和 Cookie 提示每个账户只会显示一次，拒绝时会跳转到外部网站',
          '侧边栏菜单的展开和收起动画更加流畅，不再卡顿',
          '新增邮件通知功能：有新帖子发布时，所有用户都会收到邮件通知，包含帖子标题和查看链接',
        ],
      },
      en: {
        title: 'Login/Register Modal Optimization, Compliance Banner Enhancement, Sidebar Animation Polish & Off-Site Email Notifications',
        description:
          'Improved login and register modal display, enhanced terms and privacy viewing, upgraded age verification and cookie consent features, polished sidebar animations, and added email notification feature.',
        details: [
          'Login and register modals now stay fixed in the center of the screen and no longer scroll with the page, displaying properly on all devices',
          'Terms and privacy can now be viewed in full within modals, no flickering, with multi-language support',
          'Privacy policy link in cookie consent banner now opens in a modal instead of navigating away',
          'Age verification banner adds "I am under 18" option with more detailed content, supports expand/collapse on mobile',
          'Age verification and cookie consent appear only once per account, redirecting to external site when declined',
          'Sidebar menu expand/collapse animations are now smoother without stuttering',
          'Added email notification feature: when a new post is published, all users receive an email with the post title and view link',
        ],
      },
      ja: {
        title: 'ログイン/登録モーダルの最適化・コンプライアンスバナーの改善・サイドバーアニメーションの最適化・外部メール通知機能',
        description:
          'ログインと登録モーダルの表示を改善し、利用規約とプライバシーポリシーの閲覧方法を向上させ、年齢確認と Cookie 同意機能を強化し、サイドバーアニメーションを最適化し、メール通知機能を追加しました。',
        details: [
          'ログインと登録モーダルは画面中央に固定され、ページと一緒にスクロールしなくなり、すべてのデバイスで正しく表示されます',
          '利用規約とプライバシーポリシーはモーダル内で完全な内容を閲覧でき、ちらつきがなく、多言語に対応',
          'Cookie 同意バナー内のプライバシーポリシーリンクは新しいページに移動せず、モーダルで表示',
          '年齢確認バナーに「18歳未満です」オプションを追加し、内容を充実させ、モバイルで展開/折りたたみ可能',
          '年齢確認と Cookie 同意は各アカウントで一度だけ表示され、拒否時に外部サイトにリダイレクト',
          'サイドバーメニューの展開/折りたたみアニメーションがよりスムーズになり、カクつきがなくなりました',
          'メール通知機能を追加：新しい投稿が公開されると、すべてのユーザーに投稿タイトルと閲覧リンクを含むメールが送信されます',
        ],
      },
    },
  },
  {
    date: '2025-12-03',
    version: '1.7.1',
    translations: {
      zh: {
        title: '日历按日期筛选与帖子数量徽章修复',
        description:
          '修复日历点击日期无法筛选帖子，以及日期上的帖子数量显示不正确的问题。',
        features: [
          '点击日历中的日期，现在可以正确筛选出当天的帖子',
          '日期右上角的帖子数量现在显示真实数据，不再只显示测试数据',
          '选择日期后使用"热门"排序，会在当天的帖子中按热门度排序',
          '刷新页面或分享链接时，会保持选择的日期和排序方式',
        ],
      },
      en: {
        title: 'Calendar Date Filter & Post Count Badges Fix',
        description:
          'Fixed calendar date filtering and post count badge display issues.',
        features: [
          'Clicking a date in the calendar now correctly filters posts for that day',
          'Post count badges on dates now show real data instead of test data',
          'Using "Hot" sort with a selected date now sorts posts by popularity within that day',
          'Refreshing the page or sharing links preserves the selected date and sort mode',
        ],
      },
      ja: {
        title: 'カレンダーの日付フィルタと投稿数バッジの修正',
        description:
          'カレンダーの日付クリックでフィルタが効かない問題と、投稿数バッジの表示が正しくない問題を修正しました。',
        features: [
          'カレンダーの日付をクリックすると、その日の投稿だけが正しく表示されるようになりました',
          '日付右上の投稿数バッジが実際のデータを表示するようになりました',
          '日付を選択して「人気順」を使うと、その日の投稿だけを人気度でソートします',
          'ページを再読み込みしたりリンクを共有しても、選択した日付とソート方式が保持されます',
        ],
      },
    },
  },
  {
    date: '2025-12-03',
    version: '1.7.0',
    translations: {
      zh: {
        title: '移动端头像菜单在工具集中的展开方向修复',
        description:
          '修复手机上工具集弹窗中头像菜单被底部按钮遮挡的问题。',
        features: [
          '手机上工具集弹窗中的头像菜单现在向上展开，不会被底部按钮遮挡',
          '桌面端右上角的头像菜单保持原有行为不变',
          '现在可以正常查看和点击"个人资料"和"退出登录"等选项',
        ],
      },
      en: {
        title: 'Mobile Avatar Menu Direction Fix Inside Toolset Panel',
        description:
          'Fixed avatar menu being hidden behind bottom buttons in mobile toolset panel.',
        features: [
          'Avatar menu in mobile toolset panel now opens upward instead of downward',
          'Desktop header avatar menu behavior remains unchanged',
          'Profile and logout options are now fully visible and tappable on phones',
        ],
      },
      ja: {
        title: 'モバイル版ツール集内のアバターメニュー展開方向の修正',
        description:
          'スマホのツール集パネルでアバターメニューが下部ボタンに隠れる問題を修正しました。',
        features: [
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
    translations: {
      zh: {
        title: '首屏加载动画与移动端工具集 / 侧边栏大幅升级',
        description:
          '优化加载动画效果，改进移动端工具集和侧边栏的使用体验。',
        features: [
          '加载时间缩短至 1 秒，进度条实时显示百分比',
          '新增 RE / FORUM 标识，与主页风格保持一致',
          '简化加载动画背景，视觉效果更清爽',
          '加载完成后页面内容依次淡入显示',
          '加载动画颜色跟随主题色变化，修复显示问题',
          '手机上将所有操作按钮统一到底部中间的"工具集"按钮，随时可以打开',
          '工具集弹窗从底部滑出，按钮布局统一，更易使用',
          '手机上的主题颜色选择和通知列表改为居中弹窗，不会被屏幕边缘遮挡',
          '侧边栏菜单和分类改为手风琴样式，更简洁美观',
        ],
      },
      en: {
        title: 'Intro Loader Refresh with Mobile Toolset & Sidebar Overhaul',
        description:
          'Improved loading animation and enhanced mobile toolset and sidebar experience.',
        features: [
          'Loading time reduced to 1 second with live percentage display',
          'Added RE / FORUM branding consistent with homepage',
          'Simplified loading background for cleaner visuals',
          'Page content fades in sequentially after loading',
          'Loading animation colors follow theme settings',
          'All mobile actions unified into a bottom-center "toolset" button accessible anytime',
          'Toolset panel slides up from bottom with consistent button layout',
          'Theme color picker and notifications open as centered modals on mobile, no content clipping',
          'Sidebar menu and categories redesigned as accordion style, cleaner and more modern',
        ],
      },
      ja: {
        title: 'イントロローダー刷新とモバイルツール集 / サイドバーの大幅改善',
        description:
          'ローディングアニメーションを改善し、モバイルツール集とサイドバーの使いやすさを向上させました。',
        features: [
          'ローディング時間を 1 秒に短縮し、パーセンテージをリアルタイム表示',
          'ホームページと統一された RE / FORUM ブランディングを追加',
          'ローディング背景を簡素化し、視覚的にすっきり',
          'ローディング完了後、ページ内容が順番にフェードイン',
          'ローディングアニメーションの色がテーマ設定に従うように変更',
          'モバイルのすべての操作を画面下中央の「ツール集」ボタンに集約し、いつでもアクセス可能',
          'ツール集パネルが下からスライドインし、ボタンレイアウトが統一',
          'モバイルのテーマカラー選択と通知を中央モーダル化し、画面端で切れないように改善',
          'サイドバーメニューとカテゴリをアコーディオンスタイルに再設計し、よりシンプルでモダンに',
        ],
      },
    },
  },
  {
    date: '2025-12-03',
    version: '1.6.1',
    translations: {
      zh: {
        title: '顶部搜索与时间展示重构',
        description: '重新设计顶部布局，优化搜索框位置，新增实时时间显示。',
        features: [
          '搜索框移到 Logo 旁边，左侧区域更整齐',
          '顶部中央新增实时时间显示，自动跟随语言设置',
          '日期和时间样式重新设计，与整体风格更协调',
          '所有设备上搜索框、按钮和时间都能正确对齐',
        ],
      },
      en: {
        title: 'Header Search & Time Display Revamp',
        description:
          'Redesigned header layout with optimized search position and added real-time clock display.',
        features: [
          'Search bar moved next to logo for a cleaner left side',
          'Real-time clock added in the center, automatically follows language settings',
          'Date and time styling redesigned to match overall style',
          'Search, buttons, and time properly aligned on all devices',
        ],
      },
      ja: {
        title: 'ヘッダー検索と時間表示の再設計',
        description:
          'ヘッダー構造を再編し、検索ボックスをロゴの横に移動。中央にリアルタイムの日時表示を追加し、レスポンシブのずれを全面的に修正しました。',
        features: [
          '検索ボックスをロゴのすぐ横に移動し、左側がすっきりしました',
          '中央にライブ時計を追加し、使用中の言語で日付と時間を表示',
          '日付と時間のデザインを全体テーマに合わせて刷新',
          'PC からスマホまで、検索・ボタン・時計がきれいに並ぶよう再調整',
        ],
      },
    },
  },
  {
    date: '2025-12-03',
    version: '1.6.0',
    translations: {
      zh: {
        title: '帖子展示优化、日历视图和发布日期显示',
        description: '优化帖子展示模式，添加日历视图功能，支持日期筛选，并在帖子卡片中显示发布日期。',
        features: [
          '最新与热门区块更精简，只展示重点帖子',
          '热门排序改为综合点赞、浏览和评论，榜单更可信',
          '新增日历视图，可在周/月之间切换',
          '点击日历日期即可查看当天所有帖子',
          '帖子卡片会显示完整发布日期',
          '日历与日期展示支持多语言',
          '提供 25 条演示数据方便预览',
        ],
      },
      en: {
        title: 'Post Display Optimization, Calendar View & Publish Date',
        description: 'Optimized post display modes, added calendar view with date filtering, and display publish date on post cards.',
        features: [
          'Latest and Hot sections spotlight just a few key posts',
          'Hot ranking now weighs likes, views, and comments for fairer results',
          'Calendar view arrives with week/month toggle',
          'Tap any date to jump to posts from that day',
          'Each post card now shows its publish date',
          'Calendar texts follow your selected language',
          'Includes 25 sample posts for quick previews',
        ],
      },
      ja: {
        title: '投稿表示の最適化、カレンダービューと公開日の表示',
        description: '投稿表示モードを最適化し、カレンダービュー機能を追加、日付フィルタリングをサポートし、投稿カードに公開日を表示します。',
        features: [
          '最新・人気セクションは厳選した投稿のみ表示',
          '人気ランキングはいいね・閲覧・コメントを総合して算出',
          'カレンダービューを追加し、週/月の切り替えに対応',
          '日付をタップするとその日の投稿一覧へ移動',
          '投稿カードに公開日が表示されるように変更',
          'カレンダー表示は選択中の言語に追従',
          'プレビュー用に 25 件のサンプル投稿を同梱',
        ],
      },
    },
  },
  {
    date: '2025-12-03',
    version: '1.5.10',
    translations: {
      zh: {
        title: '通知和用户资料页面多语言支持',
        description: '为通知消息、用户资料页面和帖子卡片添加完整的多语言支持。',
        features: [
          '通知消息标题支持多语言显示',
          '用户资料页面所有文本支持多语言',
          '帖子卡片统计信息支持多语言',
        ],
      },
      en: {
        title: 'Notification & User Profile Multilingual Support',
        description: 'Added complete multilingual support for notification messages, user profile pages, and post cards.',
        features: [
          'Notification titles support multilingual display',
          'All user profile page text supports multilingual',
          'Post card statistics support multilingual',
        ],
      },
      ja: {
        title: '通知とユーザープロフィールページの多言語サポート',
        description: '通知メッセージ、ユーザープロフィールページ、投稿カードに完全な多言語サポートを追加しました。',
        features: [
          '通知タイトルが多言語表示に対応',
          'ユーザープロフィールページのすべてのテキストが多言語に対応',
          '投稿カードの統計情報が多言語に対応',
        ],
      },
    },
  },
  {
    date: '2025-12-03',
    version: '1.5.9',
    translations: {
      zh: {
        title: '侧边栏导航增强',
        description: '在左侧边栏导航中添加隐私政策链接。',
        features: [
          '添加隐私政策链接',
          '支持多语言显示',
        ],
      },
      en: {
        title: 'Sidebar Navigation Enhancement',
        description: 'Added Privacy Policy link to the left sidebar navigation.',
        features: [
          'Added Privacy Policy link',
          'Supports multilingual display',
        ],
      },
      ja: {
        title: 'サイドバーナビゲーションの強化',
        description: '左側サイドバーのナビゲーションにプライバシーポリシーリンクを追加しました。',
        features: [
          'プライバシーポリシーリンクを追加',
          '多言語表示に対応',
        ],
      },
    },
  },
  {
    date: '2025-12-03',
    version: '1.5.8',
    translations: {
      zh: {
        title: '多语言支持全面优化',
        description: '将默认语言改为英文，并为板块分类和所有错误提示添加完整的多语言支持。',
        features: [
          '默认语言改为英文',
          '板块分类名称支持多语言',
          '所有错误提示支持多语言',
        ],
      },
      en: {
        title: 'Comprehensive Multilingual Support Enhancement',
        description: 'Changed default language to English and added complete multilingual support for category names and all error messages.',
        features: [
          'Default language changed to English',
          'Category names support multilingual',
          'All error messages support multilingual',
        ],
      },
      ja: {
        title: '多言語サポートの包括的強化',
        description: 'デフォルト言語を英語に変更し、カテゴリ名とすべてのエラーメッセージに完全な多言語サポートを追加しました。',
        features: [
          'デフォルト言語を英語に変更',
          'カテゴリ名が多言語に対応',
          'すべてのエラーメッセージが多言語に対応',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.7',
    translations: {
      zh: {
        title: '顶部导航与通知体验优化',
        description: '优化语言切换菜单交互，改进移动端通知下拉菜单的可见性与滚动体验。',
        features: [
          '语言切换菜单改为点击开关',
          '优化移动端通知列表显示',
        ],
      },
      en: {
        title: 'Top Navigation & Notification UX Improvements',
        description: 'Improved language switcher interactions and mobile notification dropdown visibility and scrolling behavior.',
        features: [
          'Language switcher menu uses click toggle',
          'Optimized mobile notification list display',
        ],
      },
      ja: {
        title: 'トップナビゲーションと通知のユーザー体験改善',
        description: '言語切替メニューのインタラクションを改善し、モバイル通知ドロップダウンの表示とスクロール体験を最適化しました。',
        features: [
          '言語切替メニューをクリック切り替えに変更',
          'モバイル通知リストの表示を最適化',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.6',
    translations: {
      zh: {
        title: '板块分类设计简化',
        description: '简化板块分类设计，移除装饰效果。',
        features: [
          '移除装饰效果，统一设计风格',
          '优化布局和交互',
        ],
      },
      en: {
        title: 'Category Design Simplification',
        description: 'Simplified category design, removed decorative effects.',
        features: [
          'Removed decorative effects, unified design style',
          'Optimized layout and interactions',
        ],
      },
      ja: {
        title: 'カテゴリデザインの簡素化',
        description: 'カテゴリデザインを簡素化し、装飾効果を削除しました。',
        features: [
          '装飾効果を削除し、デザインスタイルを統一',
          'レイアウトとインタラクションを最適化',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.5',
    translations: {
      zh: {
        title: '标签物理引擎系统重构',
        description: '使用Matter.js物理引擎实现标签的真实物理效果。',
        features: [
          '集成物理引擎，实现真实物理模拟',
          '支持拖拽和碰撞交互',
        ],
      },
      en: {
        title: 'Tag Physics Engine System Refactor',
        description: 'Implemented real physics effects for tags using Matter.js physics engine.',
        features: [
          'Integrated physics engine for real physics simulation',
          'Support drag and collision interactions',
        ],
      },
      ja: {
        title: 'タグ物理エンジンシステムのリファクタリング',
        description: 'Matter.js物理エンジンを使用してタグのリアルな物理効果を実装しました。',
        features: [
          '物理エンジンを統合し、リアルな物理シミュレーションを実現',
          'ドラッグと衝突のインタラクションをサポート',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.4',
    translations: {
      zh: {
        title: 'Header左右边距对称修复',
        description: '修复Header左右边距不一致的问题。',
        features: [
          '优化Grid布局确保左右对称',
        ],
      },
      en: {
        title: 'Header Left-Right Margin Symmetry Fix',
        description: 'Fixed inconsistent left-right margins in Header.',
        features: [
          'Optimized Grid layout for symmetry',
        ],
      },
      ja: {
        title: 'ヘッダーの左右マージン対称性の修正',
        description: 'ヘッダーの左右マージンの不一致を修正しました。',
        features: [
          'Gridレイアウトを最適化し対称性を確保',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.3',
    translations: {
      zh: {
        title: '响应式Header布局优化',
        description: '修复响应式设备上按钮排版错乱问题。',
        features: [
          '优化各断点的按钮布局',
        ],
      },
      en: {
        title: 'Responsive Header Layout Optimization',
        description: 'Fixed button layout issues on responsive devices.',
        features: [
          'Optimized button layout for all breakpoints',
        ],
      },
      ja: {
        title: 'レスポンシブヘッダーレイアウトの最適化',
        description: 'レスポンシブデバイスでのボタンのレイアウト問題を修正しました。',
        features: [
          'すべてのブレークポイントでボタンレイアウトを最適化',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.2',
    translations: {
      zh: {
        title: '标签位置缓存优化',
        description: '修复路由切换时标签位置被重置的问题。',
        features: [
          '使用缓存机制保持标签位置',
        ],
      },
      en: {
        title: 'Tag Position Cache Optimization',
        description: 'Fixed issue where tag positions were reset on route changes.',
        features: [
          'Used caching mechanism to preserve tag positions',
        ],
      },
      ja: {
        title: 'タグ位置キャッシュ最適化',
        description: 'ルート切替時にタグ位置がリセットされる問題を修正しました。',
        features: [
          'キャッシュメカニズムでタグ位置を保持',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.1',
    translations: {
      zh: {
        title: '标签区域随机布局优化',
        description: '标签区域改为随机错落分布，带来更自然生动的视觉效果。',
        features: [
          '标签从规则滚动改为随机错落分布，每个标签根据发帖数量重复显示',
          '移除标签数字显示和井号前缀，界面更简洁',
          '隐藏右侧边栏滚动条，保持界面整洁',
          '鼠标悬停时标签继续浮动，不会暂停动画',
          '使用防重叠算法确保标签之间保持间距，不会相互覆盖',
        ],
      },
      en: {
        title: 'Tag Area Random Layout Optimization',
        description: 'Tags area redesigned with random scattered distribution for a more natural and dynamic visual effect.',
        features: [
          'Tags changed from regular scrolling to random scattered distribution, each tag repeats based on post count',
          'Removed tag numbers and hash prefix for cleaner interface',
          'Hidden scrollbar in right sidebar for cleaner appearance',
          'Tags continue floating on hover without pausing animation',
          'Collision detection algorithm ensures tags maintain spacing without overlapping',
        ],
      },
      ja: {
        title: 'タグエリアのランダムレイアウト最適化',
        description: 'タグエリアをランダムに散らばった配置に変更し、より自然で動的な視覚効果を実現しました。',
        features: [
          'タグを規則的なスクロールからランダム配置に変更、投稿数に応じて各タグを繰り返し表示',
          'タグの数字表示とハッシュプレフィックスを削除し、よりシンプルなインターフェースに',
          '右サイドバーのスクロールバーを非表示にし、よりクリーンな見た目に',
          'ホバー時もタグが浮遊し続け、アニメーションが一時停止しない',
          '衝突検出アルゴリズムでタグ間の間隔を確保し、重なりを防止',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.0',
    translations: {
      zh: {
        title: 'UI 更新- 动态标签与气泡分类',
        description: '标签区域改为多行错开滚动，分类区域改为气泡浮动效果，带来更生动有趣的视觉体验。',
        features: [
          '标签区域改为多行错开滚动，标签持续循环滚动展示，每个标签根据发帖数量重复显示',
          '分类区域改为气泡浮动效果，每个分类独立浮动动画，位置错落有致',
          '标签滚动支持鼠标悬停暂停，方便查看标签内容',
          '分类气泡采用渐变背景容器，标签显示发帖数量，视觉效果更佳',
          '优化响应式设计，移动端自动切换为静态布局',
          '增强交互效果，悬停时标签变色、气泡放大',
        ],
      },
      en: {
        title: 'UI Update - Dynamic Tags & Floating Categories',
        description: 'Tags area redesigned with multi-row staggered scrolling, categories area redesigned as floating bubbles for a more dynamic visual experience.',
        features: [
          'Tags area changed to multi-row staggered scrolling with continuous loop animation, each tag repeats based on post count',
          'Categories area redesigned as floating bubbles with independent animations and scattered positions',
          'Tag scrolling pauses on hover for better readability',
          'Category bubbles use gradient background container, tags display post count for enhanced visuals',
          'Optimized responsive design, automatically switches to static layout on mobile',
          'Enhanced hover effects with color changes and scale animations',
        ],
      },
      ja: {
        title: 'UI 更新 - 動的タグとフローティングカテゴリー',
        description: 'タグエリアを複数行のずらしたスクロールに変更、カテゴリーエリアをフローティングバブルに変更し、より動的で魅力的な視覚体験を提供します。',
        features: [
          'タグエリアを複数行のずらしたスクロールに変更、連続ループアニメーション、投稿数に応じて各タグを繰り返し表示',
          'カテゴリーエリアをフローティングバブルに変更、独立したアニメーションと散らばった配置',
          'タグスクロールはホバーで一時停止、閲覧性向上',
          'カテゴリーバブルはグラデーション背景コンテナを使用、タグは投稿数を表示、視覚効果向上',
          'レスポンシブデザインを最適化、モバイルで自動的に静的レイアウトに切り替え',
          'ホバー時の色変更とスケールアニメーションでインタラクション強化',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.4.1',
    translations: {
      zh: {
        title: '移动端通知显示优化',
        description: '修复移动设备上通知下拉菜单显示不全的问题。',
        features: [
          '通知下拉菜单在移动端使用固定定位，确保完全显示',
          '优化小屏幕上的通知列表布局和文字大小',
          '调整通知项的内边距和间距，提升可读性',
          '改进通知菜单的最大高度计算，避免被截断',
        ],
      },
      en: {
        title: 'Mobile Notification Display Fix',
        description: 'Fixed notification dropdown display issues on mobile devices.',
        features: [
          'Notification dropdown uses fixed positioning on mobile for full visibility',
          'Optimized notification list layout and text sizes on small screens',
          'Adjusted notification item padding and spacing for better readability',
          'Improved max-height calculation to prevent truncation',
        ],
      },
      ja: {
        title: 'モバイル通知表示の最適化',
        description: 'モバイルデバイスで通知ドロップダウンが完全に表示されない問題を修正しました。',
        features: [
          'モバイルで通知ドロップダウンを固定配置に変更し、完全表示を確保',
          '小画面での通知リストのレイアウトと文字サイズを最適化',
          '通知項目の余白と間隔を調整し、可読性を向上',
          '最大高さの計算を改善し、切り詰めを防止',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.4.0',
    translations: {
      zh: {
        title: 'Inbox 通知功能',
        description: '新增右上角通知系统，实时接收新帖子通知。',
        features: [
          '右上角添加通知图标，显示未读数量徽章',
          '点击查看通知列表，包含发帖人和帖子标题',
          '支持标记单个或全部通知为已读',
          '自动轮询更新未读数量（每30秒）',
          '点击通知可直接跳转到对应帖子',
        ],
      },
      en: {
        title: 'Inbox Notifications',
        description: 'Added notification system in the top-right corner to receive real-time new post notifications.',
        features: [
          'Notification icon in top-right corner with unread badge',
          'Click to view notification list with author and post title',
          'Support marking individual or all notifications as read',
          'Auto-polling updates unread count every 30 seconds',
          'Click notification to jump directly to the related post',
        ],
      },
      ja: {
        title: 'Inbox 通知機能',
        description: '右上に通知システムを追加し、新しい投稿の通知をリアルタイムで受信できます。',
        features: [
          '右上に通知アイコンを追加、未読数のバッジを表示',
          'クリックで通知一覧を表示、投稿者と投稿タイトルを含む',
          '個別またはすべての通知を既読にする機能',
          '未読数を30秒ごとに自動更新',
          '通知をクリックして関連投稿に直接ジャンプ',
        ],
      },
    },
  },
  {
    date: '2025-12-01',
    version: '1.3.2',
    translations: {
      zh: {
        title: '响应式布局优化',
        description: '全面优化移动端和小屏幕设备的显示效果，提升用户体验。',
        features: [
          '优化帖子详情页标题和内容在小屏幕上的显示',
          '改进首页和帖子卡片在移动端的布局和间距',
          '调整错误状态提示的响应式样式',
          '优化按钮和操作元素在窄屏上的排列',
        ],
      },
      en: {
        title: 'Responsive Layout Improvements',
        description: 'Comprehensive mobile and small-screen optimizations for better user experience.',
        features: [
          'Optimized post detail page titles and content on small screens',
          'Improved layout and spacing for home page and post cards on mobile',
          'Adjusted responsive styles for error state messages',
          'Enhanced button and action element arrangement on narrow screens',
        ],
      },
      ja: {
        title: 'レスポンシブレイアウトの最適化',
        description: 'モバイルと小画面デバイスでの表示を全面的に改善しました。',
        features: [
          '投稿詳細ページのタイトルとコンテンツを小画面で最適化',
          'ホームページと投稿カードのモバイルレイアウトと余白を改善',
          'エラー状態メッセージのレスポンシブスタイルを調整',
          '狭い画面でのボタンと操作要素の配置を最適化',
        ],
      },
    },
  },
  {
    date: '2025-12-01',
    version: '1.3.1',
    translations: {
      zh: {
        title: '请求间隔优化与速率限制调整',
        description: '优化请求频率控制，解决快速操作时数据加载失败的问题。',
        features: [
          '提高系统可处理的请求数量，减少请求限制',
          '优化快速操作时的请求处理，避免重复请求',
          '延长请求等待时间，提高成功率',
          '改进错误提示，更清楚地告知用户问题原因',
        ],
      },
      en: {
        title: 'Request Throttling & Rate Limit Adjustments',
        description:
          'Optimized request frequency control to prevent data loading failures from rapid operations.',
        features: [
          'Increased system request capacity to reduce limitations',
          'Optimized request handling for rapid operations to avoid duplicate requests',
          'Extended request timeout for better success rate',
          'Improved error messages for clearer user feedback',
        ],
      },
      ja: {
        title: 'リクエスト間隔の最適化とレート制限の調整',
        description:
          'リクエスト頻度の制御を最適化し、素早い操作時のデータ読み込み失敗を解決しました。',
        features: [
          'システムが処理できるリクエスト数を増やし、制限を緩和',
          '素早い操作時のリクエスト処理を最適化し、重複リクエストを防止',
          'リクエストの待機時間を延長し、成功率を向上',
          'エラーメッセージを改善し、ユーザーに問題の原因をより明確に伝達',
        ],
      },
    },
  },
  {
    date: '2025-12-01',
    version: '1.3.0',
    translations: {
      zh: {
        title: '多语言界面与语言切换器',
        description: '新增底部语言按钮，全站 UI 文案支持中文/英文/日文切换（帖子正文除外）。',
        features: [
          '左下角悬浮语言按钮支持点击或悬停展开，带有动态动画并记住选择',
          '导航、侧栏、搜索、发帖等界面文案同步切换语言',
          '用户协议、隐私政策、更新日志、问题修复页面提供三语内容',
        ],
      },
      en: {
        title: 'Multilingual UI & Language Switcher',
        description:
          'Introduced a floating language button so the entire UI (except user posts) is available in Chinese, English, and Japanese.',
        features: [
          'Bottom-left switcher opens with hover/click animation and remembers your preference',
          'Navigation, search, posting, and dialogs now translate instantly',
          'Legal pages and changelog/fixes sections ship with full trilingual content',
        ],
      },
      ja: {
        title: '多言語 UI とランゲージスイッチャー',
        description:
          '左下のボタンから UI 表示を中国語・英語・日本語に切り替えられるようになりました（投稿本文を除く）。',
        features: [
          'ホバー/クリックで展開する円形ボタンが選択した言語を記憶',
          'ナビゲーションや投稿フォームなどの文言が即時に切り替わる',
          '利用規約・プライバシー・更新履歴・修正一覧も三言語対応',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    version: '1.2.5',
    translations: {
      zh: {
        title: '问题修复页排版统一',
        description: '针对不同屏幕统一问题修复页面的卡片布局。',
        features: [
          '采用响应式网格，保证桌面与移动端间距一致',
          '规范标题、正文、要点的行高与留白',
          '移除冗余描述，让卡片聚焦修复内容',
        ],
      },
      en: {
        title: 'Fixes Page Layout Refresh',
        description: 'Normalized the Fixes page cards so they read well on any device.',
        features: [
          'Responsive grid keeps spacing consistent between desktop and mobile',
          'Unified typography scale for titles, body text, and bullet lists',
          'Removed noisy “impact” paragraphs to highlight the actual fix',
        ],
      },
      ja: {
        title: '修正一覧ページのレイアウト統一',
        description: 'デバイスに依存しない読みやすいカード配置に調整しました。',
        features: [
          'レスポンシブグリッドでデスクトップとモバイルの余白を統一',
          'タイトルや本文、箇条書きの行間を再設計',
          '冗長な説明を削除し、修正内容そのものを強調',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    version: '1.2.4',
    translations: {
      zh: {
        title: '夜间模式卡片与下拉可读性修复',
        description: '夜间主题下的问题修复页面与发帖页下拉选择器可读性增强。',
        features: [
          '卡片、日期条、备注等组件继承主题变量，保证对比度',
          '发帖页板块下拉选项统一字体颜色，深色背景仍清晰',
        ],
      },
      en: {
        title: 'Dark Mode Readability Fix',
        description: 'Improved contrast for Fixes cards and the create-post dropdown in dark mode.',
        features: [
          'Cards, badges, and helper texts now use theme-aware tokens',
          'Category dropdown inherits the correct foreground color in dark mode',
        ],
      },
      ja: {
        title: 'ダークモードでの視認性改善',
        description: '修正ページと投稿ページのドロップダウンを暗色テーマに最適化しました。',
        features: [
          'カードや日付ラベルがテーマカラーを継承し十分なコントラストを確保',
          'カテゴリー選択の文字色を統一し、暗背景でも読みやすく調整',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    version: '1.2.3',
    translations: {
      zh: {
        title: '夜间模式表单可读性优化',
        description: '发帖页在深色模式下的输入体验更清晰。',
        features: [
          '输入框、下拉框文字切换为夜间主题主色',
          '占位提示采用次级文本色，提示信息不再模糊',
          '统一表单控件的响应式样式',
        ],
      },
      en: {
        title: 'Dark Theme Form Polish',
        description: 'Posting forms now stay legible under the dark palette.',
        features: [
          'Inputs and selects adopt primary foreground colors in dark mode',
          'Placeholder text uses the secondary tone for better contrast',
          'Responsive styles synced between light/dark themes',
        ],
      },
      ja: {
        title: 'ダークテーマのフォーム改善',
        description: '暗色モードでも投稿フォームの文字が読みやすくなりました。',
        features: [
          '入力欄とセレクト欄の文字色をダークテーマ用に最適化',
          'プレースホルダーを副次テキスト色に変更し視認性を確保',
          'フォーム全体のレスポンシブ挙動を統一',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    version: '1.2.2',
    translations: {
      zh: {
        title: '导航按钮响应式修复',
        description: '移动端顶部导航的拥挤问题得到解决。',
        features: [
          '按钮在中小屏可自动换行并保持居中',
          '夜间模式按钮在窄屏仅显示图标节省空间',
          '576px 以下自动收窄但保留搜索入口',
        ],
      },
      en: {
        title: 'Responsive Nav Buttons',
        description: 'Fixed cramped top navigation on phones.',
        features: [
          'Buttons wrap gracefully and stay centered on small screens',
          'Night-mode toggle collapses into an icon when space is tight',
          'Search entry remains reachable even under 576px width',
        ],
      },
      ja: {
        title: 'ナビゲーションボタンのレスポンシブ対応',
        description: 'モバイルでボタンが詰まる問題を解消しました。',
        features: [
          '中小画面でボタンが自動的に折り返し中央揃えに',
          'ダークモード切替は幅が狭い時にアイコン表示へ移行',
          '幅576px未満でも検索入力をキープ',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    version: '1.2.1',
    translations: {
      zh: {
        title: '资料页移动端布局优化',
        description: '用户资料页在窄屏下更加整洁。',
        features: [
          '头部信息在小屏自动堆叠并居中',
          '统计信息支持换行排列，避免拥挤',
          '删除按钮位置微调，不遮挡内容',
        ],
      },
      en: {
        title: 'Profile Layout Tune-Up',
        description: 'User profiles now scale nicely on narrow devices.',
        features: [
          'Header info stacks and centers on mobile',
          'Stats cards wrap into new rows instead of cramping',
          'Delete buttons repositioned to avoid covering posts',
        ],
      },
      ja: {
        title: 'プロフィールページのモバイル最適化',
        description: '狭い画面でもプロフィール情報が整って表示されます。',
        features: [
          'ヘッダー情報が自動で縦並び＆中央揃えに',
          '統計カードが折り返し表示され、圧迫感を解消',
          '削除ボタンの位置を調整し、投稿内容を遮らないように改善',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    version: '1.2.0',
    translations: {
      zh: {
        title: '一键夜间模式',
        description: '支持在顶部快速切换夜间/日间主题。',
        features: [
          '新增夜间模式按钮并记住最近一次选择',
          '夜间模式同步优化背景、文字、卡片对比度',
          '未登录用户也能享受相同体验',
        ],
      },
      en: {
        title: 'One-Tap Dark Mode',
        description: 'Added a dedicated dark-mode toggle next to the publish button.',
        features: [
          'Remembers your last choice and applies it globally',
          'Adjusted background, text, and cards for better nighttime contrast',
          'Works for signed-out visitors as well',
        ],
      },
      ja: {
        title: 'ワンタップのダークモード',
        description: '投稿ボタン横にテーマ切替スイッチを追加しました。',
        features: [
          '前回の選択を記憶し、全ページに適用',
          '夜間向けに背景・文字・カードのコントラストを再調整',
          '未ログイン状態でも同じ体験を提供',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    version: '1.1.1',
    translations: {
      zh: {
        title: '搜索结果命中率修复',
        description: '修复搜索统计缺少关联导致的空结果问题。',
        features: [
          '统一列表查询与统计用的 JOIN 语句',
          '维持标题/内容/作者用户名模糊匹配',
        ],
      },
      en: {
        title: 'Search Accuracy Fix',
        description: 'Resolved an issue where the search counter ignored author joins.',
        features: [
          'The same JOIN chain now powers both listing and counting',
          'Kept fuzzy matching for title, body, and author name',
        ],
      },
      ja: {
        title: '検索ヒット率の修正',
        description: '検索結果が常にゼロになる不具合を修正しました。',
        features: [
          '一覧取得と件数取得で同じ JOIN 条件を使用',
          'タイトル/本文/ユーザー名のあいまい検索を維持',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    version: '1.1.0',
    translations: {
      zh: {
        title: '新增「问题修复」栏目',
        description: '在侧栏加入问题修复入口，集中展示近期缺陷修复。',
        features: [
          '为每项修复提供背景与影响范围',
          '首批收录图片地址异常、删除帖子后标签不刷新等问题',
        ],
      },
      en: {
        title: 'Fixes Section',
        description: 'Added a “Fixes” entry to the sidebar to collect bug summaries.',
        features: [
          'Each fix documents the context and scope',
          'First batch covers image URL issues and stale tags after deletions',
        ],
      },
      ja: {
        title: '「問題修正」セクションを追加',
        description: 'サイドバーに最近の修正一覧へのリンクを設置しました。',
        features: [
          '各修正に背景と影響範囲を明記',
          '画像URL異常や削除後にタグが残る問題などを収録',
        ],
      },
    },
  },
  {
    date: '2025-11-12',
    version: '1.0.0',
    translations: {
      zh: {
        title: '搜索功能上线',
        description: '可以通过搜索框快速找到感兴趣的帖子。',
        features: [
          '支持按标题、内容、作者用户名搜索',
          '搜索页显示匹配数量并支持分页',
          '提供“最新 / 热门”排序',
        ],
      },
      en: {
        title: 'Search Released',
        description: 'You can now discover posts via the global search bar.',
        features: [
          'Search by title, body, or author handle',
          'Result page shows total counts and supports pagination',
          'Sort results by latest or hottest',
        ],
      },
      ja: {
        title: '検索機能を公開',
        description: '気になる投稿を検索バーからすぐ探せるようになりました。',
        features: [
          'タイトル・本文・ユーザー名で検索可能',
          '検索結果の総件数表示とページネーションに対応',
          '「最新順」「人気順」で並べ替え可能',
        ],
      },
    },
  },
  {
    date: '2025-11-12',
    version: '0.9.0',
    translations: {
      zh: {
        title: '图片上传功能',
        description: '发帖时可以上传最多 10 张图片，支持拖拽与预览。',
        features: [
          '拖拽或选择文件上传，实时预览',
          '支持 JPEG / PNG / GIF / WebP，单张 5MB 内',
          '上传后可移除不需要的图片',
        ],
      },
      en: {
        title: 'Image Uploads',
        description: 'Posts can now include up to ten images with drag-and-drop support.',
        features: [
          'Instant preview while selecting or dragging files',
          'Accepts JPEG, PNG, GIF, WebP up to 5 MB each',
          'Remove uploaded images before publishing',
        ],
      },
      ja: {
        title: '画像アップロード機能',
        description: '投稿時に最大10枚の画像を添付できるようになりました。',
        features: [
          'ドラッグ＆ドロップと即時プレビューに対応',
          'JPEG/PNG/GIF/WebP（各5MBまで）をサポート',
          '不要になった画像はアップロード後でも削除可能',
        ],
      },
    },
  },
  {
    date: '2025-11-12',
    version: '0.8.0',
    translations: {
      zh: {
        title: '帖子点赞功能',
        description: '支持点赞与取消点赞帖子。',
        features: [
          '实时显示点赞数量',
          '已点赞帖子显示红色心形图标',
          '阻止重复点赞请求',
        ],
      },
      en: {
        title: 'Post Likes',
        description: 'Cheer on your favorite posts with a tap.',
        features: [
          'Realtime like counts with optimistic updates',
          'Loved posts display a filled red heart',
          'Server guards against accidental double taps',
        ],
      },
      ja: {
        title: '投稿への「いいね」機能',
        description: '気に入った投稿にワンタップで反応できます。',
        features: [
          'いいね数がリアルタイムに更新',
          'いいね済みは赤いハートで表示',
          '連続タップしても重複登録されないよう制御',
        ],
      },
    },
  },
  {
    date: '2025-11-12',
    version: '0.7.0',
    translations: {
      zh: {
        title: '帖子管理功能',
        description: '在个人主页可以删除自己发布的帖子。',
        features: [
          '删除前弹出确认对话框',
          '删除后自动刷新帖子统计',
          '更安全的操作体验',
        ],
      },
      en: {
        title: 'Post Management',
        description: 'Creators can now delete their own posts from the profile page.',
        features: [
          'Confirmation dialog prevents mistakes',
          'Statistics refresh immediately after deletion',
          'Improved safety around destructive actions',
        ],
      },
      ja: {
        title: '投稿管理機能',
        description: 'プロフィールから自分の投稿を削除できるようになりました。',
        features: [
          '削除前に確認ダイアログを表示',
          '削除後は統計情報を即時更新',
          '誤操作を防ぐための保護を追加',
        ],
      },
    },
  },
  {
    date: '2025-11-12',
    version: '0.6.0',
    translations: {
      zh: {
        title: '邮箱验证注册',
        description: '注册流程增加邮箱验证码，防止恶意注册。',
        features: [
          '验证码有效期 5 分钟，60 秒内限一次发送',
          '注册前必须完成邮箱验证',
        ],
      },
      en: {
        title: 'Email Verification',
        description: 'Sign-up now requires a short-lived verification code.',
        features: [
          'Codes expire after 5 minutes and throttle to 1 per 60 seconds',
          'Prevents automated/abusive registrations',
        ],
      },
      ja: {
        title: 'メール認証付き登録',
        description: '登録時にワンタイムコードを入力する方式に変更しました。',
        features: [
          'コードの有効期限は5分、再送は60秒ごとに制限',
          '不正登録を抑制するための仕組み',
        ],
      },
    },
  },
  {
    date: '2025-11-12',
    version: '0.5.0',
    translations: {
      zh: {
        title: '界面优化',
        description: '启用全新的现代化界面与动画。',
        features: [
          '升级字体与间距，提升可读性',
          '响应式布局覆盖主要页面',
          '交互动画更顺滑',
        ],
      },
      en: {
        title: 'UI Refresh',
        description: 'Rolled out a modern visual system with smoother motion.',
        features: [
          'Typography and spacing tuned for readability',
          'Responsive layouts applied to all key pages',
          'Polished interaction animations',
        ],
      },
      ja: {
        title: 'UI の刷新',
        description: 'モダンなビジュアルとアニメーションに一新しました。',
        features: [
          'フォントと余白を再設計し読みやすさを向上',
          '主要ページをレスポンシブ対応',
          'アニメーションを滑らかに調整',
        ],
      },
    },
  },
  {
    date: '2025-11-12',
    version: '0.4.0',
    translations: {
      zh: {
        title: '浏览统计优化',
        description: '更准确地统计帖子浏览量。',
        features: [
          '同一用户或 IP 24 小时只记一次',
          '防止刷量，数据更真实',
        ],
      },
      en: {
        title: 'View Counter Accuracy',
        description: 'Page views now represent unique visitors per 24 hours.',
        features: [
          'Same user/IP counts once per day',
          'Protects against artificial inflation',
        ],
      },
      ja: {
        title: '閲覧数の精度向上',
        description: '投稿の閲覧数をより正確に計測します。',
        features: [
          '同一ユーザー/同一IPは24時間に1回だけカウント',
          '不正な水増しを防ぎ、実態に近い数値を表示',
        ],
      },
    },
  },
  {
    date: '2025-11-12',
    version: '0.3.0',
    translations: {
      zh: {
        title: '用户协议 & 隐私政策',
        description: '补齐法务条款，保障用户权利。',
        features: [
          '上线用户协议与隐私政策页面',
          '注册流程需同意条款',
        ],
      },
      en: {
        title: 'Terms & Privacy',
        description: 'Published the legal docs that govern REForum.',
        features: [
          'Dedicated Terms of Service and Privacy Policy pages',
          'Sign-up flow requires explicit consent',
        ],
      },
      ja: {
        title: '利用規約とプライバシーポリシー',
        description: 'ユーザー保護のための規約ページを整備しました。',
        features: [
          '利用規約とプライバシーポリシーを公開',
          '登録時に同意が必須に',
        ],
      },
    },
  },
]

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

const Changelog = () => {
  const { language } = useLanguage()
  const copy = changelogCopy[language] || changelogCopy.zh
  const [expandedMonths, setExpandedMonths] = useState(new Set())
  const [expandedVersions, setExpandedVersions] = useState(new Set())
  const [expandedDates, setExpandedDates] = useState(new Set())
  const locale = formatLocale[language] || zhCN
  const datePattern = formatPattern[language] || formatPattern.zh

  const monthFormatPattern = {
    zh: 'yyyy年MM月',
    en: 'MMMM yyyy',
    ja: 'yyyy年MM月',
  }
  const monthPattern = monthFormatPattern[language] || monthFormatPattern.zh

  // 处理更新日志数据
  const localizedUpdates = updates.map((entry) => {
    const translation = entry.translations[language] || entry.translations.zh
    return {
      date: entry.date,
      version: entry.version,
      type: 'update',
      type: entry.type || 'update',
      ...translation,
    }
  })

  // 处理问题修复数据
  const localizedFixes = fixes.map((item) => {
    const translation = item.translations[language] || item.translations.zh
    return {
      date: item.date,
      version: item.version,
      issue: item.issue,
      type: 'fix',
      ...translation,
    }
  })

  // 合并并按月份和版本分组
  const groupedByMonth = useMemo(() => {
    const allItems = [...localizedUpdates, ...localizedFixes]
    const grouped = {}

    allItems.forEach((item) => {
      // 跳过无效日期
      if (!item.date) return
      
      const date = new Date(item.date)
      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        console.warn('Invalid date in changelog:', item.date)
        return
      }
      
      const monthKey = format(date, 'yyyy-MM', { locale })
      const monthLabel = format(date, monthPattern, { locale })
      
      // 获取版本号（只取前两部分，如 1.5.10 -> 1.5）
      const versionKey = item.version ? item.version.split('.').slice(0, 2).join('.') : 'unknown'

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
      
      // 按日期分组
      const dateKey = item.date
      if (!grouped[monthKey].versions[versionKey].dates[dateKey]) {
        grouped[monthKey].versions[versionKey].dates[dateKey] = {
          date: dateKey,
          items: [],
        }
      }
      
      grouped[monthKey].versions[versionKey].dates[dateKey].items.push(item)
    })

    // 在每个版本内按日期排序（最新的在前）
    Object.keys(grouped).forEach((monthKey) => {
      Object.keys(grouped[monthKey].versions).forEach((versionKey) => {
        // 将日期对象转换为数组并按日期排序（最新的在前）
        const version = grouped[monthKey].versions[versionKey]
        version.dateList = Object.values(version.dates).sort((a, b) => {
          return new Date(b.date) - new Date(a.date)
        })
        
        // 在每个日期内，项目按类型排序（更新在前，修复在后）
        version.dateList.forEach((dateGroup) => {
          dateGroup.items.sort((a, b) => {
            if (a.type === 'update' && b.type === 'fix') return -1
            if (a.type === 'fix' && b.type === 'update') return 1
            return 0
          })
        })
      })
      
      // 将版本对象转换为数组并按版本号排序（最新的在前）
      grouped[monthKey].versionList = Object.values(grouped[monthKey].versions).sort((a, b) => {
        // 比较版本号，如 "1.5" vs "1.3"
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
  }, [localizedUpdates, localizedFixes, monthPattern, locale])

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

  // 硬编码：直接使用 updates 数组的第一项作为最新更新
  const latestItem = localizedUpdates.length > 0 ? localizedUpdates[0] : null
  const latestFormattedDate = latestItem?.date ? formatDate(latestItem.date) : null

  const latestLabels = {
    zh: { title: '最新更新', showAll: '查看全部' },
    en: { title: 'Latest Updates', showAll: 'View All' },
    ja: { title: '最新の更新', showAll: 'すべて表示' },
  }
  const latestLabel = latestLabels[language] || latestLabels.zh

  return (
    <div className="changelog-page">
      <div className="changelog-header">
        <h1>{copy.title}</h1>
        <p className="changelog-intro">{copy.intro}</p>
      </div>

      {latestItem && (
        <div className="changelog-latest">
          <div className="changelog-latest-header">
          <h2 className="changelog-latest-title">{latestLabel.title}</h2>
            {latestFormattedDate && (
              <span className="changelog-latest-date" title={latestItem.date}>
                {latestFormattedDate}
              </span>
            )}
          </div>
          <div className="changelog-latest-items">
            {latestItem.type === 'update' ? (
              <div className="changelog-item">
                <div className="changelog-item-header">
                  <div className="changelog-item-title-section">
                    <h2 className="changelog-item-title">{latestItem.title}</h2>
                    <span className="changelog-item-version">v{latestItem.version}</span>
                    <span className="changelog-item-type-badge">
                      {language === 'zh' ? '更新' : language === 'ja' ? '更新' : 'Update'}
                    </span>
                  </div>
                </div>
                <p className="changelog-item-description">{latestItem.description}</p>
                <ul className="changelog-item-features">
                  {latestItem.features?.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <article className="fix-card changelog-fix-item">
                <div className="fix-header">
                  <div className="fix-meta">
                    {latestItem.version && (
                      <span className="fix-version">
                        v{latestItem.version}
                      </span>
                    )}
                    {latestItem.issue && (
                      <span className="fix-issue">
                        Issue {Array.isArray(latestItem.issue) ? latestItem.issue.map(i => `#${i}`).join(', ') : `#${latestItem.issue}`}
                      </span>
                    )}
                    <span className="changelog-item-type-badge fix-badge">
                      {language === 'zh' ? '修复' : language === 'ja' ? '修正' : 'Fix'}
                    </span>
                  </div>
                  <h2 className="fix-name">{latestItem.title}</h2>
                </div>
                <p className="fix-desc">{latestItem.description}</p>
                {latestItem.details?.length > 0 && (
                  <ul className="fix-details">
                    {latestItem.details.map((detail, detailIndex) => (
                      <li key={detailIndex}>{detail}</li>
                    ))}
                  </ul>
                )}
              </article>
            )}
          </div>
        </div>
      )}

      <div className="changelog-months">
        {groupedByMonth.map((monthGroup) => {
          const isExpanded = expandedMonths.has(monthGroup.monthKey)
          return (
            <div key={monthGroup.monthKey} className="changelog-month-group">
              <button
                type="button"
                className="changelog-month-header"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleMonth(monthGroup.monthKey)
                }}
              >
                <span className="changelog-month-title">{monthGroup.monthLabel}</span>
                <span className="changelog-month-count">
                  ({monthGroup.versionList ? monthGroup.versionList.reduce((sum, v) => sum + (v.dateList ? v.dateList.reduce((dSum, d) => dSum + d.items.length, 0) : 0), 0) : 0} {monthLabel.items})
                </span>
                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {isExpanded && (
                <div className="changelog-list">
                  {monthGroup.versionList.map((versionGroup) => {
                    const versionKey = `${monthGroup.monthKey}-${versionGroup.version}`
                    const isVersionExpanded = expandedVersions.has(versionKey)
                    return (
                      <div key={`${monthGroup.monthKey}-${versionGroup.version}`} className="changelog-version-group">
                        <button
                          type="button"
                          className="changelog-version-header"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleVersion(monthGroup.monthKey, versionGroup.version)
                          }}
                        >
                          <span className="changelog-version-title">v{versionGroup.version}</span>
                          <span className="changelog-version-count">
                            ({versionGroup.dateList ? versionGroup.dateList.reduce((sum, d) => sum + d.items.length, 0) : 0} {monthLabel.items})
                          </span>
                          {isVersionExpanded ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        {isVersionExpanded && (
                          <div className="changelog-version-items">
                            {versionGroup.dateList?.map((dateGroup) => {
                              const dateKey = `${monthGroup.monthKey}-${versionGroup.version}-${dateGroup.date}`
                              const isDateExpanded = expandedDates.has(dateKey)
                              return (
                                <div key={dateKey} className="changelog-date-group">
                                  <button
                                    type="button"
                                    className="changelog-date-header"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      toggleDate(monthGroup.monthKey, versionGroup.version, dateGroup.date)
                                    }}
                                  >
                                    <span className="changelog-date-title">{formatDate(dateGroup.date)}</span>
                                    <span className="changelog-date-count">
                                      ({dateGroup.items.length} {monthLabel.items})
                                    </span>
                                    {isDateExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                  </button>
                                  {isDateExpanded && (
                                    <div className="changelog-date-items">
                                      {dateGroup.items.map((item, index) => {
                                        if (item.type === 'update') {
                                          return (
                                            <div key={`update-${item.version}-${item.date}-${index}`} className="changelog-item">
                                              <div className="changelog-item-header">
                                                <div className="changelog-item-title-section">
                                                  <h2 className="changelog-item-title">{item.title}</h2>
                                                  <span className="changelog-item-version">v{item.version}</span>
                                                  <span className="changelog-item-type-badge">
                                                    {language === 'zh' ? '更新' : language === 'ja' ? '更新' : 'Update'}
                                                  </span>
                                                </div>
                                              </div>
                                              <p className="changelog-item-description">{item.description}</p>
                                              <ul className="changelog-item-features">
                                                {item.features?.map((feature, featureIndex) => (
                                                  <li key={featureIndex}>{feature}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          )
                                        } else {
                                          return (
                                            <article key={`fix-${item.date}-${item.title}-${index}`} className="fix-card changelog-fix-item">
                                              <div className="fix-header">
                                                <div className="fix-meta">
                                                  {item.version && (
                                                    <span className="fix-version">
                                                      v{item.version}
                                                    </span>
                                                  )}
                                                  {item.issue && (
                                                    <span className="fix-issue">
                                                      Issue {Array.isArray(item.issue) ? item.issue.map(i => `#${i}`).join(', ') : `#${item.issue}`}
                                                    </span>
                                                  )}
                                                  <span className="changelog-item-type-badge fix-badge">
                                                    {language === 'zh' ? '修复' : language === 'ja' ? '修正' : 'Fix'}
                                                  </span>
                                                </div>
                                                <h2 className="fix-name">{item.title}</h2>
                                              </div>
                                              <p className="fix-desc">{item.description}</p>
                                              {item.details?.length > 0 && (
                                                <ul className="fix-details">
                                                  {item.details.map((detail, detailIndex) => (
                                                    <li key={detailIndex}>{detail}</li>
                                                  ))}
                                                </ul>
                                              )}
                                            </article>
                                          )
                                        }
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
              )}
            </div>
          )
        })}
      </div>

      <div className="changelog-footer">
        <p>{copy.footer}</p>
      </div>
    </div>
  )
}

export default Changelog

