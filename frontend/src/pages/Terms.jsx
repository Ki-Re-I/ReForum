import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import './Terms.css'

const EnglishTerms = () => (
  <div className="terms-page">
    <div className="terms-container">
      <h1 className="terms-title">Terms of Service</h1>
      <div className="terms-content">
        <p className="terms-updated">Last updated: 2025</p>

            <section className="terms-section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                Welcome to the REForum platform. By accessing or using this site, you agree to be
                bound by these Terms of Service. If you do not agree to any part of these terms,
                please do not use the platform.
              </p>
            </section>

            <section className="terms-section">
              <h2>2. Account Registration</h2>
              <p>
                2.1 You must create an account to use certain features of the platform. When
                registering, you agree to provide true, accurate, and complete information.
              </p>
              <p>
                2.2 You are responsible for keeping your account information secure and up to date.
                Do not share your account with others.
              </p>
              <p>
                2.3 You are responsible for all activities that occur under your account.
              </p>
            </section>

            <section className="terms-section">
              <h2>3. User Conduct</h2>
              <p>When using the platform, you agree to:</p>
              <ul>
                <li>Comply with all applicable laws and regulations</li>
                <li>
                  Respect other users and not post insulting, defamatory, threatening, or harassing
                  content
                </li>
                <li>Not post illegal, pornographic, violent, or otherwise inappropriate content</li>
                <li>Not send spam, advertisements, or other unauthorized commercial communications</li>
                <li>Not infringe the intellectual property or other rights of others</li>
                <li>
                  Not attempt to damage, interfere with, or otherwise undermine the security or
                  functionality of the platform
                </li>
              </ul>
            </section>

            <section className="terms-section">
              <h2>4. Content</h2>
              <p>4.1 You are solely responsible for the content you post on the platform.</p>
              <p>
                4.2 You retain all rights to your content, but by posting it, you grant us a
                non-exclusive license to use, display, and distribute the content on the platform.
              </p>
              <p>
                4.3 We reserve the right to remove any content that violates these terms or any
                applicable laws or regulations.
              </p>
            </section>

            <section className="terms-section">
              <h2>5. Intellectual Property</h2>
              <p>
                All content on the platform, including but not limited to text, graphics, logos,
                icons, images, audio, video, and software, is protected by intellectual property
                laws. You may not copy, modify, distribute, or use such content without
                authorization.
              </p>
            </section>

            <section className="terms-section">
              <h2>6. Disclaimer</h2>
              <p>
                6.1 The platform is provided on an &quot;as is&quot; basis without any express or
                implied warranties.
              </p>
              <p>
                6.2 We do not guarantee the accuracy, completeness, or reliability of user-generated
                content.
              </p>
              <p>
                6.3 We are not liable for any direct or indirect damages arising from your use of or
                inability to use the platform.
              </p>
            </section>

            <section className="terms-section">
              <h2>7. Changes and Termination</h2>
              <p>
                7.1 We reserve the right to modify, suspend, or terminate the service at any time,
                without prior notice.
              </p>
              <p>
                7.2 If you violate these terms, we may immediately terminate your account and access
                to the platform.
              </p>
            </section>

            <section className="terms-section">
              <h2>8. Changes to the Terms</h2>
              <p>
                We may update these terms from time to time. Updated terms will be posted on the
                platform. Continued use of the platform means you accept the updated terms.
              </p>
            </section>

            <section className="terms-section">
              <h2>9. Contact Us</h2>
              <p>
                If you have any questions about these terms, please contact us via the{' '}
                <a href="/contact">Contact</a> page.
              </p>
            </section>
      </div>
    </div>
  </div>
)

const JapaneseTerms = () => (
  <div className="terms-page">
    <div className="terms-container">
      <h1 className="terms-title">利用規約</h1>
      <div className="terms-content">
        <p className="terms-updated">最終更新日：2025年</p>

            <section className="terms-section">
              <h2>1. 規約への同意</h2>
              <p>
                REForum（以下「本サービス」）をご利用いただきありがとうございます。本サービスにアクセスまたは利用することで、本利用規約に同意したものとみなされます。
                規約に同意いただけない場合は、本サービスを利用しないでください。
              </p>
            </section>

            <section className="terms-section">
              <h2>2. アカウント登録</h2>
              <p>
                2.1 一部の機能を利用するにはアカウント登録が必要です。登録時には正確かつ最新の情報を提供してください。
              </p>
              <p>
                2.2 アカウント情報の管理はお客様の責任で行ってください。第三者とアカウントを共有しないでください。
              </p>
              <p>
                2.3 アカウントを通じて行われたすべての行為は、お客様の責任となります。
              </p>
            </section>

            <section className="terms-section">
              <h2>3. ユーザー行動</h2>
              <p>本サービスの利用にあたり、ユーザーは次の行為を行わないものとします。</p>
              <ul>
                <li>適用されるすべての法律・規制に違反する行為</li>
                <li>他者を中傷、脅迫、嫌がらせ、差別する行為</li>
                <li>違法、有害、わいせつ、暴力的なコンテンツの投稿</li>
                <li>スパム、広告、その他の無断商業行為</li>
                <li>第三者の知的財産権やその他の権利を侵害する行為</li>
                <li>本サービスのセキュリティや機能を妨害、破壊しようとする行為</li>
              </ul>
            </section>

            <section className="terms-section">
              <h2>4. コンテンツ</h2>
              <p>4.1 ユーザーは、自身が投稿するコンテンツについて一切の責任を負います。</p>
              <p>
                4.2 ユーザーはコンテンツの権利を保持しますが、本サービス上での表示・配信のため、非独占的な利用許諾を当サービスに付与するものとします。
              </p>
              <p>
                4.3 本規約または法令に違反すると当社が判断したコンテンツは、予告なく削除する場合があります。
              </p>
            </section>

            <section className="terms-section">
              <h2>5. 知的財産権</h2>
              <p>
                テキスト、画像、ロゴ、アイコン、ソフトウェアなど、本サービスに含まれるすべてのコンテンツは、知的財産権によって保護されています。
                事前の許可なく複製、改変、配布することはできません。
              </p>
            </section>

            <section className="terms-section">
              <h2>6. 免責事項</h2>
              <p>6.1 本サービスは「現状有姿」で提供され、いかなる保証も行いません。</p>
              <p>
                6.2 ユーザーが投稿したコンテンツの正確性、完全性、有用性について当社は保証しません。
              </p>
              <p>
                6.3 本サービスの利用または利用不能に起因して発生した損害について、当社は一切の責任を負いません。
              </p>
            </section>

            <section className="terms-section">
              <h2>7. サービスの変更および終了</h2>
              <p>
                7.1 当社は、事前の通知なく本サービスの内容を変更、一時停止、または終了する権利を有します。
              </p>
              <p>
                7.2 ユーザーが本規約に違反した場合、当社はアカウントの停止または削除を行うことがあります。
              </p>
            </section>

            <section className="terms-section">
              <h2>8. 規約の変更</h2>
              <p>
                当社は、本規約を随時変更することができます。変更後の規約は本サービス上に掲示した時点から効力を生じます。
                引き続き本サービスを利用することにより、変更後の規約に同意したものとみなされます。
              </p>
            </section>

            <section className="terms-section">
              <h2>9. お問い合わせ</h2>
              <p>
                本規約に関するご質問がある場合は、<a href="/contact">お問い合わせ</a>ページよりご連絡ください。
              </p>
            </section>
      </div>
    </div>
  </div>
)

const ChineseTerms = () => (
  <div className="terms-page">
    <div className="terms-container">
      <h1 className="terms-title">用户协议</h1>
      <div className="terms-content">
        <p className="terms-updated">最后更新：2025年</p>

          <section className="terms-section">
            <h2>1. 接受协议</h2>
            <p>
              欢迎使用 REForum 论坛平台。通过访问和使用本平台，您同意遵守本用户协议的所有条款和条件。
              如果您不同意本协议的任何部分，请不要使用本平台。
            </p>
          </section>

          <section className="terms-section">
            <h2>2. 账户注册</h2>
            <p>
              2.1 您需要注册账户才能使用本平台的某些功能。注册时，您需要提供真实、准确、完整的信息。
            </p>
            <p>
              2.2 您有责任维护账户信息的安全性和准确性。您不得与他人分享您的账户信息。
            </p>
            <p>
              2.3 您对使用您的账户进行的所有活动负责。
            </p>
          </section>

          <section className="terms-section">
            <h2>3. 用户行为规范</h2>
            <p>在使用本平台时，您同意：</p>
            <ul>
              <li>遵守所有适用的法律法规</li>
              <li>尊重其他用户，不发布侮辱、诽谤、威胁或骚扰性内容</li>
              <li>不发布违法、色情、暴力或其他不当内容</li>
              <li>不进行垃圾邮件、广告或其他商业推广活动</li>
              <li>不侵犯他人的知识产权或其他权利</li>
              <li>不尝试破坏、干扰或损害平台的安全性和功能</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>4. 内容发布</h2>
            <p>
              4.1 您对您在本平台上发布的所有内容负责。
            </p>
            <p>
              4.2 您保留对您发布内容的所有权利，但通过发布内容，您授予本平台使用、展示和分发这些内容的非独占许可。
            </p>
            <p>
              4.3 本平台保留删除任何违反本协议或相关法律法规的内容的权利。
            </p>
          </section>

          <section className="terms-section">
            <h2>5. 知识产权</h2>
            <p>
              本平台的所有内容，包括但不限于文本、图形、标识、图标、图像、音频、视频、软件等，均受知识产权法保护。
              未经授权，您不得复制、修改、分发或使用这些内容。
            </p>
          </section>

          <section className="terms-section">
            <h2>6. 免责声明</h2>
            <p>
              6.1 本平台按"现状"提供，不提供任何明示或暗示的保证。
            </p>
            <p>
              6.2 本平台不对用户发布的内容的准确性、完整性或可靠性负责。
            </p>
            <p>
              6.3 本平台不对因使用或无法使用本平台而造成的任何直接或间接损失负责。
            </p>
          </section>

          <section className="terms-section">
            <h2>7. 服务变更和终止</h2>
            <p>
              7.1 本平台保留随时修改、暂停或终止服务的权利，无需事先通知。
            </p>
            <p>
              7.2 如果您违反本协议，本平台有权立即终止您的账户和访问权限。
            </p>
          </section>

          <section className="terms-section">
            <h2>8. 协议修改</h2>
            <p>
              本平台保留随时修改本协议的权利。修改后的协议将在平台上公布。
              继续使用本平台即表示您接受修改后的协议。
            </p>
          </section>

          <section className="terms-section">
            <h2>9. 联系我们</h2>
            <p>
              如果您对本协议有任何疑问，请通过 <a href="/contact">联系我们</a> 页面与我们取得联系。
            </p>
          </section>
      </div>
    </div>
  </div>
)

const Terms = () => {
  const { language } = useLanguage()

  if (language === 'en') {
    return <EnglishTerms />
  }

  if (language === 'ja') {
    return <JapaneseTerms />
  }

  return <ChineseTerms />
}

export default Terms

