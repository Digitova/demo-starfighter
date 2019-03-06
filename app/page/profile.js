const nest = require('depnest')
const Scroller = require('pull-scroll')
const pull = require('pull-stream')
const { h, watch, onceTrue, map, Dict, dictToCollection } = require('mutant')
const next = require('pull-next-query')
const Mutual = require('ssb-mutual')

exports.gives = nest({
  'app.html.menuItem': true,
  'app.page.profile': true
})

exports.needs = nest({
  'about.html.editPrivate': 'first',
  'about.obs.name': 'first',
  'app.html.scroller': 'first',
  'app.sync.goTo': 'first',
  'contact.html.relationships': 'first',
  'contact.html.stats': 'first',
  'keys.sync.id': 'first',
  'message.html.render': 'first',
  'sbot.pull.stream': 'first',
  'sbot.obs.connection': 'first'
})

exports.create = function (api) {
  return nest({
    'app.html.menuItem': menuItem,
    'app.page.profile': profilePage
  })

  function menuItem () {
    return h('a', {
      'ev-click': () => api.app.sync.goTo(api.keys.sync.id())
    }, '/profile')
  }

  function profilePage (location) {
    const { feed: id } = location

    var balances = Dict()
    onceTrue(api.sbot.obs.connection, sbot => {
      if (!sbot.links) throw new Error('where ma sbot.links at?!')
      var mutual = Mutual.init(sbot)
      mutual.getAccountBalances(id, (err, data) => {
        if (err) console.log(err)
        if (data == null) return

        balances.set(data)
      })
    })

    const profile = h('Profile', [
      h('section.editPrivate', api.about.html.editPrivate(id)),
      h('section.relationships', api.contact.html.relationships(id))
    ])

    var { container } = api.app.html.scroller({ prepend: profile })

    watch(api.about.obs.name(id), name => { container.title = '/profile' })
    return container
  }

  function render (msg) {
    return api.message.html.render(msg, { showTitle: true })
  }
}
