const controller = {
  signUp: async function(signUpInfo) {
    let email = signUpInfo.email
    let password = signUpInfo.password
    let firstname = signUpInfo.firstname
    let lastname = signUpInfo.lastname
    
    view.setText('#sign-up-success', '')
    view.setText('#sign-up-error', '')
    view.disable('#form-sign-up-btn')

    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password)
      await firebase.auth().currentUser.updateProfile({
        displayName: firstname + " " + lastname
      })
      await firebase.auth().currentUser.sendEmailVerification()

      view.setText('#sign-up-success', 'An email verification has been sended to your email!')
    } catch(error) {
      let message = error.message
      view.setText('#sign-up-error', message)
    }

    view.enable('#form-sign-up-btn')

  },
  signIn: async function(signInInfo) {
    view.setText('#sign-in-error', '')
    view.disable('#form-sign-in-btn')
    try {
      let email = signInInfo.email
      let password = signInInfo.password
      let result = await firebase.auth().signInWithEmailAndPassword(email, password)
      let user = result.user
      if(user.emailVerified) {
        view.showScreen('chat')
      } else {
        throw new Error('Must verify email!')
      }
    } catch(error) {
      let message = error.message
      view.setText('#sign-in-error', message)
      view.enable('#form-sign-in-btn')
    }
  },
  loadConversations: async function() {
    let currentEmail = firebase.auth().currentUser.email
    
    let result = await firebase.firestore()
      .collection('conversations')
      .where('users', 'array-contains', currentEmail)
      .get()
    let conversations = utils.getDataFromDocs(result.docs)
    model.saveListConversations(conversations)
    if(conversations.length) {
      let currentConversation = conversations[0]
      model.saveCurrentConversation(currentConversation)
    }
  },
  setupConversationChange: async function() {
    let isFirstRun = true
    let currentEmail = firebase.auth().currentUser.email

    firebase.firestore()
      .collection('conversations')
      .where('users', 'array-contains', currentEmail)
      .onSnapshot(function(snapshot) {
        if(isFirstRun) {
          isFirstRun = false
          return
        }

        let docChanges = snapshot.docChanges()
        for(let docChange of docChanges) {
          let type = docChange.type
          let conversationDoc = docChange.doc
          let conversation = utils.getDataFromDoc(conversationDoc)

          // type == 'modified'
          if(type == 'modified') {
            model.updateConversationChange(conversation)
            if(model.currentConversation
              && model.currentConversation.id == conversation.id) {
              view.showCurrentConversation()
            }
          }
          // type == 'added'
          if(type == 'added') {
            model.updateConversationChange(conversation)
            view.showListConversations()
          }
          // type == 'removed'
          if(type == 'removed') {
            model.removeConversation(conversation)
            view.showListConversations()
            view.showCurrentConversation()
          }
        }
      })
  },
  updateNewMessage: async function(messageContent) {
    if(model.currentConversation) {
      let conversationId = model.currentConversation.id
      let currentEmail = firebase.auth().currentUser.email
      let queryBtnSubmit = '.form-add-message-chat button[type="submit"]'
      let inputFormAddMessage = document.querySelector('.form-add-message-chat input[name="message"]')

      view.disable(queryBtnSubmit)
      let message = {
        content: messageContent,
        owner: currentEmail,
        sendAt: new Date().toISOString()
      }

      await firebase.firestore()
        .collection('conversations')
        .doc(conversationId)
        .update({
          messages: firebase.firestore.FieldValue.arrayUnion(message)
        })
      view.enable(queryBtnSubmit)
      inputFormAddMessage.value = ''
    }
  },
  addConversation: async function(title, friendEmail) {
    let currentEmail = firebase.auth().currentUser.email
    let now = new Date().toISOString()
    // validate title & friendEmail
    let titleRequired = view.validate(
      title,
      '#title-error',
      'Missing title!'
    )
    let friendEmailRequired = view.validate(
      friendEmail,
      '#friend-email-error',
      'Missing friend email!'
    )
    if(!titleRequired || !friendEmailRequired) {
      return
    }
    let signInMethods = await firebase.auth().fetchSignInMethodsForEmail(friendEmail)
    let friendEmailExists = view.validate(
      signInMethods.length,
      '#friend-email-error',
      'Email not exists in system!'
    )
    if(!friendEmailExists) {
      return
    }
    let notCurrentEmail = view.validate(
      friendEmail != currentEmail,
      '#friend-email-error',
      'Please enter your friend email!'
    )
    if(!notCurrentEmail) {
      return
    }
    // create new conversation in table 'conversations'
    let conversation = {
      title: title,
      users: [currentEmail, friendEmail],
      messages: [],
      createdAt: now
    }
    await firebase.firestore()
      .collection('conversations')
      .add(conversation)
    
    let inputTitle = document.querySelector('.form-add-conversation input[name="title"]')
    let inputFriendEmail = document.querySelector('.form-add-conversation input[name="friendEmail"]')
    inputTitle.value = ''
    inputFriendEmail.value = ''
  },
  leaveCurrentConversation: async function() {
    if(model.currentConversation) {
      let currentConversationId = model.currentConversation.id
      let currentEmail = firebase.auth().currentUser.email

      await firebase.firestore()
        .collection('conversations')
        .doc(currentConversationId)
        .update({
          users: firebase.firestore.FieldValue.arrayRemove(currentEmail)
        })
    }
  }
}
