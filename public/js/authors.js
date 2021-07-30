var authors = {
  getAuthor: function(){    
    const xsrfToken = tools.getToken()
    const requestOptions = {
      method: 'GET',
      headers: {
        'x-xsrf-token' : xsrfToken,
        'Content-Type': 'application/json'
      }
    }
    const _url = glob.APIURL + 'api/edit/autor'
    const redir = 'noDir'
    objReq.request(_url, requestOptions, redir) 
    /*fetch(_url, requestOptions)
    .then( response => {
      console.log(response)
      if (response.ok){
        const data = response.json()
        return data
      }
      return Promise.reject({msg: 'bad request'});      
    })
    .then( data => {
      console.log(data)
      tools.selector(data.autors)
      return
    })
    .catch(error => {
      console.log(error)   
      tools.callAlert('danger', error.msg)
    }) */   
  },

  /*

  getArticlesByAutor: function(offset, row, author){
    const xsrfToken = articles.getToken()
    const requestOptions = {
      method: 'GET',
      headers: {
        'x-xsrf-token' : xsrfToken,
        'Content-Type': 'application/json'
      }
    }
    const _url = glob.APIURL + 'api/edit/articles-autor?set=' + offset + '&row=' + row + '&author=' + author
    const id_contenu = 'articles'
    const doingAfter = 'pag'
    objReq.requestInclusing(_url, requestOptions, id_contenu, doingAfter)  
  },*/
}