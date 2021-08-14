var articles = { 

  getArticles: function(offset, row, obj){
    console.log('GET-----ARTICLES----' + offset + '----' + row + '----' )
    const userIs = document.getElementById('userIs').value
    obj.userIs = userIs
    const xsrfToken = tools.getToken()
    const requestOptions = {
      method: 'POST',
      headers: {
        'x-xsrf-token' : xsrfToken,
        'Content-Type': 'application/json'
      },      
      body: JSON.stringify(obj)
    }
    const _url = glob.APIURL + 'api/edit/articles?set=' + offset + '&row=' + row
    const id_contenu = 'articles'
    const doingAfter = 'pag'
    objReq.requestInclusing(_url, requestOptions, id_contenu, doingAfter)    
  },

  getArticle: function(){
    console.log('DETAIL')
    const id = document.getElementById('article').dataset.id
    const xsrfToken = tools.getToken()
    const requestOptions = {
      method: 'GET',
      headers: {
        'x-xsrf-token' : xsrfToken,
        'Content-Type': 'application/json'
      }
    }
    const _url = glob.APIURL + 'api/edit/article/' + id    
    const id_contenu = 'master'
    objReq.requestInclusing(_url, requestOptions, id_contenu)
  },

  
  // called by click on button Add article
  add: function() {
    window.location.href = glob.APIURL + 'add'
  },
  // called to diplay an article
  detail: function(id){
    window.location.href = glob.APIURL + 'article/' + id          
  },  

  addArticle: function(e){
    e.preventDefault()
    console.log('ADD ARTICLE')
    const xsrfToken = tools.getToken()
    const form = document.forms['formAdd']
    const art = {
      title: form.elements['title'].value,
      content: form.elements['content'].value,
      author: localStorage.getItem("nickname"),
      status: 0,
      file:document.getElementById('uploadedFileName').value
    }
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'x-xsrf-token' : xsrfToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(art) // body data type must match "Content-Type" header
    }
    const _url = glob.APIURL + 'api/edit/add'
    const redir = glob.APIURL + 'articles'
    objReq.request(_url, requestOptions, redir)    
  },

  

  delete: function(id) {
    const xsrfToken = tools.getToken()
    const art = {
      id: id
    }
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'x-xsrf-token' : xsrfToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(art) // body data type must match "Content-Type" header
    }
    
    const _url = glob.APIURL + 'api/edit/article/'     
    const redir = glob.APIURL + 'articles'
    objReq.request(_url, requestOptions, redir)    
  },

  publish: function(id) {
    const xsrfToken = tools.getToken()
    const art = {
      id: id
    }
    const requestOptions = {
      method: 'PUT',
      headers: {
        'x-xsrf-token' : xsrfToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(art) // body data type must match "Content-Type" header
    }  

    const _url = glob.APIURL + 'api/edit/publish/'     
    const redir = glob.APIURL + 'articles'
    objReq.request(_url, requestOptions, redir)    
  },

  edit: function(id){
    const xsrfToken = tools.getToken()
    const requestOptions = {
      method: 'GET',
      headers: {
        'x-xsrf-token' : xsrfToken,
        'Content-Type': 'application/json'
      }
    }
    const _url = glob.APIURL + 'api/edit/edit_article/' + id    
    const id_contenu = 'master'
    objReq.requestInclusing(_url, requestOptions, id_contenu)
  },

  upArticle: function(e, id){
    e.preventDefault()
    console.log('UPDATE ARTICLE')
    const xsrfToken = tools.getToken()
    const form = document.forms['formAdd']
    const art = {
      title: form.elements['title'].value,
      content: form.elements['content'].value,
      author: localStorage.getItem("nickname"),
      status: 0,
      file:document.getElementById('uploadedFileName').value,
      id_article:id
    }
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'x-xsrf-token' : xsrfToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(art) // body data type must match "Content-Type" header
    }
    const _url = glob.APIURL + 'api/edit/update'
    const redir = glob.APIURL + 'articles'
    objReq.request(_url, requestOptions, redir)   
  } 

}