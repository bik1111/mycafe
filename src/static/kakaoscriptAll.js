getdatas = []
m_infos = []
positions = []

$.ajax({
    type:'get',
    url : "/data",
    success : function(response) {
        getdatas = response['result']
        for (i=0; i < getdatas.length; i++) {
            let m_g = getdatas[i]['name']
            let m_t = getdatas[i]['lat']
            let m_g = getdatas[i]['lng']
            let m_a = getdatas[i]['address']
            let m_n = getdatas[i]['number']


            let m_info = {'name': m_g, 'lat': m_t, 'lng': m_g, 'address':m_a, 'number': m_n}
            m_infos.push(m_info)

            console.log(m_info)
            console.log(m_infos)

        }


        // 마커

        for (var i =0; i < m_infos.length; i++) {
            var m_i_name = m_infos[i]['name']
            var m_i_t = m_infos[i]['lat']
            var m_i_g = m_infos[i]['lng']
            var m_i_a = m_infos[i]['address']
            var m_i_n = m_infos[i]['number']
            
            var gb_position = { content: `<div class="ifw"><h5>${m_i_name}</h5><h6>${m_i_a}</h6><h5>${m_i_n}</h5>`, latlng: new kakao.maps.LatLng(m_i_g, m_i_t) }
            positions.push(gb_position)        

        }

        for (var i =0; i < positions.length; i++) {
            var m_i_addr = m_infos[i]['address']
            var m_i_name = m_infos[i]['name']
            var marker = new kakao.maps.Marker({
                map: map,
                position: positions[i].latlng,
                clickable: true
            })
            var iwContent = `<div id="iw_con_info"><h5>${m_i_name}</h5><h5>${m_i_addr}</h5></div>`, // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
                iwRemoveable = true;

            var infowindow = new kakao.maps.InfoWindow({
                content: iwContent,
                removable: iwRemoveable
                });
            
            kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow));


        }

    }

})

// 인포윈도우를 표시하는 클로저를 만드는 함수
function makeOverListener(map, marker, infowindow) {
    return function () {
        infowindow.open(map, marker);
    };
}
// 인포윈도우를 닫는 클로저를 만드는 함수
function makeOutListener(infowindow) {
    return function () {
        infowindow.close();
    };
}