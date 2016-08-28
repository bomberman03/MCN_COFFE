/**
 * Created by pathFinder on 2016-08-12.
 */
app.factory('terms', [function() {
    var s = '<div class="el-0">제15조(개인정보의 수집ㆍ이용)</div><br>' +
            '<div class="el">' +
            '<div><span class="number">①</span> 개인정보처리자는 다음 각 호의 어느 하나에 해당하는 경우에는 개인정보를 수집할 수 있으며 그 수집 목적의 범위에서 이용할 수 있다.</div><br>' +
            '<div class="el">' +
            '<div><span class="number">1.</span> 정보주체의 동의를 받은 경우</div>' +
            '<div><span class="number">2.</span> 법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위하여 불가피한 경우</div>' +
            '<div><span class="number">3.</span> 공공기관이 법령 등에서 정하는 소관 업무의 수행을 위하여 불가피한 경우</div>' +
            '<div><span class="number">4.</span> 정보주체와의 계약의 체결 및 이행을 위하여 불가피하게 필요한 경우</div>' +
            '<div><span class="number">5.</span> 정보주체 또는 그 법정대리인이 의사표시를 할 수 없는 상태에 있거나 주소불명 등으로 사전 동의를 받을 수 없는 경우로서 명백히 정보주체 또는 제3자의 급박한 생명, 신체, 재산의 이익을 위하여 필요하다고 인정되는 경우</div>' +
            '<div><span class="number">6.</span> 개인정보처리자의 정당한 이익을 달성하기 위하여 필요한 경우로서 명백하게 정보주체의 권리보다 우선하는 경우. 이 경우 개인정보처리자의 정당한 이익과 상당한 관련이 있고 합리적인 범위를 초과하지 아니하는 경우에 한한다.</div>' +
            '</div>' +
            '</div><br>' +
            '<div class="el">' +
            '<div><span class="number">②</span> 개인정보처리자는 제1항제1호에 따른 동의를 받을 때에는 다음 각 호의 사항을 정보주체에게 알려야 한다. 다음 각 호의 어느 하나의 사항을 변경하는 경우에도 이를 알리고 동의를 받아야 한다.</div><br>' +
            '<div class="el">' +
            '<div><span class="number">1.</span> 개인정보의 수집·이용 목적</div>' +
            '<div><span class="number">2.</span> 수집하려는 개인정보의 항목</div>' +
            '<div><span class="number">3.</span> 개인정보의 보유 및 이용 기간</div>' +
            '<div><span class="number">4.</span> 동의를 거부할 권리가 있다는 사실 및 동의 거부에 따른 불이익이 있는 경우에는 그 불이익의 내용</div>' +
            '</div>' +
            '</div><br>';
    var o = {
        terms: [
            s,
            s
        ]
    };
    return o;
}]);