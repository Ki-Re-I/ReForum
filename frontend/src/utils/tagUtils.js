// 官方称号标识符（支持多语言）
export const OFFICIAL_TAG_KEYS = ['official', '官方', 'Official', '公式']

// 检查是否是官方称号
export const isOfficialTag = (tag) => {
  if (!tag) return false
  return OFFICIAL_TAG_KEYS.includes(tag.trim())
}

// 获取官方称号的显示文本（根据当前语言）
export const getOfficialTagText = (t) => {
  return t('tag.official')
}

