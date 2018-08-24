
/* global Deck */

var prefix = Deck.prefix

var transform = prefix('transform')

var translate = Deck.translate

var $container = document.getElementById('cards')
var $topbar = document.getElementById('topbar')

var $sort = document.createElement('button')
var $shuffle = document.createElement('button')
var $bysuit = document.createElement('button')
var $fan = document.createElement('button')
var $flip = document.createElement('button')

$sort.className = 'btn btn-success';
$shuffle.className = 'btn btn-success';
$bysuit.className = 'btn btn-success';
$fan.className = 'btn btn-success';
$flip.className = 'btn btn-success';

$shuffle.textContent = 'Premešaj'
$sort.textContent = 'Razvrsti'
$bysuit.textContent = 'Po barvah'
$fan.textContent = 'Pahljača'
$flip.textContent = 'Obrni'

$topbar.appendChild($flip)
$topbar.appendChild($shuffle)
$topbar.appendChild($bysuit)
$topbar.appendChild($fan)
$topbar.appendChild($sort)

var deck = Deck()

$shuffle.addEventListener('click', function () {
  deck.shuffle()
  deck.shuffle()
})
$sort.addEventListener('click', function () {
  deck.sort(true)
})
$bysuit.addEventListener('click', function () {
  deck.sort(true)
  deck.bysuit()
})
$fan.addEventListener('click', function () {
  deck.fan()
})
$flip.addEventListener('click', function () {
  deck.flip()
})

deck.mount($container)

deck.intro()
deck.sort(true)
