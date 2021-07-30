var objReq = {
  //it is called when the query call a new page or only put the result into an element     
  request: function(url, reqOpts, redir, user){    
    fetch(url, reqOpts)
    .then( response => {
      console.log(response)
      if (response.ok){
        return response.json()
      }
      if (response.status == 401){
        return Promise.reject({msg: 'refreshToken'})
      }
      return Promise.reject({msg: 'bad request'})

    })
    .then( data => {
      console.log(data)
      if(redir === 'noDir') {
        console.log('AUTHOR')
        tools.selector(data.autors)
        return
      } else if (redir === 'delFile'){
        tools.callAlert('success', data.msg)
        document.getElementById("fileImg").value = ""
        return
      } else if (redir === 'upFile'){
        tools.callAlert('success', data.msg.filename + 'uploaded successfully')
        document.getElementById('uploadedFileName').value = data.msg.filename
        return
      } else {
        switch(user) {
          case 'sign':
            console.log('SIGNIN UP')
            if(data.err === 1){
              tools.callAlert('danger', data.msg)
              return false
            } else {
              tools.callAlert('success', data.msg)            
              tools.setValueLocalStorage(data)   
            }                     
            break
          case 'logout': 
            console.log('LOGOUT')  
            tools.callAlert('danger', data.msg)
            localStorage.setItem('xsrfToken', '')
            localStorage.setItem('nickname', '')                      
            break
          default:
            if(data.err === 1){
              tools.callAlert('danger', data.msg)
            } else {
              tools.callAlert('success', data.msg)
            }     
            break
        }
        // the settimeout is to display alert before the page change        
        setTimeout(function(){window.location.href = redir}, 2000)
        
      }
    })
    .catch(error => {
      console.log(error)
      tools.callAlert('danger', error.msg)
    })
  },

  // it is called when the query injects the result into the mode
  requestInclusing: function(url, reqOpts, id_contenu, doingAfter){    
    fetch(url, reqOpts)
    .then( response => {
      //console.log(response)
      if (response.ok)
        return response.json();

      if (response.status == 401){
        return Promise.reject({msg: 'You must login again', err: 1})
      }
      if (response.status == 403){
        return Promise.reject({msg: 'Your Account had been deactived contact Administrator' , err: 1
        })
     }
      return Promise.reject({msg: 'bad request'})  
    })
    .then( data => {
      //console.log(data)
      const contenu = data.content
      document.getElementById(id_contenu).innerHTML = contenu
      switch(doingAfter){
        case 'pag':
          tools.updatePagination()
          break
        default:
          break
      }
        
    })
    .catch(error => {
      console.log(error)
      tools.callAlert('danger', error.msg) 
      if (typeof(error.err) != 'undefined' && error.err == 1) {
        console.log('LOGOUT')
        localStorage.setItem('xsrfToken', '')
        localStorage.setItem('nickname', '')
        // the settimeout is to display alert before the page change  
        setTimeout(function(){window.location.href = glob.APIURL}, 2000)
        
      } 
           
    })
  }  
}