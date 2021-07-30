var comments = {

    addComment: function(e, id) {
    e.preventDefault()
    const xsrfToken = tools.getToken()
    const form = document.forms['formAddComment'] 
    const art = {
      comment: tools.stripHtmlTags(form.elements['comment'].value),
      author_comment: localStorage.getItem("nickname"),
      id_article: id
    }
    console.log(art)
    const requestOptions = {
      method: 'POST',
      headers: {
        'x-xsrf-token' : xsrfToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(art) // body data type must match "Content-Type" header
    }
    
    const _url = glob.APIURL + 'api/edit/addComment'
    const redir = glob.APIURL + 'list'
    objReq.request(_url, requestOptions, redir)    
  },


  deleteComment: function(id, idC) {    
    const xsrfToken = tools.getToken()
    const comment = {
      id: id,
      idC: idC
    }
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'x-xsrf-token' : xsrfToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment) // body data type must match "Content-Type" header
    }
    const _url = glob.APIURL + 'api/edit/comment'
    const redir = glob.APIURL + 'list'
    objReq.request(_url, requestOptions, redir)
  },

  showComment: function(){
    tools.removeClass('addComment', 'hide')
  },
}