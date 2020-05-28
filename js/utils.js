(function () {
    window.tool = {
        ajax: function (url, data = {}, success, type = 'GET', async = true, error) {
            var href = window.location.href
            var host = window.location.host
            var baseUrl
            if(href.indexOf("https") !== -1) {
                baseUrl = 'https://' + host
            } else {
                baseUrl = 'http://192.168.1.101:3002'
            }
            // var baseUrl = 'https://mxsleng.remarkable.cn'
            // var baseUrl = 'http://192.168.1.101:3002'
            $.ajax({
                url: `${baseUrl}${url}`,
                type,
                async,
                data,
                success(resp) {
                    console.log('ajax成功', resp)
                    success(resp)
                },
                error(err) {
                    console.log(err)
                    error(err.responseText)
                },
                complete() {
                    // doSomething
                }
            })
        },
        escape: function (str) {
            str = str.replace(/&/g, '&amp;')
            str = str.replace(/</g, '&lt;')
            str = str.replace(/>/g, '&gt;')
            str = str.replace(/"/g, '&quto;')
            str = str.replace(/'/g, '&#39;')
            str = str.replace(/`/g, '&#96;')
            str = str.replace(/\//g, '&#x2F;')
            return str
        },
        getQueryVariable: function (variable) {
            var query = window.location.search.substring(1)
            var vars = query.split('&')
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=')
                if (pair[0] === variable) { return pair[1] }
            }
            return (false)
        }
    }
})()
