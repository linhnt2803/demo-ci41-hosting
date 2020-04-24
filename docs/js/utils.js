const utils = {
  getDataFromDoc: function (doc) {
    let data = doc.data()
    data.id = doc.id
    return data
  },
  getDataFromDocs: function (docs) {
    let result = []
    for(let doc of docs) {
      let data = utils.getDataFromDoc(doc)
      result.push(data)
    }
    return result
  },
  formatMessageChat: function(text) {
    // text = 'abc :)'
    // formattedText = 'abc <i class="fas fa-plus"></i>'
    return text
      .replace(/:\)/g, '<i class="fas fa-smile"></i>')
      .replace(/:D/g, '<i class="fas fa-grin"></i>')
  }
}