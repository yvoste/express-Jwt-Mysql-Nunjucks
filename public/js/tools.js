var tools = {
  init: function(){   
    this.dataStorage()
    this.states()    
  },  
  
  selector: function(data){  
    let str = ''
    data.forEach(function(autor, index){
      str += '<li><a class="dropdown-item" href="#">' + autor.author + '</a></li>'
    })
    document.getElementById('autor').innerHTML = str
  },

  author: function(elem){
    console.log(elem)
    const lem = document.getElementById('writer').text
    document.getElementById('writer').innerHTML = elem.text
    let selectAuthor = elem.text
    if(selectAuthor == 'Author')
      selectAuthor = ''
    elem.text = lem
    glob.FilterObject.author = selectAuthor   
  },
  
  // if localstorage exist
  dataStorage : function(){
    if(!localStorage.getItem("xsrfToken")){
      localStorage.setItem("xsrfToken", ''); 
      console.log("localStorage 'xsrfToken' created");
    }
    if(!localStorage.getItem("nickname")){
      localStorage.setItem("nickname", ''); 
      console.log("localStorage nickname created");
    }
  },

  states: function(){
    const check = this.getValueLocalStorage()
    if(check.nickname !== '' && check.xsrfToken !== ''){
      document.getElementById('whoIs').innerHTML = 'Hi! '+check.nickname
      document.getElementById('userIs').value = check.nickname
      this.isIn()
    } else {
      this.isOut()
    }
  },  

  callAlert: function(type, msg) {
    const typ = 'alert-' + type 
    this.addClass('alarm', typ)
    this.addClass('alarm', 'fadeIn')    
    document.getElementById("contAlarm").innerHTML = msg
    setTimeout(function() {
      tools.removeClass('alarm', 'fadeIn') 
      tools.addClass('alarm', 'fadeOut')      
    }, 5000);
  },

  // Function to validate fields form signup
  validateFields : function(user){
    if(this.validatePseudo(user.nickname)){
      if(this.validateEmail(user.email)){
        if(this.validatePwd(user.password))
          return true
        return {error :'invalid password must be contains 7 to 15 characters which contain at least one numeric digit and a special character'}
      }
      return {error :'invalide email'}
    }
    return {error :'invalid name must be contains only number and character between 3 and 8 caracters'}
  },

  // Function to validate fields form signin update
  validateFieldsUp : function(user){    
    if(this.validateEmail(user.email)){
      if(this.validatePwd(user.password))
        return true
      return {error :'invalid password must be contains 7 to 15 characters which contain at least one numeric digit and a special character'}
    }
    return  {error :'invalide email'}
  },

  validatePseudo: function(input){
    var exp = new RegExp("^[a-zA-Z0-9' '-]{3,8}$","g");
    if (exp.test(input) ) {
      return true 
    }
    return false
  },

  validateEmail: function(input) { 
    var exp = new RegExp("^[a-z\p{L}0-9!#$%&\'*+\/=?^`{}|~_-]+[.a-z\p{L}0-9!#$%&\'*+\/=?^`{}|~_-]*@[a-z\p{L}0-9]+(?:[.]?[_a-z\p{L}0-9-])*\.[a-z\p{L}0-9]+$")
    if (exp.test(input) ) {
      return true 
    }
    return false
  },

  //To check a password between 7 to 15 characters which contain at least one numeric digit and a special character
  validatePwd: function(input){
    var exp = new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$")
    if (exp.test(input) ) {
      return true;
    }
    return false;
  },

  getId: function(id){
    return document.getElementById(id)
  },

  addClass: function(id, nameClass){
    const el = this.getId(id)
    el.classList.add(nameClass)
  },

  removeClass: function(id, nameClass){
    const el = this.getId(id)
    el.classList.remove(nameClass)
  },

  isIn: function(){
    const isins = document.querySelectorAll('.in')
    isins.forEach(function(isin, index){
      isin.classList.add('show')
    })
    const isouts = document.querySelectorAll('.out')
    isouts.forEach(function(isout, index){
      isout.classList.add('hide')
    })
  },

  isOut: function(){
    const isouts = document.querySelectorAll('.out')
    isouts.forEach(function(isout, index){
      isout.classList.add('show')
    })
    const isins = document.querySelectorAll('.in')
    isins.forEach(function(isin, index){
      isin.classList.add('hide')
    })
  },

  getValueLocalStorage: function(){
    return valueLocal = {
      'xsrfToken': localStorage.getItem('xsrfToken'),
      'nickname': localStorage.getItem('nickname')
    }
  },

  setValueLocalStorage: function(data){ 
    localStorage.setItem('xsrfToken', JSON.stringify(data.xsrfToken))
    localStorage.setItem("nickname", data.nickname)
  },
  
  stripHtmlTags: function(data) {
    const cleanData = data.replace(new RegExp('<[^>]*>', 'g'), '')
    return cleanData
  },
  
  countCaract: function(objettextarea, maxlength){
    const res = maxlength - objettextarea.value.length
    document.getElementById("rem_post").innerHTML = res
    console.log(res)
    if (objettextarea.value.length >= maxlength) {
      objettextarea.value = objettextarea.value.substring(0, maxlength);
      alert('max size '+maxlength+'!');
     }
  },

  search: function(){
    document.getElementById('set').value = 0
    const obj = glob.FilterObject
    console.log(obj)   
    const pag = tools.getPagination()    
    articles.getArticles(pag[0], pag[1], obj)
  },

  clear: function(){
    document.getElementById('set').value = 0
    document.querySelector('#popular').checked = false
    document.getElementById('writer').text = 'Author'
    authors.getAuthor()
    this.clearDate()
    glob.FilterObject = {
      dateStart: '',
      dateEnd: '',
      author: '',
      popular: 0
    }
    const obj = glob.FilterObject   
    const pag = tools.getPagination()    
    articles.getArticles(pag[0], pag[1], obj)
  },

  checkbox: function(){
    if (document.querySelector('#popular:checked')) {
      glob.FilterObject.popular = 1
    }
  },

  next: function(e){
    e.preventDefault()
    console.log(glob.FilterObject)
    const obj = glob.FilterObject    
    const pag = tools.getPagination()    
    articles.getArticles(pag[0], pag[1], obj)
  },
  
  prev: function(e){
    e.preventDefault()
    const pag = tools.getPagination()
    const set = parseInt(pag[0]) - (2 * parseInt(pag[1]))
    document.getElementById('set').value = set
    const obj = glob.FilterObject    
    articles.getArticles(set, pag[1], obj)
  },

  getPagination: function(){
    const row = document.getElementById('howmany').value
    const set = document.getElementById('set').value
    const pag = [set, row]
    return pag
  },
  
  changeRow: function(){
    const row = document.getElementById('howmany').value    
    const set = document.getElementById('set').value = 0
    const obj = glob.FilterObject    
    articles.getArticles(set, row, obj)
  },

  updatePagination: function(){
    const offset = document.getElementById('set').value
    const howmany = document.getElementById('howmany').value
    const rows = parseInt(offset) + parseInt(howmany)
    const tot = document.getElementById('tot').value    
    switch(true) {
      case offset <= 0 && rows <= tot:
        console.log('A')
        tools.addClass('prev', 'hide')
        tools.removeClass('next', 'hide')
        break
      case offset > 0 && rows <= tot:
        console.log('B')
        tools.removeClass('prev', 'hide')
        tools.removeClass('next', 'hide')
        break
      case offset > 0 && rows > tot:
        console.log('C')
        tools.addClass('next', 'hide')
        tools.removeClass('prev', 'hide')
        break  
      case tot < howmany:
        console.log('C')
        tools.addClass('next', 'hide')
        tools.addClass('prev', 'hide')
        break      
      default:
        console.log('D')
        tools.removeClass('prev', 'hide')
        tools.removeClass('next', 'hide')
    }
    document.getElementById('set').value = (parseInt(offset) + parseInt(howmany))   
  },

  bindAuthor: function(){
    const elem = document.getElementById('autor')    
    elem.onclick = function(e){
      e.preventDefault
      if(e.target.nodeName == 'A'){
        tools.author(e.target)
      }
    }
  },

  getToken: function(){
    let xsrfToken = localStorage.getItem('xsrfToken');
    if (!xsrfToken) {
      tools.callAlert('danger', 'Missing xsrfToken, you must login again')
      return false
    } else {
      return JSON.parse(xsrfToken)
    }
    
  },
  
  clearDate: function(){
    $('#start').datepicker('setDate', null)
    $('#end').datepicker('setDate', null)
  }
}

// equivalent à  $(document).ready(function(){})
window.addEventListener("DOMContentLoaded", (event) => {  
  $('#start').datepicker({
    clearBtn: true,
    format: "yyyy-mm-dd",
    autoclose: true
  }).on('changeDate', function(event){
    const dat =  event.format(0,"yyyy-mm-dd")
    glob.FilterObject.dateStart = dat + ' 00:00:00'
  });
  $('#end').datepicker({
    clearBtn: true,
    format: "yyyy-mm-dd",
    autoclose: true
  }).on('changeDate', function(event){
    const dat = event.format(0,"yyyy-mm-dd")
    glob.FilterObject.dateEnd = dat + ' 00:00:00'
  });
  console.log("DOM loaded and analyzed");
  console.log(glob.FirstExecution)
  tools.init()
  if (location.href.match(/signup/) || location.href.match(/signin/)) {
    tools.isOut()
  }
  if (location.href.match(/list/)) {
    tools.bindAuthor()    
    tools.isIn()
    authors.getAuthor()    
    const pag = tools.getPagination()
    const obj = glob.FilterObject    
    articles.getArticles(pag[0], pag[1], obj)
  }
  
  if (location.href.match(/article/)){
    tools.isIn()
    articles.getArticle()
  }

  if (location.href.match(/profil/)) {
    tools.isIn()
    users.getProfil()
  }
  if (location.href.match(/''/)) {
    console.log('home')
    tools.isOut()
  }  
  
  
})

