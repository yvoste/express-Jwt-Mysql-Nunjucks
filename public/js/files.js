var objFiles = {
  
  uploadFile: function(){
    const xsrfToken = tools.getToken()
    const input = document.querySelector('input[type="file"]')    
    // check extension and size
    console.log(input.files[0])
    const fil = input.files[0]
    if(!['image/jpeg', 'image/gif', 'image/png', 'image/JPG' , 'image/jpg'].includes(fil.type)) {
        console.log('Only images are allowed.')
        tools.callAlert('warning', 'Only images are allowed.')
        return;
    }
    if(fil.size > 2 * 1024 * 1024) {
      console.log('File must be less than 2MB.')
      tools.callAlert('warning', 'File must be less than 2MB.')
      return;
    }
    
    const fd = new FormData();
    fd.append('img', input.files[0]);
    const requestOptions = {
      method: 'POST',
      headers: {
        'x-xsrf-token' : xsrfToken
      },
      body: fd
    }
    const _url = glob.APIURL + 'api/edit/upload'
    const redir = 'upFile'
    objReq.request(_url, requestOptions, redir)
  },

  removeFile: function(){
    const xsrfToken = tools.getToken()
    const input = document.querySelector('input[type="file"]')
    if(typeof(input.files[0]) =='undefined')
      return
    
    const name =  {name: document.getElementById('uploadedFileName').value}
    console.log(name)
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'x-xsrf-token' : xsrfToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(name)
    }
    const _url = glob.APIURL + 'api/edit/file'
    const redir = 'delFile'
    objReq.request(_url, requestOptions, redir)
  }

}