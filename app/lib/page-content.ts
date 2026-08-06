/** Eyoom 페이지 HTML (public_html/eyoom/theme/basic2/page 기반) — scripts/import-eyoom-pages.mjs 로 생성 */
import swami from "~/assets/images/swami.png";
import member_id from "~/assets/images/member_in.gif";

export const pageContent: Record<string, string> = {
  greetings: `
<style>
p {
    margin: 20px 0;
    text-align: justify;
}
</style>
<div class="greetings hte-pages">
    <div class="tab-e2 margin-top-30">
        <div class="tag-box tag-box-e3">
            <div class="row">
                <div class="col-sm-1">
                    &nbsp;
                </div>
                <div class="col-sm-3">
                    <div class="sub-img" style="margin-top: 24px;">
                        <img src="/site-assets/img/chief-2025.jpg" alt="" class="img-responsive" >
                    </div>
                </div>
                <div class="col-sm-7">
                    <!-- <blockquote>
                        <h2>" sat, cit, ananda "</h2>
                        <p><em>생명이 존재하는 것은 의식이 있고, <br>의식이 있는 존재는 행복을 추구한다.</em></p>
                    </blockquote> -->
<p>안녕하세요.<br/>
(사)한국요가연합회 10대(2025~2027) 회장 김성홍입니다.<br/>
연합회 회원님들과 연합회를 방문하는 모든 분들께 인사를 드립니다.</p>

<p>한국요가연합회는 1990년 초에 수행의 향기를 피우는 요가인들의 작은 모임에서 시작하여, 2000년 (사) 한국요가연합회로 법인이 설립되고 벌써 10대의 회장 임기를 시작하게 되었습니다. 그동안 여러 문제를 모두가 합심하여 잘 극복하고 건실한 단체로 발전했지만, 코로나 팬더믹의 사회적 문제와 내부의 여러 사정으로 위축된 것도 부정할 수 없습니다.</p>

<p>사회적 환경이 어렵지만 설립 초기부터 연합회의 실무자로 참여한 사람으로서 많은 고민도 하였습니다. 80년대 초에 요가에 입문하며 "젊은 요가인들이 평생 몸담을 조직을 만들어 달라"고 선배들에게 당돌하게 말했던 것이 또 다른 업보가 되어 전면에 나서게 된것입니다. "수행과 교육중심"이란 연합의 목적에 적합하게 활동하여 회원님들의 유대감을 회복하고 산학의 입력과 사회적 위상을 높이는 것에 매진하고자 합니다.</p>

<p>다시 한번 초심의 열정으로 (사)한국 요가연합회의 위상과 회원님들이 만족하는 단체의 초석을 만들겠습니다. 흔들리지 않는 기초를 세우고 수행의 향기가 피어나는 연합회가 되기 위해서는 임원진과 회장이 회원들에 모범이 될 수 있는 자발적 행동을 할 수 있도록 할 것이며, 자유로운 의견의 개진과 발전을 위한 소통의 공간을 만들겠습니다. 또한 시대에 앞서가는 선도적 교육 개발과 회원님들이 역량개발에 교육적 비중을 높일 것입니다.</p>

<p>한국요가연합회의 주인이라는 의식의 변화를 통해 회원님들의 적극적 동참을 요청드립니다. 늘 수행의 향기가 피어나는 단체를 만들어 수행의 아름다움을 함께 나누어 가겠습니다.</p>

<p>2025년 1월 18일</p>

<p>(사)한국요가연합회 회장 김성홍</p>
                    <!-- <p>안녕하세요. <br />
                        한국요가연합회 회원 여러분 반갑습니다.<br />
                        제 9 대 회장 강병익입니다.</p>
                    <p>코로나 팬데믹과 사회적 혼란 등으로 많은 어려움을 겪고 있는 시대입니다.<br />
                        더불어 비대면 등으로 소통이 줄어들면서 불안과 우울증 등이 심각해지고 있습니다. 그런 심리적 현상은 많은 사건 사고로 이어지고 있습니다. 이럴 때일수록 몸과 마음을 더욱 잘 챙기고 세상을 밝히는 지혜로운 요가인이 되시길 바랍니다.</p>
                    <p>많은 분들이 축하와 함께 우려와 격려의 말씀을 해주십니다.<br />
                        모두가 다 같은 심정인 것 같습니다. 그 마음들을 잘 모아서 이 시절을 살아가는데 모범이 되고, 많은 사람들에게, 한국을 넘어 세계인의 건강과 평화를 위한 협회가 될 수 있기를 소망해 봅니다.<Br />
                        이 자리를 빌어 다시 한번 감사드리며, 계속적인 관심과 참여로 함께해 주시길 바랍니다.</p>
                    <p>회원과 협회가 다 같이 안정되고 발전할 수 있도록 연구하고 실천하는 집행부가 되겠습니다.<br />
                        조직 구성에서부터 운영 방향과 방안 등 모든 면에서 민주적인 방식으로 최선의 지혜를 발휘할 것입니다. 그러기 위해 여러분들께서도 소중한 힘을 모아주시기 바랍니다. 어떠한 의견도 좋습니다. 귀를 열어놓고 가능한 많은 의견을 듣는 것으로부터 시작하겠습니다.</p>
                    <p>그리고 회원 여러분들의 가치를 높이는데 노력할 것입니다.<br />
                        교육과 수행 중심이라는 슬로건에 맞게 질 높은 교육과 수행을 할 수 있는 기회를 마련하고자 합니다. 여러분의 발전이 연합회의 발전으로, 연합회의 발전이 회원 개개인의 발전이 될 수 있기를 바랍니다.</p>
                    <p>여러분의 삶이 더 건강하고, 더 행복하고, 더 평화롭기를 진심으로 기원합니다.<br />
                        성심을 다해 회장의 임무를 다하겠습니다.<br />
                        감사합니다.</p>
                    <p style="text-align: right;">2022년 1월 16일<br />
                        강병익 합장.</p> -->
                    <!--
                    <p> &nbsp;(사)한국요가연합회는 1990년대 요가인들이 요가발전을 위하여 모임을 시작한 것이 현재 연합회의 모태이며, 끊임없는 수행과 교육중심으로 열정과 노력이 깃들어있는 단체입니다.<br> &nbsp;요가는 끊임없이 욕망을 향하여 움직이는 마음을 영혼의 자리에 다다르게 하여 본래의 모습으로 회복하는 것이며, 요가로 하여금 내 몸과 마음의 변화를 바라보면서 일상에서 늘 깨어있는 삶으로 살아가실 수 있도록 행복을 전하는 안내자가 되겠습니다.</p><br>
                    <p> &nbsp;(사)한국요가연합회는 모든 분들이 요가에 비전을 느낄 수 있는 미래를 만들고자합니다. 고전의 전통요가와 현대요가에 그치지 않고, 인간의 삶을 풍요롭게 하고, 사회, 육체, 정신, 영혼으로서 삶을 살 수 있도록 미래에 기여하는 단체가 되도록 노력하겠습니다.<p> &nbsp;더불어 주기적인 교육기관장 및 원장님들의 교육을 통해 지도자과정의 교육자들의 차별화된 전문적 지식 전달에 힘쓸 것이며, 분기별로 실시하는 원장단 워크숍 교육을 통해 대한민국에서 가장 뛰어난 교육기관장 배출에 더욱 노력할 것입니다.<br> &nbsp;현실에 맞는 새로운 프로그램을 개발 및 보급하여 요가원을 운영하는 원장님 뿐만 아니라 수업을 진행하는 (사)한국요가연합회 전회원님들이 요람에서 무덤까지 잘 태어나고, 행복한 삶을 영위하다 아름다운 죽음에 이르기까지 요가 교육에 정진하겠습니다.</p><br>
                        <p> &nbsp;'(사)한국요가연합회'를 삶에서 꼭 필요한 몸, 의식, 영혼 수련의 본질적인 안내자로 키우는데 관련 사업을 더욱 부흥시키며 앞장서겠습니다.</p><br>
                        <p align="right">감사합니다.<br><br>
                            협회장 &nbsp;&nbsp;&nbsp;이 인 승 </p>
-->
                    <br><br><br>
                </div>
            </div>
        </div>
        <blockquote class="hero hero-dark text-center">
            <p><em>"생명이 존재하는 것은 의식이 있고, 의식이 있는 존재는 행복을 추구한다"</em></p>
            <small><em>사단법인 한국요가연합회</em></small>
        </blockquote>
    </div>
</div>
<style>
.greetings h4 {
    font-size: 16px;
    font-weight: 600
}
</style>
`,

  swami: `
<div class="greetings hte-pages">  
<div class="tab-e2 margin-top-30"> 
<div class="tag-box tag-box-e3"> 	
				
		<div class="row">	
		<div class="col-md-10">		
    <div class="lg:flex lg:gap-4">
      <img src="${swami}" alt="swami" class="img-responsive">
      <div class=" text-green-600 text-xl p-12 font-bold">
      <p>요가연합회는 배우고 배운것을 수행하고 실천하는 단체입니다.</p>
      <p>수행을 통해서 악업에서 벗어나 자유롭고 평화롭고 풍요로운 삶이 되기를 소망합니다.</p>
      </div>
      </div>
			<p><br>예수라는 분이 계셨습니다.<br>그의 아버지는 목수이고 어머니는 시골 여인이었습니다.<br>그 아들은 지혜가 출중하며 열두 살이라 당시 종교 지도자들을 놀라게 하였습니다.<br> 그러던 어느 날 그 소년은 홀연히 자취를 감춥니다. 그리고 18년이 지난 어느 날 갈릴리에 나타났습니다.<br> 사람의 아들인 자신이 하늘에서 왔다고 선언합니다. 그 선언은 복음이며 기쁜 소식이었습니다.<br> 종교 지도자들은 분노했고 민중들은 환호 했습니다. 웅장하고 화려한 성전 안에 갇혀 있는 하늘을 민중들은 만날 수 없었습니다.<br> 극히 제한 된 특권 사제들의 독점물이었습니다. “사람의 아들이 하늘의 아들이다”라는 선언은 그들에게 신성모독이며 민중들은 해방(자유)이었습니다.<br> 나는 이 예수님을 참으로 좋아했습니다. 그러나 그 분이 깨달은 하늘이 내 안에 내가 하늘 안에 있다는 사실을 알아차리지 못하고 헤매고 다녔습니다. </p><br>
			<p>그 때 나에게 요가는 운명적으로 찾아왔습니다.<br>요가를 통해서 하늘은 무엇이며 나는 어디서 왔으며 어떤 존재이며 어디로 가는지를 제시해 주었고, 근원인 불명성의 하늘과 만나는 행법을 제시해 주었습니다.<br> 수행을 통해 하늘과 하나가 되는 깨달음에 이르게 되었습니다.<br> 나는 2016년 7월 9일 분에 넘치는 스와미 추대를 받았습니다.<br> 내겐 한없는 광영이지만 무거운 책무를 느낍니다. 모든 존재들이 하늘에게 왔고 그래서 귀중한 존재들이기에 앞으로 남은 날 육신을 벗는 날까지 현현한 모든 존재들을 사랑하고 헌신하는 수행을 게을리 하지 않겠습니다.</p><br>
			<p>요가연합회는 배우고 배운 것을 수행하고 실천하는 단체입니다.<br> 수행을 통해서 악업에서 벗어나 자유롭고 평화롭고 풍요로운 삶이되기를 소망합니다. <br>요가를 배우고 수행하는 모든 도반 여러분들과 연합회를 이끌어 가시는 이사님들, 그리고 회장단 모두에게 진심으로 고마운 마음을 전합니다.</p><br>
<p align="right">옴 샨띠 샨띠 샨띠<br>
스와미 석류</p> <br><br><br>
		</div>
	</div>
</div>
	<blockquote class="hero hero-dark text-center">
	       <p><em>"언제나 함께 나누고 수행의 향기가 피어나는 아름다운 전통을 만들어 가겠습니다."</em></p>
	       <small><em>사단법인 한국요가연합회</em></small>
	</blockquote>	
<style>
.greetings h4 {font-size: 16px;font-weight: 600} 
</style>
`,

  history: `
<div class="sub-main history">
    <div class="tab-e1 margin-top-30">
        <div class="tag-box tag-box-e3">
            <span class="text-highlights text-highlights-green">명칭</span>
            <p>사단법인 한국요가연합회라 칭하며,영문명은 KOREA YOGA FEDERATION으로 표기한다.</p>
            <br>
            <span class="text-highlights text-highlights-green">목적</span>
            <p>본회는 수행공동체로서 요가의 본질을 찾기 위한 교육과 지도자 양성, 요가의 저변확대, 요가의 토착화를 지향한다.<br>
                또한 모든 존재의 평화를 위해 수행에 정진하며 깨달음으로 나아감을 목적으로 한다.</p>
        </div>
        <div>
            <ul class="nav nav-tabs">
                <li class="active"><a href="#tab-3" data-toggle="tab">2020년대</a></li>
                <li><a href="#tab-4" data-toggle="tab">2010년대</a></li>
                <li><a href="#tab-5" data-toggle="tab">2000년대</a></li>
                <li><a href="#tab-6" data-toggle="tab">1990년대</a></li>
            </ul>
            <div class="tab-content padding-all-15">
                <div class="tab-pane fade in active" id="tab-3">
                    <h3>2025</h3>

                    <p><strong>2025년 10대 회장 선임 및 본부 집행부 재구성</strong></p>

                    <span class="color-green">회장 김성홍 취임<br/>명예회장 강병익 추대</span>

                    <ul style="word-break: keep-all;">
                        <li>회장 : 김성홍</li>
                        <li>부회장 : 수석 박정애, 김동환, 김안득, 김영옥, 장지영</li>
                        <li>웰니스분과 : 김동환 부회장<br/>분과이사 : 김민선, 허은실</li>
                        <li>교육분과 : 장지영 부회장<br/>분과이사 : 전인숙, 심준보, 김태희, 유명선</li>
                        <li>조직분과 : 김영옥 부회장<br/>분과이사 : 임덕</li>
                        <li>홍보분과 : 김안득 부회장<br/>분과이사 : 반창용</li>
                        <li>출제분과 : 김재민 이사 <br/>분과이사 : 성호정, 조남주</li>
                        <li>심사분과 : 이광진 이사<br/>분과이사 : 조동현, 박정애, 김재민, 김안득, 이미애</li>
                        <li>본부이사 : 김경전, 김나경, 김유진, 박신애, 박효정, 신지윤, 오성희, 유명아, 이미숙, 이태환, 이한석, 정수아, 정평둘, 한외순, 이영순   </li>
                    </ul>

                    <p>&nbsp;</p>
















                    <h3>2022</h3>
                    <p><strong>2022년 9대 회장 선임 및 본부 집행부 재 구성</strong></p>
                    <span class="color-green">회장 강병익 취임<br>명예회장 김성홍 추대</span>
                    <ul>
                        <li>회장 : 강병익</li>
                        <li>부회장 : 수석 박신애, 이미숙, 이현정, 장지영, 최도향</li>
                        <li>교육분과 : 위원장-이현정, <br />
                            분과이사-박다유, 박효정, 서은채, 이미숙, 이은경, 이현정, 장숙희 <br />
                            분과위원이사-성다움, 전인숙, 최혜림</li>
                        <li>기획(홍보)분과 : 위원장–이선근<br />
                            분과이사–김도하, 이장희, 윤수정, 정수아, 최도향<br />
                            분과위원–양해진</li>
                        <li>대외(협력)분과 : 위원장–양희연 <br />
                            분과이사–강령아, 김안득, 박정애, 조외숙</li>
                        <li>심사분과 : 위원장–조동현 <br />
                            분과이사–김영옥, 박신애, 유명아, 이미숙, 이미애, 장지영, 조선제, 한외순<br />
                            분과위원–홍영기</li>
                        <li>일반분과이사 : 김인숙, 송승리, 정윤애, 현명복</li>
                        <li>출제위원장 : 이한석</li>
                    </ul>
                </div>
                <div class="tab-pane fade in" id="tab-4">
                    <h3>2019</h3>
                    <p><strong>2019년 8대 회장 선임 및 본부 집행부 재구성</strong></p>
                    <span class="color-green">회장 이인승 취임<br>명예회장 김성홍 추대</span>
                    <ul>
                        <li>회장 : 이인승</li>
                        <li>부회장 : 수석부회장-이광진, 교육·철학메디분과-강병익, 대외협력분과-박정애, 시니어PR개발분과-류민수, 생활체육분과-윤경숙, 조직분과-김영옥</li>
                        <li>중앙연수원장 : 이형록</li>
                        <li>교육위원장 : 강병익</li>
                        <li>심사위원장 : 이한석</li>
                        <li>출제위원장 : 심준보</li>
                        <li>연합회 권역별 이사 : 서울수도권회장-김영옥, 강원권회장-홍영기, 경남권회장-정순규, 경북권회장-양민희, 광주·전남권회장-박효정, 부산권회장-최도향, 전북권회장-장지영, 충청권회장-지혜정, 울산권회장-이선근, 대구권회장-조남구, 제주권회장-이미숙</li>
                        <li>분과별 이사 : 총괄이사-문종대, 중앙연수원-조선제, 백승혜, 교육·철학메디분과-정영자, 김용량, 박승태, 이준희, 김동환, 성호정, 시니어프로그램개발분화-최도향, 이태환, 박효정, 차달남, 최옥희, 생활체육분화-김옥단, 조직분과-권역이사와 이하 동일</li>
                        <li>심사위원(이사) : 서울위원-김영옥, 서울부위원-이광진, 박신애, 홍영기, 이현정, 경남위원-최도향, 경남부위원-정유찬, 김안득, 박정애, 이선근, 제주위원-신지윤</li>
                        <li>심화교육강사 : 이인승, 강병익, 이형록, 김옥단, 이태환, 이윤선, 허은실, 임승택, 조동현, 박종원
                        </li>
                    </ul><br>
                    <h3>2016</h3>
                    <p><strong>2016년 7대 회장 선임 및 본부 집행부 재구성</strong></p>
                    <span class="color-green">회장 김성홍 취임<br>명예회장 신석규 추대</span>
                    <ul>
                        <li>부회장 : 총괄-이인승, 교육메디분과-김동환, 교육철학분과-김재민, 조직분과-김영옥, 대외협력-박정애, 요가연맹-이광진, 생활체육-이한석<br>감사 : 임정진, 류민수</li>
                        <li>중앙연수원장 :</li>
                        <li>연합회 권역 이사 : 강원권회장-김영기, 경북권회장-박선이, 서울수도권회장-김영옥, 영남권회장-조동현, 울산권회장-김윤경, 제주권회장-신지윤, 충청권회장-이현정, 호남권회장-장지영, 대구권회장-김안득</li>
                        <li>분과별 이사 : 총괄-허은실, 교육철학-강병익, 김명순, 심준보, 이형록, 정영자, 성호정, 교육메디-김용량, 박승태, 박제민, 이준희, 조남주, 대외협력 학회-정순규, 홍보-이선근, 해외협력-양희연, 협동조합협력-구우식, 최옥희, 요가연맹 김형식, 정윤애, 최도향, 현명복 생활체육-김옥단, 박신애, 이현정, 홍영기, 조직분과-권역이사와 동일</li>
                        <li>심사위원장 : 조동현</li>
                        <li>출제위원장 : 심준보</li>
                    </ul><br>
                    <h3>2013</h3>
                    <p><strong>2013년 6대 회장 선임 및 본부 집행부 재구성</strong></p>
                    <span class="color-green">회장 김성홍 취임<br>명예회장 신석규 추대</span>
                    <ul>
                        <li>부회장 : 김영옥, 박정애</br>감사 : 김정란, 이종욱<br>
                            2014년 감사변경 사항 : 이종욱, 임정진</li>
                        <li>중앙연수원장 :</li>
                        <li>연합회 권역 이사 : 강원권 회장 이장희, 경북권 회장 박선이, 서울 수도권 회장 이광진, 영남권 회장 이한석, 울산권 회장 김영희, 제주권 회장 신지윤, 충청권 회장 이현정, 호남권 회장 류민수<br>2014년 연합회 권역이사 변경사항 : 대구권 회장 김안득<br>2015년 연합회 권역이사 변경사항 : 울산권 회장 김윤경</li>
                        <li>실무 이사 : 교육이사 김재민, 문화이사 이선근, 보건이사 김동환, 복지이사 박신애, 심사이사 이인승, 총무이사 전지현, 출판이사 정순규, 학술이사 심준보, 해외이사 강병익<br>2015년 연합회 실무이사 변경사항 : 교육이사 김재민, 문화이사 이선근, 보건이사 김동환, 복지이사 박신애, 심사이사 이인승, 총무이사 허은실, 출판이사 정순규, 학술이사 심준보, 해외이사 강병익, 대외협력이사 김옥단, 박승태, 조동현, 장지영, 홍영기, 현명복, 최도향</li>
                    </ul><br>
                    <h3>2011</h3>
                    <p><strong>2011년 5대 회장 선임 및 본부 집행부 재구성</strong></p>
                    <span class="color-green">회장 신석규 취임<br>명예회장 손진국, 김성홍 추대</span>
                    <ul>
                        <li>부회장 : 이광진<br>감사 : 김형식, 류민수</li>
                        <li>중앙연수원장 :</li>
                        <li>연합회 권역 이사 : 서울 수도권 이선근, 충청권 회장 이현정, 경북권 회장 박신애 호남권 회장 박정애 강원권 회장 홍영기, 영남권 회장 이한석 제주권 회장 서관협</li>
                        <li>실무 이사 : 수석이사 이인승, 교육/기획이사 강병익, 국제교류 이형록, 업무이사 조동현, 홍보/마케팅 이선근, 회원/복지 이사 김영옥</li>
                    </ul>
                    <span class="color-green">한국직업능력개발원 민간자격재등록 요가지도자 특,1,2,3급 (제2008-0095호)<br>한국직업능력개발원 민간자격재등록 실버요가지도자 1,2급 (제2008-0096호)<br>한국직업능력개발원 민간자격재등록 어린이요가지도자 1,2급 (제2008-0097호)</span><br><br>
                    <h3>2010</h3>
                    <p><strong>2010년 4대 회장 선임 및 본부 집행부 재구성</strong></p>
                    <span class="color-green">회장 손진국 취임<br>명예회장 김성홍 추대</span>
                    <ul>
                        <li>부회장 : 이광진<br>감사 : 김형식, 류민수</li>
                        <li>중앙연수원장 : 신석규</li>
                        <li>연합회 권역 이사 : 서울 수도권 김영옥, 충청권 회장 이현정, 경북권 회장 박신애, 호남권 회장 박정애 강원권 회장 홍영기, 영남권 회장 이한석, 제주권 회장 서관협</li>
                        <li>실무 이사 : 수석이사 이인승, 교육/기획이사 강병익, 국제교류 이형록, 업무이사 조동현, 홍보/마케팅 이선근, 회원/복지 이사 김영옥</li>
                    </ul>
                    <span class="color-green">한국직업능력개발원 민간자격등록 임산부요가지도자 1,2급 (제2010-0131호)</span><br>
                </div>
                <div class="tab-pane fade in" id="tab-5">
                    <h3>2008</h3>
                    <p><strong>2008년 3대 회장 선임 및 본부 집행부 재구성</strong></p>
                    <span class="color-green">회장 김성홍 취임<br>명예회장 신석규, 안승준 추대</span>
                    <ul>
                        <li>연합회 권역 : 서울권 회장 곽민성, 경기권 회장 이병국, 안산권 회장 김정란, 충청권 회장 이현정, 호남권 회장 박정애, 경북권 회장 박신애, 영남권 회장 이인승, 제주권 회장 현해남</li>
                        <li>2008년도 기구 조직 개편<br>감사 : 이광진, 유민수<br>이사 : 대표이사 김성홍, 이사 손진국, 이사 이병국, 이사 임정진, 이사 이인승, 이사 박신애, 이사 이한석, 이사 이선근</li>
                        <span class="color-green">한국직업능력개발원 민간자격등록 요가지도자 특,1,2,3급 (제2008-0095호)<br>한국직업능력개발원 민간자격등록 실버요가지도자 1,2급 (제2008-0096호)<br>한국직업능력개발원 민간자격등록 어린이요가지도자 1,2급 (제2008-0097호)</span>
                    </ul><br>
                    <h3>2007</h3>
                    <p><strong>2007년 2대 회장 선임 및 본부 집행부 재구성</strong></p>
                    <span class="color-green">회장 안승준 취임<br>명예회장 신석규 추대</span>
                    <ul>
                        <li>연합회 권역 통합 : 서울권 회장 곽민성, 경기권 회장 이병국, 안산권 회장 이순예, 중부권 회장 조삼숙, 호남권 회장 박정애, 경북권 회장 박신애, 영남권 회장 이인승, 제주권 회장 현해남</li>
                        <li>2007년도 기구 조직 개편<br>감사 : 양해진, 정영자<br>이사 : 대표이사 안승준, 이사 강완구, 이사 손진국, 이사 김성홍, 이사 유태희, 이사 임정진, 이사 이인승, 이사 박신애, 이사 조삼숙, 이사 곽민성</li>
                    </ul><br>
                    <h3>2004</h3>
                    <p><strong>2004년 1대 회장 선임 및 사단법인 한국요가연합회 법인 등재 및 명칭 변경</strong></p>
                    <span class="color-green">회장 신석규 취임<br>명예회장 정강주 추대</span>
                    <ul>
                        <li>본부 집행부 재구성 : 도정 정태혁, 명예회장 정강주, 회장 신석규, 상임 부회장 강완구, 부회장 각권역회장, 이사 각권역회장 기획국장 김성홍, 사무국장 이병국, 재무국장 최우영, 교육국장 임승택, 홍보국장 임정진, 간사 김영주</li>
                        <li>본부직할, 서울권, 경기권, 안산권, 충청권, 호남권, 경북권, 영남권으로 재편성<br>서울권 회장 강완구, 경기권 회장 박자방, 안산권 회장 김정란, 충청권 회장 김경희,호남권 회장 문병희, 경북권 회장 박신애, 영남권 회장 박현국</li>
                        <li>2005년도 기구 조직 개편<br>회장(이사장) : 신석규, 부회장 : 각권역 회장(본부이사)<br>이사 : 강완구(서울권), 박자방(경기권), 김정란(안산권), 김경희(충청권), 문병희(호남권), 박신애(경북권), 박현국(영남권), 이형록(해외담당)<br>감사 : 심준보, 최도향</li>
                    </ul>
                    <span class="color-green">한국직업능력개발원 민간자격등록 임산부요가지도자 1,2급 (제2010-0131호)</span><br><br>
                    <h3>2003(한국요가지도자연합회)</h3>
                    <p><strong>2003년 본부임원 재구성 및 지역연합회 확대</strong></p>
                    <span class="color-green">본부임원 재구성 및 5국 확대</span>
                    <ul>
                        <li>회장 정강주, 상임부회장 안승준, 부회장 (이사)각지역 연합회장, 감사 김옥단, 기획국장 김성홍, 사무국장 이병국, 재무국장 최우영, 교육국장 임승택, 홍보국장 임정진, 간사 김성민</li>
                        <li>지역연합회 확대<br>서울권 회장 안승준, 수도권 회장 박자방, 안산 요가연합회 회장 김연자, 충청 요가연합회 회장 김경희, 호남권 회장 문병희, 영남 살림요가회 박현국, 경북 요가연합회 회장 박신애</li>
                    </ul><br>
                    <h3>2002(한국요가지도자연합회)</h3>
                    <p><strong>2002년 2대 회장 정강주 추대</strong></p>
                    <ul>
                        <li>본부임원구성 : 회장 정강주, 부회장 각권역 회장, 감사 김옥단, 기획국장 김성홍, 사무국장 정월훈, 재무국장 이병국</li>
                        <li>권역 구분 : 서울권 회장 이태영 , 영남권 회장 이철용</li>
                    </ul><br>
                    <h3>1999(한국요가지도자연합회)</h3>
                    <p><strong>권역 구분 : 서울권 회장 이태영 , 영남권 회장 이철용</strong></p>
                    <span class="color-green">초대회장 정강주, 총무 강병익</span><br>
                </div>
                <div class="tab-pane fade in" id="tab-6">
                    <h3>1990 ~ 1999</h3>
                    <span class="color-green">영남권역의 요가인들이 친목과 요가 발전을 위하여 모임을 시작한 것이 살림요가회이다.<br> 신석규, 이영금, 손진국, 김옥단, 이철용, 김성곤, 김성홍으로 구성된 초기 살림 요가회는 현재의 요가연합회의 모태라고 할 수 있다.</span><br><br>
                    <ul>
                        <li><strong>1990년 1대 회장 및 임원 : 회장 신석규, 총무 김성홍</strong></li>
                        <li><strong>1992년 2대 회장 및 임원 : 회장 손진국, 총무 김성곤</strong></li>
                        <li><strong>1994년 3대 회장 및 임원 : 회장 주남천, 총무 김성곤</strong></li>
                        <li><strong>1994년 3대 회장 및 임원 : 회장 주남천, 총무 김성곤</strong></li>
                        <li><strong>1998년 5대 회장 및 임원 : 회장 정강주, 총무 강병익</strong></li>
                    </ul>
                </div>
            </div>
        </div><br><br>
        <blockquote class="hero hero-dark text-center">
            <p><em>"언제나 함께 나누고 수행의 향기가 피어나는 아름다운 전통을 만들어 가겠습니다."</em></p>
            <small><em>사단법인 한국요가연합회</em></small>
        </blockquote>
    </div>
</div>
`,

  organization: `
<div class="greetings hte-pages">
<div class="tab-e2 margin-top-30">
<div class="tag-box tag-box-e3">
<div align="center">
<div class="sub-img">
<img src="/site-assets/img/org-2026.jpg" alt="조직도" class="img-responsive" usemap="#Map">
<map name="Map" id="Map">
<area shape="rect" coords="361,90,500,120" href="#localtable" alt="지역 조직도" />
</map>
<div id="localtable"><br></div>
</div>
</div>
</div>
</div>
<div class="tab-e2">
<ul class="nav nav-tabs">
<li class="active"><a href="#tab-0" data-toggle="tab" class="text-sm">강원</a></li>
<li><a href="#tab-1" data-toggle="tab" class="text-sm">경남</a></li>
<li><a href="#tab-2" data-toggle="tab" class="text-sm">경북</a></li>
<li><a href="#tab-3" data-toggle="tab" class="text-sm">광주·전남</a></li>
<li><a href="#tab-4" data-toggle="tab" class="text-sm">대구</a></li>
<li><a href="#tab-5" data-toggle="tab" class="text-sm">대전·충남</a></li>
<li><a href="#tab-6" data-toggle="tab" class="text-sm">부산</a></li>
<li><a href="#tab-7" data-toggle="tab" class="text-sm">서울·인천</a></li>
<li><a href="#tab-8" data-toggle="tab" class="text-sm">수도권</a></li>
<li><a href="#tab-9" data-toggle="tab" class="text-sm">울산</a></li>
<li><a href="#tab-10" data-toggle="tab" class="text-sm">전북</a></li>
<li><a href="#tab-11" data-toggle="tab" class="text-sm">제주</a></li>
<li><a href="#tab-12" data-toggle="tab" class="text-sm">충북</a></li>
</ul>
<div class="tab-content padding-all-15">
<div class="tab-pane fade in active" id="tab-0">
<table class="table table-hover">
<thead><tr><th style="text-align: center; font-size: 13px;">회장</th></tr></thead>
<tbody><tr style="text-align: center;"><th style="text-align: center; font-size: 13px;">이장희</th></tr></tbody>
</table>
</div>
<div class="tab-pane fade in" id="tab-1">
<table class="table table-hover">
<thead><tr><th style="text-align: center; font-size: 11px;">회장</th>
<th style="text-align: center; font-size: 11px;">부회장</th>
<th style="text-align: center; font-size: 11px;">총무이사</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">회계감사</th>
<th style="text-align: center; font-size: 11px;">사업감사</th></tr></thead>
<tbody><tr style="text-align: center;"><th style="text-align: center; font-size: 11px;">이미애</th>
<th style="text-align: center; font-size: 11px;">한외순</th>
<th style="text-align: center; font-size: 11px;">하은숙</th>
<th style="text-align: center; font-size: 11px;">성원남</th>
<th style="text-align: center; font-size: 11px;">조외숙</th>
<th style="text-align: center; font-size: 11px;">한광희</th>
<th style="text-align: center; font-size: 11px;">김현주</th>
<th style="text-align: center; font-size: 11px;">김나경</th>
<th style="text-align: center; font-size: 11px;">최경옥</th>
<th style="text-align: center; font-size: 11px;">신지윤</th>
<th style="text-align: center; font-size: 11px;">최경화</th>
<th style="text-align: center; font-size: 11px;">이은경</th>
<th style="text-align: center; font-size: 11px;">장정이</th>
<th style="text-align: center; font-size: 11px;">권효선</th>
<th style="text-align: center; font-size: 11px;">안세진</th>
<th style="text-align: center; font-size: 11px;">반순옥</th></tr></tbody>
</table>
</div>
<div class="tab-pane fade in" id="tab-2">
<table class="table table-hover">
<thead><tr><th style="text-align: center; font-size: 11px;">회장</th>
<th style="text-align: center; font-size: 11px;">부회장</th>
<th style="text-align: center; font-size: 11px;">부회장</th>
<th style="text-align: center; font-size: 11px;">총무</th>
<th style="text-align: center; font-size: 11px;">감사</th></tr></thead>
<tbody><tr style="text-align: center;"><th style="text-align: center; font-size: 11px;">장숙희</th>
<th style="text-align: center; font-size: 11px;">심옥선</th>
<th style="text-align: center; font-size: 11px;">전연자</th>
<th style="text-align: center; font-size: 11px;">송정선</th>
<th style="text-align: center; font-size: 11px;">권명옥</th></tr></tbody>
</table>
</div>
<div class="tab-pane fade in" id="tab-3">
<table class="table table-hover">
<thead><tr><th style="text-align: center; font-size: 11px;">회장</th>
<th style="text-align: center; font-size: 11px;">부회장</th>
<th style="text-align: center; font-size: 11px;">부회장</th>
<th style="text-align: center; font-size: 11px;">총무</th>
<th style="text-align: center; font-size: 11px;">감사</th>
<th style="text-align: center; font-size: 11px;">명예회장</th>
<th style="text-align: center; font-size: 11px;">고문</th>
<th style="text-align: center; font-size: 11px;">고문</th>
<th style="text-align: center; font-size: 11px;">고문</th></tr></thead>
<tbody><tr style="text-align: center;"><th style="text-align: center; font-size: 11px;">윤경숙</th>
<th style="text-align: center; font-size: 11px;">윤영희</th>
<th style="text-align: center; font-size: 11px;">정수정</th>
<th style="text-align: center; font-size: 11px;">정금숙</th>
<th style="text-align: center; font-size: 11px;">김명자</th>
<th style="text-align: center; font-size: 11px;">유명아</th>
<th style="text-align: center; font-size: 11px;">박정애</th>
<th style="text-align: center; font-size: 11px;">류민수</th>
<th style="text-align: center; font-size: 11px;">박효정</th></tr></tbody>
</table>
</div>
<div class="tab-pane fade in" id="tab-4">
<table class="table table-hover">
<thead><tr><th style="text-align: center; font-size: 11px;">회장</th>
<th style="text-align: center; font-size: 11px;">부회장</th>
<th style="text-align: center; font-size: 11px;">총무</th></tr></thead>
<tbody><tr style="text-align: center;"><th style="text-align: center; font-size: 11px;">강령아</th>
<th style="text-align: center; font-size: 11px;">이진우</th>
<th style="text-align: center; font-size: 11px;">이기연</th></tr></tbody>
</table>
</div>
<div class="tab-pane fade in" id="tab-5">
<table class="table table-hover">
<thead><tr><th style="text-align: center; font-size: 11px;">회장</th>
<th style="text-align: center; font-size: 11px;">총무</th>
<th style="text-align: center; font-size: 11px;">감사</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th></tr></thead>
<tbody><tr style="text-align: center;"><th style="text-align: center; font-size: 11px;">지혜정</th>
<th style="text-align: center; font-size: 11px;">전인숙</th>
<th style="text-align: center; font-size: 11px;">김혜정</th>
<th style="text-align: center; font-size: 11px;">최혜진</th>
<th style="text-align: center; font-size: 11px;">윤지애</th></tr></tbody>
</table>
</div>
<div class="tab-pane fade in" id="tab-6">
<table class="table table-hover">
<thead><tr><th style="text-align: center; font-size: 11px;">회장</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th></tr></thead>
<tbody><tr style="text-align: center;"><th style="text-align: center; font-size: 11px;">손주혜</th>
<th style="text-align: center; font-size: 11px;">정영자</th>
<th style="text-align: center; font-size: 11px;">최도향</th>
<th style="text-align: center; font-size: 11px;">박제민</th>
<th style="text-align: center; font-size: 11px;">조선제</th>
<th style="text-align: center; font-size: 11px;">김경전</th></tr></tbody>
</table>
</div>
<div class="tab-pane fade in" id="tab-7">
<table class="table table-hover">
<thead><tr><th style="text-align: center; font-size: 11px;">회장</th>
<th style="text-align: center; font-size: 11px;">총무</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th></tr></thead>
<tbody><tr style="text-align: center;"><th style="text-align: center; font-size: 11px;">이미숙</th>
<th style="text-align: center; font-size: 11px;">이인숙</th>
<th style="text-align: center; font-size: 11px;">정평둘</th>
<th style="text-align: center; font-size: 11px;">황나현</th></tr></tbody>
</table>
</div>
<div class="tab-pane fade in" id="tab-8">
<table class="table table-hover">
<thead><tr><th style="text-align: center; font-size: 11px;">회장</th>
<th style="text-align: center; font-size: 11px;">부회장</th>
<th style="text-align: center; font-size: 11px;">총무</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th></tr></thead>
<tbody><tr style="text-align: center;"><th style="text-align: center; font-size: 11px;">현명복</th>
<th style="text-align: center; font-size: 11px;">임덕</th>
<th style="text-align: center; font-size: 11px;">송명희</th>
<th style="text-align: center; font-size: 11px;">김영옥</th>
<th style="text-align: center; font-size: 11px;">이광진</th>
<th style="text-align: center; font-size: 11px;">김도하</th>
<th style="text-align: center; font-size: 11px;">이영순</th>
<th style="text-align: center; font-size: 11px;">조서현</th></tr></tbody>
</table>
</div>
<div class="tab-pane fade in" id="tab-9">
<table class="table table-hover">
<thead><tr><th style="text-align: center; font-size: 11px;">회장</th>
<th style="text-align: center; font-size: 11px;">총무</th></tr></thead>
<tbody><tr style="text-align: center;"><th style="text-align: center; font-size: 11px;">이선근</th>
<th style="text-align: center; font-size: 11px;">박소연</th></tr></tbody>
</table>
</div>
<div class="tab-pane fade in" id="tab-10">
<table class="table table-hover">
<thead><tr><th style="text-align: center; font-size: 11px;">회장</th>
<th style="text-align: center; font-size: 11px;">부회장</th>
<th style="text-align: center; font-size: 11px;">총무</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">감사</th></tr></thead>
<tbody><tr style="text-align: center;"><th style="text-align: center; font-size: 11px;">장지영</th>
<th style="text-align: center; font-size: 11px;">신주연</th>
<th style="text-align: center; font-size: 11px;">이은옥</th>
<th style="text-align: center; font-size: 11px;">김유진</th>
<th style="text-align: center; font-size: 11px;">유명선</th></tr></tbody>
</table>
</div>
<div class="tab-pane fade in" id="tab-11">
<table class="table table-hover">
<thead><tr><th style="text-align: center; font-size: 11px;">회장</th>
<th style="text-align: center; font-size: 11px;">총무이사</th>
<th style="text-align: center; font-size: 11px;">이사</th></tr></thead>
<tbody><tr style="text-align: center;"><th style="text-align: center; font-size: 11px;">윤수정</th>
<th style="text-align: center; font-size: 11px;">이미숙</th>
<th style="text-align: center; font-size: 11px;">신지윤</th></tr></tbody>
</table>
</div>
<div class="tab-pane fade in" id="tab-12">
<table class="table table-hover">
<thead><tr><th style="text-align: center; font-size: 11px;">회장</th>
<th style="text-align: center; font-size: 11px;">총무</th>
<th style="text-align: center; font-size: 11px;">이사</th>
<th style="text-align: center; font-size: 11px;">이사</th></tr></thead>
<tbody><tr style="text-align: center;"><th style="text-align: center; font-size: 11px;">이재연</th>
<th style="text-align: center; font-size: 11px;">반현희</th>
<th style="text-align: center; font-size: 11px;">이지선</th>
<th style="text-align: center; font-size: 11px;">최윤경</th></tr></tbody>
</table>
</div>
</div>
</div><br><br>
<blockquote class="hero hero-dark text-center">
<p><em>"언제나 함께 나누고 수행의 향기가 피어나는 아름다운 전통을 만들어 가겠습니다."</em></p>
<small><em>사단법인 한국요가연합회</em></small>
</blockquote>
</div>
`,

  contactus: `
<div>
    <div class="map-box margin-top-35">
        <!-- <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3246.752758456225!2d129.32634301481514!3d35.53510704558032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3567cd502b0fc3c7%3A0xe284483eea82da24!2z7Jq47IKw6rSR7Jet7IucIOuCqOq1rCDri6zrj5kg67KI7JiB66GcIDEwOSA07Li1!5e0!3m2!1sko!2skr!4v1548728940352" width="100%" height="500" frameborder="0" style="border:0" allowfullscreen></iframe> -->
        <!-- <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3257.8026186338975!2d128.8700630159435!3d35.26116596050067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3568b884d7bd9315%3A0x184cd94c72ccfdc2!2z6rK97IOB64Ko64-EIOq5gO2VtOyLnCDqsIDslbzroZwgMTgzIDQwNe2YuA!5e0!3m2!1sko!2skr!4v1640646972529!5m2!1sko!2skr" width="100%" height="500" style="border:0;" allowfullscreen="" loading="lazy"></iframe> -->
        <!-- <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3258.4882440706183!2d128.6471887127473!3d35.24410737261776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356f33359a19d9b1%3A0xc7095cfd669f745c!2z6rK97IOB64Ko64-EIOywveybkOyLnCDsnZjssL3qtawg7JuQ7J2064yA66GcMjYx67KI6ri4IDg!5e0!3m2!1sko!2skr!4v1743672241167!5m2!1sko!2skr" width="100%" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> -->
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5274.04176430848!2d128.63408106391608!3d35.260615176845896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356f335c99445ad1%3A0x618657ca93b68694!2z6rK97IOB64Ko64-EIOywveybkOyLnCDsnZjssL3qtawg64-E6rOE66GcIDQx!5e0!3m2!1sko!2skr!4v1776048702021!5m2!1sko!2skr" width="100%" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
    <div class="row">
        <div class="col-sm-6">
            <div class="headline margin-top-30 md-margin-bottom-30">
                <h4>사무국</h4>
            </div>
            <ul class="list-unstyled contact-box-l margin-bottom-30">
                <li><i class="fa fa-building"></i> 경남 창원시 의창구 도계로 41, 일호하이파이데파트 302호(㉾51164)</li>
                <li><i class="fa fa-envelope"></i> yogakorea@yogakorea.or.kr</li>
                <li><i class="fa fa-phone"></i> 055-724-4144, 4145</li>
                <li><i class="fa fa-globe"></i> http://www.yogakorea.or.kr</li>
            </ul>
        </div>
        <div class="col-sm-6">
            <div class="headline margin-top-30">
                <h4>업무시간</h4>
            </div>
            <ul class="list-unstyled contact-box-r margin-bottom-30">
                <li><strong>월 ~ 금 :</strong> 오전 9시 - 오후 6시</li>
                <li><strong>점심시간 :</strong> 12시 - 1시</li>
                <li><strong>토, 일요일, 공휴일:</strong> 휴무</li>
            </ul>
        </div>
    </div>
</div>
`,

  guide: `
<div class="sub-main history tracking-tight">
	<div class="tab-e2 margin-top-30">
	<div class="tag-box tag-box-e3">   	
        <span class="text-highlights text-highlights-green">응시자격</span><br>
        <p>요가지도자자격증 발급규정 제9조 응시자격 의거 3급 응시자격은 연합회교육기관에서 최소 6개월 이상 교육을 받은 초시자로 교육기관장의 추천을 받은 자여야 하며, 교육기간 내에 연합회에서 개최하는 동.하계 수련회 1회, 권역심화교육 1회를 반드시 이수하여야 한다. </p>
		<br>
		<span class="text-highlights text-highlights-green mb-2">응시방법</span><br>
		<div class="sub-img">
       <img src="${member_id}" alt="" class="img-responsive">
	   </div>
	   <br><br>
	<span class="text-highlights text-highlights-green mb-4">시험결과</span><br>
	<div class="mb-8">
    평균점수가 70점 미만은 불합격으로 하며, 평균점수가 70점 이상인 경우에도 과목낙제가 있으면 불합격으로 한다.<br/>
    과목낙제는 객관식, 주관식, 아사나, 호흡, 지도력, 구술, 인성으로 나누어 각각 평가된다. <br/>(예, 평균점수가 70점 일 때, 객관식 10점 미만은 불합격)</div>    	
    <span class="text-highlights text-highlights-green">합격 및 승급취소</span><br><br>
	<strong> 1. 합격 및 승급취소</strong>
        <ol>
    <li> 합격 및 승급 발표 후 만2개월이 지나도 자격증 발급을 신청하지 않으면 3개월이 지나면 경고, 4개월이 지나면 그 합격을 취소할 수 있다.</li>
    <li> 특별한 사유가 있는 경우는 예외로 한다. 특별한 사유인정여부는 이사회에 부친다.</li>   
	</ol>  
	<strong> 2. 불합격자 재시험</strong>
        <ol>
    <li> 특별한 경우를 제외하고 합격할 때까지 재시험에 응시할 수 있다.</li>
    <li> 합격취소자도 포함 될 수 있다.</li>   
	</ol>	
	<strong> 3. 정회원 입회 비용</strong>     
		<ul>
	 		<li>3급 입회자 : 42만원을 최초입회비로 연합회에 납부하고, 月 1만원 연회비를 CMS 자동이체로 납부한다. </li>


	 		<li>CMS 자동이체는 입회일 1년 이후 부터  시행 한다.  </li>
	 	</ol>
		</div>
	</div>
	
</div>
`,

  info: `
<style>
    .btn {
        border: royalblue 1px solid;
        outline: none;
        background-color: gold;
        padding: 5px 30px;
        border-radius: 13px !important;
        color: royalblue;
        align-items: center;
        font-weight: bold;
        margin-left: 30px;
    }
    table#hhh td {
        word-break: keep-all;
    }
</style>
<div class="tab-e2 margin-top-30">
<div class="panel panel-green">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fa fa-edit"></i> 자격정보 <button type='button' class='btn' onclick="window.open('/work/info_detail', '_blank', 'scrollbars=yes, resizable, width=1000px, height=800px, left='+(screen.width-1000)/2+', top='+(screen.height-800)/2)">자격정보 상세보기</button></h3>
    </div>


    <table class="table table-hover">
        <thead>
            <tr>
                <th width="22%" style="text-align: center">자격명</th>
                <th width="12%" style="text-align: center">자격의 종류</th>
                <th width="15%" style="text-align: center">등록번호</th>
                <th width="13%" style="text-align: center">자격발급기관</th>
                <th width="15%" style="text-align: center">검정(응시)료</th>
                <th width="23%" style="text-align: center">환불규정</th>
            </tr>          
        </thead>
        <tbody class="text-sm">
            <tr style="text-align: center">
                <td>요가지도자 특/1/2/3급</td>
                <td>등록(비공인)민간자격</td>
                <td>2008-0095</td>
                <td>사단법인<br>한국요가연합회</td>
                <td>3급 - 5만원<br>특/1/2급 - 3만원</td>
                <td>접수마감까지 100% 환불 검정 당일 취소 시 20% 공제 후 환불</td>
            </tr> 
			<tr style="text-align: center">
                <td>시니어요가지도자<br>1/2급 자격증</td>
                <td>등록(비공인)민간자격</td>
                <td>2008-0096</td>
                <td>사단법인<br>한국요가연합회</td>
                <td>3만원</td>
			<td>접수마감까지 100% 환불 검정 당일 취소 시 20% 공제 후 환불</td>
            </tr>
             <tr style="text-align: center">
                <td>어린이&청소년 요가지도자<br>1/2급 자격증</td>
                <td>등록(비공인)민간자격</td>
                <td>2008-0097</td>
                <td>사단법인<br>한국요가연합회</td>
                <td>3만원</td>
				<td>접수마감까지 100% 환불 검정 당일 취소 시 20% 공제 후 환불</td>
            </tr>			
			 <tr style="text-align: center">
                <td>임산부&베이비 요가지도자<br>1/2급 자격증</td>
                <td>등록(비공인)민간자격</td>
                <td>2010-0131</td>
                <td>사단법인<br>한국요가연합회</td>
                <td>3만원</td>
				<td>접수마감까지 100% 환불 검정 당일 취소 시 20% 공제 후 환불</td>
            </tr>
			 <tr style="text-align: center">
                <td>플라잉 요가지도자<br>1/2급 자격증</td>
                <td>등록(비공인)민간자격</td>
                <td>2016-005612</td>
                <td>사단법인<br>한국요가연합회</td>
                <td>3만원</td>
				<td>접수마감까지 100% 환불 검정 당일 취소 시 20% 공제 후 환불</td>
            </tr>
			 <tr style="text-align: center">
                <td>필라테스 매트 지도자 자격증</td>
                <td>등록(비공인)민간자격</td>
                <td>2017-000720</td>
                <td>사단법인<br>한국요가연합회</td>
                <td>3만원</td>
			<td>접수마감까지 100% 환불 검정 당일 취소 시 20% 공제 후 환불</td>
            </tr>
			 <tr style="text-align: center">
                <td>필라테스 소도구 지도자</td>
                <td>등록(비공인)민간자격</td>
                <td>2017-000721</td>
                <td>사단법인<br>한국요가연합회</td>
                <td>3만원</td>
			<td>접수마감까지 100% 환불 검정 당일 취소 시 20% 공제 후 환불</td>
            </tr>
			 <tr style="text-align: center">
                <td>필라테스 대기구 지도자</td>
                <td>등록(비공인)민간자격</td>
                <td>2017-000719</td>
                <td>사단법인<br>한국요가연합회</td>
                <td>3만원</td>
			<td>접수마감까지 100% 환불 검정 당일 취소 시 20% 공제 후 환불</td>
            </tr>           
             <tr style="text-align: center">
                <td>비니요가 지도자<br>1/2급 자격증</td>
                <td>등록(비공인)민간자격</td>
                <td>2017-004655</td>
                <td>사단법인<br>한국요가연합회</td>
                <td>3만원</td>
            <td>접수마감까지 100% 환불 검정 당일 취소 시 20% 공제 후 환불</td>
            </tr>           
             <tr style="text-align: center">
                <td>명상 지도자<br/>1/2급 자격증</td>
                <td>등록(비공인)민간자격</td>
                <td>2020-004445</td>
                <td>사단법인<br>한국요가연합회</td>
                <td>3만원</td>
                <td>접수마감까지 100% 환불 검정 당일 취소 시 20% 공제 후 환불</td>
            </tr>          
             <tr style="text-align: center">
                <td>KYF 싱잉볼힐러<br/>1/2급 자격증</td>
                <td>등록(비공인)민간자격</td>
                <td>2025-004619</td>
                <td>사단법인<br>한국요가연합회</td>
                <td>3만원</td>
                <td>접수마감까지 100% 환불 검정 당일 취소 시 20% 공제 후 환불</td>
            </tr>       
             <tr style="text-align: center">
                <td>KYF 아로마요가 지도자<br/>1/2급 자격증</td>
                <td>등록(비공인)민간자격</td>
                <td>2025-005600</td>
                <td>사단법인<br>한국요가연합회</td>
                <td>3만원</td>
                <td>접수마감까지 100% 환불 검정 당일 취소 시 20% 공제 후 환불</td>
            </tr>
     <!--       <tr style="text-align: center">
              <td>요가명상지도자과정</td>
              <td colspan="4">미정</td>
              <td>교육/사무국</td>
              <td>15명</td>
            </tr>
           <tr style="text-align: center">
              <td>치유요가지도자과정</td>
              <td colspan="4">미정</td>
              <td>교육/사무국</td>
              <td>15명</td>
            </tr>
            <tr style="text-align: center">
              <td>음악명상지도자과정<br>
              (15년 신설)</td>
              <td colspan="4">미정</td>
              <td>교육/사무국</td>
              <td>15명</td>
            </tr>
            <tr style="text-align: center">
                <td>몸의학교 협력<br>
                댄싱톡과정(예정)</td>
                <td colspan="4">미정</td>
                <td>교육/사무국</td>
                <td>15명</td>
            </tr>
  -->      </tbody>
    </table>
	 <div class="panel-heading">
        <h3 class="panel-title"><i class="fa fa-edit"></i> 자격관리기관 정보</h3>
    </div>
    <table class="table table-hover" id="hhh">
        <thead>
            <tr>
                <th width="14%" style="text-align: center">기관명</th>
                <th width="9%" style="text-align: center">대표자</th>
                <th width="12%" style="text-align: center">연락처</th>
                <th width="25%" style="text-align: center">소재지</th>
                <th width="20%" style="text-align: center">홈페이지</th>
				<th width="20%" style="text-align: center">이메일</th>
            </tr>          
        </thead>
        <tbody>
            <tr style="text-align: center">
                <td>사단법인<br>한국요가연합회</td>
                <td>김성홍</td>
                <td>055-724-4144/5</td>
                <td>경상남도 창원시 의창구 원이대로 261번길 8</td>
                <td>http://www.yogakorea.or.kr</td>
				<td>yogakorea@yogakorea.or.kr</td>
            </tr> 
			</tbody>
			</table>
</div>
</div>
`,

  info_detail: `
<h3>민간자격정보 상세보기</h3>
    <table class="table table-hover">
        <thead>
            <tr>
                <th rowspan=2>과목</th>
                <th rowspan=2>등급</th>
                <th rowspan=2>검정총비용</th>
                <th colspan=2>교육과정비</th>
                <th rowspan=2>교재비</th>
                <th rowspan=2>자격응시료</th>
                <th colspan=2>자격증발급수수료</th>
                <th rowspan=2>보수교육비<br>(심화교육)</th>
                <th rowspan=2>연수비</th>
                <th rowspan=2>입회비</th>
                <th rowspan=2>연회비</th>
                <th rowspan=2>재발급비</th>
            </tr>
            <tr>
                <th>정회원</th>
                <th>비회원</th>
                <th>정회원</th>
                <th>비회원</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td rowspan=4>요가지도자</td>
                <td>특급</td>
                <td>약128만원</td>
                <td>-1급 취득 후 10년이상 실무경력 또는 요가경력 15년 이상 실무경력과 인지도 및 공헌도<br>
-요가관련학과 박사 소지자<br>
-교육과정비 : 없음</td>
                <td>없음</td>
                <td>별도</td>
                <td  rowspan=4>초시: 5만원<br>재시: 3만원<br>갱신: 5만원<br>승급: 3만원</td>
                <td>62만원<br>(연회비 12만원 포함)</td>
                <td rowspan=4></td>
                <td rowspan=4>본부교육 무료<br>권역교육 권역교육별 상이</td>
                <td rowspan=4>연수별 금액 상이</td>
                <td>50만원</td>
                <td rowspan=4>12만원</td>
                <td rowspan=17>1만원</td>
            </tr> 
            <tr>
                <td>1급</td>
                <td>약108만원</td>
                <td>-2급 취득 후 3년간의 실무경력과 재교육 이수<br>
-교육과정비 : 없음</td>
                <td>없음</td>
                <td>별도</td>
                <td>62만원<br>(연회비 12만원 포함)</td>
                <td>30만원</td>
            </tr>
            <tr>
                <td>2급</td>
                <td>약88만원</td>
                <td>-3급 취득 후 2년간의 실무경력과 재교육 이수<br>
-교육과정비 : 없음</td>
                <td>없음</td>
                <td>별도</td>
                <td>52만원<br>(연회비 12만원 포함)</td>
                <td>20만원</td>
            </tr>
            <tr>
                <td>3급</td>
                <td>약270만원</td>
                <td>-6개월이상 300시간 교육(이론100시간, 실기200시간)<br>
-교육과정비 : 200만원 이상</td>
                <td>없음</td>
                <td>별도</td>
                <td>42만원<br>(연회비 12만원 포함)</td>
                <td>12만원</td>
            </tr>
            <tr>
                <td rowspan=2>실버요가지도자</td>
                <td>1급</td>
                <td>90만원</td>
                <td rowspan=6>- 40시간 이수<br>- 교육과정비: 50만원 이상</td>
                <td rowspan=6 class='red'>- 40시간 이수<br>- 교육과정비: 80만원 이상</td>
                <td>별도</td>
                <td rowspan=13>없음</td>
                <td rowspan=13>10만원</td>
                <td rowspan=6>10만원</td>
                <td rowspan=13>무료</td>
                <td rowspan=13>별도</td>
                <td rowspan=13>없음</td>
                <td rowspan=13>없음</td>
            </tr>
            <tr>
                <td>2급</td>
                <td>90만원</td>
                <td>별도</td>
            </tr>
            <tr>
                <td rowspan=2>어린이&청소년 요가지도자</td>
                <td>1급</td>
                <td>90만원</td>
                <td>별도</td>
            </tr>
            <tr>
                <td>2급</td>
                <td>90만원</td>
                <td>별도</td>
            </tr>
            <tr>
                <td rowspan=2>임산부&베이비 요가지도자</td>
                <td>1급</td>
                <td>90만원</td>
                <td>별도</td>
            </tr>
            <tr>
                <td>2급</td>
                <td>90만원</td>
                <td>별도</td>
            </tr>
            <tr>
                <td rowspan=2>슬링(플라잉) 요가지도자</td>
                <td>1급</td>
                <td>150만원</td>
                <td rowspan=2>- 40시간 이수<br>- 교육과정비: 70만원 이상</td>
                <td rowspan=2>- 40시간 이수<br>- 교육과정비: 120만원 이상</td>
                <td>별도</td>
                <td rowspan=2>20만원</td>
            </tr>
            <tr>
                <td>2급</td>
                <td>150만원</td>
                <td>별도</td>
            </tr>
            <tr>
                <td rowspan=3>필라테스 지도자</td>
                <td>매트</td>
                <td>150만원</td>
                <td>- 40시간 이수<br>- 교육과정비: 100만원 이상</td>
                <td>- 40시간 이수<br>- 교육과정비: 120만원 이상</td>
                <td>별도</td>
                <td rowspan=3>20만원</td>
            </tr>
            <tr>
                <td>소도구</td>
                <td>120만원</td>
                <td>- 40시간 이수<br>- 교육과정비: 70만원 이상</td>
                <td>- 40시간 이수<br>- 교육과정비: 90만원 이상</td>
                <td>별도</td>
            </tr>
            <tr>
                <td>대기구</td>
                <td>190만원</td>
                <td>- 40시간 이수<br>- 교육과정비: 130만원 이상</td>
                <td>- 40시간 이수<br>- 교육과정비: 160만원 이상</td>
                <td>별도</td>
            </tr>
            <tr>
                <td rowspan=2>비니요가 지도자</td>
                <td>1급</td>
                <td>90만원</td>
                <td class='red'>- 40시간 이수<br>- 교육과정비: 130만원 이상</td>
                <td></td>
                <td>별도</td>
                <td rowspan=2>20만원</td>
            </tr>
            <tr>
                <td>2급</td>
                <td>90만원</td>
                <td></td>
                <td></td>
                <td>별도</td>
            </tr>
        </tbody>
    </table>

<div class='uc'>
    <button type='button' class='btn' onclick="window.close()">창닫기</button>
</div>
`,

  biz01: `
<div class="sub-main history">
	<div class="tab-e2 margin-top-30">
	<div class="tag-box tag-box-e3 space-y-4">   
        <span class="text-highlights text-highlights-green">사업방침</span>
        <ol class="list-decimal text-sm ml-4 leading-relaxed">
            <li>정통요가의 전통을 살리면서 현대인의 생활방식과 신체구조에 맞게 요가지도법을 연구하고 발전시켜, 지도의 체계와 효율성을 도모한다.</li>
            <li>요가를 통한 국민건강에 이바지 할 수 있도록 지속적인 지도자 심화교육 및 연수와 국제적인 요가교류, 요가논문 발표를 통하여 요가지도자의 질을 높인다.</li>
        </ol>
		<span class="text-highlights text-highlights-green">사업목표</span>
        <ol class="list-decimal text-sm ml-4 leading-relaxed">
            <li> 지도자교육내실화 및 자질향상</li>
            <li> 지역사회에 요가보급</li>
            <li> 국제적인 요가교류</li>
            <li> 요가지도자 양성 및 회원 확보</li>
            <li> 요가용품 보급(요가행법 보조기구 제작)</li>
            <li> 지도자간 유대강화</li>
	    </ol>
	    <span class="text-highlights text-highlights-green">교육과정</span>
        <ol class="list-decimal text-sm ml-4 leading-relaxed">
	        <li><strong>지도자자격증 발급 교육기관 공통 사항</strong>
                <ul class="list-disc text-sm ml-4">
                    <li> 자격증발급: (사)한국요가연합회 주최하는 시험에 합격한 자로 (사)한국요가연합회 명의로 발급된다.</li>
                    <li> 지도자자격 교육 기관 : 교육개시 1개월 전에 이사회의 심의를 받은 후 시행한다.<br>심의 시 필요서류-지도자과정 개설 신청서1부, 입학자 신상명세 명단, 교육커리큘럼, 지도강사이력</li>
                    <li> 교육 시간 : 6개월 이론 100시간, 실기 200시간 이상으로 외부강사 2명 이상을 초빙한다.</li>
                    <li> 교과 과목 : 필수 20시간(요가철학, 요가심리학, 요가생리학, 인도사상과 동양사상사) 자유 80시간(교육기관성격에 따라) 참고교재-요가디피카, 우파니샤드, 인도철학사, 쿤달리니 탄트라, 요가철학 등</li>
                    <li> 지도자교육강사 : 자격취득 2년 이상 된 자로 연합회 자격증을 발급 받고 연합회 심화교육 192시간 후 이사회 사전 승인을 얻어야 함</li>
                    <li> 지도자자격시험 : 정기시험은 매년 1월, 4월, 7월, 10월 (필요에 따라 임시시험 있음)</li>
                    <li> 자격증취득 후 6개월간 심화교육과정 의무참여</li>
                </ul>
            </li>
            <li><strong>지도자자격증 취득 시험 심사기준</strong>
                <ul class="list-disc text-sm ml-4 leading-relaxed">
                    <li> 합격점수 : 300점 만점에 평균 70점 이상 되어야 함</li>
                    <li> 이론 및 실기 시험 : 이론 100점(객관식40점, 주관식60점), 실기 100점(아사나75점<수리야나마스까라 10점, 지도(발표) 25점, 시르시아사나 15점, 좌법 10점, 심사위원 질문 15점>), 호흡 25점(3종 15점, 심사위원 질문 10점)</li>
                    <li>면접 시험 - 면점 100점<구술 80점(명상/호흡/아사나/기타), 인성20점></li>
                    <li> 이론시험 : 다음 문항 중 심시위원이 선택 출제하는 2문항
                        <ul class="list-disc text-sm ml-4 leading-relaxed">
                        <li type="circle">요가란 무엇인가?</li>
                        <li type="circle">요가슈트라 1절~2절</li>
                        <li type="circle">아쉬탕가요가</li>
                        <li type="circle">바가바드기타에 나타난 요가 종류</li>
                        <li type="circle">쿤달리니와 차크라</li>
                        <li type="circle">삿뜨까르마</li>
                        <li type="circle">판차코샤</li>
                        <li type="circle">반다와 무드라</li>
                        </ul>
                    </li>
                    <li> 아사나: 필수3종( 수리야 나마스까라, 시르시아사나, 빠드마 아사나) 과 심사위원이 선택한 1종</li>
                    <li> 호흡법 : 나디소나다, 까발라바띠, 바스트리카, 싯탈리, 브라마리, 완전호흡</li>
                    <li> 구술 : 요가에 관한 전반적 질의 응답</li>
                    <li> 지도력 : 요가지도 5분 이상 발표</li>
                    <li> 인성 : 요가 수행자와 요가지도자로서의 적합한 성품</li>
                </ul>    
            </li>
            <li><strong>입회비 및 지도자교육 기관 교육비</strong>
                <ul class="list-disc text-sm ml-4 leading-relaxed">
                    <li> (자격증) 30만원, 月1만원 연회비 자동이체 신청</li>
                    <li> 자격시험시 심사비 : 심사비 5만원, 재시험시 3만원</li>
                    <li> 교육비 : 6개월 과정(각 기관성격에 따라 차이가 있을수 있으므로 기관에 직접 문의)</li>    
                </ul>
            </li>
        </ol>    
	</div>
	</div>
	<table class="table table-hover">
        <thead>
		    <tr><th colspan="8" style="text-align: right">요가지도자 1/2/3급 자격증 (민간자격번호 : 2008-0095)</th></tr>
            <tr>
                <th width="15%" rowspan="2" style="text-align: center">목적</th>
                <th width="20%" rowspan="2" style="text-align: center">사업내용</th>
                <th width="35%" colspan="4" style="text-align: center">시행시기</th>
                <th width="15%" rowspan="2" style="text-align: center">담당부서</th>
                <th width="15%" rowspan="2" style="text-align: center">비고</th>
            </tr>
            <tr>
              <th>1/4분기</th>
              <th>2/4분기</th>
              <th>3/4분기</th>
              <th>4/4분기</th>
            </tr>
        </thead>
        <tbody style="text-align: center">
            <tr>
                <td rowspan="3" style="text-align: center">요가지도자양성및 정회원 확보</td>
                <td>3급</td>   
				 <td style="text-align: center">4월 3째</td>
                <td style="text-align: center">4월 4째</td>
                <td style="text-align: center">7월 4째</td>
                <td style="text-align: center">10월 4째</td>
                <td>심사/사무국</td>
                <td>신규 160명</td>
            </tr>
            <tr>
                <td>승급(1, 2급)</td> 	
			    <td style="text-align: center">4월 3째</td>
                <td style="text-align: center">4월 4째</td>
                <td style="text-align: center">7월 4째</td>
                <td style="text-align: center">10월 4째</td>
                <td>심사/사무국</td>
                <td>2급 20명<br>1급 20명</td>
            </tr>
            <tr> 
              <td>타 단체 갱신</td>  
			   <td style="text-align: center">4월 3째</td>
                <td style="text-align: center">4월 4째</td>
                <td style="text-align: center">7월 4째</td>
                <td style="text-align: center">10월 4째</td>
              <td>심사/사무국</td>
              <td>갱신 16명</td>
            </tr>           
        </tbody>
    </table>

</div>
</div>
`,

  biz02: `
<div class="tab-e2 margin-top-30">
<div class="panel panel-green">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fa fa-edit"></i> 2026년 분기별 사업계획</h3>
    </div>
    <div class="">
    <table class="table table-hover">
        <thead>
            <tr class="text-sm">
                <th width="13%" rowspan="2" style="text-align: center;">목적</th>
                <th width="27%" rowspan="2" style="text-align: center;">사업내용</th>
                <th width="34%" colspan="4" style="text-align: center;">시행시기</th>
                <th width="12%" rowspan="2" style="text-align: center;">담당부서</th>
                <th width="14%" rowspan="2" style="text-align: center;">비고</th>
            </tr>
            <tr style="text-align: center;" class="text-sm">
              <th>1/4분기</th>
              <th>2/4분기</th>
              <th>3/4분기</th>
              <th>4/4분기</th>
            </tr>
        </thead>
        <tbody style="text-align: center;" class="text-sm">
            <tr style="text-align: center">
                <td rowspan="11">특수자격증발급</td>
                <td>어린이&청소년 요가지도자<br>
				(민간자격등록번호:2008-0097)</td>
                <td colspan="4">상시</td>
                <td>교육/사무국</td>
                <td>위탁 교육 20명</td>
            </tr>
            <tr style="text-align: center">
                <td>시니어 요가지도자<br>
				(민간자격등록번호:2008-0096)</td>
                <td colspan="4">상시</td>
                <td>교육/사무국</td>
                <td>위탁 교육 20명</td>
            </tr>
            <tr style="text-align: center">
              <td>임산부&베이비 요가지도자<br>
			  (민간자격등록번호:2010-0131)</td>
              <td colspan="4">상시</td>
              <td>교육/사무국</td>
              <td>위탁 교육 20명</td>
            </tr>
            <tr style="text-align: center">
              <td>플라잉 요가지도자<br>
			  (민간자격등록번호:2016-005612)</td>
              <td colspan="4">상시</td>
              <td>교육/사무국</td>
              <td>위탁 교육 30명</td>
            </tr>
            <tr style="text-align: center">
              <td>필라테스 매트 지도자<br>
			  (민간자격등록번호:2017-000720)</td>
              <td colspan="4">상시</td>
              <td>교육/사무국</td>
              <td>위탁 교육 30명</td>
            </tr>
			<tr style="text-align: center">
              <td>필라테스 소도구 지도자<br>
			  (민간자격등록번호:2017-000721)</td>
              <td colspan="4">상시</td>
              <td>교육/사무국</td>
              <td>위탁 교육 30명</td>
            </tr>
            <tr style="text-align: center">
              <td>필라테스 대기구 지도자<br>
              (민간자격등록번호:2017-000719)</td>
              <td colspan="4">상시</td>
              <td>교육/사무국</td>
              <td>위탁 교육 30명</td>
            </tr>
            <tr style="text-align: center">
              <td>비니 요가지도자<br/>(민간자격등록번호:2017-004655)</td>
              <td colspan="4">상시</td>
              <td>교육/사무국</td>
              <td>위탁 교육 30명</td>
            </tr>
            <tr style="text-align: center">
              <td>명상 지도자<br>
              (민간자격등록번호:2020-004445)</td>
              <td colspan="4">상시</td>
              <td>교육/사무국</td>
              <td>위탁 교육 30명</td>
            </tr>
            <tr style="text-align: center">
              <td>KYF 싱일볼 힐러<br>
              (민간자격등록번호:2025-004619)</td>
              <td colspan="4">상시</td>
              <td>교육/사무국</td>
              <td>위탁 교육 30명</td>
            </tr>
            <tr style="text-align: center">
              <td>KYF 아로마요가 지도자<br>
              (민간자격등록번호:2025-005600)</td>
              <td colspan="4">상시</td>
              <td>교육/사무국</td>
              <td>위탁 교육 30명</td>
            </tr>
        </tbody>
    </table>
    </div>
</div>
</div>
`,

  biz03: `
<div class="tab-e2 margin-top-30">
<div class="panel panel-green">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fa fa-edit"></i> 2026년 분기별 사업계획</h3>
    </div>
   <table class="table table-hover">
        <thead>
            <tr class="text-sm">
                <th width="13%" rowspan="2" style="text-align: center">목적</th>
                <th width="22%" rowspan="2" style="text-align: center">사업내용</th>
                <th width="37%" colspan="4" style="text-align: center">시행시기</th>
                <th width="13%" rowspan="2" style="text-align: center">담당부서</th>
                <th width="15%" rowspan="2" style="text-align: center">비고</th>
            </tr>
            <tr class="text-sm">
              <th>1/4분기</th>
              <th>2/4분기</th>
              <th>3/4분기</th>
              <th>4/4분기</th>
            </tr>
        </thead>
        <tbody style="text-align: center;" class="text-sm">
            <tr>
                <td rowspan="4" align="center">지도자 교육 및<br>
                유대 강화</td>
                <td>수련회</td>
                <td style="text-align: center">1월 세째주<br>
                (동계)</td>
                <td style="text-align: center">&nbsp;</td>
                <td style="text-align: center">7월 둘째주<br>
                (하계)</td>
                <td style="text-align: center">&nbsp;</td>
                <td>교육/사무국</td>
                <td>동계 200명<br>
                하계 250명</td>
            </tr>
            <tr class="text-sm">
              <td>심화교육</td>
                <td style="text-align: center">3월</td>
                <td style="text-align: center">5월<br>
                (권역)</td>
                <td style="text-align: center">9월</td>
                <td style="text-align: center">11월<br>
                (권역)</td>
                <td>교육/사무국</td>
                <td></td>
            </tr>
            <tr class="text-sm">
              <td>철학강좌<br>
              (갱신자보수교육)</td>
              <td style="text-align: center">&nbsp;</td>
              <td style="text-align: center">6월</td>
              <td style="text-align: center">&nbsp;</td>
              <td style="text-align: center">11월</td>
              <td>교육/사무국</td>
              <td></td>
            </tr>
            <tr class="text-sm">
              <td>원장단 워크숍</td>
              <td colspan="4" style="text-align: center">4월 둘째주 / 11월 둘째주 (1박2일로 년2회 시행)</td>
              <td>교육/사무국</td>
              <td>요가원장단<br>
              실무이사 및 국장</td>
            </tr>
            <tr class="text-sm">
              <td rowspan="5" align="center">교육 및 워크숍</td>
              <td>요가3대 경전강독</td>
              <td colspan="4" style="text-align: center">상시접수</td>
              <td>교육/사무국</td>
              <td>30명</td>
            </tr>
            <tr class="text-sm">
              <td>경전 강독<br>
              (권역지원사업)</td>
              <td colspan="4" style="text-align: center">권역별 일정 조정</td>
              <td>사무국/권역</td>
              <td>권역별 20명</td>
            </tr>
            <tr class="text-sm">
              <td>게릴라 특강<br>
              (권역지원사업)</td>
              <td colspan="4" style="text-align: center">권역별 일정 조정</td>
              <td>사무국/권역</td>
              <td>권역별 20명</td>
            </tr>
            <tr class="text-sm">
              <td>특수자격증 보수교육</td>
              <td colspan="4" style="text-align: center">어린이, 임산부, 실버 각 1회</td>
              <td>사무국/권역</td>
              <td>회당 20명</td>
            </tr>            
            <tr class="text-sm">
              <td>기타 워크숍<br>
              (비움워크숍, 명상프로그램 등)</td>
                <td colspan="4" style="text-align: center">미정</td>
                <td>교육/사무국</td>
                <td>40명</td>
            </tr>
			 <tr class="text-sm">
              <td rowspan="2" align="center">기타</td>
              <td>홈피관리</td>
              <td colspan="4" style="text-align: center">수시</td>
              <td>사무국/홍보국</td>
              <td>수시관리</td>
            </tr>
            <tr class="text-sm">
              <td>요가원 및 교육기관 등록</td>
              <td colspan="4" style="text-align: center">수시</td>
              <td>사무국</td>
              <td>신청시</td>
            </tr>
        </tbody>
    </table>
</div>
</div>
`,

  biz04: `
<div class="tab-e2 margin-top-30">
<div class="panel panel-green">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fa fa-edit"></i> 2017년 분기별 사업계획</h3>
    </div>
   <table class="table table-hover">
        <thead>
            <tr>
                <th width="15%" rowspan="2" style="text-align: center">목적</th>
                <th width="20%" rowspan="2" style="text-align: center">사업내용</th>
                <th width="35%" colspan="4" style="text-align: center">시행시기</th>
                <th width="15%" rowspan="2" style="text-align: center">담당부서</th>
                <th width="15%" rowspan="2" style="text-align: center">비고</th>
            </tr>
            <tr>
              <th>1/4분기</th>
              <th>2/4분기</th>
              <th>3/4분기</th>
              <th>4/4분기</th>
            </tr>
        </thead>
        <tbody style="text-align: center">
            <tr>
                <td rowspan="3" align="center">기타</td>
                <td>회보발간</td>
                <td style="text-align: center"></td>
                <td style="text-align: center">5월</td>
                <td style="text-align: center"></td>
                <td style="text-align: center">12월</td>
                <td>사무국</td>
                <td>연 2회 발간</td>
            </tr>
            <tr>
              <td>홈페이지관리</td>
                <td style="text-align: center">2월</td>
                <td style="text-align: center"></td>
                <td style="text-align: center">9월</td>
                <td style="text-align: center"></td>
                <td>사무국/홍보국</td>
                <td>수시 관리</td>
            </tr>
            <tr> 
              <td>교육기관, 요가원 등록</td>
              <td style="text-align: center">&nbsp;</td>
              <td style="text-align: center"></td>
              <td style="text-align: center">&nbsp;</td>
              <td style="text-align: center"></td>
              <td>사무국</td>
              <td>신청시</td>
            </tr>           
        </tbody>
    </table>
</div>
</div>
`,

  relative01: `
<div class="tab-e2 margin-top-30">
<div class="panel panel-green">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fa fa-align-justify"></i> 참여단체 및 대학</h3>
    </div>
  <table class="table table-bordered">
    <thead>
        <tr>
            <th style="text-align: center; font-size: 13px;">구분</th>
            <th style="text-align: center; font-size: 13px;">단체 및 대학명</th>
            <th style="text-align: center; font-size: 13px;">홈페이지</th>         
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="7" style="text-align: center; vertical-align: middle;">협력대학</td>
            <td>동국대학교 불교대학원 융합요가학과</td>
            <td><a href="http://gsbs.dongguk.edu/" target="_blank">http://gsbs.dongguk.edu/</a></td>      
        </tr>
		<tr>           
            <td>서울불교대학원대학교 심신통합치유학과</td>
            <td><a href="https://sub.ac.kr/" target="_blank">http://sub.ac.kr/</a></td>           
        </tr>
		<tr>
            <td>선문대학교 통합의학대학원</td>
            <td><a href="https://kltest.sunmoon.ac.kr/graduate/cm/cntnts/cntntsView.do?mi=45981&cntntsId=240493" target="_blank">https://kltest.sunmoon.ac.kr/</a></td>
		</tr>
		<tr>
            <td>원광대학교 동양학대학원</td>
            <td><a href="https://orient.wku.ac.kr/" target="_blank">https://orient.wku.ac.kr/</a></td>           
        </tr>
		<tr>
            <td>원광디지털대학교 웰빙문화대학원</td>
            <td><a href="http://graduate.wdu.ac.kr/" target="_blank">http://graduate.wdu.ac.kr/</a></td> 
        </tr>
		<tr>
            <td>원광디지털대학교 요가명상학과</td>
            <td><a href="http://www.wdu.ac.kr/index.do" target="_blank">http://www.wdu.ac.kr/</a></td>           
        </tr>
		<tr>
            <td>춘해보건대학교 요가과 </td>
            <td><a href="http://yoga.ch.ac.kr/" target="_blank">http://yoga.ch.ac.kr/</a></td>           
        </tr>
		<!-- <tr>
            <td rowspan="2">협력단체</td>
            <td>싸띠아난다 아쉬람</td>
            <td><a href="http://www.satyananda.co.kr/" target="_blank">http://www.satyananda.co.kr/</a></td>           
        </tr>
		<tr>
            <td>슈리 크리슈나다스 아쉬람</td>
            <td><a href="http://www.krishnadass.com/" target="_blank">http://www.krishnadass.com/</a></td>           
        </tr> -->
    </tbody>
</table>
</div>
</div>
`,

  relative02: `
<div class="tab-e2 margin-top-30">
<div class="panel panel-green">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fa fa-align-justify"></i> 후원 및 협찬사</h3>
    </div>
  <table class="table table-bordered">
    <thead>
        <tr>
            <th style="text-align: center; font-size: 13px;">구분</th>
            <th style="text-align: center; font-size: 13px;">업체명</th>
            <th style="text-align: center; font-size: 13px;">홈페이지</th>         
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="4" style="text-align: center; vertical-align: middle;">후원 및 협찬사</td>
            <td>지혜의 나무</td>
            <td></td>      
        </tr>
		<!-- <tr>           
            <td>요나패밀리</td>
            <td><a href="http://www.yonafamily.co.kr/" target="_blank">http://www.yonafamily.co.kr/</a></td>           
        </tr>
		<tr>
            <td>인디피아</td>
            <td><a href="http://www.indipia.com/" target="_blank">http://www.indipia.com/</a></td>
		</tr> -->
		<tr>
            <td>요가몰</td>
            <td><a href="https://yogamall.co.kr/" target="_blank">https://yogamall.co.kr/</a></td>           
        </tr>
		<tr>
            <td>보니앤제이 </td>
            <td><a href="https://b1954.com/" target="_blank">https://b1954.com/</a></td> 
        </tr>
		<tr>
            <td>그랜드코나코리아</td>
            <td><a href="https://smartstore.naver.com/grandkona?NaPm=ct%3Dmqgdfye1%7Cci%3Dcheckout%7Ctr%3Dds%7Ctrx%3Dnull%7Chk%3D6725490b2e00c6b0a27c78b24ee2eb6f7749a5c6" target="_blank">쇼핑몰바로가기</a></td>           
        </tr>		
    </tbody>
</table>
</div>
</div>
`,

  relative03: `
<div class="tab-e2 margin-top-30">
<div class="panel panel-green">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fa fa-align-justify"></i> 관련사이트</h3>
    </div>
  <table class="table table-bordered">
    <thead>
        <tr>
            <th style="text-align: center; font-size: 13px;">구분</th>
            <th style="text-align: center; font-size: 13px;">사이트명</th>
            <th style="text-align: center; font-size: 13px;">홈페이지</th>         
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="4">협력학회</td>
            <td>한국요가학회</td>
            <td><a href="http://www.k-yoga.org/" target="_blank">http://www.k-yoga.org/</a></td>      
        </tr>
		<tr>           
            <td>한국인도학회</td>
            <td><a href="http://www.indology.co.kr/" target="_blank">http://www.indology.co.kr/</a></td>           
        </tr>
		<tr>
            <td>한국아유르베다학회</td>
            <td><a href="http://cafe.naver.com/koreaayurveda" target="_blank">http://cafe.naver.com/koreaayurveda</a></td>
		</tr>
		<tr>
            <td>인도철학회</td>
            <td><a href="http://www.ksip.or.kr/home.html" target="_blank">http://www.ksip.or.kr/home.html</a></td>          
        </tr>		
    </tbody>
</table>
</div>
</div>
`,

  privacy: `
<div>
	<div class="headline"><h5 class="font-bold">제1조 총칙</h5></div>
	<ol>
		<li>본 사이트는 귀하의 개인정보보호를 매우 중요시하며, 『정보통신망이용촉진등에관한법률』상의 개인정보보호 규정 및 정보통신부가 제정한 『개인정보보호지침』을 준수하고 있습니다.
		<li>본 사이트는 개인정보보호방침을 통하여 귀하께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
		<li>본 사이트는 개인정보보호방침을 홈페이지 첫 화면 하단에 공개함으로써 귀하께서 언제나 용이하게 보실 수 있도록 조치하고 있습니다.
		<li>본 사이트는 개인정보취급방침을 개정하는 경우 웹사이트 공지사항(또는 개별공지)을 통하여 공지할 것입니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제2조 개인정보 수집에 대한 동의</h5></div>
	귀하께서 본 사이트의 개인정보보호방침 또는 이용약관의 내용에 대해 「동의한다」버튼 또는 「동의하지 않는다」버튼을 클릭할 수 있는 절차를 마련하여, 「동의한다」버튼을 클릭하면 개인정보 수집에 대해 동의한 것으로 봅니다.

	<div class="headline margin-top-30"><h5 class="font-bold">제3조 개인정보의 수집 및 이용목적</h5></div>
	<ol>
		<li>본 사이트는 다음과 같은 목적을 위하여 개인정보를 수집하고 있습니다.
		<ol style="list-style-type:disc;">
			<li>서비스제공을 위한 계약의 성립 : 본인식별 및 본인의사 확인 등			
			<li>회원 관리 : 회원제 서비스 이용에 따른 본인확인, 개인 식별, 불만처리 등 민원처리
			<li>기타 새로운 서비스, 이벤트 정보 안내
		</ol>
		<li>단, 이용자의 기본적 인권 침해의 우려가 있는 민감한 개인정보(인종 및 민족, 사상 및 신조, 출신지 및 본적지, 정치적 성향 및 범죄기록, 건강상태 및 성생활 등)는 수집하지 않습니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제4조 수집하는 개인정보 항목</h5></div>
	본 사이트는 회원가입, 상담, 서비스 신청 등등을 위해 아래와 같은 개인정보를 수집하고 있습니다.
	<ol>
		<li>수집항목 : 이름 , 생년월일 , 성별 , 로그인ID , 비밀번호 , 휴대전화번호 , 이메일 , 접속 로그 , 접속 IP 정보
		<li>개인정보 수집방법 : 홈페이지(회원가입), 온라인신청
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제5조 개인정보 자동수집 장치의 설치, 운영 및 그 거부에 관한 사항</h5></div>
	본 사이트는 귀하에 대한 정보를 저장하고 수시로 찾아내는 '쿠키(cookie)'를 사용합니다. 쿠키는 웹사이트가 귀하의 컴퓨터 브라우저(넷스케이프, 인터넷 익스플로러 등)로 전송하는 소량의 정보입니다. 귀하께서 웹사이트에 접속을 하면 본 쇼핑몰의 컴퓨터는 귀하의 브라우저에 있는 쿠키의 내용을 읽고, 귀하의 추가정보를 귀하의 컴퓨터에서 찾아 접속에 따른 성명 등의 추가 입력 없이 서비스를 제공할 수 있습니다.
	<p>
	쿠키는 귀하의 컴퓨터는 식별하지만 귀하를 개인적으로 식별하지는 않습니다. 또한 귀하는 쿠키에 대한 선택권이 있습니다. 웹브라우저의 옵션을 조정함으로써 모든 쿠키를 다 받아들이거나, 쿠키가 설치될 때 통지를 보내도록 하거나, 아니면 모든 쿠키를 거부할 수 있는 선택권을 가질 수 있습니다.
	<ol>
		<li>쿠키 등 사용 목적 : 이용자의 접속 빈도나 방문 시간 등을 분석, 이용자의 취향과 관심분야를 파악 및 자취 추적, 각종 이벤트 참여 정도 및 방문 회수 파악 등을 통한 타겟 마케팅 및 개인 맞춤 서비스 제공
		<li>쿠키 설정 거부 방법 : 쿠키 설정을 거부하는 방법으로는 귀하가 사용하는 웹 브라우저의 옵션을 선택함으로써 모든 쿠키를 허용하거나 쿠키를 저장할 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다.
		<li>설정방법 예시 : 인터넷 익스플로어의 경우 → 웹 브라우저 상단의 도구 > 인터넷 옵션 > 개인정보
		<li>단, 귀하께서 쿠키 설치를 거부하였을 경우 서비스 제공에 어려움이 있을 수 있습니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제6조 목적 외 사용 및 제3자에 대한 제공</h5></div>
	<ol>
		<li>본 사이트는 귀하의 개인정보를 "개인정보의 수집목적 및 이용목적"에서 고지한 범위 내에서 사용하며, 동 범위를 초과하여 이용하거나 타인 또는 타기업·기관에 제공하지 않습니다.
		<li>그러나 보다 나은 서비스 제공을 위하여 귀하의 개인정보를 제휴사에게 제공하거나 또는 제휴사와 공유할 수 있습니다. 개인정보를 제공하거나 공유할 경우에는 사전에 귀하께 제휴사가 누구인지, 제공 또는 공유되는 개인정보항목이 무엇인지, 왜 그러한 개인정보가 제공되거나 공유되어야 하는지, 그리고 언제까지 어떻게 보호·관리되는지에 대해 개별적으로 전자우편 및 서면을 통해 고지하여 동의를 구하는 절차를 거치게 되며, 귀하께서 동의하지 않는 경우에는 제휴사에게 제공하거나 제휴사와 공유하지 않습니다.
		<li>또한 이용자의 개인정보를 원칙적으로 외부에 제공하지 않으나, 아래의 경우에는 예외로 합니다.
		<ol style="list-style-type:disc;">
			<li>이용자들이 사전에 동의한 경우
			<li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
		</ol>
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제7조 개인정보의 열람 및 정정</h5></div>
	<ol>
		<li>귀하는 언제든지 등록되어 있는 귀하의 개인정보를 열람하거나 정정하실 수 있습니다. 개인정보 열람 및 정정을 하고자 할 경우에는 "회원정보수정"을 클릭하여 직접 열람 또는 정정하거나, 개인정보관리책임자에게 유선 및 E-mail로 연락하시면 조치하겠습니다.
		<li>귀하가 개인정보의 오류에 대한 정정을 요청한 경우, 정정을 완료하기 전까지 당해 개인정보를 이용하지 않습니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제8조 개인정보 수집, 이용, 제공에 대한 동의철회</h5></div>
	<ol>
		<li>회원가입 등을 통해 개인정보의 수집, 이용, 제공에 대해 귀하께서 동의하신 내용을 귀하는 언제든지 철회하실 수 있습니다. 개인정보관리책임자에게 유선 및 E-mail등으로 연락하시면 즉시 개인정보의 삭제 등 필요한 조치를 하겠습니다.
		<li>본 사이트는 개인정보의 수집에 대한 동의철회를 개인정보 수집시와 동등한 방법 및 절차로 행사할 수 있도록 필요한 조치를 하겠습니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제9조 개인정보의 보유 및 이용기간</h5></div>
	<ol>
		<li>원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.
		<ol style="list-style-type:disc;">
			<li>보존 항목 : 회원가입정보(로그인ID, 이름, 별명)
			<li>보존 근거 : 회원탈퇴시 다른 회원이 기존 회원아이디로 재가입하여 활동하지 못하도록 하기 위함
			<li>보존 기간 : 영구
		</ol>
		<li> 그리고 상법 등 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 거래 및 회원정보를 보관합니다.
		<ol style="list-style-type:disc;">
			<li>보존 항목 : 계약 또는 청약철회 기록, 대금 결제 및 재화공급 기록, 불만 또는 분쟁처리 기록
			<li>보존 근거 : 전자상거래등에서의 소비자보호에 관한 법률 제6조 거래기록의 보존
			<li>보존 기간 : 계약 또는 청약철회 기록(5년), 대금 결제 및 재화공급 기록(5년), 불만 또는 분쟁처리 기록(3년)
		</ol>
		<li>위 보유기간에도 불구하고 계속 보유하여야 할 필요가 있을 경우에는 귀하의 동의를 받겠습니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제10조 개인정보의 파기절차 및 방법</h5></div>
	본 사이트는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다. 파기절차 및 방법은 다음과 같습니다.
	<ol>
		<li>파기절차 : 귀하가 회원가입 등을 위해 입력하신 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기되어집니다. 별도 DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 보유되어지는 이외의 다른 목적으로 이용되지 않습니다.
		<li>파기방법 : 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제11조 아동의 개인정보 보호</h5></div>
	<ol>
		<li>본 사이트는 만14세 미만 아동의 개인정보를 수집하는 경우 법정대리인의 동의를 받습니다.
		<li>만14세 미만 아동의 법정대리인은 아동의 개인정보의 열람, 정정, 동의철회를 요청할 수 있으며, 이러한 요청이 있을 경우 본 사이트는 지체없이 필요한 조치를 취합니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제12조 개인정보 보호를 위한 기술적 대책</h5></div>
	본 사이트는 귀하의 개인정보를 취급함에 있어 개인정보가 분실, 도난, 누출, 변조 또는 훼손되지 않도록 안전성 확보를 위하여 다음과 같은 기술적 대책을 강구하고 있습니다.
	<ol>
		<li>귀하의 개인정보는 비밀번호에 의해 보호되며, 파일 및 전송 데이터를 암호화하거나 파일 잠금기능(Lock)을 사용하여 중요한 데이터는 별도의 보안기능을 통해 보호되고 있습니다.
		<li>본 사이트는 백신프로그램을 이용하여 컴퓨터바이러스에 의한 피해를 방지하기 위한 조치를 취하고 있습니다. 백신프로그램은 주기적으로 업데이트되며 갑작스런 바이러스가 출현할 경우 백신이 나오는 즉시 이를 제공함으로써 개인정보가 침해되는 것을 방지하고 있습니다.
		<li>해킹 등에 의해 귀하의 개인정보가 유출되는 것을 방지하기 위해, 외부로부터의 침입을 차단하는 장치를 이용하고 있습니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제13조 개인정보의 위탁처리</h5></div>
	본 사이트는 서비스 향상을 위해서 귀하의 개인정보를 외부에 위탁하여 처리할 수 있습니다.
	<ol>
		<li>개인정보의 처리를 위탁하는 경우에는 미리 그 사실을 귀하에게 고지하겠습니다.
		<li>개인정보의 처리를 위탁하는 경우에는 위탁계약 등을 통하여 서비스제공자의 개인정보호 관련 지시엄수, 개인정보에 관한 비밀유지, 제3자 제공의 금지 및 사고시의 책임부담 등을 명확히 규정하고 당해 계약내용을 서면 또는 전자적으로 보관하겠습니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제14조 의견수렴 및 불만처리</h5></div>
	<ol>
		<li>본 사이트는 개인정보보호와 관련하여 귀하가 의견과 불만을 제기할 수 있는 창구를 개설하고 있습니다. 개인정보와 관련한 불만이 있으신 분은 본 쇼핑몰의 개인정보 관리책임자에게 의견을 주시면 접수 즉시 조치하여 처리결과를 통보해 드립니다.
		<ol style="list-style-type:disc;">
			<li>개인정보관리책임자 성명 : 조은겸
			<li>전화번호 : 055-286-7071
			<li>이메일 : yogakorea@yogakorea.or.kr
		</ol>
		<li>또는 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.
		<ol style="list-style-type:disc;">
			<li>개인분쟁조정위원회 (<a href="http://www.1336.or.kr" target="_blank">www.1336.or.kr</a> / 1336)
			<li>정보보호마크인증위원회 (<a href="http://www.eprivacy.or.kr" target="_blank">www.eprivacy.or.kr</a> / 02-580-0533~4)
			<li>대검찰청 인터넷범죄수사센터 (<a href="http://icic.sppo.go.kr" target="_blank">icic.sppo.go.kr</a> / 02-3480-3600)
			<li>경찰청 사이버테러대응센터 (<a href="http://www.ctrc.go.kr" target="_blank">www.ctrc.go.kr</a> / 02-392-0330)
		</ol>
	</ol>

	<div class="tag-box tag-box-e2-y margin-top-30">
	    <p>부 칙(시행일) 이 약관은 2016년 10월 15일부터 시행합니다.</p>
	</div>
</div>
`,

  provision: `
<div>
	<div class="headline"><h5 class="font-bold">제1조 목적</h5></div>
	<p>이 약관은 본 사이트(이하 "몰"이라 한다)에서 제공하는 인터넷 관련 서비스(이하 "서비스"라 한다)를 이용함에 있어 사이버 몰과 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.</p>

	<div class="headline margin-top-30"><h5 class="font-bold">제2조 정의</h5></div>
	<ol>
		<li>"몰" 이란 재화 또는 용역(이하 "재화등"이라 함)을 이용자에게 제공하기 위하여 컴퓨터등 정보통신설비를 이용하여 재화등을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 사이버몰을 운영하는 사업자의 의미로도 사용합니다.
		<li>"이용자"란 "몰"에 접속하여 이 약관에 따라 "몰"이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
		<li>'회원'이라 함은 "몰"에 개인정보를 제공하여 회원등록을 한 자로서, "몰"의 정보를 지속적으로 제공받으며, "몰"이 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
		<li>'비회원'이라 함은 회원에 가입하지 않고 "몰"이 제공하는 서비스를 이용하는 자를 말합니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제3조 약관등의 명시와 설명 및 개정</h5></div>
	<ol>
		<li>"몰"은 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 전화번호·모사전송번호·전자우편주소, 사업자등록번호, 통신판매업신고번호, 개인정보관리책임자등을 이용자가 쉽게 알 수 있도록 사이버몰의 초기 서비스화면(전면)에 게시합니다. 다만, 약관의 내용은 이용자가 연결화면을 통하여 볼 수 있도록 할 수 있습니다.
		<li>"몰은 이용자가 약관에 동의하기에 앞서 약관에 정하여져 있는 내용 중 청약철회·배송책임·환불조건 등과 같은 중요한 내용을 이용자가 이해할 수 있도록 별도의 연결화면 또는 팝업화면 등을 제공하여 이용자의 확인을 구하여야 합니다.
		<li>"몰"은 전자상거래등에서의소비자보호에관한법률, 약관의규제에관한법률, 전자거래기본법, 전자서명법, 정보통신망이용촉진등에관한법률, 방문판매등에관한법률, 소비자보호법 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
		<li>"몰"이 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 몰의 초기화면에 그 적용일자 7일이전부터 적용일자 전일까지 공지합니다. 다만, 이용자에게 불리하게 약관내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예기간을 두고 공지합니다. 이 경우 "몰"은 개정전 내용과 개정후 내용을 명확하게 비교하여 이용자가 알기 쉽도록 표시합니다.
		<li>"몰"이 약관을 개정할 경우에는 그 개정약관은 그 적용일자 이후에 체결되는 계약에만 적용되고 그 이전에 이미 체결된 계약에 대해서는 개정전의 약관조항이 그대로 적용됩니다. 다만 이미 계약을 체결한 이용자가 개정약관 조항의 적용을 받기를 원하는 뜻을 제3항에 의한 개정약관의 공지기간내에 '몰"에 송신하여 "몰"의 동의를 받은 경우에는 개정약관 조항이 적용됩니다.
		<li>이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 전자상거래등에서의소비자보호에관한법률, 약관의규제등에관한법률, 공정거래위원회가 정하는 전자상거래등에서의소비자보호지침 및 관계법령 또는 상관례에 따릅니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제4조 서비스의 제공 및 변경</h5></div>
	<ol>
		<li>"몰"은 다음과 같은 업무를 수행합니다.
		<ol style="list-style-type:disc;">
			<li>재화 또는 용역에 대한 정보 제공 및 구매계약의 체결
			<li>구매계약이 체결된 재화 또는 용역의 배송
			<li>기타 "몰"이 정하는 업무
		</ol>
		<li>"몰"은 재화 또는 용역의 품절 또는 기술적 사양의 변경 등의 경우에는 장차 체결되는 계약에 의해 제공할 재화 또는 용역의 내용을 변경할 수 있습니다. 이 경우에는 변경된 재화 또는 용역의 내용 및 제공일자를 명시하여 현재의 재화 또는 용역의 내용을 게시한 곳에 즉시 공지합니다.
		<li>"몰"이 제공하기로 이용자와 계약을 체결한 서비스의 내용을 재화등의 품절 또는 기술적 사양의 변경 등의 사유로 변경할 경우에는 그 사유를 이용자에게 통지 가능한 주소로 즉시 통지합니다.
		<li>전항의 경우 "몰"은 이로 인하여 이용자가 입은 손해를 배상합니다. 다만, "몰"이 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제5조 서비스의 중단</h5></div>
	<ol>
		<li>"몰"은 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
		<li>"몰"은 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단, "몰"이 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
		<li>사업종목의 전환, 사업의 포기, 업체간의 통합 등의 이유로 서비스를 제공할 수 없게 되는 경우에는 "몰"은 제8조에 정한 방법으로 이용자에게 통지하고 당초 "몰"에서 제시한 조건에 따라 소비자에게 보상합니다. 다만, "몰"이 보상기준 등을 고지하지 아니한 경우에는 이용자들의 마일리지 또는 적립금 등을 "몰"에서 통용되는 통화가치에 상응하는 현물 또는 현금으로 이용자에게 지급합니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제6조 회원가입</h5></div>
	<ol>
		<li>이용자는 "몰"이 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.
		<li>"몰"은 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각호에 해당하지 않는 한 회원으로 등록합니다.
		<ol style="list-style-type:disc;">
			<li>가입신청자가 이 약관 제7조제3항에 의하여 이전에 회원자격을 상실한 적이 있는 경우, 다만 제7조제3항에 의한 회원자격 상실후 3년이 경과한 자로서 "몰"의 회원재가입 승낙을 얻은 경우에는 예외로 한다.
			<li>등록 내용에 허위, 기재누락, 오기가 있는 경우
			<li>기타 회원으로 등록하는 것이 "몰"의 기술상 현저히 지장이 있다고 판단되는 경우
		</ol>
		<li>회원가입계약의 성립시기는 "몰"의 승낙이 회원에게 도달한 시점으로 합니다.
		<li>회원은 제15조제1항에 의한 등록사항에 변경이 있는 경우, 즉시 전자우편 기타 방법으로 "몰"에 대하여 그 변경사항을 알려야 합니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제7조 회원 탈퇴 및 자격 상실 등</h5></div>
	<ol>
		<li>회원은 "몰"에 언제든지 탈퇴를 요청할 수 있으며 "몰"은 즉시 회원탈퇴를 처리합니다.
		<li>회원이 다음 각호의 사유에 해당하는 경우, "몰"은 회원자격을 제한 및 정지시킬 수 있습니다.
		<ol style="list-style-type:disc;">
			<li>가입 신청시에 허위 내용을 등록한 경우
			<li>"몰"을 이용하여 구입한 재화등의 대금, 기타 "몰"이용에 관련하여 회원이 부담하는 채무를 기일에 지급하지 않는 경우
			<li>다른 사람의 "몰" 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우
			<li>"몰"을 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우
		</ol>
		<li>"몰"이 회원 자격을 제한·정지 시킨후, 동일한 행위가 2회이상 반복되거나 30일이내에 그 사유가 시정되지 아니하는 경우 "몰"은 회원자격을 상실시킬 수 있습니다.
		<li>"몰"이 회원자격을 상실시키는 경우에는 회원등록을 말소합니다. 이 경우 회원에게 이를 통지하고, 회원등록 말소전에 최소한 30일 이상의 기간을 정하여 소명할 기회를 부여합니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제8조 회원에 대한 통지</h5></div>
	<ol>
		<li>"몰"이 회원에 대한 통지를 하는 경우, 회원이 "몰"과 미리 약정하여 지정한 전자우편 주소로 할 수 있습니다.
		<li>"몰"은 불특정다수 회원에 대한 통지의 경우 1주일이상 "몰" 게시판에 게시함으로서 개별 통지에 갈음할 수 있습니다. 다만, 회원 본인의 거래와 관련하여 중대한 영향을 미치는 사항에 대하여는 개별통지를 합니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제9조 구매신청</h5></div>
	"몰"이용자는 "몰"상에서 다음 또는 이와 유사한 방법에 의하여 구매를 신청하며, "몰"은 이용자가 구매신청을 함에 있어서 다음의 각 내용을 알기 쉽게 제공하여야 합니다.  단, 회원인 경우 제2호 내지 제4호의 적용을 제외할 수 있습니다.
	<ol>
		<li>재화등의 검색 및 선택
		<li>성명, 주소, 전화번호, 전자우편주소(또는 이동전화번호) 등의 입력
		<li>약관내용, 청약철회권이 제한되는 서비스, 배송료·설치비 등의 비용부담과 관련한 내용에 대한 확인
		<li>이 약관에 동의하고 위 3.호의 사항을 확인하거나 거부하는 표시(예, 마우스 클릭)
		<li>재화등의 구매신청 및 이에 관한 확인 또는 "몰"의 확인에 대한 동의
		<li>결제방법의 선택
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제10조 계약의 성립</h5></div>
	<ol>
		<li>"몰"은 제9조와 같은 구매신청에 대하여 다음 각호에 해당하면 승낙하지 않을 수 있습니다. 다만, 미성년자와 계약을 체결하는 경우에는 법정대리인의 동의를 얻지 못하면 미성년자 본인 또는 법정대리인이 계약을 취소할 수 있다는 내용을 고지하여야 합니다.
		<ol style="list-style-type:disc;">
			<li>신청 내용에 허위, 기재누락, 오기가 있는 경우
			<li>미성년자가 담배, 주류등 청소년보호법에서 금지하는 재화 및 용역을 구매하는 경우
			<li>기타 구매신청에 승낙하는 것이 "몰" 기술상 현저히 지장이 있다고 판단하는 경우
		</ol>
		<li>"몰"의 승낙이 제12조제1항의 수신확인통지형태로 이용자에게 도달한 시점에 계약이 성립한 것으로 봅니다.
		<li>"몰"의 승낙의 의사표시에는 이용자의 구매 신청에 대한 확인 및 판매가능 여부, 구매신청의 정정 취소등에 관한 정보등을 포함하여야 합니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제11조 지급방법</h5></div>
	"몰"에서 구매한 재화 또는 용역에 대한 대금지급방법은 다음 각호의 방법중 가용한 방법으로 할 수 있습니다. 단, "몰"은 이용자의 지급방법에 대하여 재화 등의 대금에 어떠한 명목의 수수료도 추가하여 징수할 수 없습니다.
	<ol>
		<li>폰뱅킹, 인터넷뱅킹, 메일 뱅킹 등의 각종 계좌이체
		<li>선불카드, 직불카드, 신용카드 등의 각종 카드 결제
		<li>온라인무통장입금
		<li>전자화폐에 의한 결제
		<li>수령시 대금지급
		<li>마일리지 등 "몰"이 지급한 포인트에 의한 결제
		<li>"몰"과 계약을 맺었거나 "몰"이 인정한 상품권에 의한 결제
		<li>기타 전자적 지급 방법에 의한 대금 지급 등
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제12조 수신확인통지·구매신청 변경 및 취소</h5></div>
	<ol>
		<li>"몰"은 이용자의 구매신청이 있는 경우 이용자에게 수신확인통지를 합니다.
		<li>수신확인통지를 받은 이용자는 의사표시의 불일치등이 있는 경우에는 수신확인통지를 받은 후 즉시 구매신청 변경 및 취소를 요청할 수 있고 "몰"은 배송전에 이용자의 요청이 있는 경우에는 지체없이 그 요청에 따라 처리하여야 합니다. 다만 이미 대금을 지불한 경우에는 제15조의 청약철회 등에 관한 규정에 따릅니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제13조 재화등의 공급</h5></div>
	<ol>
		<li>"몰"은 이용자와 재화등의 공급시기에 관하여 별도의 약정이 없는 이상, 이용자가 청약을 한 날부터 7일 이내에 재화 등을 배송할 수 있도록 주문제작, 포장 등 기타의 필요한 조치를 취합니다. 다만, "몰"이 이미 재화 등의 대금의 전부 또는 일부를 받은 경우에는 대금의 전부 또는 일부를 받은 날부터 2영업일 이내에 조치를 취합니다.  이때 "몰"은 이용자가 재화등의 공급 절차 및 진행 사항을 확인할 수 있도록 적절한 조치를 합니다.
		<li>"몰"은 이용자가 구매한 재화에 대해 배송수단, 수단별 배송비용 부담자, 수단별 배송기간 등을 명시합니다. 만약 "몰"이 약정 배송기간을 초과한 경우에는 그로 인한 이용자의 손해를 배상하여야 합니다. 다만 "몰"이 고의·과실이 없음을 입증한 경우에는 그러하지 아니합니다.
	</ol>

	<div class="sub_title">제14조 환급</div>
	<div class="headline margin-top-30"><h5 class="font-bold">제2조 정의</h5></div>
	"몰"은 이용자가 구매신청한 재화등이 품절 등의 사유로 인도 또는 제공을 할 수 없을 때에는 지체없이 그 사유를 이용자에게 통지하고 사전에 재화 등의 대금을 받은 경우에는 대금을 받은 날부터 2영업일 이내에 환급하거나 환급에 필요한 조치를 취합니다.

	<div class="headline margin-top-30"><h5 class="font-bold">제15조 청약철회 등</h5></div>
	<ol>
		<li>"몰"과 재화등의 구매에 관한 계약을 체결한 이용자는 수신확인의 통지를 받은 날부터 7일 이내에는 청약의 철회를 할 수 있습니다.
		<li>이용자는 재화등을 배송받은 경우 다음 각호의 1에 해당하는 경우에는 반품 및 교환을 할 수 없습니다.
		<ol style="list-style-type:disc;">
			<li>이용자에게 책임 있는 사유로 재화 등이 멸실 또는 훼손된 경우(다만, 재화 등의 내용을 확인하기 위하여 포장 등을 훼손한 경우에는 청약철회를 할 수 있습니다)
			<li>이용자의 사용 또는 일부 소비에 의하여 재화 등의 가치가 현저히 감소한 경우
			<li>시간의 경과에 의하여 재판매가 곤란할 정도로 재화등의 가치가 현저히 감소한 경우
			<li>같은 성능을 지닌 재화등으로 복제가 가능한 경우 그 원본인 재화 등의 포장을 훼손한 경우
		</ol>
		<li>제2항제2호 내지 제4호의 경우에 "몰"이 사전에 청약철회 등이 제한되는 사실을 소비자가 쉽게 알 수 있는 곳에 명기하거나 시용상품을 제공하는 등의 조치를 하지 않았다면 이용자의 청약철회등이 제한되지 않습니다.
		<li>이용자는 제1항 및 제2항의 규정에 불구하고 재화등의 내용이 표시·광고 내용과 다르거나 계약내용과 다르게 이행된 때에는 당해 재화등을 공급받은 날부터 3월이내, 그 사실을 안 날 또는 알 수 있었던 날부터 30일 이내에 청약철회 등을 할 수 있습니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제16조 청약철회 등의 효과</h5></div>
	<ol>
		<li>"몰"은 이용자로부터 재화 등을 반환받은 경우 3영업일 이내에 이미 지급받은 재화등의 대금을 환급합니다. 이 경우 "몰"이 이용자에게 재화등의 환급을 지연한 때에는 그 지연기간에 대하여 공정거래위원회가 정하여 고시하는 지연이자율을 곱하여 산정한 지연이자를 지급합니다.
		<li>"몰"은 위 대금을 환급함에 있어서 이용자가 신용카드 또는 전자화폐 등의 결제수단으로 재화등의 대금을 지급한 때에는 지체없이 당해 결제수단을 제공한 사업자로 하여금 재화등의 대금의 청구를 정지 또는 취소하도록 요청합니다.
		<li>청약철회등의 경우 공급받은 재화등의 반환에 필요한 비용은 이용자가 부담합니다. "몰"은 이용자에게 청약철회등을 이유로 위약금 또는 손해배상을 청구하지 않습니다. 다만 재화등의 내용이 표시·광고 내용과 다르거나 계약내용과 다르게 이행되어 청약철회등을 하는 경우 재화등의 반환에 필요한 비용은 "몰"이 부담합니다.
		<li>이용자가 재화등을 제공받을때 발송비를 부담한 경우에 "몰"은 청약철회시 그 비용을  누가 부담하는지를 이용자가 알기 쉽도록 명확하게 표시합니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제17조 개인정보보호</h5></div>
	<ol>
		<li>"몰"은 이용자의 정보수집시 구매계약 이행에 필요한 최소한의 정보를 수집합니다. 다음 사항을 필수사항으로 하며 그 외 사항은 선택사항으로 합니다.
		<ol style="list-style-type:disc;">
			<li>성명
			<li>주소
			<li>전화번호
			<li>희망ID(회원의 경우)
			<li>비밀번호(회원의 경우)
			<li>전자우편주소(또는 이동전화번호)
		</ol>
		<li>"몰"이 이용자의 개인식별이 가능한 개인정보를 수집하는 때에는 반드시 당해 이용자의 동의를 받습니다.
		<li>제공된 개인정보는 당해 이용자의 동의없이 목적외의 이용이나 제3자에게 제공할 수 없으며, 이에 대한 모든 책임은 "몰"이 집니다. 다만, 다음의 경우에는 예외로 합니다.
		<ol style="list-style-type:disc;">
			<li>배송업무상 배송업체에게 배송에 필요한 최소한의 이용자의 정보(성명, 주소, 전화번호)를 알려주는 경우
			<li>통계작성, 학술연구 또는 시장조사를 위하여 필요한 경우로서 특정 개인을 식별할 수 없는 형태로 제공하는 경우
			<li>재화등의 거래에 따른 대금정산을 위하여 필요한 경우
			<li>도용방지를 위하여 본인확인에 필요한 경우
			<li>법률의 규정 또는 법률에 의하여 필요한 불가피한 사유가 있는 경우
		</ol>
		<li>"몰"이 제2항과 제3항에 의해 이용자의 동의를 받아야 하는 경우에는 개인정보관리 책임자의 신원(소속, 성명 및 전화번호, 기타 연락처), 정보의 수집목적 및 이용목적, 제3자에 대한 정보제공 관련사항(제공받은자, 제공목적 및 제공할 정보의 내용) 등 정보통신망이용촉진등에관한법률 제22조제2항이 규정한 사항을 미리 명시하거나 고지해야 하며 이용자는 언제든지 이 동의를 철회할 수 있습니다.
		<li>이용자는 언제든지 "몰"이 가지고 있는 자신의 개인정보에 대해 열람 및 오류정정을 요구할 수 있으며 "몰"은 이에 대해 지체없이 필요한 조치를 취할 의무를 집니다. 이용자가 오류의 정정을 요구한 경우에는 "몰"은 그 오류를 정정할 때까지 당해 개인정보를 이용하지 않습니다.
		<li>"몰"은 개인정보 보호를 위하여 관리자를 한정하여 그 수를 최소화하며 신용카드, 은행계좌 등을 포함한 이용자의 개인정보의 분실, 도난, 유출, 변조 등으로 인한 이용자의 손해에 대하여 모든 책임을  집니다.
		<li>"몰" 또는 그로부터 개인정보를 제공받은 제3자는 개인정보의 수집목적 또는 제공받은 목적을 달성한 때에는 당해 개인정보를 지체없이 파기합니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제18조 "몰"의 의무</h5></div>
	<ol>
		<li>"몰"은 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라 지속적이고, 안정적으로 재화·용역을 제공하는데 최선을 다하여야 합니다.
		<li>"몰"은 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보(신용정보 포함)보호를 위한 보안 시스템을 갖추어야 합니다.
		<li>"몰"이 상품이나 용역에 대하여 「표시·광고의공정화에관한법률」 제3조 소정의 부당한 표시·광고행위를 함으로써 이용자가 손해를 입은 때에는 이를 배상할 책임을 집니다.
		<li>"몰"은 이용자가 원하지 않는 영리목적의 광고성 전자우편을 발송하지 않습니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제19조 회원의 ID 및 비밀번호에 대한 의무</h5></div>
	<ol>
		<li>제17조의 경우를 제외한 ID와 비밀번호에 관한 관리책임은 회원에게 있습니다.
		<li>회원은 자신의 ID 및 비밀번호를 제3자에게 이용하게 해서는 안됩니다.
		<li>회원이 자신의 ID 및 비밀번호를 도난당하거나 제3자가 사용하고 있음을 인지한 경우에는 바로 "몰"에 통보하고 "몰"의 안내가 있는 경우에는 그에 따라야 합니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제20조 이용자의 의무</h5></div>
	이용자는 다음 행위를 하여서는 안됩니다.
	<ol>
		<li>신청 또는 변경시 허위 내용의 등록
		<li>타인의 정보 도용
		<li>"몰"에 게시된 정보의 변경
		<li>"몰"이 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시
		<li>"몰" 기타 제3자의 저작권 등 지적재산권에 대한 침해
		<li>"몰" 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위
		<li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 몰에 공개 또는 게시하는 행위
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제21조 연결"몰"과 피연결"몰" 간의 관계</h5></div>
	<ol>
		<li>상위 "몰"과 하위 "몰"이 하이퍼 링크(예: 하이퍼 링크의 대상에는 문자, 그림 및 동화상 등이 포함됨)방식 등으로 연결된 경우, 전자를 연결 "몰"(웹 사이트)이라고 하고 후자를 피연결 "몰"(웹사이트)이라고 합니다.
		<li>연결"몰"은 피연결"몰"이 독자적으로 제공하는 재화등에 의하여 이용자와 행하는 거래에 대해서 보증책임을 지지 않는다는 뜻을 연결"몰"의 초기화면 또는 연결되는 시점의 팝업화면으로 명시한 경우에는 그 거래에 대한 보증책임을 지지 않습니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제22조 저작권의 귀속 및 이용제한</h5></div>
	<ol>
		<li>"몰"이 작성한 저작물에 대한 저작권 기타 지적재산권은 "몰"에 귀속합니다.
		<li>이용자는 "몰"을 이용함으로써 얻은 정보 중 "몰"에게 지적재산권이 귀속된 정보를 "몰"의 사전 승낙없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
		<li>"몰"은 약정에 따라 이용자에게 귀속된 저작권을 사용하는 경우 당해 이용자에게 통보하여야 합니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제23조 분쟁해결</h5></div>
	<ol>
		<li>"몰"은 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.
		<li>"몰"은 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다. 다만, 신속한 처리가 곤란한 경우에는 이용자에게 그 사유와 처리일정을 즉시 통보해 드립니다.
		<li>"몰"과 이용자간에 발생한 전자상거래 분쟁과 관련하여 이용자의 피해구제신청이 있는 경우에는 공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.
	</ol>

	<div class="headline margin-top-30"><h5 class="font-bold">제24조 재판권 및 준거법</h5></div>
	<ol>
		<li>"몰"과 이용자간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다. 다만, 제소 당시 이용자의 주소 또는 거소가 분명하지 않거나 외국 거주자의 경우에는 민사소송법상의 관할법원에 제기합니다.
		<li>"몰"과 이용자간에 제기된 전자상거래 소송에는 한국법을 적용합니다.
	</ol>

	<div class="tag-box tag-box-e2-y margin-top-30">
	    <p>부 칙(시행일) 이 약관은 OOOO년 O월 O일부터 시행합니다.</p>
	</div>
</div>
`,

  noemail: `
<div>
	<p class="margin-top-50 margin-bottom-30">본 사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집 되는 것을 거부하며, 이를 위반시 정보 통신망법에 의해 형사처벌됨을 유념하시기 바랍니다.</p>

	<blockquote class="hero hero-default margin-bottom-30">
	    <p><i class="fa fa-info-circle"></i> 정보통신망법 제50조의2(전자우편주소의 무단 수집행위 등 금지)</p>
	</blockquote>

	<div class="bg-light">
		<ol class="margin-top-10">
			<li>누구든지 전자우편주소의 수집을 거부하는 의사가 명시된 인터넷 홈페이지에서 자동으로 전자우편주소를 수집하는 프로그램이나 그 밖의 기술적 장치를 이용하여 전자우편주소를 수집하여서는 아니된다.</li>
			<li>누구든지 제1항의 규정을 위반하여 수집된 전자우편주소를 판매 유통하여서는 아니된다.</li>
			<li>누구든지 제1항 및 제2항의 규정에 의하여 수집·판매 및 유통이 금지된 전자우편주소임을 알고 이를 정보 전송에 용하여서는 아니된다.</li>
		</ol>
	</div>

	<div class="tag-box tag-box-e2-y margin-top-30">
	    <p><i class="fa fa-exclamation-triangle color-red"></i> 위반 시 1천만원 이하의 벌금</p>
	</div>
</div>
`,
};
