import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import './Privacy.css'

const EnglishPrivacy = () => (
  <div className="privacy-page">
    <div className="privacy-container">
      <h1 className="privacy-title">Privacy Policy</h1>
      <div className="privacy-content">
        <p className="privacy-updated">Last updated: 2025</p>

            <section className="privacy-section">
              <h2>1. Information We Collect</h2>
              <p>We collect the following types of information:</p>
              <ul>
                <li>
                  <strong>Account information</strong>: username, email address, password (stored
                  in encrypted form)
                </li>
                <li>
                  <strong>Profile information</strong>: avatar, bio and other optional details
                </li>
                <li>
                  <strong>Usage data</strong>: posts, comments, browsing history and interactions on
                  the platform
                </li>
                <li>
                  <strong>Technical data</strong>: IP address, browser type, device information, etc.
                </li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2>2. How We Use Your Information</h2>
              <p>We use the collected information to:</p>
              <ul>
                <li>Provide and maintain the platform</li>
                <li>Process registration and manage user accounts</li>
                <li>Improve user experience and platform features</li>
                <li>Send important notifications and updates</li>
                <li>Prevent fraud and abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2>3. Information Sharing</h2>
              <p>3.1 We do not sell, trade, or rent your personal information to third parties.</p>
              <p>3.2 We may share your information in the following situations:</p>
              <ul>
                <li>With your explicit consent</li>
                <li>To comply with laws, regulations, or legal processes</li>
                <li>To protect our rights, property, or safety</li>
                <li>
                  With service providers (such as email services) solely for the purpose of
                  providing the service
                </li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2>4. Data Security</h2>
              <p>
                4.1 We use reasonable technical and organizational measures to protect your personal
                information.
              </p>
              <p>
                4.2 Your password is stored in encrypted form; we cannot view your original password.
              </p>
              <p>
                4.3 While we strive to protect your data, please be aware that transmission over the
                internet is not 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="privacy-section">
              <h2>5. Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar technologies to:</p>
              <ul>
                <li>Remember your login status</li>
                <li>Save your preferences</li>
                <li>Analyze platform usage</li>
                <li>Improve the quality of our services</li>
              </ul>
              <p>
                You can manage cookies through your browser settings, but this may affect some
                features of the platform.
              </p>
            </section>

            <section className="privacy-section">
              <h2>6. Your Rights</h2>
              <p>You have the following rights regarding your personal information:</p>
              <ul>
                <li>
                  <strong>Access</strong>: request a copy of the personal data we hold about you
                </li>
                <li>
                  <strong>Correction</strong>: correct inaccurate or incomplete information
                </li>
                <li>
                  <strong>Deletion</strong>: request deletion of your personal data
                </li>
                <li>
                  <strong>Withdraw consent</strong>: withdraw consent to processing where applicable
                </li>
              </ul>
              <p>
                To exercise these rights, please contact us via the{' '}
                <a href="/contact">Contact</a> page.
              </p>
            </section>

            <section className="privacy-section">
              <h2>7. Data Retention</h2>
              <p>
                We retain your personal data for as long as your account is active and for a
                reasonable period thereafter to comply with legal obligations, resolve disputes, and
                enforce our agreements.
              </p>
            </section>

            <section className="privacy-section">
              <h2>8. Children&apos;s Privacy</h2>
              <p>
                Our services are intended for users aged 18 and over. We do not knowingly collect
                personal information from children. If you are a parent or guardian and believe we
                have collected information about a child, please contact us.
              </p>
            </section>

            <section className="privacy-section">
              <h2>9. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. The updated policy will be
                posted on the platform with an updated &quot;Last updated&quot; date. Continued use
                of the platform indicates your acceptance of the updated policy.
              </p>
            </section>

            <section className="privacy-section">
              <h2>10. Contact Us</h2>
              <p>
                If you have any questions or concerns about this privacy policy, please contact us
                via the <a href="/contact">Contact</a> page.
              </p>
            </section>
      </div>
    </div>
  </div>
)

const JapanesePrivacy = () => (
  <div className="privacy-page">
    <div className="privacy-container">
      <h1 className="privacy-title">プライバシーポリシー</h1>
      <div className="privacy-content">
        <p className="privacy-updated">最終更新日：2025年</p>

            <section className="privacy-section">
              <h2>1. 収集する情報</h2>
              <p>当サービスでは、次の種類の情報を収集する場合があります。</p>
              <ul>
                <li>
                  <strong>アカウント情報</strong>：ユーザー名、メールアドレス、パスワード（暗号化して保存）
                </li>
                <li>
                  <strong>プロフィール情報</strong>：アイコン、自己紹介など任意で登録された情報
                </li>
                <li>
                  <strong>利用状況データ</strong>：投稿、コメント、閲覧履歴など
                </li>
                <li>
                  <strong>技術情報</strong>：IPアドレス、ブラウザの種類、端末情報など
                </li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2>2. 情報の利用目的</h2>
              <p>収集した情報は、主に次の目的で利用します。</p>
              <ul>
                <li>本サービスの提供および維持</li>
                <li>アカウント登録および管理のため</li>
                <li>ユーザー体験および機能改善のための分析</li>
                <li>重要なお知らせや更新情報の送信</li>
                <li>不正利用や悪用行為の防止</li>
                <li>法令遵守のため</li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2>3. 情報の共有</h2>
              <p>3.1 当社は、ユーザーの個人情報を第三者に販売・貸与することはありません。</p>
              <p>3.2 以下の場合に限り、情報を共有することがあります。</p>
              <ul>
                <li>ユーザー本人の明示的な同意がある場合</li>
                <li>法令や裁判所の命令などに基づく場合</li>
                <li>当社の権利・財産・安全を保護する必要がある場合</li>
                <li>メール配信サービスなどの業務委託先と共有する場合（サービス提供に必要な範囲に限る）</li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2>4. データの安全管理</h2>
              <p>4.1 当社は、適切な技術的・組織的安全管理措置を講じ、個人情報を保護します。</p>
              <p>4.2 パスワードは暗号化して保存しており、平文で閲覧することはできません。</p>
              <p>
                4.3 しかしながら、インターネットを経由した通信は完全な安全性を保証できるものではなく、当社は絶対的な安全性を保証するものではありません。
              </p>
            </section>

            <section className="privacy-section">
              <h2>5. Cookie とトラッキング技術</h2>
              <p>当サービスでは、次の目的で Cookie や類似技術を使用することがあります。</p>
              <ul>
                <li>ログイン状態の維持</li>
                <li>ユーザー設定の保存</li>
                <li>サービス利用状況の分析</li>
                <li>サービス品質の向上</li>
              </ul>
              <p>
                Cookie の利用はブラウザ設定で制限できますが、一部機能が正しく動作しない場合があります。
              </p>
            </section>

            <section className="privacy-section">
              <h2>6. ユーザーの権利</h2>
              <p>ユーザーは、自身の個人情報に関して次の権利を有します。</p>
              <ul>
                <li>
                  <strong>アクセス権</strong>：当社が保有する自身の個人情報を確認する権利
                </li>
                <li>
                  <strong>訂正権</strong>：不正確または不完全な情報を修正する権利
                </li>
                <li>
                  <strong>削除権</strong>：一定の条件下で個人情報の削除を求める権利
                </li>
                <li>
                  <strong>同意の撤回</strong>：同意に基づく処理について同意を撤回する権利
                </li>
              </ul>
              <p>
                これらの権利を行使したい場合は、<a href="/contact">お問い合わせ</a>ページよりご連絡ください。
              </p>
            </section>

            <section className="privacy-section">
              <h2>7. データの保存期間</h2>
              <p>
                当社は、サービス提供期間中およびアカウント削除後も、法的義務の履行や紛争解決、契約の履行に必要な範囲で、一定期間データを保存することがあります。
              </p>
            </section>

            <section className="privacy-section">
              <h2>8. 子どものプライバシー</h2>
              <p>
                本サービスは原則として18歳以上のユーザーを対象としています。当社は、意図的に児童から個人情報を収集しません。
                保護者の方が、お子様の情報が当社に提供された可能性があるとお考えの場合は、速やかにご連絡ください。
              </p>
            </section>

            <section className="privacy-section">
              <h2>9. ポリシーの変更</h2>
              <p>
                当社は、本プライバシーポリシーを随時更新することがあります。変更後のポリシーは本サービス上に掲載され、「最終更新日」を更新します。
                引き続きサービスを利用することで、変更後のポリシーに同意したものとみなされます。
              </p>
            </section>

            <section className="privacy-section">
              <h2>10. お問い合わせ</h2>
              <p>
                本プライバシーポリシーに関するご質問やご不明点がございましたら、
                <a href="/contact">お問い合わせ</a>ページよりご連絡ください。
              </p>
            </section>
      </div>
    </div>
  </div>
)

const ChinesePrivacy = () => (
  <div className="privacy-page">
    <div className="privacy-container">
      <h1 className="privacy-title">隐私政策</h1>
      <div className="privacy-content">
        <p className="privacy-updated">最后更新：2025年</p>

          <section className="privacy-section">
            <h2>1. 信息收集</h2>
            <p>
              我们收集以下类型的信息：
            </p>
            <ul>
              <li><strong>账户信息</strong>：用户名、邮箱地址、密码（加密存储）</li>
              <li><strong>个人资料</strong>：头像、个人简介等可选信息</li>
              <li><strong>使用数据</strong>：您发布的帖子、评论、浏览记录等</li>
              <li><strong>技术信息</strong>：IP地址、浏览器类型、设备信息等</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>2. 信息使用</h2>
            <p>我们使用收集的信息用于：</p>
            <ul>
              <li>提供和维护平台服务</li>
              <li>处理您的注册和账户管理</li>
              <li>改善用户体验和平台功能</li>
              <li>发送重要通知和更新</li>
              <li>防止欺诈和滥用行为</li>
              <li>遵守法律法规要求</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>3. 信息共享</h2>
            <p>
              3.1 我们不会向第三方出售、交易或出租您的个人信息。
            </p>
            <p>
              3.2 我们可能在以下情况下共享您的信息：
            </p>
            <ul>
              <li>获得您的明确同意</li>
              <li>遵守法律法规或法律程序</li>
              <li>保护我们的权利和财产</li>
              <li>与服务提供商共享（如邮件服务），但仅限于提供服务所需</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>4. 数据安全</h2>
            <p>
              4.1 我们采用合理的技术和管理措施保护您的个人信息安全。
            </p>
            <p>
              4.2 您的密码经过加密存储，我们无法直接查看您的原始密码。
            </p>
            <p>
              4.3 尽管我们采取了安全措施，但请注意互联网传输并非100%安全，我们无法保证绝对安全。
            </p>
          </section>

          <section className="privacy-section">
            <h2>5. Cookie 和跟踪技术</h2>
            <p>
              我们使用 Cookie 和类似技术来：
            </p>
            <ul>
              <li>记住您的登录状态</li>
              <li>保存您的偏好设置</li>
              <li>分析平台使用情况</li>
              <li>改善服务质量</li>
            </ul>
            <p>
              您可以通过浏览器设置管理 Cookie，但这可能影响某些功能的正常使用。
            </p>
          </section>

          <section className="privacy-section">
            <h2>6. 您的权利</h2>
            <p>您对自己的个人信息享有以下权利：</p>
            <ul>
              <li><strong>访问权</strong>：查看我们持有的您的个人信息</li>
              <li><strong>更正权</strong>：更正不准确或不完整的信息</li>
              <li><strong>删除权</strong>：请求删除您的个人信息</li>
              <li><strong>撤回同意</strong>：撤回您对信息处理的同意</li>
            </ul>
            <p>
              如需行使这些权利，请通过 <a href="/contact">联系我们</a> 页面与我们联系。
            </p>
          </section>

          <section className="privacy-section">
            <h2>7. 数据保留</h2>
            <p>
              我们会在您使用服务期间保留您的个人信息，并在您删除账户后合理时间内保留，
              以遵守法律义务、解决争议和执行我们的协议。
            </p>
          </section>

          <section className="privacy-section">
            <h2>8. 儿童隐私</h2>
            <p>
              我们的服务面向18岁及以上的用户。我们不会故意收集儿童的个人信息。
              如果您是儿童的父母或监护人，发现我们收集了儿童信息，请立即联系我们。
            </p>
          </section>

          <section className="privacy-section">
            <h2>9. 政策更新</h2>
            <p>
              我们可能会不时更新本隐私政策。更新后的政策将在平台上公布，并更新"最后更新"日期。
              继续使用本平台即表示您接受更新后的政策。
            </p>
          </section>

          <section className="privacy-section">
            <h2>10. 联系我们</h2>
            <p>
              如果您对本隐私政策有任何疑问或担忧，请通过 <a href="/contact">联系我们</a> 页面与我们取得联系。
            </p>
          </section>
      </div>
    </div>
  </div>
)

const Privacy = () => {
  const { language } = useLanguage()

  if (language === 'en') {
    return <EnglishPrivacy />
  }

  if (language === 'ja') {
    return <JapanesePrivacy />
  }

  return <ChinesePrivacy />
}

export default Privacy

