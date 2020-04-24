const view = {
  async showScreen(screenName) {
    let app = document.querySelector('#app')

    switch(screenName) {
      case 'signUp': {
        // display page content
        app.innerHTML = components.signUp

        // bind events
        let link = document.querySelector('#form-sign-up-link')
        link.onclick = function() {
          view.showScreen('signIn')
        }

        let form = document.querySelector('.form-sign-up')
        form.onsubmit = function(event) {
          event.preventDefault()
          // 1. get data
          let signUpInfo = {
            firstname: form.firstname.value.trim(), // required
            lastname: form.lastname.value.trim(), // required
            email: form.email.value.trim().toLowerCase(), // required
            password: form.password.value, // required && length >= 6
            confirmPassword: form.confirmPassword.value // required && length >= 6 && == password
          }

          // 2. validate data
          let validateResult = [
            view.validate(signUpInfo.firstname, '#firstname-error', 'Missing firstname!'),
            view.validate(signUpInfo.lastname, '#lastname-error', 'Missing lastname!'),
            view.validate(signUpInfo.email, '#email-error', 'Missing email!'),
            view.validate(
              signUpInfo.password && signUpInfo.password.length >= 6,
              '#password-error',
              'Invalid password!'
            ),
            view.validate(
              signUpInfo.confirmPassword && signUpInfo.confirmPassword.length >= 6
                && signUpInfo.password == signUpInfo.confirmPassword,
              '#confirm-password-error',
              'Invalid confirm password!'
            )
          ]

          // 3. submit data
          
          if(view.allPassed(validateResult)) {
            controller.signUp(signUpInfo)
          }

        }

        break
      }
      case 'signIn': {
        app.innerHTML = components.signIn

        let link = document.querySelector('#form-sign-in-link')
        link.onclick = function() {
          view.showScreen('signUp')
        }

        let form = document.querySelector('.form-sign-in')
        form.onsubmit = function(e) {
          e.preventDefault()

          let signInInfo = {
            email: form.email.value.trim().toLowerCase(),
            password: form.password.value
          }
          
          let validateResult = [
            view.validate(signInInfo.email, '#email-error', 'Missing email!'),
            view.validate(
              signInInfo.password && signInInfo.password.length >= 6,
              '#password-error',
              'Invalid password!'
            )
          ]

          if(view.allPassed(validateResult)) {
            controller.signIn(signInInfo)
          }
        }

        break
      }
      case 'chat': {
        app.innerHTML = components.nav + components.chat
        
        // load conversations from database >> save conversations to model
        await controller.loadConversations()
        controller.setupConversationChange()

        view.showListConversations()
        view.showCurrentConversation()

        // su kien form-add-message
        let formAddMessage = document.querySelector('.form-add-message-chat')
        formAddMessage.onsubmit = function(event) {
          event.preventDefault()

          let messageContent = formAddMessage.message.value.trim()
          if(messageContent) {
            controller.updateNewMessage(messageContent)
          }
        }

        // su kien form-add-conversation
        let formAddConversation = document.querySelector('.form-add-conversation')
        formAddConversation.onsubmit = function(event) {
          event.preventDefault()

          let title = formAddConversation.title.value
            .trim()
          let friendEmail = formAddConversation.friendEmail.value
            .trim().toLowerCase()

          controller.addConversation(title, friendEmail)
        }

        // su kien btn-leave-conversation
        let btnLeaveConversation = document.querySelector('#btn-leave-conversation')
        btnLeaveConversation.onclick = function() {
          controller.leaveCurrentConversation()
        }
      }
    }
  },
  showListConversations() {
    if(model.listConversations) {
      let listConversations = model.listConversations // [{ id: 1, title: '', users: ['email1', 'email2'] }]
      let listContainer = document.querySelector('.list-conversation')

      listContainer.innerHTML = ''

      // show all html to screen
      for(let conversation of listConversations) {
        let conversationId = conversation.id
        let title = conversation.title
        let memberCount = conversation.users.length
        let members = memberCount > 1
          ? `${memberCount} members`
          : `${memberCount} member`
        let className = (model.currentConversation && model.currentConversation.id == conversationId)
          ? 'conversation current'
          : 'conversation'

        let html = `
          <div id="conversation-${conversationId}" class="${className}">
            <div class="conversation-title">${title}</div>
            <div class="conversation-members">${members}</div>
          </div>
        `
        listContainer.innerHTML += html
      }

      // bind event to conversation tags
      for(let conversation of listConversations) {
        let conversationId = conversation.id
        let conversationDiv = document.querySelector(`#conversation-${conversationId}`)

        conversationDiv.onclick = function() {
          model.saveCurrentConversation(conversation)
          view.showCurrentConversation()
          view.showListConversations()
        }
      }
    }
  },
  showCurrentConversation() {
    let listContainer = document.querySelector('.list-message-chat')
    listContainer.innerHTML = ''
    let detailsContainer = document.querySelector('.details-current-conversation')
    detailsContainer.innerHTML = ''

    if(model.currentConversation) {
      let messages = model.currentConversation.messages
      let currentEmail = firebase.auth().currentUser.email
      let users = model.currentConversation.users
      let createdAt = model.currentConversation.createdAt
      let createdAtLocale = new Date(createdAt).toLocaleString()
      
      // display all message of current conversation
      for(let message of messages) {
        let content = message.content
        let formattedContent = utils.formatMessageChat(content)
        let owner = message.owner
        let className = owner == currentEmail
          ? 'message-chat your'
          : 'message-chat'

        let messageHtml = `
          <div class="${className}">
            <span>${formattedContent}</span>
          </div>
        `
        listContainer.innerHTML += messageHtml // <span>a</span>
      }

      // display details info of current conversation
      for(let email of users) {
        let emailHtml = `
          <div class="conversation-email">${email}</div>
        `
        detailsContainer.innerHTML += emailHtml
      }
      let createdAtHtml = `
        <div class="conversation-created-at">${createdAtLocale}</div>
      `
      detailsContainer.innerHTML += createdAtHtml
    }
  },
  setText(query, text) {
    document.querySelector(query).innerText = text
  },
  validate(condition, queryErrorTag, messageError) {
    if(condition) {
      view.setText(queryErrorTag, '')
      return true
    } else {
      view.setText(queryErrorTag, messageError)
      return false
    }
  },
  allPassed(validateResult) {
    for(let result of validateResult) {
      if(!result) {
        return false
      }
    }
    return true
  },
  disable(query) {
    document.querySelector(query).setAttribute('disabled', true)
  },
  enable(query) {
    document.querySelector(query).removeAttribute('disabled')
  }
}