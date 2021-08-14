var users = {  
  /*
  *Validate data before send to server
  *email
  *password
  *nickname
  */
  signup: function(e){
    e.preventDefault()
    console.log('SIGNUP')
    
    const form = document.forms['formRegister']
    console.log(form)
    const nick = tools.stripHtmlTags(form.elements['nickname'].value)
    let role = 3
    if(nick == 'admin') 
      role = 1
    if(nick == 'mod') 
      role = 2  
    const user = {
      email: tools.stripHtmlTags(form.elements['email'].value),
      password: tools.stripHtmlTags(form.elements['password'].value),
      nickname: tools.stripHtmlTags(form.elements['nickname'].value),
      role: role,
    }
    const ret = tools.validateFields(user)
    if(ret === true) {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user) // body data type must match "Content-Type" header
      }
      const _url = glob.APIURL + 'api/user/signup/'
      const redir = glob.APIURL + 'articles'
      objReq.request(_url, requestOptions, redir, 'sign')
    } else {
      tools.callAlert('danger', ret.error)
    }
  },

  /*
  *Validate data before send to server
  *email
  *password
  */
  signin: function(e){
    e.preventDefault()
    let form = document.forms['formsignin']
    let user = {
      email: tools.stripHtmlTags(form.elements['email'].value),
      password: tools.stripHtmlTags(form.elements['password'].value)
    }
    
    if(tools.validateFieldsUp(user)) {      
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user) // body data type must match "Content-Type" header
      }
      const _url = glob.APIURL + 'api/user/signin/'
      const redir = glob.APIURL + 'articles'      
      objReq.request(_url, requestOptions, redir, 'sign')      
    } else {
      tools.callAlert('danger', ret.error)
    } 
  },

  // called by tools.js DOMContentLoaded if url match profil
  getProfil: function() {
    const xsrfToken = tools.getToken()    
    const requestOptions = {
      method: 'GET',
      headers: {
        'x-xsrf-token' : xsrfToken,
        'Content-Type': 'application/json'
        
      }
    }
    const _url = glob.APIURL + 'api/user/profil'    
    const id_contenu = 'prof'
    objReq.requestInclusing(_url, requestOptions, id_contenu)    
  },

  updateProfil: function(e){
    e.preventDefault()
    console.log('UPDATE PROFIL')
    const xsrfToken = tools.getToken()    
    const form = document.forms['formProfil']    
    const user = {
      email: tools.stripHtmlTags(form.elements['email'].value),
      nickname: tools.stripHtmlTags(form.elements['nickname'].value)
    }
    
    if(tools.validateFieldsUp(user)) {      
      const requestOptions = {
        method: 'POST',
        headers: {
          'x-xsrf-token' : xsrfToken,
          'Content-Type': 'application/json'          
        },         
        body: JSON.stringify(user) // body data type must match "Content-Type" header
      }
      const _url = glob.APIURL + 'api/user/update/'
      const redir = glob.APIURL + 'articles'      
      objReq.request(_url, requestOptions, redir, 'sign')
      
    } else {
      tools.callAlert('danger', ret.error)
    } 
  },


  //  on logout, destruction of the token in the localstorage so all the routes called with auth are inaccessible.
  logout: function(){
    const xsrfToken = tools.getToken() 
    const requestOptions = {
      method: 'GET',
      headers: {
        'x-xsrf-token' : xsrfToken,
        'Content-Type': 'application/json'
        
      }
    }
    const _url = glob.APIURL + 'api/user/logout'
    const redir = glob.APIURL
    const user = 'logout'
    objReq.request(_url, requestOptions, redir, user)
  },

  cancel: function(){ 
    window.location.href = glob.APIURL + 'articles'  
  }
}
