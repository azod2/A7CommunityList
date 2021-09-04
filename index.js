let dataPanel = document.querySelector("#data-panel");

const userData = [];
const BASIC_URL = "https://lighthouse-user-api.herokuapp.com";
const USER_URL = BASIC_URL + "/api/v1/users";

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')


const List_PER_PAGE = 12
const paginator = document.querySelector('#paginator')

axios
    .get(USER_URL)
    .then((respone) => {
        userData.push(...respone.data.results);
        renderUserList(userData);
        renderPaginator(userData.length)
        renderUserList(getUsersByPage(1))
        // console.log(respone.data.results)
        // console.log(userData)
    })
    .catch((err) => console.log(err));

function renderUserList(data) {
    let rawHTML = "";
    data.forEach((item) => {
        // title, image
        rawHTML += `<div class="m-2">
    <div class="mb-2">
      <div class="user">
        <img src="${item.avatar}" class="user-img-top  border" alt="User Photo" data-toggle="modal" data-target="#user-modal">
        <div class="user-body">
          <h5 class="name-title">${item.name}</h5>
        </div>        
      </div>
    </div>
  </div>`;
    });
    dataPanel.innerHTML = rawHTML;
}


//...
//監聽表單提交事件
searchForm.addEventListener('submit', function onSearchFormSubmitted(event)  {
    event.preventDefault()
    // console.log(searchInput.value) //測試用
    const keyword = searchInput.value.trim().toLowerCase()
    let filteredNames = []
    if (!keyword.length) {
      return alert('請輸入有效字串！')
    }
    filteredNames = userData.filter((name) =>
        name.name.toLowerCase().includes(keyword)
    )
    //錯誤處理：無符合條件的結果
    if (filteredNames.length === 0) {
        return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
    }
    renderUserList(filteredNames)
})

//分頁標籤數量分配
function renderPaginator(amount) {
    //計算總頁數
    const numberOfPages = Math.ceil(amount / List_PER_PAGE)
    //製作 template
    let rawHTML = ''

    for (let page = 1; page <= numberOfPages; page++) {
        rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
    }
    //放回 HTML
    paginator.innerHTML = rawHTML
}

function getUsersByPage(page) {
    //計算起始 index
    const startIndex = (page - 1) * List_PER_PAGE
    //回傳切割後的新陣列
    return userData.slice(startIndex, startIndex + List_PER_PAGE)
}

//監聽分頁按鈕
paginator.addEventListener('click', function onPaginatorClicked(event) {
    //如果被點擊的不是 a 標籤，結束
    if (event.target.tagName !== 'A') return

    //透過 dataset 取得被點擊的頁數
    const page = Number(event.target.dataset.page)
    //更新畫面
    renderUserList(getUsersByPage(page))
})