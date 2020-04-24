const model = {
  listConversations: null, // danh sách những cuộc hội thoại người dùng tham gia
  currentConversation: null, // cuộc hội thoại người dùng đang trỏ vào
  saveListConversations(conversations) {
    model.listConversations = conversations
  },
  saveCurrentConversation(conversation) {
    model.currentConversation = conversation
  },
  updateConversationChange(newConversation) {
    if(model.listConversations) {
      let foundIndex = model.listConversations.findIndex(function(conversation) {
        return conversation.id == newConversation.id
      })
      if(foundIndex >= 0) {
        model.listConversations[foundIndex] = newConversation
      } else {
        model.listConversations.unshift(newConversation)
      }

      if(model.currentConversation
        && model.currentConversation.id == newConversation.id) {
        model.saveCurrentConversation(newConversation)
      }
    }
  },
  removeConversation(conversation) {
    if(model.listConversations) {
      // remove conversation from listConversation
      let conversationIndex = model.listConversations.findIndex(function(element) {
        return element.id == conversation.id
      })
      if(conversationIndex >= 0) {
        model.listConversations.splice(conversationIndex, 1)
      }
      // remove currentConversation
      if(model.currentConversation
        && model.currentConversation.id == conversation.id) {
        model.currentConversation = null
        if(model.listConversations.length) {
          model.currentConversation = model.listConversations[0]
        }
      }
    }
  }
}