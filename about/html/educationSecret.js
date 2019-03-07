const nest = require('depnest')
const dataurl = require('dataurl-')
const hyperfile = require('hyperfile')
const hypercrop = require('hypercrop')
const {
  h, Value
} = require('mutant')
const pull = require('pull-stream')

exports.gives = nest('about.html.educationSecret')

exports.needs = nest({
  'about.obs': {
    name: 'first',
    imageUrl: 'first',
    description: 'first',
    latestValue: 'first',
    groupedValues: 'first'
  },
  'app.html.modal': 'first',
  'blob.sync.url': 'first',
  'keys.sync.id': 'first',
  'message.html.confirm': 'first',
  'message.html.markdown': 'first',
  sbot: {
    'async.addBlob': 'first',
    'pull.links': 'first'
  }
})

exports.create = function (api) {
  return nest({
    'about.html.educationSecret': education
  })

  // TODO refactor this to use obs better
  function education (id) {
    // TODO - get this to wait till the connection is present !

    var isMe = api.keys.sync.id() === id

    const modalContent = Value()
    const isOpen = Value(false)
    const modal = api.app.html.modal(modalContent, { isOpen })

    return h('SectionEditor', [
      modal,
      h('section.education', [
        h('header', 'Education'),
        h('div.university', [
          h('text', 'University of North Carolina at Chapel Hill')
        ]),
        h('div.educationDetails', [
          h('text', 'Bachelor of Science'),
          h('text', 'Computer Science')
        ]),
        h('div.university', [
          h('text', 'Northwestern University')
        ]),
        h('div.educationDetails', [
          h('text', 'Master of Science'),
          h('text', 'Digital Forensics & Cyber Security')
        ]),
        h('div.university', [
          h('text', 'Northwestern University')
        ]),
        h('div.educationDetails', [
          h('text', 'PhD'),
          h('text', 'Ethical Hacking')
        ]),
      ])
    ])
  }
}
