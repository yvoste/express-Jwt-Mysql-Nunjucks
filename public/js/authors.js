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
  }
}