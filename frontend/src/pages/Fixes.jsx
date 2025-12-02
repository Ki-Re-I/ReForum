import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import './Fixes.css'

const fixes = [
  {
    date: '2025-12-02',
    version: '1.5.5',
    translations: {
      zh: {
        title: '标签系统物理效果和交互性增强',
        description: '集成Matter.js物理引擎，实现标签的真实物理效果和拖拽交互功能。',
        details: [
          '使用Matter.js物理引擎实现真实的物理模拟（重力、碰撞、摩擦、弹性）',
          '标签从容器上方掉落，受重力影响自然下落并堆叠',
          '支持鼠标和触摸拖拽标签，标签之间会发生真实碰撞',
          '简化标签样式，移除色块和装饰，改为简洁的纯文字样式',
          '减小标签占地面积，提高标签密度',
          '优化响应式布局，确保在移动端正常显示且不影响其他内容',
          '容器样式与整体页面样式统一，使用主题变量',
        ],
      },
      en: {
        title: 'Tag System Physics Effects and Interactivity Enhancement',
        description: 'Integrated Matter.js physics engine to implement real physics effects and drag interaction for tags.',
        details: [
          'Used Matter.js physics engine for real physics simulation (gravity, collision, friction, restitution)',
          'Tags fall from top of container, naturally drop and stack under gravity',
          'Support mouse and touch drag for tags with real collision detection',
          'Simplified tag styles, removed color blocks and decorations, using clean text-only style',
          'Reduced tag footprint, increased tag density',
          'Optimized responsive layout to ensure proper display on mobile devices without affecting other content',
          'Container styles unified with overall page styles using theme variables',
        ],
      },
      ja: {
        title: 'タグシステムの物理効果とインタラクティブ性の強化',
        description: 'Matter.js物理エンジンを統合し、タグのリアルな物理効果とドラッグインタラクション機能を実装しました。',
        details: [
          'Matter.js物理エンジンを使用してリアルな物理シミュレーション（重力、衝突、摩擦、弾性）を実現',
          'タグがコンテナの上から落下し、重力の影響で自然に落下して積み重なる',
          'マウスとタッチでタグをドラッグ可能で、タグ間でリアルな衝突が発生',
          'タグスタイルを簡素化し、色ブロックと装飾を削除し、シンプルなテキストのみのスタイルに変更',
          'タグの占有面積を削減し、タグ密度を向上',
          'レスポンシブレイアウトを最適化し、モバイルデバイスで正常に表示され、他のコンテンツに影響しないことを確認',
          'コンテナスタイルを全体ページスタイルと統一し、テーマ変数を使用',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.4',
    translations: {
      zh: {
        title: 'Header左右边距不对称问题',
        description: '修复Header中左侧Logo与左侧边缘的距离和右侧按钮组合与右侧边缘的距离不一致的历史遗留问题。',
        details: [
          '使用 minmax(0, 1fr) 确保Grid布局中左右列严格等宽',
          '移除Logo和按钮组合的额外margin和padding，确保紧贴边缘',
          '添加 width: fit-content 确保元素紧贴各自列的边缘',
          '在所有响应式断点下保持左右对称',
          '这是一个历史遗留问题，多个版本更新迭代都未修复',
        ],
      },
      en: {
        title: 'Header Left-Right Margin Asymmetry',
        description: 'Fixed historical issue where the distance from left logo to left edge and right button group to right edge were inconsistent.',
        details: [
          'Used minmax(0, 1fr) to ensure strict equal width for left and right columns in Grid layout',
          'Removed extra margin and padding from logo and button group to ensure they align to edges',
          'Added width: fit-content to ensure elements align to their column edges',
          'Maintained left-right symmetry at all responsive breakpoints',
          'This was a historical issue that persisted through multiple version updates',
        ],
      },
      ja: {
        title: 'ヘッダーの左右マージンの非対称性',
        description: '左側のロゴと左端の距離、右側のボタングループと右端の距離が一致しない歴史的な問題を修正しました。',
        details: [
          'minmax(0, 1fr) を使用してGridレイアウトで左右の列の幅を厳密に等しく設定',
          'ロゴとボタングループの余分なマージンとパディングを削除し、端に揃えるように調整',
          'width: fit-content を追加して要素が各列の端に揃うように設定',
          'すべてのレスポンシブブレークポイントで左右対称を維持',
          'これは複数のバージョン更新を経ても修正されなかった歴史的な問題でした',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.3',
    translations: {
      zh: {
        title: '响应式设备上Header按钮排版错乱',
        description: '修复语言切换按钮移到右上角后，在响应式设备上出现的按钮排版错乱问题。',
        details: [
          '优化992px、768px、576px、480px断点的按钮布局',
          '确保按钮在所有断点下都能正确换行和排列，不会重叠或溢出',
          '调整按钮padding和font-size，确保在小屏幕上可读且协调',
          '优化语言菜单在小屏幕上的定位，确保不会超出视口',
          '统一图标按钮和文字按钮的尺寸，保持视觉一致性',
          '改进搜索框在超小屏幕上的显示效果',
        ],
      },
      en: {
        title: 'Header Button Layout Issues on Responsive Devices',
        description: 'Fixed button layout issues on responsive devices after moving language switcher to top-right corner.',
        details: [
          'Optimized button layout for 992px, 768px, 576px, and 480px breakpoints',
          'Ensured buttons wrap correctly and align properly at all breakpoints without overlapping or overflow',
          'Adjusted button padding and font-size for readability and consistency on small screens',
          'Optimized language menu positioning on small screens to prevent viewport overflow',
          'Unified icon button and text button sizes for visual consistency',
          'Improved search box display on extra small screens',
        ],
      },
      ja: {
        title: 'レスポンシブデバイスでのヘッダーボタンのレイアウト問題',
        description: '言語切替ボタンを右上に移動した後、レスポンシブデバイスで発生したボタンのレイアウト問題を修正しました。',
        details: [
          '992px、768px、576px、480pxのブレークポイントでボタンレイアウトを最適化',
          'すべてのブレークポイントでボタンが正しく折り返し、整列し、重なりやオーバーフローが発生しないように調整',
          '小画面での可読性と一貫性のため、ボタンのパディングとフォントサイズを調整',
          '小画面での言語メニューの位置を最適化し、ビューポートを超えないように調整',
          '視覚的一貫性のため、アイコンボタンとテキストボタンのサイズを統一',
          '超小画面での検索ボックスの表示を改善',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.2',
    translations: {
      zh: {
        title: '路由切换时标签位置重置',
        description: '修复切换页面（如更新日志、问题修复等）时，右侧标签浮动位置和动画参数被重置的问题。',
        details: [
          '使用 useMemo 和 useRef 缓存标签位置和动画参数',
          '仅在标签数据真正改变时才重新生成位置',
          '标签签名机制确保相同标签数据使用相同位置',
          '动画参数（持续时间、延迟、方向）持久化，避免每次渲染重新生成',
          '切换页面时标签保持连续浮动，不会中断或重置',
        ],
      },
      en: {
        title: 'Tag Position Reset on Route Change',
        description: 'Fixed issue where tag positions and animation parameters were reset when navigating between pages (e.g., changelog, fixes).',
        details: [
          'Used useMemo and useRef to cache tag positions and animation parameters',
          'Positions regenerate only when tag data actually changes',
          'Tag signature mechanism ensures same tag data uses same positions',
          'Animation parameters (duration, delay, direction) persist across renders',
          'Tags maintain continuous floating animation when switching pages without interruption',
        ],
      },
      ja: {
        title: 'ルート切替時のタグ位置リセット',
        description: 'ページを切り替える際（更新履歴、問題修正など）に、右側のタグの浮遊位置とアニメーションパラメータがリセットされる問題を修正しました。',
        details: [
          'useMemo と useRef を使用してタグ位置とアニメーションパラメータをキャッシュ',
          'タグデータが実際に変更された場合のみ位置を再生成',
          'タグ署名メカニズムにより、同じタグデータは同じ位置を使用',
          'アニメーションパラメータ（継続時間、遅延、方向）を永続化し、毎回のレンダリングで再生成を防止',
          'ページ切替時もタグが連続的に浮遊し、中断やリセットが発生しない',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.1',
    translations: {
      zh: {
        title: '移动端通知下拉菜单显示不全',
        description: '修复移动设备上通知下拉菜单被截断或显示不完整的问题。',
        details: [
          '通知下拉菜单在移动端改为固定定位，确保完全显示在视口内',
          '调整下拉菜单的宽度和位置，适配不同屏幕尺寸',
          '优化通知项的字体大小和内边距，提升移动端可读性',
          '改进最大高度计算，避免内容被底部导航栏遮挡',
          '添加 768px 和 480px 断点的响应式样式',
        ],
      },
      en: {
        title: 'Mobile Notification Dropdown Truncation',
        description: 'Fixed notification dropdown being cut off or incompletely displayed on mobile devices.',
        details: [
          'Changed notification dropdown to fixed positioning on mobile for full visibility',
          'Adjusted dropdown width and position to fit different screen sizes',
          'Optimized notification item font sizes and padding for mobile readability',
          'Improved max-height calculation to prevent content being blocked by bottom navigation',
          'Added responsive styles for 768px and 480px breakpoints',
        ],
      },
      ja: {
        title: 'モバイル通知ドロップダウンの表示不全',
        description: 'モバイルデバイスで通知ドロップダウンが切り詰められたり不完全に表示される問題を修正しました。',
        details: [
          'モバイルで通知ドロップダウンを固定配置に変更し、完全表示を確保',
          'ドロップダウンの幅と位置を調整し、異なる画面サイズに対応',
          '通知項目のフォントサイズと余白を最適化し、モバイルでの可読性を向上',
          '最大高さの計算を改善し、コンテンツが下部ナビゲーションに遮られないように調整',
          '768px と 480px のブレークポイントにレスポンシブスタイルを追加',
        ],
      },
    },
  },
  {
    date: '2025-12-01',
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
    translations: {
      zh: {
        title: '频繁请求导致后端数据加载失败',
        description: '修复用户快速操作（切换排序、搜索、切换分类等）时，请求过于频繁导致后端数据加载不出来的问题。',
        details: [
          '放宽后端速率限制，从 15 分钟内 100 个请求增加到 500 个请求',
          '首页和搜索页面添加防抖（300ms）和节流（500ms最小间隔）机制',
          'API 请求超时时间从 5 秒增加到 10 秒，给后端更多处理时间',
          '优化 429 速率限制错误的处理，提供更友好的错误提示',
        ],
      },
      en: {
        title: 'Rapid Requests Causing Data Loading Failures',
        description: 'Fixed an issue where rapid user actions (sorting, searching, category switching) caused backend data loading failures due to too many requests.',
        details: [
          'Relaxed backend rate limit from 100 to 500 requests per 15 minutes',
          'Added debounce (300ms) and throttle (500ms min interval) on Home and Search pages',
          'Extended API timeout from 5 to 10 seconds for better backend processing',
          'Improved 429 rate limit error handling with clearer user feedback',
        ],
      },
      ja: {
        title: '頻繁なリクエストによるデータ読み込み失敗',
        description: 'ユーザーが素早く操作（並び替え、検索、カテゴリー切替など）した際、リクエストが多すぎてデータが読み込めなくなる問題を修正しました。',
        details: [
          'バックエンドのレート制限を15分間100リクエストから500リクエストに緩和',
          'ホームと検索ページにデバウンス（300ms）とスロットル（最小間隔500ms）を実装',
          'API リクエストのタイムアウトを5秒から10秒に延長し、バックエンドの処理時間を確保',
          '429 レート制限エラーの処理を改善し、より分かりやすいエラーメッセージを提供',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
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
        description: 'Standardized spacing and alignment across breakpoints.',
        details: [
          'Responsive grid keeps cards tidy on desktop and mobile',
          'Reworked typography rhythm for headings, copy, and bullets',
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
    date: '2025-11-13',
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
    date: '2025-11-13',
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
    date: '2025-11-13',
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
    date: '2025-11-13',
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
    date: '2025-11-13',
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
    date: '2025-11-13',
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
    date: '2025-11-13',
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
    date: '2025-11-12',
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

const Fixes = () => {
  const { language } = useLanguage()
  const copy = pageCopy[language] || pageCopy.zh

  const localizedFixes = fixes.map((item) => {
    const translation = item.translations[language] || item.translations.zh
    return {
      date: item.date,
      ...translation,
    }
  })

  return (
    <div className="fixes-page">
      <h1 className="fixes-title">{copy.title}</h1>
      <p className="fixes-subtitle">{copy.subtitle}</p>

      <div className="fixes-list">
        {localizedFixes.map((fix) => (
          <article className="fix-card" key={`${fix.date}-${fix.title}`}>
            <div className="fix-header">
              <span className="fix-date">{fix.date}</span>
              <h2 className="fix-name">{fix.title}</h2>
            </div>
            <p className="fix-desc">{fix.description}</p>
            {fix.details?.length > 0 && (
              <ul className="fix-details">
                {fix.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

export default Fixes


