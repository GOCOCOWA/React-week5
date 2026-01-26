import { createRoot } from 'react-dom/client'
import { createHashRouter,RouterProvider } from 'react-router'




import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import routes from './routes'

const router =createHashRouter(routes)



createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>,
)
