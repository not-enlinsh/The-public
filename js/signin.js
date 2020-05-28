(function (tool, initData) {
    var signinNumber = 0
    var signinBonus = []
    var signinLock = false
    function setDayInfo() {
        var dateObj = new Date()
        var year = dateObj.getFullYear()
        var month = dateObj.getMonth() + 1
        if (month < 10) {
            month = year + '年0' + month + '月'
        } else {
            month = year + '年' + month + '月'
        }
        var curDate = dateObj.getDate()
        var day = dateObj.getDay()
        switch (day) {
            case 0:
                day = '星期日'
                break;
            case 1:
                day = '星期一'
                break;
            case 2:
                day = '星期二'
                break;
            case 3:
                day = '星期三'
                break;
            case 4:
                day = '星期四'
                break;
            case 5:
                day = '星期五'
                break;
            case 6:
                day = '星期六'
                break;
            default:
                break;
        }
        $('.month').empty().text(month)
        $('.date').empty().text(curDate)
        $('.day').empty().text(day)
    }
    function setListItem(continueNumber) {
        var $li
        $('.c-head').empty()
        if (continueNumber < 5) {
            for (var selI = 0; selI < 5; selI++) {
                var award1 = signinBonus[selI]
                var day1 = selI + 1
                if (day1 !== continueNumber && day1 < 5) {
                    $li = '<li class="s-item"><div class="day">第' + day1 + '天</div><div class="num">+' + award1 + '</div></li>'
                } else if (day1 === 5) {
                    $li = '<li class="s-item"><div class="day">' + '>=第' + 5 + '天</div><div class="num">+' + award1 + '</div></li>'
                } else {
                    $li = '<li class="s-item c-day"><div class="day">第' + day1 + '天</div><div class="num">+' + award1 + '</div></li>'
                }
                $('.c-head').append($li)
            }
        } else {
            for (var bigI = 0; bigI < 5; bigI++) {
                var award2 = signinBonus[bigI]
                var day2 = bigI + 1
                if (day2 < 5) {
                    $li = '<li class="s-item"><div class="day">第' + day2 + '天</div><div class="num">+' + award2 + '</div></li>'
                } else {
                    $li = '<li class="s-item c-day"><div class="day">>=第5天</div><div class="num">+' + award2 + '</div></li>'
                }
                $('.c-head').append($li)
            }
        }
    }
    function signinSuc(resp) {
        if (resp && !resp.error) {
            console.log(resp)
            signinNumber++
            $('.c-num').empty().text(' ' + signinNumber + ' ')
            $('.tips-row1').show()
            setListItem(signinNumber)
            initData.isSignin = true
            var award = '签到成功，获得' + resp.data.starNumber + '颗守护星'
            $('.signin-toast').text(award).show()
            setTimeout(() => {
                $('.signin-toast').hide()
                signinLock = false
            }, 1500)
            $('.r-b').removeClass('not-done').removeClass('done').addClass('done').text('已签到').hide()
            $('.l-c-row2').empty().text('长按识别 为爱豆打榜')
            $('.qr-code').show()
        } else {
            if (resp.error.rawMessage === '任务已经完成') {
                $('.signin-toast').text('今日已签到').show()
                setTimeout(() => {
                    $('.signin-toast').hide()
                    signinLock = false
                }, 1500)
            } else {
                $('.signin-toast').text(`${resp.error.rawMessage}`).show()
                setTimeout(() => {
                    $('.signin-toast').hide()
                    signinLock = false
                }, 1500)
            }
        }
    }
    function pageInit() {
        try {
            signinNumber = initData.signinNumber
            if (signinNumber > 0) {
                $('.c-num').empty().text(' ' + signinNumber + ' ')
                $('.tips-row1').show()
            }
            signinBonus = initData.signinBonus.slice(0, 5)
            setDayInfo()
            if (!initData.isSignin) {
                $('.r-b').removeClass('done').removeClass('not-done').addClass('not-done').text('签到').show()
            } else {
                $('.r-b').removeClass('done').removeClass('not-done').addClass('done').text('已签到').hide()
                $('.l-c-row2').empty().text('长按识别 为爱豆打榜')
                $('.qr-code').show()
            }
            setListItem(signinNumber)
            $('.r-b').click(function () {
                if ($(this).hasClass('not-done') && !signinLock && initData.user.objectId) {
                    signinLock = true
                    tool.ajax('/api/v1/user/task', {
                        type: 'signin',
                        userId: initData.user.objectId
                    }, signinSuc, 'POST', false, function (err) {
                        $('.signin-toast').text(err).show()
                        setTimeout(() => {
                            $('.signin-toast').hide()
                            signinLock = false
                        }, 1500)
                    })
                }
            })
            $('.rule').click(function () {
                $('.pop-up').show()
            })
            $('.close-btn').click(function () {
                $('.pop-up').hide()
            })
        } catch (err) {
            // $('body').empty().text(err)
            console.log(err)
        }
    }
    pageInit()
})(window.tool, window.initData)
