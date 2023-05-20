// VK API
const TOKEN = "vk1.a.PfD30rLv8JpK3-RBjksczmShBSymiZ0gxlZn2FixH-B8OG-MA_GVSB-aOFlvydrzzyAYpPfs6Q8_fRUWJxapzjyHpcuzBynC2baY_fU0WkzgqC5yK1-tvY9fGEtBdnzZdOvFI1EPbst2XPt-yyR6JxTN7-T51bSaIhjNzcjPpWo1XD7DBhdAaJLBN1o0I36R31L0ORlG4wuLc1i4p2Jpaw"

function getMethodUrl(method, params) {
    params = params || {}
    params['access_token'] = TOKEN
    params['v'] = "5.131"
    return "https://api.vk.com/method/" + method + "?" + $.param(params)
}

export function VKsendRequest(method, params, func=null) {
    $.ajax({
        url: getMethodUrl(method, params),
        method: 'GET',
        dataType: 'JSONP',
        success: func,
    })
}

export function VKsendMessage(peer_id, message, func=null) {
    VKsendRequest('messages.send', {peer_id: peer_id, random_id: 0, message: message}, 
        (data) => {
            if (func) {
                func(data.response)
            }
        }
    )
}

// VKsendMessage(2000000007, "ку", (data) => {
//     console.log(data);
// })


// 2000000001 Рп беседа
// 2000000002 test_chamber
// 2000000005 logs
// 2000000006 Географ Жалобы
// 2000000007 Географ Логи
// 2000000008 Географ Ошибки