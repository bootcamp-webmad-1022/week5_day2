const express = require('express');
const router = express.Router();

const Book = require('./../models/Book.model')
const { isLoggedIn } = require('./../middleware/route-guard')

// Books list
router.get('/libros/listado', (req, res) => {

  Book
    .find()
    .select({ title: 1 })
    .then(books => {
      res.render('books/list', { books })
    })
    .catch(err => console.log(err))
})


// Owned books list
router.get('/libros/mis-libros', isLoggedIn, (req, res) => {

  Book
    .find({ owner: req.session.currentUser._id })
    .select({ title: 1 })
    .then(books => {
      res.render('books/list', { books })
    })
    .catch(err => console.log(err))
})


// Book details (role rendered content)
router.get('/libros/detalle/:book_id', (req, res) => {

  const { book_id } = req.params

  Book
    .findById(book_id)
    .then(book => {
      res.render('books/details', {
        book,
        isAdmin: req.session.currentUser.role === 'ADMIN',
        isEditor: req.session.currentUser.role === 'EDITOR'
      })
    })
    .catch(err => console.log(err))
})



// New book form (render)
router.get('/libros/crear', isLoggedIn, (req, res) => {
  res.render('books/create')
})


// New book form (handle)
router.post('/libros/crear', isLoggedIn, (req, res) => {

  const { title, author, description, rating } = req.body
  const owner = req.session.currentUser._id

  Book
    .create({ title, description, author, rating, owner })
    .then(book => {
      res.redirect(`/libros/detalle/${book._id}`)
    })
    .catch(err => console.log(err))
})





// Edit book form (render)
router.get('/libros/editar/:book_id', (req, res) => {

  const { book_id } = req.params

  Book
    .findById(book_id)
    .then(book => {
      res.render('books/edit', book)
    })
    .catch(err => console.log(err))
})


// Edit book form (handle)
router.post('/libros/editar', (req, res) => {

  const { title, author, description, rating } = req.body
  const { book_id } = req.query

  Book
    .findByIdAndUpdate(book_id, { title, author, description, rating })
    .then(() => res.redirect(`/libros/detalle/${book_id}`))
    .catch(err => console.log(err))
})




// Delete book 
router.post('/libros/eliminar/:book_id', (req, res) => {

  const { book_id } = req.params

  Book
    .findByIdAndDelete(book_id)
    .then(() => res.redirect('/libros/listado'))
    .catch(err => console.log(err))

})



module.exports = router