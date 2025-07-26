import x from 'tenoxui'
import config from './src/styles/tenoxui.config.ts'

const ui = new x(config)

console.log(ui.render('bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'))
