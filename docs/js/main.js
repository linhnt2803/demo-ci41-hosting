window.onload = init

function init() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user && user.emailVerified) {
      view.showScreen('chat')
    } else {
      view.showScreen('signUp')
    }
  })
}

// let isFirstRun = true
// firebase
//   .firestore()
//   .collection('conversations')
//   .onSnapshot(function(snapshot) {
//     if(isFirstRun) { // skip first run
//       isFirstRun = false
//       return
//     }

//     let docChanges = snapshot.docChanges()

//     for(let docChange of docChanges) {
//       let type = docChange.type
//       let doc = docChange.doc

//       let conversation = utils.getDataFromDoc(doc)

//       console.log('docChange type', type)
//       console.log('docChange data', conversation)
//       // if(type == 'modified') ...
//     }
//   })


// learn database
// collection ~ bảng
// document ~ bản ghi/1 dòng trong bảng

async function learnDB() {
  // create

  // let user = {
  //   name: 'Nguyễn Văn A',
  //   age: 20
  // }
  // await firebase.firestore()
  //   .collection('users')
  //   .add(user)
  // console.log(`create new document in collection 'users'`)

  // read

  // let result = await firebase.firestore()
  //   .collection('users')
  //   // .where('field', 'condition', 'value')
  //   .where('name', '==', 'Nguyen Van B')
  //   .get()
  // let docs = result.docs // documents
  // console.log('document', docs) // [doc1, doc2, doc3]

  // let users = getDataFromDocs(docs)
  // console.log('users', users) // [user1, user2, user3]

  // update

  // let id = '2t3UTbB5Ws97Dae55JoJ'
  // await firebase.firestore()
  //   .collection('users')
  //   .doc(id)
  //   .update({
  //     classes: firebase.firestore.FieldValue.arrayRemove('9A1') // xoa phan tu '10A1' khoi mang 'classes'
  //   })
  //   // .update({
  //   //   classes: firebase.firestore.FieldValue.arrayUnion('9A1') // them phan tu '9A1' vao mang 'classes'
  //   // })
  //   // .update({
  //   //   name: 'Nguyen Van A3',
  //   //   description: 'Hoc truong FPT 2 lan'
  //   // })
  // console.log('update new info for document with id: ', id)

  // delete

  // let id = 'NDqOVjLopk4S6RsSKdxt'
  // await firebase.firestore()
  //   .collection('users')
  //   .doc(id)
  //   .delete()
  // console.log('deleted document with id: ', id)

}
