export function SiteFooter() {
  return (
    <footer className="yk-footer">
      <div className="yk-container text-sm md:text-base flex justify-between">
        <div className="space-y-2">
          <div className="">
            <strong>사단법인 한국요가연합회</strong>
            <div>
              경남 창원시 의창구 도계로 41, 일호하이파이데파트 302호(㉾51164)
            </div>
            <div>Tel. (055)724-4144, 4145 | Fax. (055)724-4146</div>
          </div>
          <div className="space-y-2">
            <div>Copyright © 사단법인 한국요가연합회. All Rights Reserved.</div>
            <div className="flex gap-2 text-sm text-yellow-400">
              <a href="/about/greetings">About Us</a> |
              <a href="/about/contactus">Contact Us</a> |
              <a href="/pages/privacy">개인정보처리방침</a> |
              {/* <a href="/pages/provision">이용약관</a> | */}
              <a href="/pages/noemail">이메일무단수집거부</a> 
            </div>
          </div>
        </div>
        <div>
          <p className="w-100 font-thin mb-2">
            "수행과 교육중심" 의 한국요가연합회는 고전의 전통요가를 이어 현대적
            요가의 융합과 발전을 통해 "한국요가의 세계화" 를 위해 노력하고
            있습니다.
          </p>
          <div className="flex gap-2">
            <a href="https://www.band.us/band/53408297/post" target="_blank">
              <img
                src="/images/icon-band.png"
                alt="네이버밴드"
                className="w-6 h-6"
              />
            </a>
            <a href="https://www.instagram.com/yoga.korea/" target="_blank">
              <img
                src="/images/icon-insta.png"
                alt="인스타그램"
                className="w-6 h-6"
              />
            </a>
            <a href="http://pf.kakao.com/_hxiCxhs" target="_blank">
              <img
                src="/images/icon-kakao.png"
                alt="카카오채널"
                className="w-6 h-6"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
