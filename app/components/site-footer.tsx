export function SiteFooter() {
  return (
    <footer className="yk-footer">
      <div className="yk-container">
        <div className="space-y-2">
          <div className="">
            <strong>사단법인 한국요가연합회</strong>
            <div>
              경남 창원시 의창구 도계로 41, 일호하이파이데파트 302호(㉾51164)
            </div>
            <div>Tel. (055)724-4144, 4145 | Fax. (055)724-4146</div>
          </div>
          <div className="space-y-2">
            <div>Copyright © 한국요가연합회. All Rights Reserved.</div>
            <div className="flex gap-2 text-sm">
              <a href="/pages/privacy">개인정보처리방침</a> |
              <a href="/pages/provision">이용약관</a> |
              <a href="/pages/noemail">이메일무단수집거부</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
