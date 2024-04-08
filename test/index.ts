import { ProBun } from '../lib/main/index'

const app = new ProBun({
    port: 3000,
    routes: "routes",
    logger: true
})

app.start()