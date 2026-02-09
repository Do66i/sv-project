class Reporter {
    onRunComplete(contexts, results) {
        console.log('\n');

        if (results.numFailedTests === 0) {
            // ✅ 성공: 깔끔, 명료, 화려함
            console.log('\x1b[32m%s\x1b[0m', '   (ﾉ^ヮ^)ﾉ*:･ﾟ✧   ✨  TEST PASSED  ✨   ✧ﾟ･: *ヽ(^ヮ^ヽ)');
            console.log('\x1b[32m%s\x1b[0m', '   *:･ﾟ✧*:･ﾟ✧*:･ﾟ✧*:･ﾟ✧*:･ﾟ✧*:･ﾟ✧*:･ﾟ✧*:･ﾟ✧*:･ﾟ✧*:･ﾟ✧');
            console.log('   🌈   결과  :  전체 테스트 통과 (All Passed)');
            console.log('   💎   상태  :  결점 없음 (Stable)');
            console.log('   🚀   제안  :  커밋(Commit) 권장');
            console.log('\x1b[32m%s\x1b[0m', '   *:･ﾟ✧*:･ﾟ✧*:･ﾟ✧*:･ﾟ✧*:･ﾟ✧*:･ﾟ✧*:･ﾟ✧*:･ﾟ✧*:･ﾟ✧*:･ﾟ✧');

        } else {
            // ❌ 실패: 드라이한 팩트 전달
            console.log('\x1b[31m%s\x1b[0m', '   (╯°□°）╯︵ ┻━┻   🚨  TEST FAILED  🚨');
            console.log('\x1b[31m%s\x1b[0m', '   xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
            console.log('   🔥   결과  :  테스트 실패 (Error Found)');
            console.log('   👻   원인  :  상단 로그 확인 필요');
            console.log('   🚑   조치  :  코드 수정 및 디버깅 요망');
            console.log('\x1b[31m%s\x1b[0m', '   xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        }

        console.log('\n');
    }
}

module.exports = Reporter;
