import React from 'react'
import { format } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'
import enUS from 'date-fns/locale/en-US'
import ja from 'date-fns/locale/ja'
import { useLanguage } from '../context/LanguageContext'
import './Changelog.css'

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
    date: '2025-12-01',
    version: '1.3.1',
    translations: {
      zh: {
        title: '请求间隔优化与速率限制调整',
        description: '放宽后端速率限制，添加前端防抖与节流机制，解决频繁请求导致的数据加载失败问题。',
        features: [
          '后端速率限制从 15 分钟内 100 个请求提升到 500 个请求',
          '首页和搜索页面添加防抖（300ms）和节流（500ms最小间隔）机制',
          'API 请求超时时间从 5 秒增加到 10 秒，给后端更多处理时间',
          '优化 429 速率限制错误的处理，提供更友好的错误提示',
        ],
      },
      en: {
        title: 'Request Throttling & Rate Limit Adjustments',
        description:
          'Relaxed backend rate limits and added frontend debouncing/throttling to prevent data loading failures from rapid requests.',
        features: [
          'Backend rate limit increased from 100 to 500 requests per 15 minutes',
          'Added debounce (300ms) and throttle (500ms min interval) on Home and Search pages',
          'API timeout extended from 5 to 10 seconds for better backend processing',
          'Improved 429 rate limit error handling with clearer user feedback',
        ],
      },
      ja: {
        title: 'リクエスト間隔の最適化とレート制限の調整',
        description:
          'バックエンドのレート制限を緩和し、フロントエンドにデバウンス/スロットルを追加して、頻繁なリクエストによるデータ読み込み失敗を解決しました。',
        features: [
          'バックエンドのレート制限を15分間100リクエストから500リクエストに引き上げ',
          'ホームと検索ページにデバウンス（300ms）とスロットル（最小間隔500ms）を実装',
          'API リクエストのタイムアウトを5秒から10秒に延長し、バックエンドの処理時間を確保',
          '429 レート制限エラーの処理を改善し、より分かりやすいエラーメッセージを提供',
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
  const locale = formatLocale[language] || zhCN
  const datePattern = formatPattern[language] || formatPattern.zh

  const localizedUpdates = updates.map((entry) => {
    const translation = entry.translations[language] || entry.translations.zh
    return {
      date: entry.date,
      version: entry.version,
      ...translation,
    }
  })

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), datePattern, { locale })
    } catch {
      return dateString
    }
  }

  return (
    <div className="changelog-page">
      <div className="changelog-header">
        <h1>{copy.title}</h1>
        <p className="changelog-intro">{copy.intro}</p>
      </div>

      <div className="changelog-list">
        {localizedUpdates.map((update) => (
          <div key={`${update.version}-${update.date}`} className="changelog-item">
            <div className="changelog-item-header">
              <div className="changelog-item-title-section">
                <h2 className="changelog-item-title">{update.title}</h2>
                <span className="changelog-item-version">v{update.version}</span>
              </div>
              <span className="changelog-item-date">{formatDate(update.date)}</span>
            </div>
            <p className="changelog-item-description">{update.description}</p>
            <ul className="changelog-item-features">
              {update.features.map((feature, featureIndex) => (
                <li key={featureIndex}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="changelog-footer">
        <p>{copy.footer}</p>
      </div>
    </div>
  )
}

export default Changelog

