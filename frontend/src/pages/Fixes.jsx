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
    date: '2025-12-03',
    version: '1.7.0',
    issue: 14,
    translations: {
      zh: {
        title: '移动端工具集按钮与工具列表排版统一',
        description:
          '修复移动端“工具集”按钮跟随页面滚动、工具列表覆盖按钮、本行文字与图标对不齐、行间距不一致等一系列排版与交互问题。',
        details: [
          '将移动端“工具集”入口从 Header 结构中抽离，改为挂载到 body，并使用固定定位始终悬浮在屏幕底部中央（类似指纹识别区域）',
          '重写工具集弹窗的打开/关闭逻辑：点击按钮在其上方平滑上滑展开，再次点击按钮或点击遮罩/右上角 X 时带动画下滑收起',
          '统一工具列表中所有按钮的排版：在移动端变体下固定为左侧文字描述、右侧功能图标两列对齐，行与行之间的间隔也保持一致',
          '将移动端主题颜色选择器与通知列表改为居中模态弹窗，背景虚化，避免内容被裁切或超出屏幕',
          '调整工具集窗口右上角关闭按钮的位置与层级，避免被第一行按钮遮挡',
        ],
      },
      en: {
        title: 'Mobile Toolset Button & Tools List Layout Cleanup',
        description:
          'Fixed a series of layout and interaction issues on mobile where the floating toolset button scrolled with the page, the tools panel overlapped the button, and text/icon alignment and spacing were inconsistent.',
        details: [
          'Detached the mobile “Toolset” entry from the header layout and mounted it to the document body with fixed positioning so it always floats at the bottom center of the viewport',
          'Reworked the toolset panel open/close logic so tapping the button slides the panel up above it and tapping the button again, the backdrop, or the close icon plays a smooth slide-down animation',
          'Standardized every tool row inside the panel to a two‑column layout on mobile: text label on the left with flex:1, action icon aligned on the right, with consistent vertical spacing between rows',
          'Converted the mobile theme color picker and notification list into centered modals with blurred backdrops to prevent content from being cut off on small screens',
          'Adjusted the top‑right close “X” position and z‑index so it never overlaps or gets hidden by the first tool row',
        ],
      },
      ja: {
        title: 'モバイル版ツール集ボタンとツール一覧レイアウトの整理',
        description:
          'モバイル環境でツール集ボタンがページと一緒にスクロールしてしまう問題や、ツール一覧がボタンを覆ってしまう問題、各行のテキストとアイコンのズレ・行間の不統一などをまとめて改善しました。',
        details: [
          'モバイルの「ツール集」入口をヘッダー構造から切り離し、body 直下にマウントして `position: fixed` で画面下中央に常に表示されるように変更',
          'ツール集パネルの開閉ロジックを作り直し、ボタンタップでボタン上方向にスライドインし、再度タップや背景・右上の X でスライイドアウトするアニメーションを追加',
          'ツール一覧の各行をモバイル時はすべて「左テキストラベル、右アイコン」の2カラムレイアウトに統一し、行ごとの余白も揃えて読みやすく調整',
          'モバイルのテーマカラー選択と通知一覧を中央モーダル化し、背景をぼかすことで小さな画面でも内容が切れないように改善',
          'ツール集ウィンドウ右上の X ボタンの位置と z-index を調整し、最初の行のボタンに隠れないようにした',
        ],
      },
    },
  },
  {
    date: '2025-12-03',
    version: '1.6.1',
    issue: 13,
    translations: {
      zh: {
        title: '加载动画主题适配与灰色方块残影问题',
        description:
          '修复首页加载动画在切换“整体页面基调”后颜色未同步，以及进度条周围出现灰色方块残影的问题。',
        details: [
          '将 Intro 加载页背景改为直接使用主题背景变量，跟随右上角主题色变化',
          '进度条圆环、百分比文字和 LOADING 文案统一使用主题主色系变量渲染',
          '移除进度条的模糊阴影，消除灰色方块感，视觉更干净',
        ],
      },
      en: {
        title: 'Loading Overlay Theme Sync & Gray Box Artifact',
        description:
          'Fixed the issue where the initial loading animation did not follow the global theme color and showed a gray box around the progress ring.',
        details: [
          'Intro screen background now uses the themed background token so it changes with the global color baseline',
          'Progress ring, percentage text, and LOADING label all render with theme-driven primary colors',
          'Removed the blur shadow around the ring to eliminate the gray block artifact and keep visuals clean',
        ],
      },
      ja: {
        title: 'ロードアニメーションのテーマ連動とグレーボックス残像の修正',
        description:
          '「全体のカラー基調」を変更してもロードアニメーションの色が追従せず、進捗リングの周りにグレーの四角い残像が出ていた問題を修正しました。',
        details: [
          'イントロロード画面の背景をテーマ背景トークンに切り替え、右上のテーマ色変更に連動',
          '進捗リング・パーセンテージ表示・LOADING テキストをテーマのプライマリカラーで描画',
          'リング周辺のぼかしシャドウを削除し、グレーの四角い残像をなくしてスッキリした見た目に調整',
        ],
      },
    },
  },
  {
    date: '2025-12-03',
    version: '1.6.1',
    issue: 12,
    translations: {
      zh: {
        title: '更新日志最新条目日期缺失与徽章对比度低',
        description: '修复更新日志页面“最新更新”区域没有显示发布日期、且“更新”徽章在浅色背景下难以辨认的问题。',
        details: [
          '在“最新更新”标题旁展示符合当前语言格式的发布日期',
          '“更新/Update”徽章改为高对比度的胶囊样式，明暗主题都能清晰辨认',
          '日期标签重新设计为渐变芯片风格，整体视觉更现代',
        ],
      },
      en: {
        title: 'Changelog Latest Block Date & Badge Contrast',
        description:
          'Fixed the issue where the changelog’s “Latest Updates” block failed to show the release date and the Update badge looked washed out.',
        details: [
          'Shows the release date next to the heading in the correct locale format',
          'Gives the “Update” badge a high-contrast pill design that works in light/dark themes',
          'Refreshes the date chip styling with a modern gradient treatment',
        ],
      },
      ja: {
        title: '更新履歴の最新セクションでの日付表示とバッジ視認性',
        description:
          '更新履歴ページの「最新の更新」ブロックに日付が表示されず、アップデートバッジのコントラストが低かった問題を修正しました。',
        details: [
          '見出し横に現在の言語フォーマットで公開日を表示',
          '「更新/Update」バッジを高コントラストのピル形状に刷新し、ライト/ダーク両テーマで読みやすく調整',
          '日付チップをグラデーションを使ったモダンなスタイルに再設計',
        ],
      },
    },
  },
  {
    date: '2025-12-03',
    version: '1.5.10',
    issue: 11,
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
    issue: 10,
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
    issue: [5, 6],
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
    issue: 8,
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
    issue: 7,
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
    issue: 6,
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
    issue: 5,
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
    issue: 1,
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
    version: '1.4.0',
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
    version: '1.4.0',
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
    version: '1.4.0',
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
    version: '1.4.0',
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
    version: '1.4.0',
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
    version: '1.4.0',
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
    version: '1.4.0',
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
    version: '1.4.0',
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
    version: '1.3.0',
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


