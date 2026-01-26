import Home from "../pages/Home";
import Products from "../pages/products";
import Cart from "../pages/Cart";
import NotFound from "../pages/NotFound";
import Product from "../pages/Product";



import Layout from "../Layout";



const routes=[
    {
        path:'/',
        element:<Layout/>,
        children:[
            {
                path:'/',
                element:<Home/>

            },
            {
                path:'/products',
                element:<Products/>
            },
            {
                path:'/cart',
                element:<Cart/>
            },
            {
                path:'product/:id',
                element:<Product/>
            },

        ]

    },
    {
        path:'*',
        element:<NotFound/>

    }
    
]

export default routes